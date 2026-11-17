# Previsões do modelo Kronos (https://github.com/shiyu-coder/Kronos) para os mercados do Radar Macro.
# Lê as velas em <pasta>/ohlc/<ID>.json (gravadas por fetch-ohlc.js), simula várias trajetórias futuras por mercado
# e por intervalo de tempo, CALIBRA-AS com o backtest (tools/kronos-calibration.json) e escreve um ficheiro por mercado
# em <pasta>/kronos/<ID>.json, pronto a gravar na coleção "kronos".
#
# O modelo, tal como sai, é demasiado confiante: as trajetórias dispersam-se um terço do que o mercado se dispersa e a média prevista
# não bate "o preço fica igual" (ver tools/backtests). Por isso, antes de gravar:
#   - o contexto só leva velas FECHADAS (a vela que ainda decorre não é tratada como completa) e, quando há, o volume;
#   - a média prevista é encolhida para o último preço com o fator lam do backtest (0 quando o modelo não mostrou vantagem);
#   - a dispersão das trajetórias é posta à escala da volatilidade real, vezes o fator s do backtest, para a banda de 80% apanhar 80%.
# Uso: .venv-kronos/Scripts/python tools/kronos-forecast.py <pasta> [--model base|small|mini] [--samples 30] [--only SPX,BTC]
import argparse, json, os, sys, time
from datetime import datetime, timezone

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kronoslib as K  # noqa: E402

GHOSTS = 6  # trajetórias individuais guardadas para desenhar a flutuação
CAL_PATH = os.path.join(K.ROOT, 'tools', 'kronos-calibration.json')
DEFAULT_CFG = {'lb': 256, 'T': 1.0, 'top_p': 0.9, 'norm': 'level', 'vol': False}


def decimals(vals):
    d = 0
    for v in vals[-60:]:
        s = f'{v:.6f}'.rstrip('0')
        d = max(d, len(s.split('.')[1]) if '.' in s else 0)
    return d


def forecast(pred, b, tf, samples, weekend, cfg, cal):
    h = K.TF[tf][1]
    n = len(b['t'])
    k = n - 2  # última vela fechada; a seguinte (a que decorre) entra no horizonte
    P, fut = K.sample_paths(pred, b, k, h + 1, tf, weekend, cfg, samples, seed=7)  # (trajetórias, h+1 velas, OHLC)
    c0 = float(b['c'][-1])  # preço atual, dentro da vela que decorre
    # cada trajetória recomeça no preço atual: o que se simula é o que vem depois da vela em curso
    R = np.log(P[:, 1:, :] / P[:, :1, 3:4])  # log-retornos de OHLC face ao fecho da vela em curso, por trajetória
    L = R[:, :, 3]
    mu = L.mean(axis=0)
    d = L - mu
    sd = d.std(axis=0, ddof=1)
    sd[sd < 1e-9] = 1e-9
    c = np.array(b['c'], dtype=np.float64)
    vol = float(np.diff(np.log(c[-61:-1])).std(ddof=1))  # volatilidade por vela, só velas fechadas (como no backtest)
    sig = vol * np.sqrt(np.arange(1, h + 1))
    lam, s = (cal or {}).get('lam', 0.0), (cal or {}).get('s', 1.0)
    L2 = lam * mu + d * (sig * s / sd)  # trajetórias calibradas
    shift = L2 - L  # a mesma correção desloca abertura, máximo e mínimo de cada vela simulada
    O = np.exp(R + shift[:, :, None]) * c0  # (trajetórias, h, 4) em preço
    dec = decimals(b['c'])
    r = lambda a: [round(float(v), dec) for v in a]
    m = O.mean(axis=0)
    cc = O[:, :, 3]
    q = np.percentile(cc, [10, 25, 75, 90], axis=0)
    order = np.argsort(cc[:, -1])
    pick = order[np.linspace(1, samples - 2, GHOSTS).round().astype(int)] if samples > GHOSTS + 2 else order
    out = {'t0': int(b['t'][-1]), 'tp': int(b['t'][-2]), 'c0': c0, 't': fut[1:],
           'o': r(m[:, 0]), 'h': r(np.max(m, axis=1)), 'l': r(np.min(m, axis=1)), 'c': r(m[:, 3]),
           'p10': r(q[0]), 'p25': r(q[1]), 'p75': r(q[2]), 'p90': r(q[3]),
           'up': round(float((cc[:, -1] > c0).mean()), 3),
           'np': len(pick), 'ps': r(cc[pick].reshape(-1)),
           'lam': round(float(lam), 3), 's': round(float(s), 3)}
    if cal:  # resultado do backtest para este intervalo de velas: o que o utilizador vê como fiabilidade
        out['bt'] = {k2: cal[k2] for k2 in ('n', 'hit', 'cov', 'skill', 'pin_vs_cone') if k2 in cal}
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('dir')
    ap.add_argument('--model', default='base', choices=list(K.MODELS))
    ap.add_argument('--samples', type=int, default=30)
    ap.add_argument('--only', default='')
    a = ap.parse_args()
    calib = json.load(open(CAL_PATH, encoding='utf8')) if os.path.exists(CAL_PATH) else {}
    if not calib:
        print('AVISO: sem tools/kronos-calibration.json; a previsão sai sem calibrar', flush=True)
    pred, src = K.load_predictor(a.model)
    print(f'{src} em {pred.device}', flush=True)
    ind, outd = os.path.join(a.dir, 'ohlc'), os.path.join(a.dir, 'kronos')
    os.makedirs(outd, exist_ok=True)
    only = {s for s in a.only.split(',') if s}
    ok, bad, t0 = [], [], time.time()
    for f in sorted(os.listdir(ind)):
        mid = f[:-5]
        if not f.endswith('.json') or (only and mid not in only):
            continue
        with open(os.path.join(ind, f), encoding='utf8') as fh:
            ohlc = json.load(fh)
        doc = {'model': 'Kronos-' + a.model, 'src': src, 'n': a.samples, 'cal': bool(calib),
               'updatedAt': datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z'), 'tf': {}}
        weekend = K.is_weekend_market(ohlc)
        for tf in K.TF:
            b = ohlc.get('tf', {}).get(tf)
            if not b or len(b.get('t', [])) < 60:
                continue
            ref = 'h1' if tf == 'm15' else tf  # 15 minutos não foi testado: usa a calibração das velas de 1 hora
            cfg = {**DEFAULT_CFG, **calib.get('cfg', {}).get(ref, {})}
            if cfg.get('vol') and not b.get('v'):
                cfg['vol'] = False
            try:
                doc['tf'][tf] = forecast(pred, b, tf, a.samples, weekend, cfg, calib.get('cal', {}).get(ref))
            except Exception as e:  # um mercado com dados estranhos não pára os outros
                bad.append(f'{mid}/{tf}: {e}')
        if doc['tf']:
            with open(os.path.join(outd, f), 'w', encoding='utf8') as fh:
                json.dump(doc, fh, separators=(',', ':'))
            ok.append(mid)
            print(f'{mid} {" ".join(doc["tf"])}  ({time.time() - t0:.0f}s)', flush=True)
    print(f'OK {len(ok)} em {time.time() - t0:.0f}s')
    if bad:
        print('FALHAS\n' + '\n'.join(bad))


if __name__ == '__main__':
    main()

# Calibra a previsão do Kronos com os resultados do backtest (tools/backtests/<nome>.jsonl) e escreve tools/kronos-calibration.json.
# Para cada intervalo de velas ajusta, por regressão normalizada pela volatilidade:
#   lam  quanto da média prevista pelo modelo se aproveita (0 = nada, 1 = tudo)
#   s    escala da dispersão das trajetórias, para a banda de 80% apanhar 80% dos casos
# e mede o resultado fora da amostra (deixando cada mercado de fora a vez, para não ser otimista).
# Uso: python tools/kronos-calibrate.py tools/backtests/validacao.jsonl [--cfg detrend] [--out tools/kronos-calibration.json]
import argparse, json, os
from math import sqrt
from statistics import NormalDist

import numpy as np

ND = NormalDist()
QS = np.array([.1, .25, .5, .75, .9])


def prep(r):
    """Trajetórias em log-retorno face ao último fecho, média, desvio por passo e verdade, tudo em unidades de retorno."""
    c0, S, real, h = r['c0'], np.array(r['S']), np.array(r['real']), r['h']
    L = np.log(S / c0)
    mu = L.mean(axis=0)
    d = L - mu
    sd = d.std(axis=0, ddof=1)
    sd[sd < 1e-9] = 1e-9
    t = np.arange(1, h + 1)
    sig = r['vol'] * np.sqrt(t)  # cone de volatilidade
    return {'mu': mu, 'd': d, 'sd': sd, 'sig': sig, 'real': np.log(real / c0), 'h': h, 'mkt': r['mkt'], 'vol': r['vol']}


def calibrated(p, lam, s):
    """Log-retornos das trajetórias calibradas: média encolhida e dispersão posta no cone de volatilidade vezes s (s=None: o modelo tal e qual)."""
    if s is None:
        return p['mu'] + p['d']
    return lam * p['mu'] + p['d'] * (p['sig'] * s / p['sd'])


def coverage(P, lam, s):
    c = []
    for p in P:
        L = calibrated(p, lam, s)
        lo, hi = np.percentile(L, 10, axis=0), np.percentile(L, 90, axis=0)
        c.append(((lo <= p['real']) & (p['real'] <= hi)).mean())
    return float(np.mean(c))


def fit(P):
    zp = np.array([p['mu'][-1] / p['sig'][-1] for p in P])
    zr = np.array([p['real'][-1] / p['sig'][-1] for p in P])
    lam = float((zp * zr).sum() / (zp * zp).sum()) if (zp * zp).sum() > 0 else 0.0
    lam = max(0.0, min(1.0, lam))
    lo, hi = 0.2, 4.0  # coberta cresce com s: bisseção até 80%
    for _ in range(40):
        m = (lo + hi) / 2
        if coverage(P, lam, m) < .8:
            lo = m
        else:
            hi = m
    # cone de volatilidade puro, com a mesma calibração de 80% (a referência justa para comparar)
    q = np.percentile(np.concatenate([np.abs(p['real'] / p['sig']) for p in P]), 80)
    return lam, (lo + hi) / 2, float(q / ND.inv_cdf(.9))


def pinball(L, real_end):
    qm = np.percentile(L, QS * 100)
    return float(np.mean([max(q * (real_end - x), (q - 1) * (real_end - x)) for q, x in zip(QS, qm)]))


def evaluate(P, lam, s, sc=1.0):
    hit, cov, pm, pc, mae_m, mae_r, up_ok = [], [], [], [], [], [], []
    for p in P:
        L = calibrated(p, lam, s)
        re = p['real']
        lo, hi = np.percentile(L, 10, axis=0), np.percentile(L, 90, axis=0)
        cov.append(float(((lo <= re) & (re <= hi)).mean()))
        mean = L.mean(axis=0)
        mae_m.append(float(np.abs(mean - re).mean()))
        mae_r.append(float(np.abs(re).mean()))
        if re[-1] != 0 and abs(mean[-1]) > 1e-9:
            hit.append(np.sign(mean[-1]) == np.sign(re[-1]))
        pm.append(pinball(L, re[-1]))
        pc.append(pinball(np.array([ND.inv_cdf(q) * p['sig'][-1] * sc for q in np.linspace(.03, .97, 64)]), re[-1]))
    return {'n': len(P), 'hit': float(np.mean(hit)) if hit else None, 'cov': float(np.mean(cov)),
            'skill': 1 - float(np.mean(mae_m)) / float(np.mean(mae_r)), 'pin_vs_cone': float(np.mean(pm)) / float(np.mean(pc))}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('file')
    ap.add_argument('--cfg', default=None, help='configuração a calibrar (por defeito, todas as do ficheiro, por intervalo)')
    ap.add_argument('--out', default=None)
    ap.add_argument('--pick-out', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'kronos-calibration.json'))
    ap.add_argument('--min-rows', type=int, default=30)
    ap.add_argument('--pick', default=None, help='configuração escolhida por intervalo, ex.: d1=base,h1=detrend,w1=base; escreve o ficheiro de calibração para o kronos-forecast.py')
    a = ap.parse_args()
    rows = [json.loads(l) for l in open(a.file, encoding='utf8')]
    out = {}
    print('tf  cfg           n   lam   s    | fora da amostra: acerto  cob80  skill  pinball/cone calibrado | sem calibrar: cob80 skill pin/cone')
    for tf in sorted({r['tf'] for r in rows}):
        cfgs = [a.cfg] if a.cfg else sorted({r['cfg'] for r in rows if r['tf'] == tf})
        for cfg in cfgs:
            P = [prep(r) for r in rows if r['tf'] == tf and r['cfg'] == cfg]
            if len(P) < a.min_rows:
                continue
            lam, s, sc = fit(P)
            # validação cruzada: ajusta sem o mercado e avalia nesse mercado
            mk = sorted({p['mkt'] for p in P})
            ev_rows = []
            for m in mk:
                tr = [p for p in P if p['mkt'] != m]
                if len(tr) < 10:
                    continue
                l2, s2, c2 = fit(tr)
                te = [p for p in P if p['mkt'] == m]
                for p in te:
                    ev_rows.append((p, l2, s2, c2))
            # agrega métricas fora da amostra
            hit, cov, pm, pc, mm, mr = [], [], [], [], [], []
            for p, l2, s2, c2 in ev_rows:
                e = evaluate([p], l2, s2, c2)
                cov.append(e['cov'])
                if e['hit'] is not None:
                    hit.append(e['hit'])
                pm.append(e['pin_vs_cone'])
                mm.append(1 - e['skill'])
            raw = evaluate(P, 1.0, None, sc)  # sem calibrar: o modelo tal e qual
            res = {'n': len(P), 'lam': round(lam, 3), 's': round(s, 3), 's_cone': round(sc, 3),
                   'hit': round(float(np.mean(hit)), 3) if hit else None, 'cov': round(float(np.mean(cov)), 3),
                   'skill': round(1 - float(np.mean(mm)), 3), 'pin_vs_cone': round(float(np.mean(pm)), 3)}
            print(f"{tf:3} {cfg:13} {len(P):4} {lam:5.2f} {s:4.2f} |   {res['hit'] or 0:.3f}  {res['cov']:.3f}  {res['skill']:+.3f}  {res['pin_vs_cone']:.3f}   |  {raw['cov']:.3f} {raw['skill']:+.3f} {raw['pin_vs_cone']:.3f}")
            out.setdefault(tf, {})[cfg] = res
    if a.pick:
        import importlib.util
        sp = importlib.util.spec_from_file_location('kb', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'kronos-backtest.py'))
        kb = importlib.util.module_from_spec(sp); sp.loader.exec_module(kb)
        cal = {'cfg': {}, 'cal': {}}
        for kv in a.pick.split(','):
            tf, cfg = kv.split('=')
            sel = [r for r in rows if r['tf'] == tf and r['cfg'] == cfg]
            raw = kb.metrics(sel)  # o modelo tal como sai: acerto de direção, vantagem sobre "fica igual"
            res = out[tf][cfg]
            cal['cfg'][tf] = kb.variants(tf)[cfg]
            cal['cal'][tf] = {'n': res['n'], 'lam': res['lam'], 's': res['s'], 'hit': round(raw['hit'], 3), 'cov': res['cov'],
                              'skill': round(raw['skill'], 3), 'pin_vs_cone': res['pin_vs_cone']}
        cal['fitted'] = os.path.basename(a.file)
        json.dump(cal, open(a.pick_out, 'w', encoding='utf8'), indent=1, ensure_ascii=False)
        print('escrito', a.pick_out)
    if a.out:
        json.dump(out, open(a.out, 'w', encoding='utf8'), indent=1, ensure_ascii=False)
        print('escrito', a.out)


if __name__ == '__main__':
    main()

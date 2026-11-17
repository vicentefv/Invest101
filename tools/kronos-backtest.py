# Backtest walk-forward do Kronos: em cada origem histórica o modelo só vê as velas anteriores e o resultado compara-se com o que aconteceu.
# Uso:
#   python tools/kronos-backtest.py run <pasta data> --name busca --model small --samples 16 --tf d1,h1,w1 --markets SPX,NDX --variants base,lb64,detrend
#   python tools/kronos-backtest.py report tools/backtests/busca.jsonl
import argparse, json, os, sys, time

import numpy as np

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import kronoslib as K  # noqa: E402

OUT = os.path.join(K.ROOT, 'tools', 'backtests')
BASE_LB = {'d1': 256, 'h1': 256, 'w1': 128, 'm15': 128}
KMIN = {'d1': 255, 'h1': 255, 'w1': 127, 'm15': 127}
STRIDE = {'d1': 12, 'h1': 12, 'w1': 14, 'm15': 12}


def variants(tf):
    b = BASE_LB[tf]
    base = {'lb': b, 'T': 1.0, 'top_p': 0.9, 'norm': 'level', 'vol': False}
    v = {'base': base,
         'lb64': {**base, 'lb': 64}, 'lb128': {**base, 'lb': 128},
         'detrend': {**base, 'norm': 'detrend'},
         'detrend_lb128': {**base, 'norm': 'detrend', 'lb': 128},
         'detrend_lb64': {**base, 'norm': 'detrend', 'lb': 64},
         'p100': {**base, 'top_p': 1.0}, 'T08': {**base, 'T': 0.8}, 'vol': {**base, 'vol': True}}
    return v


def origins(n_closed, tf, h):
    kmax = n_closed - 1 - h
    ks = list(range(kmax, KMIN[tf] - 1, -STRIDE[tf]))
    return ks[::-1][-12:]


def run(a):
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, a.name + '.jsonl')
    done = set()
    if os.path.exists(path):
        for line in open(path, encoding='utf8'):
            r = json.loads(line)
            done.add((r['mkt'], r['tf'], r['cfg'], r['k']))
    pred, src = K.load_predictor(a.model)
    print(f'{src}, {a.samples} amostras, {path}', flush=True)
    only = {s for s in a.markets.split(',') if s}
    want = [v for v in a.variants.split(',') if v]
    t0, n = time.time(), 0
    with open(path, 'a', encoding='utf8') as out:
        for f in sorted(os.listdir(os.path.join(a.dir, 'ohlc'))):
            mid = f[:-5]
            if only and mid not in only:
                continue
            ohlc = json.load(open(os.path.join(a.dir, 'ohlc', f), encoding='utf8'))
            weekend = K.is_weekend_market(ohlc)
            for tf in a.tf.split(','):
                b = ohlc.get('tf', {}).get(tf)
                if not b or len(b['t']) < KMIN[tf] + 40:
                    continue
                h = K.TF[tf][1]
                nc = len(b['t']) - 1  # a última vela está a decorrer: não entra
                vols = variants(tf)
                for name in want:
                    cfg = vols.get(name)
                    if cfg is None or (name == 'vol' and not b.get('v')):
                        continue
                    for k in origins(nc, tf, h):
                        if (mid, tf, name, k) in done:
                            continue
                        c = np.array(b['c'], dtype=np.float64)
                        try:
                            P, fut = K.sample_paths(pred, b, k, h, tf, weekend, cfg, a.samples, seed=1000 + k)
                        except Exception as e:
                            print('FALHA', mid, tf, name, k, e, flush=True)
                            continue
                        lr = np.diff(np.log(c[max(0, k - 60):k + 1]))
                        row = {'mkt': mid, 'tf': tf, 'cfg': name, 'k': k, 'h': h, 'c0': float(c[k]), 'vol': float(lr.std(ddof=1)),
                               'real': [float(x) for x in c[k + 1:k + 1 + h]],
                               'S': [[round(float(x), 6) for x in p] for p in P[:, :, 3]]}
                        out.write(json.dumps(row, separators=(',', ':')) + '\n')
                        out.flush()
                        n += 1
                    print(f'{mid} {tf} {name}  ({time.time() - t0:.0f}s, {n} previsões)', flush=True)
    print(f'FIM {n} previsões em {time.time() - t0:.0f}s')


def metrics(rows):
    """Métricas agregadas de um conjunto de linhas (mesma configuração)."""
    qs = np.array([.1, .25, .5, .75, .9])
    hit, mae_m, mae_r, ce, ca, zp, zr, spr, pin_m, pin_v, pr_end, rr_end, up_ok = ([] for _ in range(13))
    from math import sqrt
    from statistics import NormalDist
    nd = NormalDist()
    for r in rows:
        c0, S, real, h = r['c0'], np.array(r['S']), np.array(r['real']), r['h']
        ret = S / c0 - 1
        rr = real / c0 - 1
        pr = ret.mean(axis=0)
        sig = r['vol'] * sqrt(h)
        mae_m.append(np.abs(pr - rr).mean())
        mae_r.append(np.abs(rr).mean())
        if rr[-1] != 0:
            hit.append(np.sign(pr[-1]) == np.sign(rr[-1]))
            up_ok.append(((ret[:, -1] > 0).mean() > .5) == (rr[-1] > 0))
        lo, hi = np.percentile(ret, 10, axis=0), np.percentile(ret, 90, axis=0)
        ce.append(lo[-1] <= rr[-1] <= hi[-1])
        ca.append(((lo <= rr) & (rr <= hi)).mean())
        zp.append(pr[-1] / sig)
        zr.append(rr[-1] / sig)
        spr.append(ret[:, -1].std(ddof=1) / sig)
        pr_end.append(pr[-1])
        rr_end.append(rr[-1])
        qm = np.percentile(ret[:, -1], qs * 100)
        qv = np.array([nd.inv_cdf(q) * sig for q in qs])
        pin = lambda qv_: float(np.mean([max(q * (rr[-1] - x), (q - 1) * (rr[-1] - x)) for q, x in zip(qs, qv_)]))
        pin_m.append(pin(qm))
        pin_v.append(pin(qv))
    zp, zr = np.array(zp), np.array(zr)
    lam = float((zp * zr).sum() / (zp * zp).sum()) if (zp * zp).sum() > 0 else float('nan')
    return {'n': len(rows), 'hit': float(np.mean(hit)), 'up_hit': float(np.mean(up_ok)),
            'skill': 1 - float(np.mean(mae_m)) / float(np.mean(mae_r)),
            'cov_end': float(np.mean(ce)), 'cov_all': float(np.mean(ca)),
            'bias_z': float(zp.mean()), 'real_z': float(zr.mean()), 'lam': lam,
            'spread_ratio': float(np.mean(spr)), 'pin_vs_vol': float(np.mean(pin_m)) / float(np.mean(pin_v))}


def report(a):
    rows = [json.loads(l) for l in open(a.file, encoding='utf8')]
    keys = sorted({(r['tf'], r['cfg']) for r in rows})
    print('tf  cfg             n    acerto  skill   cob80fim cob80todas  vies_z  lam    disp/vol  pinball/cone')
    for tf, cfg in keys:
        m = metrics([r for r in rows if r['tf'] == tf and r['cfg'] == cfg])
        print(f"{tf:3} {cfg:14} {m['n']:4}  {m['hit'] * 100:5.1f}%  {m['skill'] * 100:+5.1f}%  {m['cov_end'] * 100:5.1f}%   {m['cov_all'] * 100:5.1f}%   {m['bias_z']:+.2f}  {m['lam']:+.2f}  {m['spread_ratio']:.2f}      {m['pin_vs_vol']:.2f}")
    if a.by_market:
        for tf, cfg in keys:
            for mk in sorted({r['mkt'] for r in rows if r['tf'] == tf and r['cfg'] == cfg}):
                m = metrics([r for r in rows if r['tf'] == tf and r['cfg'] == cfg and r['mkt'] == mk])
                print(f"  {tf} {cfg} {mk:8} n={m['n']:2} acerto {m['hit'] * 100:5.1f}% skill {m['skill'] * 100:+6.1f}% cob {m['cov_end'] * 100:5.1f}%")


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest='cmd', required=True)
    r = sub.add_parser('run')
    r.add_argument('dir')
    r.add_argument('--name', default='busca')
    r.add_argument('--model', default='small', choices=list(K.MODELS))
    r.add_argument('--samples', type=int, default=16)
    r.add_argument('--tf', default='d1')
    r.add_argument('--markets', default='')
    r.add_argument('--variants', default='base')
    p = sub.add_parser('report')
    p.add_argument('file')
    p.add_argument('--by-market', action='store_true')
    args = ap.parse_args()
    run(args) if args.cmd == 'run' else report(args)

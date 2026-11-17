# Núcleo partilhado pelo backtest e pela previsão: carrega o Kronos e simula trajetórias a partir de velas FECHADAS.
import json, os, sys
from datetime import datetime, timezone

import numpy as np
import pandas as pd
import torch

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, 'vendor', 'Kronos'))
from model import Kronos, KronosTokenizer, KronosPredictor  # noqa: E402

MODELS = {'mini': ('NeoQuasar/Kronos-mini', 'NeoQuasar/Kronos-Tokenizer-2k', 2048),
          'small': ('NeoQuasar/Kronos-small', 'NeoQuasar/Kronos-Tokenizer-base', 512),
          'base': ('NeoQuasar/Kronos-base', 'NeoQuasar/Kronos-Tokenizer-base', 512)}
# segundos por vela, número de velas previstas (horizonte de produção)
TF = {'m15': (900, 32), 'h1': (3600, 24), 'd1': (86400, 20), 'w1': (604800, 12)}


def load_predictor(name):
    src, tok, ctx = MODELS[name]
    dev = 'cuda:0' if torch.cuda.is_available() else 'cpu'
    return KronosPredictor(Kronos.from_pretrained(src).eval(), KronosTokenizer.from_pretrained(tok).eval(),
                           device=dev, max_context=ctx), src


def is_weekend_market(ohlc):
    """Mercados que negoceiam ao fim de semana (cripto): têm velas diárias ao sábado."""
    return any(datetime.fromtimestamp(x, timezone.utc).weekday() == 5
               for x in ohlc.get('tf', {}).get('d1', {}).get('t', [])[-30:])


def future_stamps(t, tf, weekend, n):
    """Instantes das próximas n velas, respeitando os dias e as horas em que este mercado costuma negociar."""
    step = TF[tf][0]
    last, out = int(t[-1]), []
    if tf == 'w1':
        return [last + step * (k + 1) for k in range(n)]
    prev = np.array(t[-300:])
    hist = pd.to_datetime(prev, unit='s')
    phase = int(pd.Series(prev[-30:] % step).mode().iloc[0])  # só as últimas: a hora de abertura em UTC muda com a hora de verão
    cur = (last - phase) // step * step + phase
    days = set(hist.weekday)
    if tf == 'd1':
        while len(out) < n:
            cur += step
            if datetime.fromtimestamp(cur, timezone.utc).weekday() in days or len(days) < 3:
                out.append(cur)
        return out
    pairs = {(d.weekday(), (d.hour * 3600 + d.minute * 60) // step) for d in hist} if prev[-1] - prev[0] > 8 * 86400 else None
    slots, scanned = {(d.hour * 3600 + d.minute * 60) // step for d in hist}, 0
    while len(out) < n:
        cur += step
        scanned += 1
        d = datetime.fromtimestamp(cur, timezone.utc)
        s = (d.hour * 3600 + d.minute * 60) // step
        wd = d.weekday()
        if ((wd, s) in pairs if pairs else (weekend or wd < 5 or wd in days) and s in slots) or scanned > 14 * 86400 // step:
            out.append(cur)
    return out


def frame(b, lo, hi, vol):
    """DataFrame OHLC(+volume) das velas lo..hi (exclusivo)."""
    d = {k: np.array(b[c][lo:hi], dtype=np.float64) for k, c in (('open', 'o'), ('high', 'h'), ('low', 'l'), ('close', 'c'))}
    if vol and b.get('v') and np.count_nonzero(b['v'][lo:hi]) > (hi - lo) * 0.6:
        v = np.array(b['v'][lo:hi], dtype=np.float64)
        d['volume'] = v
        d['amount'] = v * (d['open'] + d['high'] + d['low'] + d['close']) / 4
    return pd.DataFrame(d)


def sample_paths(pred, b, k, h, tf, weekend, cfg, samples, seed=None):
    """Simula `samples` trajetórias de h velas depois da vela k (inclusive; só se usam velas 0..k, todas fechadas).
    cfg: lb (velas de contexto), T, top_p, norm ('level' | 'detrend'), vol (bool).
    Devolve (array (samples, h, 4) em preço OHLC, lista dos instantes futuros)."""
    lb = int(cfg.get('lb', 256))
    lo = max(0, k + 1 - lb)
    df = frame(b, lo, k + 1, cfg.get('vol', False))
    t = b['t'][lo:k + 1]
    fut = future_stamps(t, tf, weekend, h)
    x_ts = pd.Series(pd.to_datetime(np.array(t), unit='s'))
    y_ts = pd.Series(pd.to_datetime(np.array(fut), unit='s'))
    trend = None
    if cfg.get('norm') == 'detrend' and len(df) >= 20:
        # tira a tendência linear do fecho a todas as colunas de preço; a previsão volta a somar o nível final (deriva nula)
        x = np.arange(len(df))
        a1, a0 = np.polyfit(x, df['close'].values, 1)
        line = a0 + a1 * x
        for c in ('open', 'high', 'low', 'close'):
            df[c] = df[c].values - line
        trend = a0 + a1 * (len(df) - 1)
    if seed is not None:
        torch.manual_seed(seed)
        np.random.seed(seed)
    outs = pred.predict_batch([df] * samples, [x_ts] * samples, [y_ts] * samples, pred_len=h,
                              T=float(cfg.get('T', 1.0)), top_p=float(cfg.get('top_p', 0.9)), sample_count=1, verbose=False)
    P = np.stack([o[['open', 'high', 'low', 'close']].values for o in outs]).astype(np.float64)
    if trend is not None:
        P = P + trend
    if not np.isfinite(P).all():
        raise ValueError('previsão com valores inválidos')
    # velas bem formadas
    P[:, :, 1] = np.maximum.reduce([P[:, :, 0], P[:, :, 1], P[:, :, 2], P[:, :, 3]])
    P[:, :, 2] = np.minimum.reduce([P[:, :, 0], P[:, :, 1], P[:, :, 2], P[:, :, 3]])
    return P, fut

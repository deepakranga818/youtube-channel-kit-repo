"""Sound: male neural voice reading the script, pen foley driven by the strokes, no background music.

Inputs (this folder): timeline.json (chunk starts), vo/<id>.wav, events.json (one event per stroke + story cues, exported from index.html).
Output: out/mix.wav (48 kHz stereo). Run with the library venv:  LIB=<library> python mix.py
"""
import json, os, sys
import numpy as np, soundfile as sf, soxr
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, click, whoosh

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json')))
EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = float(TL['dur']); N = int(DUR * SR); EV = EVJ['ev']
CUE = {e['name']: e['t'] for e in EV if e['type'] == 'cue'}
rng = np.random.default_rng(31)
tt = np.arange(N) / SR
rms = lambda x: float(np.sqrt(np.mean(np.square(x)) + 1e-12))
db = lambda x: 20 * np.log10(x + 1e-12)


def smooth(x, sec):
    k = max(1, int(sec * SR)); return np.convolve(x, np.ones(k) / k, 'same')


# ---------------- voice ----------------
vo = np.zeros(N); vmask = np.zeros(N)
for L in TL['lines']:
    x, sr = sf.read(os.path.join(HERE, 'vo', L['id'] + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = soxr.resample(x, sr, SR)
    i = int(L['t0'] * SR); n = min(len(x), N - i); vo[i:i + n] += x[:n]; vmask[i:i + n] = 1
vo = hp(vo, 80)
vo = compress(vo / (np.abs(vo).max() + 1e-9) * 0.9, thr=0.22, ratio=3.0, att=0.003, rel=0.12)
duck = smooth(np.maximum(vmask, np.roll(vmask, int(0.12 * SR))), 0.15)


# ---------------- pen foley ----------------
def activity(kind):
    a = np.zeros(N); pw = np.zeros(N)
    for e in EV:
        if e['type'] != kind: continue
        i0 = int(e['t'] * SR); i1 = min(N, int((e['t'] + max(e['d'], 0.03)) * SR))
        if i1 <= i0: continue
        n = i1 - i0; env = np.ones(n); r = min(n // 3, int(0.012 * SR))
        if r > 0: env[:r] = np.linspace(0, 1, r); env[-r:] = np.linspace(1, 0, r)
        a[i0:i1] += env; pw[i0:i1] += env * e.get('pan', 0)
    pan = np.where(a > 1e-6, pw / np.maximum(a, 1e-6), 0)
    return smooth(1 - np.exp(-a * 0.9), 0.02), smooth(pan, 0.02)


def scratch_noise(lo, hi, grain_hz, depth, seed):
    r = np.random.default_rng(seed); x = bp(r.standard_normal(N), lo, hi, 2)
    g = lp(np.abs(r.standard_normal(N)), grain_hz, 1); g = g / (np.percentile(g, 95) + 1e-9)
    return x * ((1 - depth) + depth * g)


def wobble(rate, seed):
    r = np.random.default_rng(seed)
    ph = np.cumsum(rate * (1 + 0.35 * lp(r.standard_normal(N), 3, 1) * 8) / SR) * 2 * np.pi
    return 0.55 + 0.45 * np.abs(np.sin(ph))


def pan_st(x, pan):
    th = (pan + 1) * np.pi / 4; return np.stack([x * np.cos(th), x * np.sin(th)], 1)


foley = np.zeros((N, 2))
for kind, (lo, hi, gh, dep, rate, pw, g, sd) in {
        'pen': (2400, 6500, 900, 0.85, 6, 1.0, 0.14, 1),
        'write': (2000, 6000, 700, 0.9, 11, 1.5, 0.17, 3),
        'marker': (700, 3200, 300, 0.6, 14, 2.0, 0.14, 5)}.items():
    lv, pn = activity(kind)
    foley += pan_st(scratch_noise(lo, hi, gh, dep, sd) * wobble(rate, sd + 1) ** pw * lv, pn * 0.6) * g
for e in EV:
    if e['type'] in ('pen', 'write') and e['d'] >= 0.12:
        add(foley, hp(click(pitch=0.55 + rng.random() * 0.2, v=1.0), 1500) * 0.04, e['t'], 1.0, e.get('pan', 0) * 0.6)
foley *= (1 - 0.5 * duck)[:, None]
room = lp(rng.standard_normal(N), 500, 2) * 0.004
foley += np.stack([room, np.roll(room, 997)], 1)

# camera moves between the eight blocks: paper and air
first = {}
for L in TL['lines']: first.setdefault(L['id'][0], L['t0'])
KEYS = list(first)                       # section letters in order of appearance (first letter of each chunk id)
for k in KEYS[1:]: add(foley, lp(whoosh(0.9, 1.0), 2600) * 0.07, first[k] - 0.7, 1.0, 0.0)
add(foley, lp(whoosh(1.6, 1.0), 2500) * 0.08, CUE['pull'], 1.0, 0.0)
# optional story cue: CUE['fee'] (set it in page.js) = the one number that lands; a small coin plip, a glockenspiel pair and a held breath
d = 0.16; t_ = np.arange(int(d * SR)) / SR
plip = np.sin(2 * np.pi * (1500 - 2600 * t_) * t_) * np.exp(-t_ / 0.035)
if 'fee' in CUE: add(foley, plip * 0.16, CUE['fee'] + 0.3, 1.0, 0.0)

# ---------------- no background music (removed at the owner's request): voice + pen/marker foley + room tone + the whooshes and the coin plip ----------------
# ---------------- balance: voice about 5 dB above the pen sounds (the ratio the film was approved with); build.sh masters to -14 LUFS ----------------
spk = vmask > 0
vg = (rms(foley[spk].mean(1)) * 10 ** (5 / 20)) / rms(vo[spk])
mix = foley + np.stack([vo * vg, vo * vg], 1)
print(f'voice vs pens (RMS while speaking): {db(rms(vo[spk]) * vg) - db(rms(foley[spk].mean(1))):.1f} dB')
mix = np.stack([limit(compress(mix[:, c], thr=0.35, ratio=2.0)) for c in (0, 1)], 1)
mix *= np.clip((DUR - tt) / 0.25, 0, 1)[:, None]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
print('mix', mix.shape, 'peak', round(float(np.abs(mix).max()), 3))

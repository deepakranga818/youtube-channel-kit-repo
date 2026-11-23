"""Sound for a Mid-century Cartoon film: NO background music (channel default). Narration + foley from the picture events (stamps for medallions, pops for tags,
paper swishes for wipes, a ding for the number that lands) + a very quiet room tone.
Inputs: timeline.json, vo/<id>.wav, events.json (from core/render/events.mjs). Output: out/mix.wav (48 kHz stereo). Run:  LIB=<library> python mix.py
Silences: a held breath before the key number (cue 'fee' if the scenes emit it), room tone only before the lockup. Voice is levelled to a fixed RMS; mastering to -14 LUFS happens in mux.sh."""
import json, os, sys
import numpy as np, soundfile as sf, soxr
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar'); sys.path.insert(0, LIB)
from core.audio.sfx import SR, t_, env_exp, bp, lp, hp, norm, brown, clack, whoosh, ding, pop as sfx_pop, add, compress, limit

HERE = os.path.dirname(os.path.abspath(__file__))
TL = json.load(open(os.path.join(HERE, 'timeline.json'))); EVJ = json.load(open(os.path.join(HERE, 'events.json')))
DUR = float(TL['dur']); N = int(DUR * SR); EV = EVJ['ev']; CUE = {e['name']: e['t'] for e in EV if e['type'] == 'cue'}
SC = {s['id']: s for s in TL['scenes']}
BPM = TL['bpm']; B = 60 / BPM; BAR = 4 * B; SW = 0.60
rng = np.random.default_rng(48)
rms = lambda x: float(np.sqrt(np.mean(np.square(x)) + 1e-12)); db = lambda x: 20 * np.log10(x + 1e-12)
tt = np.arange(N) / SR
def smooth(x, sec): k = max(1, int(sec * SR)); return np.convolve(x, np.ones(k) / k, 'same')
def nz(d): return rng.standard_normal(len(t_(d)))
def sine(f, d): return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(f, len(t_(d))).astype(float)) / SR)
def M(*xs): n = max(len(x) for x in xs); return sum(np.pad(x, (0, n - len(x))) for x in xs)

# ---------------- narration ----------------
vo = np.zeros(N); vmask = np.zeros(N)
for L in TL['lines']:
    x, sr = sf.read(os.path.join(HERE, 'vo', L['id'] + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    if sr != SR: x = soxr.resample(x, sr, SR)
    i = int(L['t0'] * SR); n = min(len(x), N - i); vo[i:i + n] += x[:n]; vmask[i:i + n] = 1
vo = hp(vo, 80); vo = compress(vo / (np.abs(vo).max() + 1e-9) * 0.9, thr=0.22, ratio=3.0, att=0.003, rel=0.12)
duck = smooth(np.maximum(vmask, np.roll(vmask, int(0.12 * SR))), 0.15)

# ---------------- foley by material ----------------
def stamp():                       # rubber stamp: thick, damped, a little paper smack
    d = .3; x = sine(140 * (1 - .4 * t_(d)), d) * env_exp(d, .035) + lp(nz(d), 1800) * env_exp(d, .012) * .9; return norm(x)
def paper_swish(d=.3): return norm(bp(nz(d), 1800, 8000)) * np.sin(np.pi * t_(d) / d) ** 2
def slide(d=.25): return norm(bp(nz(d), 1200, 5000)) * np.sin(np.pi * t_(d) / d)
def pip(): d = .12; return norm(sine(880, d) * env_exp(d, .03) + sine(1760, d) * env_exp(d, .015) * .3)
def iris(d): return norm(bp(nz(d), 1000, 6000) * np.linspace(1, .2, len(t_(d)))) * np.sin(np.pi * t_(d) / d)
def coin():                        # the ₹ ding: bright bell + a plip
    d = .9; tt_ = t_(d); x = sine(1568, d) * env_exp(d, .25) + sine(2349, d) * env_exp(d, .12) * .5 + sine(3136, d) * env_exp(d, .05) * .25
    return norm(x * np.minimum(1, tt_ / .003))
fx = np.zeros((N, 2)); last_pop = -9
for e in EV:
    t, ty, gn, pan = e['t'], e['type'], e.get('gain', 1.0), e.get('pan', 0.0)
    if ty == 'pop':
        if t - last_pop < 0.12: continue
        last_pop = t; add(fx, pip(), t, .10 * gn, pan)
    elif ty == 'stamp': add(fx, stamp(), t, .55 * gn, pan)
    elif ty == 'whoosh': add(fx, lp(whoosh(e.get('dur', .35), 1), 3000), t, .2 * gn, pan)
    elif ty == 'slide': add(fx, slide(), t, .12 * gn, -.4)
    elif ty == 'paper_swish': add(fx, paper_swish(.3), t, .28 * gn, .3)
    elif ty == 'ding': add(fx, coin(), t, .35 * gn, .1)
    elif ty == 'iris': add(fx, iris(e.get('dur', .5)), t, .22)
room = lp(brown(DUR), 900) * .016; amb = np.stack([room, np.roll(room, 311)], 1)

# ---------------- no background music: voice + foley (stamps, pops, paper swishes, the coin ding) + a very quiet room tone ----------------
fee_t = CUE.get('fee', 1e9); lock_t = CUE['lock']
for a_, b_ in ((fee_t - 0.35, fee_t - 0.02), (lock_t - 0.5, lock_t)):                 # a held breath before the rupee number; room tone only before the lockup
    m = np.ones(N); m[int(a_ * SR):int(b_ * SR)] = 0.0; m = smooth(m, 0.03); fx *= m[:, None]
# ---------------- balance: voice at a fixed level (mux masters to -14 LUFS); effects keep their own gains ----------------
spk = vmask > 0; vg = 0.10 / rms(vo[spk]) if spk.any() else 1
mix = fx + amb + np.stack([vo * vg, vo * vg], 1)
print(f'voice RMS {db(rms(vo[spk]) * vg):.1f} dB; effects RMS while speaking {db(rms(fx[spk].mean(1))):.1f} dB')
mix = np.stack([limit(compress(mix[:, c], thr=0.35, ratio=2.0)) for c in (0, 1)], 1)
mix *= np.clip((DUR - tt) / 0.25, 0, 1)[:, None]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
print('mix', mix.shape, 'peak', float(np.abs(mix).max()))

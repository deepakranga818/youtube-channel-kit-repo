"""Sound for "अदृश्य ब्रह्मांड का नक्शा": Hindi narration + foley, all on the film's timeline (seconds). NO background music (removed at the owner's request).
The timeline keeps the 84 bpm bar grid (a bar = 2.857 s, 53 bars = 151.43 s) that the scenes were cut on.
Writes out/mix.wav (48 kHz stereo), out/cues.json and out/subs.srt.
Usage (library .venv): LIB=<library> python mix.py
"""
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import resample_poly
LIB = os.environ.get('LIB') or os.path.expanduser('~/lemo-opuscar')
sys.path.insert(0, LIB)
from core.audio.sfx import SR, bp, lp, hp, add, compress, limit, click, clack, whoosh, thump, pop, ding, brown

HERE = os.path.dirname(os.path.abspath(__file__))
DUR = 151.43; N = int(round(DUR * SR))
BPM = 84; BAR = 240 / BPM; BEAT = 60 / BPM
rng = np.random.default_rng(23)
SEC = dict(S1=0, S2=3 * BAR, S3=7 * BAR, S4=13 * BAR, S5=17 * BAR, S6=24 * BAR, S7=28 * BAR, S8=36 * BAR, S9=43 * BAR)

# ---------- narration: id, start, duration (rendered voice), Hindi/English cue pairs (same as film.js) ----------
VO = [
 ('v1', 2.0, 5.922, [('आसमान में एक छोटा सा बिंदु…', 'A tiny dot in the sky…'), ('असल में एक पूरी आकाशगंगा है।', 'is really a whole galaxy.')]),
 ('v2', 10.0, 7.593, [('यूरोपीय स्पेस एजेंसी के यूक्लिड टेलीस्कोप ने', "ESA's Euclid telescope has"), ('नब्बे करोड़ से ज़्यादा आकाशगंगाएँ सूचीबद्ध की हैं।', 'catalogued over 900 million galaxies.')]),
 ('v3', 20.8, 3.731, [('लेकिन ब्रह्मांड का एक बड़ा हिस्सा', 'But a large part of the universe'), ('हमें दिखता ही नहीं।', 'never shows up.')]),
 ('v4', 26.0, 5.959, [('इसे डार्क मैटर कहते हैं।', 'It is called dark matter.'), ('इसकी तस्वीर आज तक किसी ने नहीं खींची।', 'Nobody has ever photographed it.')]),
 ('v5', 36.0, 5.469, [('तो वैज्ञानिक इसका नक्शा कैसे बनाते हैं?', 'So how do scientists map it?'), ('इसके असर को देखकर।', 'By watching what it does.')]),
 ('v6', 42.5, 6.098, [('जैसे हवा नहीं दिखती, पर पत्ते हिलते हैं,', 'Wind is invisible, but leaves move,'), ('तो पता चल जाता है कि हवा है।', 'and you know it is there.')]),
 ('v7', 51.0, 6.783, [('भारी चीज़ें स्पेस को मोड़ती हैं,', 'Heavy things bend space,'), ('और दूर की आकाशगंगा की रोशनी भी मुड़ जाती है।', "and a distant galaxy's light bends too.")]),
 ('v8', 59.2, 2.457, [('इसे ग्रैविटेशनल लेंसिंग कहते हैं।', 'This is called gravitational lensing.')]),
 ('v9', 62.8, 5.009, [('कभी रोशनी इतनी मुड़ती है', 'Sometimes light bends so much'), ('कि एक चमकता हुआ छल्ला बन जाता है।', 'that a glowing ring appears.')]),
 ('v10', 71.0, 7.651, [('यूक्लिड को क़रीब पंद्रह हज़ार', 'Euclid found about 15,000'), ('ऐसे लेंस के उम्मीदवार मिले हैं।', 'lens candidates.'), ('अभी सबकी पुष्टि बाकी है।', 'All still need confirming.')]),
 ('v11', 82.0, 5.896, [('आकाशगंगाओं की हल्की-सी बदली हुई आकृतियों से', 'Slight changes in galaxy shapes'), ('डार्क मैटर का नक्शा बनता है।', 'build the dark matter map.')]),
 ('v12', 89.5, 9.318, [('यह अभी शुरुआती डेटा है, पूरा नक्शा नहीं।', 'This is early data, not the finished map.'), ('पूरा पहला डेटा रिलीज़', 'The full first data release'), ('दो हज़ार सत्ताईस के मध्य तक आएगा।', 'is due in mid-2027.')]),
 ('v13', 103.2, 6.398, [('और डार्क एनर्जी?', 'And dark energy?'), ('वह ब्रह्मांड के फैलने से जुड़ा, एक अलग रहस्य है।', 'A separate mystery tied to expansion.')]),
 ('v14', 110.5, 9.632, [('भारत का जीएमआरटी रेडियो टेलीस्कोप भी', "India's GMRT radio telescope also"), ('ब्रह्मांड को देखता है, पर रेडियो तरंगों से।', 'studies the universe, with radio waves.'), ('यह यूक्लिड से अलग यंत्र है।', 'It is a different instrument from Euclid.')]),
 ('v15', 124.5, 8.339, [('हर चीज़ को सीधे देखना ज़रूरी नहीं।', "You don't have to see everything directly."), ('कभी-कभी किसी अदृश्य चीज़ का पता उसके असर से चलता है।', 'Sometimes an invisible thing is known by its effects.')]),
 ('v16', 135.5, 3.899, [('एक्सप्लेन एवरीडे: बड़े सवाल, आसान जवाब।', 'ExplainEveryday: Big Questions, Simple Explanations.')]),
]
cues = []
for vid, t0, d, cs in VO:
    tot = sum(len(c[0]) for c in cs); t = t0
    for i, c in enumerate(cs):
        dd = d * len(c[0]) / tot; t1 = t0 + d + 0.6 if i == len(cs) - 1 else t + dd
        cues.append(dict(t0=round(t, 3), t1=round(max(t1, t + 1.8), 3), text=c[0] + '\n' + c[1])); t += dd
for i in range(len(cues) - 1):
    if cues[i]['t1'] > cues[i + 1]['t0'] - 0.05: cues[i]['t1'] = round(cues[i + 1]['t0'] - 0.05, 3)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
json.dump(cues, open(os.path.join(HERE, 'out', 'cues.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# =============== narration ===============
vo = np.zeros(N); vo_env = np.zeros(N)
for vid, t0, d, _ in VO:
    x, sr = sf.read(os.path.join(HERE, 'vo', vid + '.wav'), dtype='float32')
    if x.ndim > 1: x = x.mean(1)
    x = resample_poly(x, SR, sr); x = hp(x, 90); x = compress(x / (np.abs(x).max() + 1e-9) * .8, thr=.18, ratio=3.0)
    i0 = int(t0 * SR); i1 = min(N, i0 + len(x))
    if i1 > i0: vo[i0:i1] += x[:i1 - i0]
    a0, a1 = max(0, i0 - int(.25 * SR)), min(N, i1 + int(.35 * SR)); vo_env[a0:a1] = 1
k = int(.2 * SR); vo_env = np.convolve(vo_env, np.ones(k) / k, 'same')

# =============== foley (film seconds) ===============
fx = np.zeros((N, 2))
def tt_(d): return np.arange(int(d * SR)) / SR
def servo(d, pitch):
    t = tt_(d); f = 140 * pitch * (1 + 0.35 * t / d); ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(k * ph) / k for k in range(1, 14)); e = np.minimum(1, t / .015) * np.minimum(1, (d - t) / .03); return bp(x, 500, 3500) * e
def blip(f, d=.05): t = tt_(d); return np.sin(2 * np.pi * f * t) * np.exp(-t / .012) * np.minimum(1, t / .002)
def swish(d): t = tt_(d); return bp(rng.standard_normal(len(t)), 2500, 8000) * np.sin(np.pi * t / d) ** 2
def windn(d, lo=200, hi=1800): t = tt_(d); return bp(rng.standard_normal(len(t)), lo, hi) * np.sin(np.pi * t / d) ** 1.5
def puff(d=.3): t = tt_(d); return lp(rng.standard_normal(len(t)), 900) * np.exp(-t / .08) * np.minimum(1, t / .01)
def F(t, snd, g, pan=0.0):
    if 0 <= t < DUR: add(fx, snd, t, g, pan)
for t in (4.3, 13.6, 27.9, 52.2, 76.4, 118.1, 142.2): F(t, lp(click(.5), 3500), .09)          # blinks
F(0.45, pop(), .08); F(3.0, lp(whoosh(.9), 3000), .16, -.4); F(4.3, servo(.3, .8), .05); F(4.82, servo(.16, 1.5), .06); F(4.97, click(.9), .1)
for t in (4.34, 4.69): F(t, thump(1, 88), .15, -.5)
F(4.9, swish(.5), .025, -.5)
for i in range(18): F(5.2 + .06 * i, blip(900 * 2 ** (i / 17)), .03, .1 + .02 * i)           # the first sight line
F(5.2, lp(puff(.2), 900), .05)
F(8.0, lp(whoosh(.9), 3000), .14)
for i in range(32): F(12.2 + 3.2 * (i / 32) ** 1.5, hp(click(1.9), 2500), .03, .4)           # the counter rolls
F(15.4, clack(.9), .13, 0); F(15.45, lp(ding(), 6000)[:int(.8 * SR)] * np.exp(-tt_(.8) / .25), .05)
F(15.6, swish(.5), .03, .3)
F(19.2, lp(whoosh(1.0), 2600), .2); F(19.3, windn(.9, 120, 900), .05)
F(25.2, servo(.16, 1.5), .06); F(25.4, click(.9), .1)
for i in range(18): F(25.3 + .06 * i, blip(900 * 2 ** (i / 17)), .03, -.2)
for i in range(40): F(31.8 + 1.4 * i / 40, blip(500 + 1500 * i / 40, .03), .012, -.6 + 1.2 * i / 40)   # the halo scan
F(31.8, windn(1.5, 300, 2400), .05)
F(33.2, lp(ding(), 6000)[:int(1.2 * SR)] * np.exp(-tt_(1.2) / .4), .06); F(33.3, swish(.5), .03, .3)
F(36.9, lp(whoosh(.9), 2600), .2)                                                              # S3 -> S4
F(38.2, swish(.5), .03, .0)
F(39.0, windn(9.0, 200, 1500), .045, 0)                                                        # the wind bed
for i in range(14): F(41.0 + .5 * i + float(rng.uniform(0, .2)), lp(whoosh(.25), 3500), .045, float(rng.uniform(-.6, .6)))   # leaves
F(47.6, lp(whoosh(1.0), 2600), .2)                                                             # S4 -> S5
for i in range(40): F(51.0 + .12 * i, blip(900 + 1000 * (i % 20) / 20, .04), .012, -.7 + 1.4 * (i % 40) / 40)    # light walking
F(54.0, lp(whoosh(.8), 3000), .1, 0)
F(58.6, swish(.5), .03, -.3)
for i in range(40): F(62.0 + 1.2 * i / 40, blip(700 + 1500 * i / 40, .03), .012, .2)
F(63.2, windn(3.0, 400, 3000), .04); F(64.4, swish(.5), .03, .3)
F(66.2, clack(.9), .12, .2); F(66.3, lp(ding(), 6000)[:int(.8 * SR)] * np.exp(-tt_(.8) / .25), .05, .2)
F(SEC['S6'], lp(thump(1, 60), 800), .13); F(SEC['S6'] - .1, lp(whoosh(1.0), 2600), .2)
for i in range(30): F(69.3 + 1.4 * i / 30, hp(click(1.6), 2000), .02, 0)                       # the tape
F(70.0, clack(.9), .12, .5)
for i in range(30): F(73.2 + 2.4 * i / 30, pop(), .04, float(rng.uniform(-.5, .5)))
for i in range(9): F(76.0 + .22 * i, lp(ding(), 6000)[:int(.5 * SR)] * np.exp(-tt_(.5) / .2), .03, float(rng.uniform(-.5, .5)))
F(SEC['S7'] - .2, lp(whoosh(1.0), 2600), .2)
for i in range(20): F(84.0 + 4.0 * i / 20, servo(.12, 1.0 + .02 * i), .02, float(rng.uniform(-.6, .6)))   # the shear
F(89.0, swish(7.0) * .7, .02, -.3); F(91.0, swish(.5), .03, .3)
F(SEC['S8'] - .2, lp(whoosh(1.0), 2600), .2)
F(104.0, windn(8.0, 120, 800), .035, -.4)                                                      # the expansion
F(109.6, servo(1.4, .8), .03, .4)
for i in range(14): F(111.0 + .62 * i, blip(1100, .08) * np.exp(-tt_(.08) / .03), .02, .4)       # radio pings
F(104.6, swish(.5), .03, -.3); F(111.2, swish(.5), .03, .3)
F(SEC['S9'] - .2, lp(whoosh(1.0), 2600), .2)
for i, t in enumerate((125.0, 127.0, 129.0, 131.0)):
    F(t, lp(ding(), 6000)[:int(.8 * SR)] * np.exp(-tt_(.8) / .25), .05, -.4 + .27 * i); F(t - .05, clack(.9), .1, -.4 + .27 * i)
for i in range(60): F(125.0 + 8.0 * i / 60, blip(900 + 900 * i / 60, .03), .012, .0)           # dots run the track
F(135.6, swish(.5), .03, 0); F(136.4, swish(.5), .03, 0)
F(145.5, lp(ding(), 6000)[:int(1.0 * SR)] * np.exp(-tt_(1.0) / .35), .03)
tt = np.arange(N) / SR
thr = lp(brown(DUR + .1)[:N], 380) * np.clip((tt - 1.5) / .7, 0, 1) * np.clip((146 - tt) / 1.0, 0, 1)
room = lp(rng.standard_normal(N), 180) * .006
fx += np.stack([thr * .016, thr * .012], 1) + np.stack([room, np.roll(room, 1499)], 1)

# =============== mix: narration + foley, no background music ===============
fxd = fx * (1 - 0.3 * vo_env)[:, None]
voice = np.stack([vo, vo], 1) * .55
mix = fxd + voice
mix = np.stack([compress(mix[:, 0], thr=.3, ratio=2.5), compress(mix[:, 1], thr=.3, ratio=2.5)], 1)
f = np.clip((DUR - np.arange(N) / SR) / 0.6, 0, 1); mix *= f[:, None]
mix = np.stack([limit(mix[:, 0]), limit(mix[:, 1])], 1)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), mix.astype(np.float32), SR)
m = vo_env > .9
rv = 20 * np.log10(np.sqrt((voice[m] ** 2).mean()) + 1e-9); rf = 20 * np.log10(np.sqrt((fxd[m] ** 2).mean()) + 1e-9)
print(f'voice RMS {rv:.1f} dB, effects under voice {rf:.1f} dB, difference {rv - rf:.1f} dB')
print('mix', mix.shape, 'peak', round(float(np.abs(mix).max()), 3))

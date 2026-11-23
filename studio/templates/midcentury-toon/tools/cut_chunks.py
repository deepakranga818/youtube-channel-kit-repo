"""Cut the recorded parts into one wav per script chunk and measure the real pauses between chunks.
Needs out/align.json (tools/align.py) and out/asr/seg_<part>.json (utterances). Run with the library python:  python tools/cut_chunks.py
Writes vo/<id>.wav (24 kHz mono, tight), vo/dur.json, vo/gaps.json ({id: seconds of real pause before it, or null at a part start}), out/cuts.json.
The previous synthetic voice files are moved to vo_synthetic/ the first time (rename that folder if you want to keep it; build.sh skips text-to-speech once vo/gaps.json exists).
Needs ffmpeg on PATH. out/asr/ and out/ must exist (tools/segment_asr.py creates out/asr)."""
import glob, json, os, shutil, subprocess, sys
import numpy as np, soundfile as sf
HERE = os.path.dirname(os.path.abspath(__file__)) + '/..'
sys.path.insert(0, HERE)
from hinglish_src import L
IDS = [i for i, _, _ in L]
A = json.load(open(f'{HERE}/out/align.json', encoding='utf-8'))
PARTS = [p for p, _, _ in json.load(open(f'{HERE}/tools/parts.json'))]
SEG = {p: json.load(open(f'{HERE}/out/asr/seg_{p}.json', encoding='utf-8'))['segs'] for p in PARTS}
PAD_IN, PAD_OUT = 0.05, 0.08

# 1) boundaries: a chunk starts at its first word (snapped to the utterance start when close) and ends at the last speech before the next chunk begins
S = {}; E = {}
for p in SEG:
    ids = [i for i in IDS if A[i]['part'] == p]; us = SEG[p]
    for k, cid in enumerate(ids):
        s = A[cid]['s']
        for u in us:
            if u['s'] - 0.02 <= s <= u['e'] and s - u['s'] < 0.35: s = max(u['s'] + 0.03, s - 0.0) if s - u['s'] > 0.12 else u['s'] + 0.03; break
        S[cid] = s
    for k, cid in enumerate(ids):
        e = A[cid]['e']; nxt = S[ids[k + 1]] if k + 1 < len(ids) else 1e9
        for u in us:
            if u['s'] >= S[cid] - 0.02 and u['e'] <= nxt + 0.05 and u['e'] > e: e = u['e'] - 0.03
            elif u['s'] < e <= u['e'] and u['e'] <= nxt + 0.2: e = u['e'] - 0.03                  # finish the utterance we are in
        E[cid] = min(e, nxt - 0.02)

# 2) decode the parts once, cut tight clips (never overlapping the neighbour), measure the pauses
os.makedirs(f'{HERE}/vo', exist_ok=True)
if not os.path.exists(f'{HERE}/vo_synthetic'):
    os.makedirs(f'{HERE}/vo_synthetic'); [shutil.move(os.path.join(f'{HERE}/vo', f), f'{HERE}/vo_synthetic/{f}') for f in os.listdir(f'{HERE}/vo') if f.endswith(('.wav', '.json'))]
    shutil.copy(f'{HERE}/vo_synthetic/lines.json', f'{HERE}/vo/lines.json') if os.path.exists(f'{HERE}/vo_synthetic/lines.json') else None
dur = {}; gaps = {}; cuts = {}
for p in SEG:
    wav = f'{HERE}/out/asr/{p}_24k.wav'
    src = [f for f in glob.glob(f'{HERE}/Voice Script/{p}.*') if f.lower().endswith(('.mp3', '.wav', '.m4a', '.flac', '.ogg'))][0]
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-ac', '1', '-ar', '24000', wav], check=True)
    x, sr = sf.read(wav, dtype='float32'); ids = [i for i in IDS if A[i]['part'] == p]
    for k, cid in enumerate(ids):
        a = max(0.0, S[cid] - PAD_IN); b = E[cid] + PAD_OUT
        if k > 0: a = max(a, (E[ids[k - 1]] + S[cid]) / 2 if S[cid] - E[ids[k - 1]] < PAD_IN + PAD_OUT else a)
        if k + 1 < len(ids): b = min(b, (E[cid] + S[ids[k + 1]]) / 2 if S[ids[k + 1]] - E[cid] < PAD_IN + PAD_OUT else b)
        b = min(b, len(x) / sr)
        clip = x[int(a * sr):int(b * sr)].copy(); n = int(0.006 * sr); clip[:n] *= np.linspace(0, 1, n); clip[-n:] *= np.linspace(1, 0, n)
        sf.write(f'{HERE}/vo/{cid}.wav', clip, sr)
        dur[cid] = round(len(clip) / sr, 3); gaps[cid] = round(S[cid] - E[ids[k - 1]], 3) if k > 0 else None
        cuts[cid] = dict(part=p, s=round(S[cid], 3), e=round(E[cid], 3))
json.dump(dur, open(f'{HERE}/vo/dur.json', 'w')); json.dump(gaps, open(f'{HERE}/vo/gaps.json', 'w')); json.dump(cuts, open(f'{HERE}/out/cuts.json', 'w'), indent=1)
tot = sum(dur.values()); print('chunks', len(dur), 'speech total', round(tot, 1), 's')
big = [(c, g) for c, g in gaps.items() if g and g > 1.0]; print('pauses > 1.0 s:', big)
sl = [(c, round(dur[c], 1)) for c in dur if dur[c] > 8.5]; print('chunks longer than 8.5 s:', sl)

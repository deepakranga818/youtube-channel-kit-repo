"""One timeline from the rendered voice: chunk starts, scene windows snapped to the 132 BPM beat grid, caption cues, a mouth track.
Writes timeline.json, mouth.json and subtitles_en-hindi.srt (English on top, Devanagari below). Scene starts land on a beat; the voice enters 0.30 s after its scene (L-cut)."""
import json, os, numpy as np, soundfile as sf
import scenes as SCN
SCENES = SCN.SCENES
HERE = os.path.dirname(os.path.abspath(__file__))
BPM = 132; BEAT = 60 / BPM; BAR = 4 * BEAT
L = json.load(open(os.path.join(HERE, 'vo', 'lines.json'), encoding='utf-8')); LID = {c['id']: c for c in L}; ORDER = [c['id'] for c in L]
D = json.load(open(os.path.join(HERE, 'vo', 'dur.json'))); D = {k: (v['dur'] if isinstance(v, dict) else v) for k, v in D.items()}
GAPS = json.load(open(os.path.join(HERE, 'vo', 'gaps.json'))) if os.path.exists(os.path.join(HERE, 'vo', 'gaps.json')) else None   # real pauses from a recording
EXTRA = {} if GAPS else getattr(SCN, 'EXTRA', {})          # synthetic voice only: {chunk id: extra breath before it}, defined in scenes.py
LEAD = 0.30; GAP_SAME = 0.15; GAP_SEC = 0.36; GAP_SCENE = 0.40; MIN_GAP = 0.12; MIN_SCENE_GAP = GAP_SCENE + LEAD
snap = lambda x: np.ceil(x / BEAT - 1e-9) * BEAT
# all chunks must be inside exactly one scene, in order
cover = []
for sid, a, b, lesson, ground in SCENES: cover += ORDER[ORDER.index(a):ORDER.index(b) + 1]
assert cover == ORDER, 'scenes.py does not cover the chunks in order'
t = 1.4; lines = []; scenes = []; prev = None
for sid, a, b, lesson, ground in SCENES:
    ids = ORDER[ORDER.index(a):ORDER.index(b) + 1]
    if GAPS:                                                  # recorded voice: keep the speaker's own pauses; a scene change needs room for the wipe / iris
        real = GAPS.get(ids[0]); real = 0.7 if real is None else real
        t = (1.4 + LEAD) if prev is None else t + max(real, MIN_SCENE_GAP)
        t0 = t - LEAD
    else:
        t0 = float(snap(t + (GAP_SCENE if prev else 0))); t = t0 + LEAD
    for k, i in enumerate(ids):
        if k:
            if GAPS: t += max(GAPS.get(i) or 0.4, MIN_GAP)
            else: t += GAP_SAME if i.rstrip('ab') == ids[k - 1].rstrip('ab') else GAP_SEC
        t += EXTRA.get(i, 0)
        lines.append({'id': i, 't0': round(t, 3), 't1': round(t + D[i], 3), 'hi': LID[i]['hi'], 'dv': LID[i].get('dv', LID[i]['text']), 'en': LID[i]['en']})
        t += D[i]; prev = i
    scenes.append({'id': sid, 'lesson': lesson, 'ground': ground, 't0': round(t0, 3), 'first': a, 'last': b})
tail = float(snap(t + 0.6))
for k, s in enumerate(scenes): s['t1'] = scenes[k + 1]['t0'] if k + 1 < len(scenes) else round(tail, 3)
LOCK = 6 * BEAT * 2          # lockup: 12 beats = 3 bars, dead still at the end (silent)
END = BAR * 2                # end iris: 2 bars
scenes.append({'id': 'lockup', 'lesson': 8, 'ground': 'paper', 't0': round(tail, 3), 't1': round(tail + LOCK, 3), 'first': None, 'last': None})
scenes.append({'id': 'end', 'lesson': 9, 'ground': 'ink', 't0': round(tail + LOCK, 3), 't1': round(tail + LOCK + END, 3), 'first': None, 'last': None})
FILM = round(tail + LOCK + END, 3)
for k, l in enumerate(lines):               # caption windows: voice + 0.6 s, at least 1.8 s and chars/12 + 1 s, never into the next cue
    need = max(1.8, l['t1'] - l['t0'] + 0.6, len(l['en']) / 12 + 1)
    nxt = lines[k + 1]['t0'] - 0.08 if k + 1 < len(lines) else FILM - 6
    l['c0'] = l['t0'] - 0.05; l['c1'] = round(max(l['c0'] + 1.0, min(nxt, l['t0'] + need)), 3)
sc = {s['id']: s for s in scenes}
json.dump({'dur': FILM, 'bpm': BPM, 'lines': lines, 'scenes': scenes, 'start': {l['id']: l['t0'] for l in lines}, 'len': {l['id']: round(l['t1'] - l['t0'], 3) for l in lines}},
          open(os.path.join(HERE, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
# mouth: open amount 0..1 per 1/12 s (on twos), from the voice loudness
M = {}
for l in lines:
    y, sr = sf.read(os.path.join(HERE, 'vo', l['id'] + '.wav')); y = np.abs(y if y.ndim == 1 else y.mean(1)); h = sr // 12
    r = np.array([np.sqrt(np.mean(y[i:i + h] ** 2)) for i in range(0, len(y), h)]); r = r / (np.percentile(r, 90) + 1e-9)
    M[l['id']] = [round(float(min(1, max(0, v))), 2) for v in r]
json.dump(M, open(os.path.join(HERE, 'mouth.json'), 'w'))
def ts(x):
    h, r = divmod(x, 3600); m, s = divmod(r, 60); return f'{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
with open(os.path.join(HERE, 'subtitles_en-hindi.srt'), 'w', encoding='utf-8') as f:
    for n, l in enumerate(lines, 1): f.write(f"{n}\n{ts(l['c0'])} --> {ts(l['c1'])}\n{l['en']}\n{l['dv'] + chr(10) if l['dv'] else ''}\n")
print('film', FILM, 's =', int(FILM // 60), ':', round(FILM % 60), ' chunks', len(lines), ' scenes', len(scenes), ' bars', round(FILM / BAR, 1))
print({s['id']: (round(s['t0'], 1), round(s['t1'] - s['t0'], 1)) for s in scenes})

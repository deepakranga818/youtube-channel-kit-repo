"""One timeline: where each narration chunk starts (from the rendered voice), plus the subtitle cues. Writes timeline.json and subtitles_hinglish-en.srt."""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(os.path.join(HERE, 'vo', 'lines.json'), encoding='utf-8'))
D = json.load(open(os.path.join(HERE, 'vo', 'dur.json')))
D = {k: (v['dur'] if isinstance(v, dict) else v) for k, v in D.items()}
EXTRA = {}          # {chunk id: seconds}: an extra breath before that chunk (the credit-card film used {'f2': 1.1, 'p10a': 0.2, 'z4': 0.2}: the pen alone before the key number lands)
# NOTE: this timeline only knows synthetic voice durations. To use a supplied recording with Sketchnote, port the GAPS logic from templates/midcentury-toon/timeline.py (docs/VOICE_AND_SUBTITLES.md).
t = 1.0; lines = []; prev = None
for c in L:
    i = c['id']
    if prev is not None:
        same = prev[0] == i[0]
        base = lambda s: ''.join(ch for ch in s if not ch.isalpha() or ch == s[0]) if False else s.rstrip('ab')
        gap = 0.9 if not same else (0.15 if base(prev) == base(i) else 0.35)
        t += gap
    t += EXTRA.get(i, 0)
    lines.append({'id': i, 't0': round(t, 3), 't1': round(t + D[i], 3), 'hi': c['text'], 'en': c['en']})
    t += D[i]; prev = i
FILM = round(lines[-1]['t1'] + 5.0, 3)
for k, L_ in enumerate(lines):
    need = max(1.8, L_['t1'] - L_['t0'] + 0.5)
    nxt = lines[k + 1]['t0'] - 0.1 if k + 1 < len(lines) else FILM - 0.3
    L_['c0'] = L_['t0']; L_['c1'] = round(max(L_['c0'] + 1.0, min(nxt, L_['t0'] + need + 0.4)), 3)
json.dump({'dur': FILM, 'lines': lines, 'start': {l['id']: l['t0'] for l in lines}, 'len': {l['id']: round(l['t1'] - l['t0'], 3) for l in lines}}, open(os.path.join(HERE, 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
def ts(x):
    h, r = divmod(x, 3600); m, s = divmod(r, 60); return f'{int(h):02d}:{int(m):02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
with open(os.path.join(HERE, 'subtitles_hinglish-en.srt'), 'w', encoding='utf-8') as f:
    for n, l in enumerate(lines, 1): f.write(f"{n}\n{ts(l['c0'])} --> {ts(l['c1'])}\n{l['hi']}\n{l['en']}\n\n")
print('film', FILM, 's =', int(FILM // 60), ':', round(FILM % 60), ' chunks', len(lines))
sec = {}
for l in lines: sec.setdefault(l['id'][0], [l['t0'], 0])[1] = l['t1']
print({k: (round(v[0], 1), round(v[1], 1)) for k, v in sec.items()})

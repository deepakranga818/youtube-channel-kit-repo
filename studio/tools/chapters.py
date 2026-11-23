"""YouTube chapter lines from a film's timeline.json (never type chapter times by hand).
  python studio/tools/chapters.py <project_dir> "Hook title" "Lesson 1 title" "Lesson 2 title" ...
Prints  m:ss Title  for the hook (always 0:00) and for the first scene of every numbered lesson, in order. Give one title per lesson found (extra or missing titles are reported).
Rules checked: at least 3 chapters, each at least 10 s long. Re-run after any re-timing."""
import json, os, sys
P = sys.argv[1]; titles = sys.argv[2:]
TL = json.load(open(os.path.join(P, 'timeline.json'), encoding='utf-8'))
first = {}
for s in TL['scenes']:
    if 0 <= s['lesson'] <= 7 and s['lesson'] not in first: first[s['lesson']] = s['t0']
first[0] = 0.0
ks = sorted(first)
fmt = lambda t: f'{int(t // 3600)}:{int(t % 3600 // 60):02d}:{int(t % 60):02d}' if t >= 3600 else f'{int(t // 60)}:{int(t % 60):02d}'
if len(titles) != len(ks): print(f'! {len(ks)} chapters found (lessons {ks}) but {len(titles)} titles given', file=sys.stderr)
for k, ti in zip(ks, titles + [''] * len(ks)): print(f'{fmt(first[k])} {ti}'.rstrip())
gaps = [first[b] - first[a] for a, b in zip(ks, ks[1:])] + [TL['dur'] - first[ks[-1]]]
if len(ks) < 3 or min(gaps) < 10: print('! YouTube needs at least 3 chapters of at least 10 s each', file=sys.stderr)

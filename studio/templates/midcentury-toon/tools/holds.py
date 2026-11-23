"""Reading-time gate: every text that pops onto the picture must stay at least max(1.8 s, chars/12 + 1 s) before its scene ends. python tools/holds.py [events.json]"""
import json, sys, os
p = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'events.json')
E = [e for e in json.load(open(p))['ev'] if e['type'] == 'txt']; bad = []
for e in E:
    dwell = e['until'] - e['t']; need = max(1.8, len(e['s']) / 12 + 1.0)
    if dwell < need: bad.append((round(need - dwell, 2), e['t'], e['s'], round(dwell, 2), round(need, 2)))
print(len(E), 'texts;', len(bad), 'short holds')
for b in sorted(bad, reverse=True): print(f'  short by {b[0]:.2f}s at {b[1]:.1f}s: {b[2]!r} (stays {b[3]}s, needs {b[4]}s)')
sys.exit(1 if bad else 0)

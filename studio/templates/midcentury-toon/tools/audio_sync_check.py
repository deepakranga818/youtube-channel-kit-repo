"""Audio sync gate: is there speech inside every chunk's window and quiet in the pauses between chunks?
Run with the library python from the project folder:   python tools/audio_sync_check.py [project_dir] [mix.wav]      (needs timeline.json and out/mix.wav)
Prints the speech and pause medians (dB), the chunks whose window is quiet (< -35 dB: speech missing or shifted) and the pauses that are loud (> -28 dB: speech spilling out).
Exit code 1 when either list is not empty. Foley is quiet (about -40 dB), so a loud pause means speech or a mistimed cut."""
import json, os, sys
import numpy as np, soundfile as sf
P = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.abspath(os.path.dirname(os.path.abspath(__file__)) + '/..')
TL = json.load(open(f'{P}/timeline.json')); wav = sys.argv[2] if len(sys.argv) > 2 else f'{P}/out/mix.wav'
x, sr = sf.read(wav, dtype='float32'); x = x if x.ndim == 1 else x.mean(1)
db = lambda a: 20 * np.log10(np.sqrt(np.mean(np.square(a)) + 1e-12) + 1e-12)
seg = lambda a, b: x[int(max(a, 0) * sr):int(b * sr)]
L = TL['lines']; speech = []; gaps = []; quiet = []; loud = []
for k, l in enumerate(L):
    d = db(seg(l['t0'] + 0.05, l['t1'] - 0.05)); speech.append(d)
    if d < -35: quiet.append((l['id'], round(float(d), 1)))
    if k + 1 < len(L):
        a, b = l['t1'] + 0.08, L[k + 1]['t0'] - 0.08                    # skip the cut padding
        if b - a > 0.15:
            g = db(seg(a, b)); gaps.append(g)
            if g > -28: loud.append((l['id'], round(float(g), 1)))
print(f'chunks {len(L)}  speech median {np.median(speech):.1f} dB  pause median {np.median(gaps) if gaps else float("nan"):.1f} dB')
print('quiet windows (speech missing or shifted):', quiet)
print('loud pauses (speech outside its window):', loud)
sys.exit(1 if quiet or loud else 0)

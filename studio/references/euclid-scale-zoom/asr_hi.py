"""Hindi speech check: transcribes each vo/<id>.wav with faster-whisper (language hi) and compares it with the script by character similarity.
Usage (private Python 3.12 venv): .venv-asr/Scripts/python.exe asr_hi.py [--model small] [--threshold 0.8]
Writes vo/asr.json with what was heard and the score per line."""
import json, os, re, sys, difflib, argparse, unicodedata
import numpy as np
from faster_whisper import WhisperModel
ap = argparse.ArgumentParser(); ap.add_argument('--model', default='small'); ap.add_argument('--threshold', type=float, default=0.8)
A = ap.parse_args()
HERE = os.path.dirname(os.path.abspath(__file__))
lines = json.load(open(os.path.join(HERE, 'vo', 'lines.json'), encoding='utf-8'))
def norm(s):
    s = unicodedata.normalize('NFC', s)
    s = s.replace('़', '')                      # nukta: ज़ / ज, ड़ / ड are heard the same
    s = re.sub(r'[ंँ]', 'ं', s)       # anusvara / chandrabindu
    s = re.sub(r'[^ऀ-ॿ0-9a-zA-Z]', '', s)
    return s
m = WhisperModel(A.model, device='cpu', compute_type='int8')
bad = 0; out = {}
for L in lines:
    from faster_whisper.audio import decode_audio
    y = decode_audio(os.path.join(HERE, 'vo', L['id'] + '.wav'), sampling_rate=16000)
    pad = np.zeros(8000, np.float32)
    segs, _ = m.transcribe(np.concatenate([pad, y, pad]).astype(np.float32), beam_size=5, language='hi')
    got = ' '.join(s.text.strip() for s in segs)
    r = difflib.SequenceMatcher(None, norm(L['text']), norm(got)).ratio()
    ok = r >= A.threshold; bad += not ok
    out[L['id']] = {'want': L['text'], 'heard': got, 'score': round(r, 3), 'ok': ok}
    print(('ok  ' if ok else 'BAD ') + f"{L['id']:4s} {r:.2f}  {got}")
json.dump(out, open(os.path.join(HERE, 'vo', 'asr.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('mismatches:', bad)

"""Split each voice part into utterances at the pauses, then recognise every utterance on its own (short clips decode far more reliably than a 2-minute stream).
Run from the project folder with the ASR python (studio/tools/env.sh sets $ASR_PY and $HF_HOME):   $ASR_PY tools/segment_asr.py [--lang hi|en]
Reads  Voice Script/part*.mp3 (or .wav/.m4a)   Writes out/asr/seg_<part>.json = {dur, segs:[{s,e,text,words:[{w,s,e}]}]}.
Only the word TIMES matter; the recognised spelling (especially Hindi) is approximate."""
import os, sys, json, glob
import numpy as np
os.environ.setdefault('HF_HOME', os.path.expanduser('~/.video-studio/hf-cache'))
from faster_whisper import WhisperModel
from faster_whisper.audio import decode_audio
HERE = os.path.dirname(os.path.abspath(__file__)) + '/..'
LANG = sys.argv[sys.argv.index('--lang') + 1] if '--lang' in sys.argv else 'hi'
SR = 16000
HOP = 160                                           # 10 ms
MIN_SIL = 0.20                                      # a pause this long splits utterances
MIN_SEG = 0.18
def segments(x):
    n = len(x) // HOP; fr = x[:n * HOP].reshape(n, HOP); db = 20 * np.log10(np.sqrt((fr ** 2).mean(1)) + 1e-9)
    thr = max(-52.0, np.percentile(db, 95) - 30)
    sp = db > thr; segs = []; i = 0
    while i < n:
        if sp[i]:
            j = i
            while j < n and (sp[j] or (j + 1 < n and sp[j:j + int(MIN_SIL * 100)].any())): j += 1
            segs.append([i / 100, j / 100]); i = j
        else: i += 1
    return [(max(0, a - 0.04), b + 0.04) for a, b in segs if b - a >= MIN_SEG], thr
if __name__ == '__main__':
    m = WhisperModel('small', device='cpu', compute_type='int8')
    files = sorted(f for f in glob.glob(f'{HERE}/Voice Script/part*.*') if f.lower().endswith(('.mp3', '.wav', '.m4a', '.flac', '.ogg')))
    assert files, 'no recordings found: put Voice Script/part1.mp3 ... in the project folder'
    os.makedirs(f'{HERE}/out/asr', exist_ok=True)
    for f in files:
        name = os.path.splitext(os.path.basename(f))[0]
        x = decode_audio(f, sampling_rate=SR); sg, thr = segments(x); out = []
        for a, b in sg:
            clip = x[int(a * SR):int(b * SR)]
            ss, info = m.transcribe(clip, language=LANG, word_timestamps=True, beam_size=5, condition_on_previous_text=False, vad_filter=False)
            ss = list(ss); words = [dict(w=w.word.strip(), s=round(a + float(w.start), 3), e=round(a + float(w.end), 3)) for s in ss for w in s.words]
            out.append(dict(s=round(a, 3), e=round(b, 3), text=' '.join(s.text.strip() for s in ss), words=words))
        json.dump(dict(dur=round(len(x) / SR, 3), thr=round(float(thr), 1), segs=out), open(f'{HERE}/out/asr/seg_{name}.json', 'w', encoding='utf-8'), ensure_ascii=False)
        print(name, 'utterances', len(out), 'threshold dB', round(float(thr), 1), flush=True)

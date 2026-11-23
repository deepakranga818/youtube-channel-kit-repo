"""Align the recorded voice parts to the script's chunks.
Input : out/asr/seg_<part>.json (tools/segment_asr.py), hinglish_src.py (the script the audio reads: id, roman text, english), tools/parts.json (which chunk ids each recording part covers)
Output: out/align.json (every chunk: part, start, end, matched score); tools/cut_chunks.py then cuts vo/<id>.wav, vo/dur.json, vo/gaps.json
Method: both sides are reduced to a consonant skeleton (Roman letters and Devanagari map to the same ~12 classes; English ASR words are Roman and use the Roman rule),
then a dynamic programme splits the recognised word stream into the chunks in order, preferring boundaries at pauses.
Run from the project folder with the library python:  python tools/align.py     (check the printed list of weak matches; listen to those lines)
"""
import json, os, re, sys, unicodedata, difflib, math
import numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)) + '/..'
sys.path.insert(0, HERE)
from hinglish_src import L as SCRIPT
IDS = [i for i, _, _ in SCRIPT]; TEXT = {i: h for i, h, _ in SCRIPT}
PARTS = [tuple(p) for p in json.load(open(f'{HERE}/tools/parts.json'))]       # [["part1", "first chunk id", "last chunk id"], ...] in recording order

DEVA = {}
for ch in 'कखगघङक़ख़ग़': DEVA[ch] = 'k'
for ch in 'चछजझञज़फ़': DEVA[ch] = 'c'
for ch in 'टठडढतथदधड़ढ़': DEVA[ch] = 't'
for ch in 'णनमं ँ'.replace(' ', ''): DEVA[ch] = 'n'
for ch in 'पफबभ': DEVA[ch] = 'p'
DEVA.update({'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 's', 'ष': 's', 'स': 's', 'ह': 'h'})
for ch in 'ड़ढ़': DEVA[ch] = 'r'
ROM = {'k': 'k', 'g': 'k', 'q': 'k', 'x': 'k', 'j': 'c', 'z': 'c', 'd': 't', 't': 't', 'b': 'p', 'p': 'p', 'f': 'p', 'm': 'n', 'n': 'n', 'r': 'r', 'l': 'l',
       's': 's', 'v': 'v', 'w': 'v', 'y': 'y', 'h': 'h'}

def skel_deva(s):
    s = unicodedata.normalize('NFD', s); out = []
    for ch in s:
        if ch in DEVA: out.append(DEVA[ch])
    return ''.join(out)
def skel_rom(s):
    s = re.sub(r'[^a-z ]', '', s.lower()); out = []
    for w in s.split():
        k = ''; i = 0
        while i < len(w):
            c = w[i]
            if c in 'aeiou': i += 1; continue
            if c == 'c': k += 'c' if w[i + 1:i + 2] == 'h' else 'k'; i += 2 if w[i + 1:i + 2] == 'h' else 1; continue
            if c == 'h': k += '' if (k and w[i - 1] not in 'aeiou') else 'h'; i += 1; continue
            k += ROM.get(c, ''); i += 1
        out.append(k)
    return ''.join(out)
def skel_asr(w): return skel_deva(w) or skel_rom(w)          # Devanagari spelling from the recogniser, or Roman when the recording is English
def cost(a, b):
    m = sum(t.size for t in difflib.SequenceMatcher(None, a, b, autojunk=False).get_matching_blocks())
    return 2 * m - len(a) - len(b)

def align_part(words, ids):
    n = len(words); m = len(ids)
    sk = [skel_asr(w['w']) for w in words]
    gap = [0.0] + [max(0.0, words[j]['s'] - words[j - 1]['e']) for j in range(1, n)] + [9.0]     # gap[j] = pause before word j
    exp = [skel_rom(TEXT[i]) for i in ids]; nw = [max(1, len(re.findall(r"[A-Za-z0-9₹%.,']+", TEXT[i]))) for i in ids]
    NEG = -1e9; best = [[NEG] * (n + 1) for _ in range(m + 1)]; back = [[0] * (n + 1) for _ in range(m + 1)]; best[0][0] = 0
    for k in range(1, m + 1):
        lo = max(1, int(round(nw[k - 1] * 0.4))); hi = int(round(nw[k - 1] * 2.2)) + 2
        for j in range(k, n + 1):
            for L in range(lo, hi + 1):
                i0 = j - L
                if i0 < k - 1 or best[k - 1][i0] <= NEG / 2: continue
                dur = words[j - 1]['e'] - words[i0]['s']; ed = 0.30 * nw[k - 1] + 0.25
                c = cost(''.join(sk[i0:j]), exp[k - 1]) + 5 * min(gap[j], 0.6) + 3 * min(gap[i0], 0.6) - min(14.0, 7 * abs(math.log(max(dur, 0.1) / ed)))
                v = best[k - 1][i0] + c
                if v > best[k][j]: best[k][j] = v; back[k][j] = i0
    j = n; spans = []
    for k in range(m, 0, -1):
        i0 = back[k][j]; spans.append((i0, j)); j = i0
    spans.reverse()
    return spans, best[m][n]

if __name__ == '__main__':
    cut = '--cut' in sys.argv
    res = {}; allc = []
    for name, a, b in PARTS:
        ids = IDS[IDS.index(a):IDS.index(b) + 1]
        sf = f'{HERE}/out/asr/seg_{name}.json'
        if os.path.exists(sf): A = json.load(open(sf, encoding='utf-8')); words = [w for sg in A['segs'] for w in sg['words']]   # per-utterance recognition
        else: A = json.load(open(f'{HERE}/out/asr/{name}.json', encoding='utf-8')); words = A['words']
        spans, score = align_part(words, ids)
        for cid, (i0, j) in zip(ids, spans):
            ws = words[i0:j]; sc = cost(''.join(skel_asr(w['w']) for w in ws), skel_rom(TEXT[cid]))
            res[cid] = dict(part=name, s=ws[0]['s'], e=ws[-1]['e'], words=len(ws), text=' '.join(w['w'] for w in ws), cost=sc, exp=len(skel_rom(TEXT[cid])))
        print(name, 'words', len(words), 'chunks', len(ids), 'total score', round(score, 1), flush=True)
    json.dump(res, open(f'{HERE}/out/align.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    weak = [(c, r['cost'], r['exp']) for c, r in res.items() if r['cost'] < -0.45 * max(4, r['exp']) * 2]
    print('chunks', len(res), ' weak matches (cost vs 2x skeleton length):', weak)

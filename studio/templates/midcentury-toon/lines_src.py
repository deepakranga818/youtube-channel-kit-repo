# THE SCRIPT FILE. Same chunk ids as the approved Roman-Hinglish script (hinglish_src.py). HI = the Hindi narration in Devanagari.
# vo/lines.json: text = Devanagari (what the voice reads, with amounts as words in "say"), hi = Roman Hinglish caption, en = English (kept for the record).
import json, re, os
from hinglish_src import L as HINGLISH
HERE = os.path.dirname(os.path.abspath(__file__))
HI = {   # Devanagari narration per chunk id (same ids as hinglish_src.py). Worked example: example/lines_src.py
 'h1': 'नमस्ते!', 'h2': 'आज एक सवाल।', 'p1': 'पहले ये देखिए।', 'p2': 'फिर ये।', 'z1': 'सब्सक्राइब करें।', 'z2': 'बिग क्वेश्चंस। सिंपल एक्सप्लेनेशन्स।',
}
# what the voice actually reads: amounts as words, dashes and ellipses as commas (the AMT pairs below are the credit-card film's; replace them with your film's amounts)
AMT =[('₹10,000', 'दस हज़ार रुपये'), ('₹9,850', 'नौ हज़ार आठ सौ पचास रुपये'), ('₹150', 'एक सौ पचास रुपये'), ('1.5%', 'डेढ़ प्रतिशत')]
def say(s):
    for a, b in AMT: s = s.replace(a, b)
    s = s.replace('…', ',').replace('—', ',')
    return re.sub(r'\s+', ' ', s).replace(' ,', ',')
SECOND_LINE = True        # False for an English-only film: the caption card and the .srt then carry the English line only
ORDER = [i for i, _, _ in HINGLISH]
assert set(ORDER) == set(HI), (set(ORDER) ^ set(HI))
if __name__ == '__main__':
    os.makedirs(os.path.join(HERE, 'vo'), exist_ok=True)
    out = [dict(id=i, text=HI[i], say=say(HI[i]), hi=h, en=e, dv=HI[i] if SECOND_LINE else '') for i, h, e in HINGLISH]
    json.dump(out, open(os.path.join(HERE, 'vo', 'lines.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    open(os.path.join(HERE, 'script_hi.md'), 'w', encoding='utf-8').write('# हिंदी स्क्रिप्ट\n\n' + '\n'.join(f"- **{i}** {HI[i]}" for i in ORDER) + '\n')
    print(len(out), 'chunks; long (>95 chars):', [(i, len(HI[i])) for i in ORDER if len(HI[i]) > 95])

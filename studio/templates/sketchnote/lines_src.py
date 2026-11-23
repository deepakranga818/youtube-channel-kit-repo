# THE SCRIPT FILE (stub). One chunk = one voice file = one subtitle cue: (id, spoken/subtitle text, English subtitle).
# The first letter of the id is the section (h hook ... z close): sections get longer breaths and a whoosh. Keep each text under ~92 chars.
# Worked example (105 chunks, Roman Hinglish): example/lines_src.credit-cards.py. For Devanagari text, edit say() only if numbers need spelling out.
import json, re, os
HERE = os.path.dirname(os.path.abspath(__file__))
L = [
 ('h1', 'Hello! Aaj hum ek simple sawaal samjhenge.', 'Hello! Today we will understand one simple question.'),
 ('h2', 'Pehle ye dekhiye.', 'First, look at this.'),
 ('z1', 'Channel ko subscribe karein.', 'Subscribe to the channel.'),
]
def say(s):                                                   # what the voice reads: spell amounts as words, fix pronunciations (the examples below are from the credit-card film; replace them)
    s = s.replace('…', ',').replace('—', ',')
    s = re.sub(r'₹([\d,]+)', lambda m: m.group(1).replace(',', '') + ' rupees', s)
    s = s.replace('%', ' percent').replace('MDR', 'M D R').replace('ATM', 'A T M').replace('RuPay', 'Rupay')
    return re.sub(r'\s+', ' ', s).replace(' ,', ',')
if __name__ == '__main__':
    os.makedirs(os.path.join(HERE, 'vo'), exist_ok=True)
    out = [dict(id=i, text=h, say=say(h), en=e) for i, h, e in L]
    json.dump(out, open(os.path.join(HERE, 'vo', 'lines.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    over = [(i, len(h), len(e)) for i, h, e in L if len(h) > 92 or len(e) > 92]
    print(len(out), 'chunks; long:', over)

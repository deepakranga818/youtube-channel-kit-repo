# How Banks Earn From a Credit Card: Mid-century Cartoon, Hindi (Devanagari)

Style: **Mid-century Cartoon** (Lemo-Opuscar): flat colour printed a few px off its broken ink line, held-body presenter whose hands do the work, colour-plane
scenes, numbered lesson medallions, circle irises, a cool-jazz combo. Chosen because the script is a classroom-style "follow along" film and the style
numbers its steps, which gives the 8:54 film a clear spine (7 lessons + a hook).

## Voice and language
- Narration: Hindi in Devanagari (`script_hi.md`), read by `hi-IN-MadhurNeural` (male, synthetic). Amounts are spelled as words for the voice (दस हज़ार रुपये), shown as ₹10,000 on screen.
- Caption card (and the .srt): English (large) over the same line in Devanagari (small).
- All other on-screen text is English (Oleo Script kicker, Alfa Slab One titles, Jost labels), like the Sketchnote film. Devanagari appears only in the caption's Hindi line.

## Host
ExplainEveryDayHost (a boy): curly dark hair, navy hooded jacket, red scarf, white tee, olive cargo trousers, white sneakers (from the channel model sheet).
A held drawing: only arms, hands, eyes and mouth move; the mouth opens with the voice loudness (`mouth.json`).

## Structure (scenes.py maps chunks to scenes; ids are the script chunk ids)
Hook (3 scenes) -> 1 Players -> 2 The fee (the ₹150: 1.5% hypothetical, to-scale bar, pie "not to scale") -> 3 Interest -> 4 Other charges -> 5 Rewards -> 6 Is it always profit? -> 7 Three rules -> lockup (7 medallions, still) -> iris-out end card.
Lesson changes iris through the numbered medallion; scenes inside a lesson change with a colour-block wipe.

## Accuracy guards (FACTS.md)
- The 1.5% fee is labelled "काल्पनिक उदाहरण" (hypothetical) and "सिर्फ़ उदाहरण" on screen and in the voice.
- ₹10,000 x 1.5% = ₹150; merchant gets ₹9,850. The bar is drawn to scale (1.5% sliver); the ₹150 pie is stamped "पैमाने पर नहीं" (not to scale), equal thirds on purpose.
- The ₹150 is shared among acquirer/PSP, network and interchange (to the issuer); the issuer is never shown getting all of it.

## Sound
No background music (owner's rule). Narration at a fixed level, foley from the picture events (stamps for medallions, pops for tags, paper swishes for wipes, a coin ding for the number that lands), a very quiet room tone, a held breath before the rupee number. Mastered to -14 LUFS.

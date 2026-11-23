# Fonts and on-screen text

## Rules
1. **On-screen text language** is a channel rule (`channel/CHANNEL.md`). ExplainEveryday default: all English on screen even for Hindi narration; the narration language appears only in the caption's second line.
2. **Font stacks, not font switching**: canvas text uses `'500 30px Jost, Deva'`: Latin glyphs come from the first family, anything it lacks falls back to the next. Register every family under ONE name in `fonts/fonts.css`.
3. **Never split one family into Latin and Devanagari faces by unicode-range.** Chrome then dropped the Latin face on some weights (Jost 400/600 fell back to a serif). Give Devanagari its own families: `Deva` (Poppins 400/500/600), `DevaSlab` (Rozha One), `DevaScript` (Kalam Bold) and put them second in the stack.
4. **Missing glyphs**: Jost, Oleo Script and Alfa Slab One have no rupee sign (U+20B9); Kalam Bold does; arrows and symbols may be missing too. Every font string carries a fallback and `main.js` preloads with a sample string that includes `Ag₹→≠·` so a missing glyph shows up in the first still.
5. **Never letter-space Devanagari** (no `track` option): spacing breaks the conjuncts.
6. **Other scripts** (Tamil, Arabic, Bengali ...): same pattern: a dedicated family from google/fonts (OFL) as the second family in the stack, loaded with `document.fonts.load('500 30px Name', 'sample text')`. RTL needs extra care (check with a still).
7. **Fit**: `fit(g, text, '{px}px Slab, DevaSlab', startPx, maxWidth, maxLines, minPx)` returns `{lines, font}` shrunk to fit; use it for anything that comes from a script.
8. The handwriting of Sketchnote uses glyph skeletons: a new character needs `tools/skeleton.py` run again (delete `glyphs.json`).

## Fonts used (all SIL OFL 1.1; `tools/fonts.sh` downloads them pinned to one google/fonts commit; licence texts are saved in `fonts/`)
- Sketchnote: Kalam Bold (headings), Patrick Hand (notes).
- Mid-century: Oleo Script Bold (kicker), Alfa Slab One (titles, registered as `Slab`), Jost (body); Devanagari: Poppins (`Deva`), Rozha One (`DevaSlab`), Kalam Bold (`DevaScript`).
- A new channel look = new font choices in `tools/fonts.sh` + `fonts/fonts.css` + `fonts.json`; keep each film's `CREDITS` honest.

## Reading time
Every text that pops onto the picture must stay at least `max(1.8 s, characters / 12 + 1 s)` before its scene ends (`tools/holds.py` reads the `txt` events; the library's `readcheck.mjs` is stricter and needs `window.TEXTS(t)`). `kit.js fitT(t0, str)` pops a text earlier if the scene is too short for it (never earlier than 0.3 s into the scene); every helper that draws text (`tag iconCard stamp banner slam`) calls it first. When a faster voice shortens scenes, fix it with `fitT` before touching the picture.

## Layout rules that were learned the hard way
- Keep subjects out of the bottom 150 px (the caption card lives there) and inside a 120 px safe margin.
- Number and word callouts: one idea per card, max about 4 words per line, 40 px minimum for body text at 1080p, 28 px for labels.
- Thumbnail text readable at 168 px wide (the size of a suggested-video tile).
- After any layout change render stills at the scene start, middle and end and LOOK at them: the code cannot tell you a label covers a card.

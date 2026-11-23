# Styles: the two ready templates, the reference film, and how to add a style

A *style* is an engine (how things are drawn and animated) plus a stub topic. Pick one, copy it with `sh studio/new-video.sh <style> <slug>`, change only the topic files. Never rewrite an engine.

## sketchnote (`templates/sketchnote/`)
One big page drawn by hand while a camera moves over it: fineliner pen outlines, grey marker in three strengths, one yellow accent, handwriting that is written stroke by stroke. Good for explainers, long films (the credit-card film is 8:49), money/process topics.
- Topic files: `page.js` (the drawing), `lines_src.py` (script chunks: id, spoken text, English), `FACTS.md`.
- `page.js` is blocks `B0..Bn` laid on one sheet (`BK` = block origins, about 1700x900 each). Per chunk: one `note`/`head`/icon timed `T('id') + 0.2`. Camera keys `CK(t, x, y, zoom)` at least 0.45 s apart (closer ones are dropped; far hops whip). `PULL` = final pull-back to show all blocks. `CUE.pull`, `CUE.done`, `CUE.silence`, optional `CUE.fee` (the number that lands) are set in `buildPage`.
- Helpers live in `parts.js`: `head note host icons ribbon box swash tick cross coinIcon slow(...)`. `slow(t0, k, fn)` stretches a drawing's stroke timing.
- Handwriting uses `glyphs.json` (glyph skeletons made by `tools/skeleton.py` from the two fonts). A new character (for example a currency sign) needs `skeleton.py` run again (`build.sh` does it only when `glyphs.json` is missing: delete it).
- Fonts: Kalam Bold (headings, has the rupee sign), Patrick Hand (notes). Voice default: `hinglish` (en-IN male reading Roman Hinglish). Subtitles from `timeline.py`.
- Limit: `timeline.py` only handles synthetic durations (no `GAPS`); to use a supplied recording port the logic from the Mid-century `timeline.py`.

## midcentury-toon (`templates/midcentury-toon/`)
1950s classroom-film cards: flat colour grounds, off-register cel look (colour plates shifted from the ink), a boy host with moving hands whose mouth follows the voice, numbered lessons with a medallion iris, a lockup card and an iris end card, a two-line caption card (English on top, Devanagari below).
- Topic files: see `TOPIC_FILES` (`brand.js`, `scenes_a.js`, `scenes_b.js`, `scenes.py`, `lines_src.py`, `hinglish_src.py`, `thumb.js`).
- `scenes.py`: `SCENES = [(scene_id, first_chunk, last_chunk, lesson, ground_colour)]`, 36 scenes in the worked example; lesson 0 = hook, 1..N numbered (N = `BRAND.lessons.length`, at most 7), `timeline.py` appends the silent `lockup` (lesson 8) and `end` (9). The chunks must be covered in order with no gaps (timeline.py asserts this).
- `scenes_*.js`: one exported function per scene id, signature `(g, t, s)`; start everything on its chunk: `T('p1') + 0.2`. `s.t0/s.t1` = the scene window.
- `kit.js` helpers: `stage sunburst slam slab body kick tag iconCard callout medal banner stamp tick cross swash bar lines host lessonHeader`, timing `T(id)` `DN(id)` `fitT`, sound `ev(t, type, opts)`, constants `PAL GROUND ACC`. `host(g, t, x, y, scale, [[t, pose, face], ...], {dir})`: poses `rest explain point pointUp think wave both fist hold`, faces `neutral happy wink wow`; `prop` holds a card/phone/tablet.
- Transitions are automatic: lesson change = iris through the numbered medallion (stamp + whoosh), same lesson = colour-block wipe (paper swish). A 0.7 s minimum gap between scenes leaves room for them.
- Caption card: English line `'600 Npx Jost, Deva'` over Devanagari `'500 Npx Deva'`; keep subjects out of the bottom 150 px.
- `brand.js` carries the channel name, tagline, lockup text, lesson titles/icons, `keyChunk` (the chunk where the key number lands: a held breath before it) and thumbnail words. `scenes.py` may define `EXTRA = {chunk id: seconds}` (extra breath before a chunk, synthetic voice only). Icons: `engine/icons.js` (library demo) and `engine/icons2.js` (finance set: card bank shop terminal network coin calendar atm gift scale globe book tag piggy). Add icons to `icons2.js`: 200-unit box centred on 0,0, same `shape/ink/text` calls.
- Thumbnail: `thumb.js` (`?test=thumb&v=a|b`); host poses sheet: `sheet.js` (`?test=sheet`).
- Reading-time gate: `tools/holds.py`; `fitT` pops a text earlier when the scene is shorter than its reading time.

### Replacing the host
`engine/host.js` is the ExplainEveryday boy (colours in `HC`). For another channel either recolour/redraw it, or write a new `drawHost(g, pose, t)` with the same pose object `{ x, y, s, dir, view, face, armF, armB, handF, handB, blink, mouth, look, prop }` and the same `POSE` names so `kit.js` and the scenes keep working. No host at all: delete the `host(...)` calls from the scenes; the engine does not need him.

## references/euclid-scale-zoom (not a template)
A 2:57 Hindi film in the library style `flat-space-explainer` ("Scale Zoom Explainer"): a tiny guide follows one dotted line of light from a far galaxy to a telescope while a scale ribbon runs from the far end of the universe to a dish in India. Source: `film.js flat.js tara.js mix.py asr_hi.py build.sh TREATMENT.md FACTS.md`. Use it to see how a library style is adapted (treatment with three structures, one chosen), how voice `.55` + fx mix, and the Hindi ASR check. To make it a template follow "Adding a style". Its on-screen text is still Devanagari (older film; current rule is English on screen).

## The library's other styles (99)
`$LIB/styles/<slug>/STYLE.md` + gallery `https://lemomo-ai.github.io/lemo-opuscar/`. For a style we have no template for: read `$LIB/AGENTS.md` (Finding the style, Workflow), `$LIB/DIRECTOR.md`, `$LIB/TECHNIQUE.md`; fetch that style's demo source with `sh studio/tools/lemo-setup.sh demo <slug>` (reference only, do not render it); write a treatment first. Styles marked with a star need an image generator the owner provides. Library docs are CC BY-NC: read them, do not copy them into channel material.

## Adding a style (turn a finished film into a template)
1. Build the first film in that style (project folder under `videos/`).
2. Copy the folder to `studio/templates/<style>/` without `out/ vo/ vo_*/ stills/ thumbs/ *.mp4 *.wav node_modules`.
3. Replace the topic files by small stubs that still build (3 scenes / 3 chunks); move the finished topic files to `example/` (including `FACTS.md`, `TREATMENT.md`, `youtube_listing.md`).
4. Remove channel/topic strings from the engine (use a `brand.js`-style file for channel name, lesson titles, thumbnail words); read voices from `studio/shared/voices.json` and the poster time from `timeline.json` in `build.sh`; no absolute paths.
5. Write `TOPIC_FILES` and `CREDITS` (with placeholders). Add the style to `FLOW.md` and to this file.
6. Smoke-test: `FORCE=1 sh studio/new-video.sh <style> smoke`, render two stills, run `timeline.py` on the stub, delete the smoke folder.

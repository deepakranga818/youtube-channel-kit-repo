# Pitfalls: what went wrong before and the fix (read when something looks off)

## Environment and shell
- **faster-whisper will not install in the library's Python 3.15** (`tokenizers` has no wheel). Use the separate Python 3.12 ASR env (`setup.sh asr`). The library's own `asr_check.py` belongs to the library venv, not to the ASR env.
- **ffmpeg is not on Git Bash's PATH** when installed by winget: `studio/tools/env.sh` appends `~/AppData/Local/Microsoft/WinGet/Links`. Source it (`. studio/tools/env.sh`) before any ffmpeg command in a fresh shell.
- **MSYS path conversion only touches whole arguments**: `python -c "open('/d/x/y.json')"` fails on Windows Python. Pass paths as arguments, or `cd` into the folder and use relative paths.
- **Long files via heredoc got truncated / missing EOF.** Use the Write tool for anything over a few dozen lines.
- **`rm -rf` of the shell's own working directory is blocked.** `cd` out first, or leave the scratch folder and tell the owner to delete it (two smoke-test folders were left behind once: always clean up your own test folders at the end).
- Foreground commands time out at 2 minutes (max 10): run renders and ASR with `run_in_background` and wait for the completion notice; do not poll.
- A re-run of the library's own `setup.sh` on a *managed* clone resets it to upstream main. The kit pins the commit and marks the clone unmanaged (`setup.sh lib`); never hand-run the vendored script on the library without `LEMO_OPUSCAR_HOME` and a reason.
- edge-tts needs internet; a corporate/captive network shows as a connection error on the first chunk.

## Fonts and text (see FONTS_AND_TEXT.md)
- unicode-range split of one family -> Latin weights fell back to serif. Separate `Deva*` families + font stacks.
- No rupee sign in Jost/Oleo/Alfa Slab -> blank glyph; add a fallback and preload with a sample containing the symbol.
- Letter-spacing on Devanagari breaks conjuncts. Never pass `track`.
- Text longer than its box: always `fit(...)`; check stills with the longest script lines.

## Voice, alignment, timeline
- **One long ASR pass over a 2-minute part garbled Hindi** (parts 2-3 of the credit film). Split at pauses and recognise each utterance (`segment_asr.py`).
- ASR Hindi spelling is approximate; use only the word times, match by consonant skeleton, read the weak-match list.
- A chunk cut ending mid-word (`b3a`): end each chunk at the last speech before the next chunk starts, not at the last matched word.
- A faster speaker than the scenes were written for leaves texts on screen too briefly (15 short holds): `fitT` + the holds gate.
- A scene change needs room for the iris/wipe: minimum 0.7 s between the last word and the next scene's first word (0.4 s + 0.3 s L-cut).
- Numbers: spell amounts as words in the spoken text only; digits stay in the caption and the picture.
- The builder cannot hear audio. Never claim the voice is right; list what to listen for.

## Engine reuse (what broke when a film became a template)
- Chunk ids hard-coded in an engine file (`z11` in the Sketchnote runtime, `f2` in the Mid-century film cues) crash or mis-time the next topic: after extracting a template `grep -nE "'[a-z][0-9]+[ab]?'" ` the engine files, move such ids to topic files (`PULL`, `CUE`, `BRAND.keyChunk`, `scenes.py EXTRA`).
- Channel name, lesson titles, the lesson count (7) and thumbnail words were baked into `film.js`/`kit.js`/`thumb.js`: now `brand.js`.
- Absolute paths in tools (`D:/...`) and a fixed poster timestamp (`-ss 530.96`) only work for the first film: tools take project-relative paths; the poster frame is taken from `timeline.json`.
- A template must be smoke-built from a clean copy before it is trusted (`FORCE=1 sh studio/new-video.sh <style> smoke`, two stills, `timeline.py`).

## Pictures and thumbnails
- A strap/label drawn over the hero object (thumbnail) and a clipped second headline: give the object its own clear zone and check the image.
- Scene text hidden by the caption card: nothing important in the bottom 150 px.
- Sketchnote camera: keys closer than 0.45 s are dropped, far hops whip; plan hops at least that far apart.

## Content and wording
- A wording fix of mine introduced a grammar error in a Hindi line (`h8b`): after every edit re-read the whole sentence, and apply an owner's wording change in all three places (spoken text, caption lines, worked example).
- Hindi review: keep the translation table (`HINDI_REVIEW.md`) and apply the owner's edits exactly; do not "improve" them.
- Facts that can change (rates, dates) must be checked on the web at build time and cited in `FACTS.md`.

## Working with the owner
- They keep standing rules ("no music", "English on screen", "subtitles English over Devanagari", "boy host, male voice") and expect them applied without being asked again. Rules live in `channel/CHANNEL.md` and are repeated in CLAUDE.md.
- They want a standard flow, not one-off code: when you solve something twice, put it in a template/doc.
- They ask "is it ready?" in the middle of long jobs: always have an honest one-line status (done / running / blocked).
- Outward-facing actions (upload, post, spend credits) need an explicit yes.
- Long sessions lose detail in summaries: write facts to files (docs, FACTS, LEARNINGS) as you go.

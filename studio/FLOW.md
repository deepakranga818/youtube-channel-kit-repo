# Standard flow: one topic -> one finished film (any style)

The rule: **never write an engine again.** Each style has a working template in `studio/templates/<style>/`. A new video = copy it, change the topic files, build. Details of every step: `studio/docs/PIPELINE.md`.

```
sh studio/new-video.sh <style> <slug>      # copies templates/<style> to videos/<slug>-<style>/ and writes BRIEF.md
```
(Refuses while `channel/CHANNEL.md` has TODO markers: run the channel-setup skill first. `FORCE=1` overrides for smoke tests.)

## Standing rules
They live in `channel/CHANNEL.md` (human) and `channel/channel.json` (machine); ExplainEveryday's are in `channel/examples/explaineveryday/`. Read them before every film; never silently change one.

## Steps (same for every style)
1. **Brief**: topic, audience, length, language (`studio/shared/voices.json` key), style, voice (synthetic or supplied recording).
2. **Treatment + script + facts**: `TREATMENT.md` (3 structures, one chosen), approved script, `FACTS.md` (claim | basis | caveat); illustrative numbers labelled.
3. **Chunks**: split the script into chunks in the topic file (`lines_src.py` / `hinglish_src.py`). Section = first letter of the id.
4. **Voice**: edge-tts via `build.sh`, or a supplied recording aligned with the ASR tools (`studio/docs/VOICE_AND_SUBTITLES.md`).
5. **Timeline**: from the rendered voice durations (`timeline.py`), never from guesses.
6. **Pictures**: edit only the topic drawing files; check layout with stills before the long render (`core/render/still.mjs`).
7. **Sound**: `mix.py` (voice + foley from picture events + room tone; no music unless the channel says so); master -14 LUFS in `mux.sh`.
8. **Render**: `sh build.sh` (24 fps, 3 workers; long: run in the background).
9. **QA gates**: `studio/docs/QA_GATES.md` (duration, loudness, black frames, reading time, audio sync, stills, facts, language, sign-off, files) and the honest-delivery note.
10. **Thumbnail + listing**: `studio/docs/YOUTUBE.md` (two 1280x720 variants, `youtube_listing.md`, `.srt` files, pinned comment).
11. **Deliver and learn**: `<name>.mp4`, `poster.jpg`, thumbnails, `.srt`, `youtube_listing.md`, `CREDITS`, `FACTS.md` in the project folder; append to `studio/docs/LEARNINGS.md`.

## Styles available
- `sketchnote`: one big page drawn by hand, camera moves over it (explainers; long films OK). Topic files: `page.js`, `lines_src.py`.
- `midcentury-toon`: 1950s classroom-film cards, a host with moving hands, numbered lessons, English on screen + a second caption line in the narration language. Topic files: see its `TOPIC_FILES` (`brand.js`, `scenes_a.js`, `scenes_b.js`, `scenes.py`, `lines_src.py`, `hinglish_src.py`, `thumb.js`).
- Reference only: `studio/references/euclid-scale-zoom/` (library style `flat-space-explainer`).
- Any of the library's 99 styles: read `$LIB/AGENTS.md` first (`studio/docs/STYLES.md`).

## Adding a style
Build the first film in that style, then follow `studio/docs/STYLES.md` "Adding a style" (stubs, `example/`, `TOPIC_FILES`, `CREDITS`, smoke build).

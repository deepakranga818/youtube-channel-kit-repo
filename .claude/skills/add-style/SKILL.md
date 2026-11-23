---
name: add-style
description: Turn a finished film in a new visual style into a reusable template in studio/templates, so later topics only change topic files. Use after the first film in a new style is delivered, or when the owner says "make this a template" or "save this style for next videos".
---

# Add a style template

Read `studio/docs/STYLES.md` section "Adding a style" and compare with the two existing templates (`studio/templates/sketchnote`, `studio/templates/midcentury-toon`).

1. Confirm the film is delivered and approved. Work on a copy, not the original project.
2. Copy the project to `studio/templates/<style>/` WITHOUT `out/ vo/ vo_*/ stills/ thumbs/ *.mp4 *.wav node_modules`.
3. Move the finished topic files to `example/` (script, scenes/page, `FACTS.md`, `TREATMENT.md`, `youtube_listing.md`); put small stubs in their place (3 chunks, 3 scenes) that still build.
4. Remove everything topic- or channel-specific from the engine: channel name, tagline, lesson count/titles, thumbnail words (a `brand.js`), chunk ids (`grep -nE "'[a-z][0-9]+[ab]?'"`), absolute paths, fixed timestamps. `build.sh` reads the voice from `studio/shared/voices.json` (`VOICE`), skips TTS when `vo/gaps.json` exists, takes the poster frame from `timeline.json`, sources `studio/tools/env.sh`.
5. Write `TOPIC_FILES` (what to edit) and `CREDITS` (placeholders). Add the style to `studio/FLOW.md`, `studio/docs/STYLES.md` and the table in `CLAUDE.md`.
6. Smoke test from a clean copy: `FORCE=1 sh studio/new-video.sh <style> smoke`, render two stills of the stub, run `timeline.py`, fix what breaks, then delete the smoke folder.
7. Append to `studio/docs/LEARNINGS.md`; tell the owner the template exists and what it needs per topic.

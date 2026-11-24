---
name: new-video
description: Make a new narrated explainer film from a topic, end to end (brief, treatment, script and facts, voice, pictures, render, QA, thumbnails and listing). Use when the owner gives a topic or says "make a video about ...", "next video", "new film".
---

# New video (the standard flow; never rewrite an engine)

Read first: `channel/CHANNEL.md`, `studio/FLOW.md`, `studio/docs/PIPELINE.md`, and the style's section in `studio/docs/STYLES.md`. If CHANNEL.md has TODOs: run the `channel-setup` skill.

1. **Brief** (one round, only what the profile does not answer): topic, angle, length, voice (synthetic or recorded), and the **style: chosen by the topic, never by habit**. Say your pick and the best alternative with a reason so the owner can override.
2. **Style choice + treatment**: first run the method in `studio/docs/STYLES.md` "Choosing the style for a topic" (characterise the topic; shortlist three from the ready templates, the library's 99 styles via `$LIB/styles/*/style.json`, and the owner's own styles; judge fit, attention, tone, feasibility, build cost, channel variety). Then `sh studio/new-video.sh <style> <slug>` (a library style without a template: build it, then `add-style`) and write `videos/<slug>-<style>/TREATMENT.md`: start with `## Style choice` (topic shape, three candidate styles with a pro and con, the choice and why), then three structures, the chosen one and why, logline, arc, the picture idea for each lesson. Show it; get a yes.
3. **Script + facts**: draft the script in plain spoken language; research changeable facts on the web; write `FACTS.md` (claim | basis | caveat) and label illustrative numbers. If the narration language is not the owner's own, also write the translation review notes. **The owner approves the script before any picture is drawn.**
4. **Chunks**: put the script into the topic files (see the project's `BRIEF.md` / `TOPIC_FILES`). Mid-century also needs `scenes.py` and `brand.js`; Sketchnote needs `page.js` blocks.
5. **Voice**: synthetic: `VOICE=<key> sh build.sh` handles it. A supplied recording: stop and use the `align-recording` skill.
6. **Pictures**: write the scenes; render stills (`studio/docs/PIPELINE.md` step 6), LOOK at them (Read the images), fix overlaps, clipped text, caption-band collisions, missing glyphs. Run `tools/holds.py`.
7. **Build**: `sh build.sh` in the background; report status honestly when asked; do not poll.
8. **QA**: every gate in `studio/docs/QA_GATES.md`, with numbers. Write the honest-delivery note (what was checked, what was not, what to listen for).
9. **Thumbnails + listing**: use the `youtube-package` skill.
10. **Deliver**: list the files and where they are; ask before any upload. Append the lessons to `studio/docs/LEARNINGS.md`; if you improved an engine or tool, update the template too (not only the project copy).

Rules that apply to every step: never default to the style used last (a ready template must win the comparison); default taste rules from the profile (language on screen, subtitles, music, host); numbers as words in spoken text; outward-facing actions only after an explicit yes; delete scratch folders you made.

# Pipeline: one topic -> one finished film (any style)

Commands assume the Bash tool (Git Bash on Windows), run from the channel root unless noted. `$LIB` is the library. Long steps run in the background (`run_in_background`).

## 0. Once per machine / channel
`sh studio/tools/setup.sh` (check) -> `sh studio/tools/setup.sh lib` if the library is missing. First run in a new channel folder: the `channel-setup` skill fills `channel/CHANNEL.md` and `channel.json`.

## 1. Brief (ask the owner, one round)
Topic, audience, length (6-10 min is the channel norm so far), narration language, style (**chosen by the topic, never by habit**: follow `STYLES.md` "Choosing the style for a topic", which covers the ready templates and the library's 99 styles; give your pick and the best alternative), voice (synthetic or the owner records). Anything already in `channel/CHANNEL.md` is not asked again.

## 2. Treatment, script and facts
- `TREATMENT.md`: starts with `## Style choice` (topic shape, three candidate styles with a pro and con each, the choice and why), then 3 candidate structures, the chosen one and why, logline, arc, what the picture does for each idea. Show it before building.
- Script in plain language; **approved by the owner before any code**. Spell every number the way it is said.
- `FACTS.md`: table `claim | basis | caveat` for every number and claim; label illustrative numbers as such (see CONTENT_AND_LICENCES.md). Search the web for facts that can change (rates, dates, rules) and cite the source in the table.
- If the language is not the owner's own, the translation is yours: list it for review (`HINDI_REVIEW.md` is the model: wording choices, terms, anything an expert should check) and offer the owner a review pass.

## 3. Chunks
Split the script into chunks (one clause or sentence, under about 92 characters per caption line). Put them in the template's topic file (`lines_src.py`, and `hinglish_src.py` for Mid-century: id, Roman text, English text). Run the file: it writes `vo/lines.json`.

## 4. Voice
- Synthetic: `build.sh` runs edge-tts with the voice key from `studio/shared/voices.json` (`VOICE=<key> sh build.sh`).
- Supplied recording: follow `VOICE_AND_SUBTITLES.md` "Using a supplied recording". `build.sh` then skips text-to-speech because `vo/gaps.json` exists.
- Nobody on the build side can hear the voice. Say so, and list the terms and numbers the owner should listen for (QA_GATES.md).

## 5. Timeline
`python timeline.py` builds `timeline.json` from the real durations (never from guesses), plus `mouth.json` (host lip movement from voice loudness) and the `.srt`. Scene starts snap to the beat grid for synthetic voices; for recordings the speaker's own pauses are kept and a scene change gets at least 0.7 s.

## 6. Pictures
Edit only the topic drawing files. Check layout with stills before the long render:
```bash
cd "$LIB" && node core/render/still.mjs "<abs project path>" 1.5 12 30 --out "<abs project path>/stills"
```
Mid-century also has `?test=sheet` (host poses) and `?test=thumb&v=a`: pass with `--q 'test=sheet'`. Look at the images (Read tool); do not trust the code. Check: subjects clear of the 150 px caption band, text fits, nothing overlaps, every text has its reading time.

## 7. Events and the reading-time gate
`node core/render/events.mjs <project>` then `python tools/holds.py events.json` (Mid-century) or `core/render/readcheck.mjs` (Sketchnote). A text must stay up max(1.8 s, chars/12 + 1 s). Fix the scene, or accept a hold knowingly and say so.

## 8. Sound
`python mix.py` -> `out/mix.wav` (voice + foley from events + quiet room tone). No music unless the channel profile says so. See SOUND.md.

## 9. Render and master
`sh build.sh` runs steps 3-9 in order (lines, voice, timeline, events, reading-time gate, render, mix, master, poster); the QA gates and the thumbnail/listing are separate. Measured speed: the Sketchnote film rendered 12,697 frames in 1,892 s (about 6.7 frames/s, 3 workers); budget half an hour for a 7-9 minute film and run it in the background. `mux.sh` masters to -14 LUFS / true peak under -1 dBTP and prints the numbers.

## 10. QA gates
All of QA_GATES.md. Do not deliver on a failed gate; report a gate you could not run.

## 11. Thumbnail and listing
YOUTUBE.md: two thumbnail variants (1280x720 JPEG under 2 MB), `youtube_listing.md` (3-4 titles, description with chapters from `timeline.json`, hashtags, tags, studio settings, pinned comment), English and Hindi `.srt`.

## 12. Deliver and learn
Deliver in the project folder: `<name>.mp4`, `poster.jpg`, thumbnails, `.srt` files, `youtube_listing.md`, `CREDITS`, `FACTS.md`. Tell the owner where they are. Then append what was new to `studio/docs/LEARNINGS.md` (the learning loop in CLAUDE.md).

## What to confirm with the owner (never assume)
Script approval; voice choice; anything that spends credits or is outward-facing (uploads, posts); the synthetic/altered-content answer on YouTube; a new style or a change of channel rules. Standing taste rules are in `channel/CHANNEL.md`.

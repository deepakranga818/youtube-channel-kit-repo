# Overview: what this studio is

A channel folder that makes narrated explainer films **entirely in code**. A film is a web page that draws itself as a pure function of time (`window.render(t)`). A headless browser captures every frame, ffmpeg muxes the picture with a voice and procedurally generated sound effects, and nothing is edited by hand. Every film can be rebuilt with one command and fixed by editing text.

## The pieces
| Piece | Where | What it does |
|---|---|---|
| Lemo-Opuscar library | `$LIB` (default `~/lemo-opuscar`; commit pinned in `studio/tools/setup.sh`) | renderer `core/render/*.mjs`, text-to-speech `core/tts/tts_zh.py` (edge-tts), sound helpers `core/audio/sfx.py`, 99 film styles and the guides. NOT in this kit (1.5 GB, own licence); `setup.sh lib` fetches it |
| Style templates | `studio/templates/<style>/` | a working film engine, stub topic files, an `example/` with a finished topic |
| Playbooks | `studio/docs/` | these files: how everything works and what went wrong before |
| Channel profile | `channel/` | niche, audience, language plan, host, voice, taste rules (`CHANNEL.md` + `channel.json`) |
| Films | `videos/<slug>-<style>/` | one project folder per film: a copy of a template plus the topic files |
| Speech recognition env | `$STUDIO_HOME/asr-venv` (optional) | only when the owner supplies a recording (alignment) |

## Vocabulary
- **Chunk**: one clause or sentence of narration = one voice file = one caption cue. Id like `f3a`; the first letter is the section (h hook ... z close).
- **Scene**: the picture for a run of chunks (`scenes.py` in Mid-century); **lesson**: a numbered group of scenes with its own header and medallion iris.
- **Topic files**: the only files that change per film (listed in each template's `TOPIC_FILES`). Everything else is the engine and is never rewritten.
- **Timeline** (`timeline.json`): when each chunk starts, from the real voice durations. Every picture, caption and sound is placed from it (`T('id')`).
- **Events** (`events.json`): sound cues and on-screen text pops exported from the page by `events.mjs`; `mix.py` turns them into foley.
- **Treatment**: the one-page plan written before building (3 candidate structures, the chosen one and why, logline, arc). Worked examples: `templates/*/example/TREATMENT.md`, `references/euclid-scale-zoom/TREATMENT.md`.

## Data flow (every style)
```
script.md + FACTS.md   (owner approves)
   -> chunks in lines_src.py / hinglish_src.py        one id per chunk
   -> vo/lines.json                                    text, say (spoken form), caption lines
   -> voice: edge-tts per chunk  OR  a supplied recording cut per chunk (docs/VOICE_AND_SUBTITLES.md)
   -> vo/<id>.wav + vo/dur.json (+ vo/gaps.json for recordings)
   -> timeline.py -> timeline.json, mouth.json, subtitles_en-hindi.srt
   -> events.mjs  -> events.json                       (+ tools/holds.py: reading-time gate)
   -> video.mjs   -> out/video.mp4                     24 fps, 3 workers, the long step
   -> mix.py      -> out/mix.wav                       voice + foley + room tone, no music by default
   -> mux.sh      -> <name>.mp4                        -14 LUFS, peak <= -1 dBTP
   -> poster.jpg, thumbnails, youtube_listing.md, CREDITS, FACTS.md
```

## Where to read next
`PIPELINE.md` (steps and gates) -> `STYLES.md` (which engine, how to adapt it) -> `QA_GATES.md` before every delivery -> `PITFALLS.md` when something looks wrong. For any style other than the two templates, read `$LIB/AGENTS.md`, `$LIB/DIRECTOR.md` and `$LIB/TECHNIQUE.md` first (the library's own agent guides; do not copy them into this kit).

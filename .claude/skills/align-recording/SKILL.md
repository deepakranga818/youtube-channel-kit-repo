---
name: align-recording
description: Align a voice recording the owner supplies (several mp3/wav parts) to the film's script chunks, then rebuild the timeline and film from it. Use when the owner says they recorded the voice, gives "Voice Script/part1...", or asks to sync scenes with their audio.
---

# Align a supplied recording to the script

Read `studio/docs/VOICE_AND_SUBTITLES.md` section "Using a supplied recording" first. Builds on the Mid-century template tools (`tools/segment_asr.py`, `align.py`, `cut_chunks.py`, `audio_sync_check.py`); Sketchnote needs its `timeline.py` ported (GAPS logic) before this works there.

1. Inputs: parts in `Voice Script/part1.<ext> ...` in the project folder, and the script per part (chunk ids). The script text in `hinglish_src.py` must be the text the owner read. Ask for the part boundaries (first and last chunk id of each part) if they are not obvious; write them to `tools/parts.json`.
2. Check the speech env: `sh studio/tools/setup.sh` shows "speech recognition env"; if missing: `sh studio/tools/setup.sh asr` (about 800 MB, once) or `link-asr <dir>`.
3. Recognise per utterance (background, about 0.7x real time): `"$ASR_PY" tools/segment_asr.py --lang <hi|en>`.
4. Align: `python tools/align.py` with the library python. Read the weak-match list; fix chunk boundaries only through `parts.json` or the script text, never by hand-editing times without saying so.
5. Cut: `python tools/cut_chunks.py` (needs ffmpeg on PATH: `. studio/tools/env.sh`). The old synthetic voice moves to `vo_synthetic/`.
6. Rebuild: `python timeline.py`; `events.mjs`; `tools/holds.py` (faster speech shortens scenes; `fitT` handles most, fix the rest in the scenes); render stills at scene changes; `sh build.sh` (skips text-to-speech because `vo/gaps.json` exists).
7. Verify: `python tools/audio_sync_check.py` (no quiet windows, no loud pauses), the QA gates, and regenerate chapters (`python studio/tools/chapters.py <project> ...`), `.srt` and the listing times (all from `timeline.json`).
8. Report: chunks aligned (n of n), film length before and after, gates passed, and plainly that you have not heard the recording: name the 5-6 lines the owner should check against the picture, plus any weak matches.

Never claim the spoken words match the script beyond what the recogniser's times and the weak-match list show.

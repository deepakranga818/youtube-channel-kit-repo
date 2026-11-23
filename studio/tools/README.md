# Studio tools

| File | What |
|---|---|
| `setup.sh` | `sh studio/tools/setup.sh` = check; `lib` = install the Lemo-Opuscar library at the pinned commit; `asr` = build the speech env; `link-asr <dir>` = reuse an existing one |
| `env.sh` | sourced by every `build.sh`: sets `LIB`, `PATH` (ffmpeg), `ASR_PY`, `HF_HOME` |
| `lemo-setup.sh` | vendored copy of the library skill's setup script (MIT) used by `setup.sh lib` |

## asr-venv (speech recognition, Python 3.12)
`faster-whisper` 1.2.1 + the Whisper `small` model (about 460 MB, cached in `$HF_HOME`). Own environment because the library's Python 3.15 cannot build `tokenizers`. Used to find word start/end times when the owner supplies a recording (alignment). CPU is fine: about 0.7x real time.
Not for the library's `asr_check.py` (that one needs the library's own venv). Hindi spelling in the transcript is approximate; the word TIMES are what we use.

## Using a supplied voice recording (worked example: the credit-card film)
1. Put the parts in `Voice Script/part1.mp3 ...`; keep the script chunks in `hinglish_src.py` (id, roman text, english); list which chunk ids each part covers in `tools/parts.json`.
2. `$ASR_PY tools/segment_asr.py [--lang hi|en]` (split at pauses, recognise each utterance) -> `out/asr/`.
3. Library python: `python tools/align.py` (match words to chunks; read the weak-match list), then `python tools/cut_chunks.py` (writes `vo/<id>.wav`, `vo/dur.json`, `vo/gaps.json`; the old voice goes to `vo_synthetic/`).
4. `python timeline.py` (keeps the speaker's pauses, adds room for scene changes), events, `tools/holds.py`, render, mix, mux, `tools/audio_sync_check.py`. `kit.js fitT` pops texts earlier when the recording is faster than the scenes were written for.
Full explanation: `studio/docs/VOICE_AND_SUBTITLES.md`.

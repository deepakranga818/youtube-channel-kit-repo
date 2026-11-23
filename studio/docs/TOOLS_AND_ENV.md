# Tools and environment

## What a machine needs
| Tool | Version used | Why | Install |
|---|---|---|---|
| Node.js | 24.14 (20+ required) | the renderer (Playwright headless Chromium) | https://nodejs.org |
| ffmpeg | 9.0.2 Gyan full build (7+ required) | mux, mastering, poster, checks | `winget install Gyan.FFmpeg` |
| git | any | clone the library | |
| Python | 3.15.2 for the library venv; **3.12** for the ASR env | library tools / speech recognition | `winget install Python.Python.3.12` (3.12 only if recordings are used) |
| Lemo-Opuscar library | commit `f9e2042` (pinned in `studio/tools/setup.sh`) | renderer, edge-tts wrapper, sound helpers, styles | `sh studio/tools/setup.sh lib` |
| ASR env | faster-whisper 1.2.1, Whisper `small` (about 460 MB model) | align a supplied recording | `sh studio/tools/setup.sh asr` or `link-asr <dir>` |

Library venv packages in use: edge-tts 7.3.1, numpy 2.5.5, scipy 1.18.1, soundfile 0.14, soxr 1.1, pillow 13, fonttools 4.68, certifi. Library node packages (Playwright etc.) come from its `package.json`.

`sh studio/tools/setup.sh` checks all of this and prints what is missing; it never installs system software.

## Notes for Windows (where the studio was built; macOS/Linux are untested)
- Shells: the Bash tool = Git Bash (use it for every `sh` script); PowerShell is the user's own shell (give them commands in PowerShell).
- Library: `~/lemo-opuscar` (`C:\Users\<user>\lemo-opuscar`) by default, a sparse clone at the pinned commit.
- ffmpeg from winget lives in `C:\Users\<user>\AppData\Local\Microsoft\WinGet\Links` (added to PATH by `env.sh`).
- Python 3.12 is reachable as `py -3.12`; `uv` is optional.
- A speech env that already exists from another channel can be reused instead of downloading again: `sh studio/tools/setup.sh link-asr <folder that contains asr-venv and hf-cache>`.

## Environment variables (set by `studio/tools/env.sh`, overridable)
`LIB` (library), `STUDIO_HOME` (default `~/.video-studio`: ASR env, model cache, `local.env`), `ASR_PY`, `HF_HOME`, `WORKERS` (render workers, default 3), `VOICE` (key from `voices.json`), `FORCE=1` (new-video.sh with TODO profile).

## Command cheat sheet (Bash tool, from the project folder unless noted)
```bash
. ../../studio/tools/env.sh                                   # PATH, LIB, ASR_PY
cd "$LIB" && node core/render/still.mjs "$P" 1.5 12 --out "$P/stills"        # $P = absolute project path
cd "$LIB" && node core/render/events.mjs "$P"                  # events.json
cd "$LIB" && node core/render/video.mjs "$P" --fps 24 --workers 3 --out "$P/out/video.mp4"
"$LIB/.venv/Scripts/python.exe" mix.py                         # sound (library python; env var LIB set)
sh "$LIB/core/render/mux.sh" out/video.mp4 out/mix.wav name.mp4 24 4
"$ASR_PY" tools/segment_asr.py --lang hi                       # recordings only
```
Run python tools with the library's python (`$LIB/.venv/Scripts/python.exe` or `.venv/bin/python`); build scripts pick it automatically.

## Other tools available in the Claude desktop app (optional, not needed for code-made films)
Built-in browser (preview a page, drive YouTube Studio after the owner signs in), Claude in Chrome, image/video generation and Canva connectors, computer use. The earlier pure-AI-video workflows (NotebookLM exports, generated stills) are a different production path with different costs; the code-made path here is deterministic and free per film.

## Disk
Kit about 3 MB; library about 1.5 GB; ASR env about 314 MB + model 464 MB; one finished film folder 1-2 GB (frames and wavs in `out/`; delete `out/` and `vo/` after delivery if space matters, keep the topic files).

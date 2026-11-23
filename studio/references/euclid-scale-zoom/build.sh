#!/bin/sh
# One command: render the picture, mix the sound, master, subtitles and poster.
# Needs the Lemo-Opuscar library with its .venv (core tier), ffmpeg on PATH, vo/ generated (see TREATMENT.md).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-$HOME/lemo-opuscar}
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "set LIB to the library folder"; exit 1; }
PY="$LIB/.venv/Scripts/python.exe"; [ -x "$PY" ] || PY="$LIB/.venv/bin/python"
cd "$LIB"
mkdir -p "$HERE/out"
node core/render/video.mjs "$HERE" --fps 24 --workers 3 --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/dark-matter-map.mp4" 24 0
"$PY" core/render/srt.py "$HERE/out/cues.json" "$HERE/subtitles_hi-en.srt"
ffmpeg -v error -y -ss 7 -i "$HERE/dark-matter-map.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
echo "done: $HERE/dark-matter-map.mp4"

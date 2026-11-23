#!/bin/sh
# One command: build this Sketchnote film (topic = page.js + lines_src.py)       sh build.sh
#   voice (edge-tts) -> timeline + subtitles -> events -> picture -> pen foley (no music) -> master -> poster
# Voice: VOICE=<key in ../../studio/shared/voices.json> (default hinglish); if vo/gaps.json exists (a supplied recording) the text-to-speech step is skipped.
# Needs the Lemo-Opuscar library (LIB, default ~/lemo-opuscar) with its .venv (edge-tts, certifi, numpy, scipy, soundfile, soxr, pillow),
# ffmpeg on PATH, and an internet connection for the voice (edge-tts) and the fonts (tools/fonts.sh).
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
STUDIO="$HERE/../../studio"; [ -f "$STUDIO/tools/env.sh" ] && . "$STUDIO/tools/env.sh"
LIB=${LIB:-$HOME/lemo-opuscar}; export LIB
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"
NAME=$(basename "$HERE")
WORKERS=${WORKERS:-3}
VOICE=${VOICE:-hinglish}
cd "$LIB"
[ -f "$HERE/fonts/Kalam-Bold.ttf" ] && [ -f "$HERE/fonts/PatrickHand-Regular.ttf" ] || sh "$HERE/tools/fonts.sh" "$HERE"
[ -f "$HERE/glyphs.json" ] || "$PY" "$HERE/tools/skeleton.py"
CERT=$("$PY" -c 'import certifi; print(certifi.where())'); export SSL_CERT_FILE="$CERT"
(cd "$HERE" && "$PY" lines_src.py)
if [ -f "$HERE/vo/gaps.json" ]; then
  echo "voice: supplied recording found (vo/gaps.json), skipping text-to-speech"
else
  VR=$("$PY" -c 'import json,sys; d=json.load(open(sys.argv[1]))[sys.argv[2]]; print(d["voice"], d["rate"])' "$STUDIO/shared/voices.json" "$VOICE")
  "$PY" core/tts/tts_zh.py "$HERE/vo/lines.json" "$HERE/vo" --voice "${VR% *}" --rate "${VR#* }"
fi
(cd "$HERE" && "$PY" timeline.py)
node core/render/events.mjs "$HERE"
node core/render/video.mjs "$HERE" --fps 24 --workers "$WORKERS" --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 24 1
node core/render/readcheck.mjs "$HERE" > "$HERE/out/readcheck.txt" || echo "readcheck: see out/readcheck.txt"
mkdir -p "$HERE/out/poster"
ffmpeg -v error -y -sseof -1.5 -i "$HERE/$NAME.mp4" -frames:v 1 "$HERE/out/poster/frame.png"
"$PY" -c 'import sys; from PIL import Image; Image.open(sys.argv[1]).convert("RGB").save(sys.argv[2], "JPEG", quality=90, optimize=True)' "$HERE/out/poster/frame.png" "$HERE/poster.jpg"
echo "done: $HERE/$NAME.mp4"

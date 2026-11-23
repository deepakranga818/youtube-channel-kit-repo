#!/bin/sh
# One command: build this Mid-century Cartoon film.      sh build.sh
#   fonts -> lines -> voice -> timeline (+mouth, srt) -> events -> reading-time gate -> picture -> sound -> master -> poster
# Topic files: see TOPIC_FILES. Voice: VOICE=<key in ../../studio/shared/voices.json> (default hi-deva); if vo/gaps.json exists (a supplied recording cut by
# tools/cut_chunks.py) the text-to-speech step is skipped. Needs the Lemo-Opuscar library (LIB, default ~/lemo-opuscar) with its .venv, ffmpeg on PATH,
# and internet for the fonts and edge-tts. The render is the long step (tens of minutes for a 7-9 minute film): run it in the background.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
STUDIO="$HERE/../../studio"; [ -f "$STUDIO/tools/env.sh" ] && . "$STUDIO/tools/env.sh"
LIB=${LIB:-$HOME/lemo-opuscar}; export LIB
PY="$LIB/.venv/bin/python"; [ -x "$PY" ] || PY="$LIB/.venv/Scripts/python.exe"
NAME=$(basename "$HERE")
WORKERS=${WORKERS:-3}
VOICE=${VOICE:-hi-deva}
sh "$HERE/tools/fonts.sh"
CERT=$("$PY" -c 'import certifi; print(certifi.where())'); export SSL_CERT_FILE="$CERT"
(cd "$HERE" && "$PY" lines_src.py)
if [ -f "$HERE/vo/gaps.json" ]; then
  echo "voice: supplied recording found (vo/gaps.json), skipping text-to-speech"
else
  VR=$("$PY" -c 'import json,sys; d=json.load(open(sys.argv[1]))[sys.argv[2]]; print(d["voice"], d["rate"])' "$STUDIO/shared/voices.json" "$VOICE")
  "$PY" "$LIB/core/tts/tts_zh.py" "$HERE/vo/lines.json" "$HERE/vo" --voice "${VR% *}" --rate "${VR#* }"
fi
(cd "$HERE" && "$PY" timeline.py)
cd "$LIB"
node core/render/events.mjs "$HERE"
"$PY" "$HERE/tools/holds.py" "$HERE/events.json" || echo "holds: some texts stay on screen less than their reading time; fix the scene or accept"
node core/render/video.mjs "$HERE" --fps 24 --workers "$WORKERS" --out "$HERE/out/video.mp4"
"$PY" "$HERE/mix.py"
sh core/render/mux.sh "$HERE/out/video.mp4" "$HERE/out/mix.wav" "$HERE/$NAME.mp4" 24 4
mkdir -p "$HERE/out/poster"
POSTER_T=$(cd "$HERE" && "$PY" -c "import json; s=[x for x in json.load(open('timeline.json'))['scenes'] if x['id']=='lockup'][0]; print(round(s['t1']-0.3,2))")
ffmpeg -v error -y -ss "$POSTER_T" -i "$HERE/$NAME.mp4" -frames:v 1 -q:v 2 "$HERE/poster.jpg"
echo "done: $HERE/$NAME.mp4"

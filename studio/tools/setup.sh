#!/bin/sh
# studio/tools/setup.sh: check or install what the studio needs. Never installs system software (Node, ffmpeg, Python, git): it tells you what is missing.
#   sh studio/tools/setup.sh                  check: what is installed, what is missing (changes nothing)
#   sh studio/tools/setup.sh lib              download the Lemo-Opuscar library to $LIB at the pinned commit and install its packages (a few minutes, first time only)
#   sh studio/tools/setup.sh lib --update     move an existing library to the newest upstream main (may change the render tools: re-test a still afterwards)
#   sh studio/tools/setup.sh asr              build the speech-recognition env (Python 3.12 + faster-whisper + Whisper small, about 800 MB) in $STUDIO_HOME. Only needed when you supply a voice recording
#   sh studio/tools/setup.sh link-asr <dir>   reuse an existing <dir>/asr-venv + <dir>/hf-cache instead of building another copy
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
. "$HERE/env.sh"
LIB_REPO=https://github.com/lemomo-ai/lemo-opuscar.git
LIB_PIN=f9e204293930952b61ba921cd8944d05f121beee        # the library commit every template here was built and tested against
MISS=0
ok() { printf '  ok       %s\n' "$*"; }
no() { printf '  MISSING  %s\n' "$*"; MISS=1; }
libpy() { for c in "$LIB/.venv/bin/python" "$LIB/.venv/Scripts/python.exe"; do [ -x "$c" ] && { echo "$c"; return; }; done; }

check() {
  echo "studio check   (LIB=$LIB  STUDIO_HOME=$STUDIO_HOME)"
  if command -v node >/dev/null; then [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 20 ] && ok "node $(node -v)" || no "node 20+ (found $(node -v))"; else no "node 20+  (https://nodejs.org)"; fi
  if command -v ffmpeg >/dev/null; then v=$(ffmpeg -version 2>/dev/null | sed -n '1s/^ffmpeg version n\{0,1\}\([0-9][0-9]*\)\..*/\1/p'); { [ -z "$v" ] || [ "$v" -ge 7 ]; } && ok "ffmpeg $(ffmpeg -version | sed -n '1s/ffmpeg version \([^ ]*\).*/\1/p')" || no "ffmpeg 7+ (found $v)"; else no "ffmpeg on PATH  (Windows: winget install Gyan.FFmpeg)"; fi
  command -v git >/dev/null && ok "git" || no "git"
  if [ -f "$LIB/AGENTS.md" ] && [ -d "$LIB/core/render" ]; then
    cur=$(git -C "$LIB" rev-parse HEAD 2>/dev/null || echo unknown)
    [ "$cur" = "$LIB_PIN" ] && ok "library $LIB (pinned commit)" || ok "library $LIB at ${cur%"${cur#???????}"} (templates were tested on ${LIB_PIN%"${LIB_PIN#???????}"}; re-test a still if renders look different)"
    [ -d "$LIB/node_modules/playwright-core" ] && ok "library node packages" || no "library node packages  (sh studio/tools/setup.sh lib)"
    P=$(libpy); if [ -n "$P" ]; then "$P" -c 'import edge_tts, numpy, scipy, soundfile, soxr, PIL, certifi' 2>/dev/null && ok "library python packages ($("$P" -V 2>&1))" || no "library python packages  (sh studio/tools/setup.sh lib)"; else no "library .venv  (sh studio/tools/setup.sh lib)"; fi
  else no "Lemo-Opuscar library at $LIB  (sh studio/tools/setup.sh lib)"; fi
  if [ -n "$ASR_PY" ] && [ -x "$ASR_PY" ] && "$ASR_PY" -c 'import faster_whisper' 2>/dev/null; then
    ok "speech recognition env $ASR_PY"; ls "$HF_HOME"/hub 2>/dev/null | grep -qi whisper && ok "Whisper model cache $HF_HOME" || echo "  note     Whisper model not downloaded yet (downloads on first use, about 460 MB)"
  else echo "  optional speech recognition env not set up (only for supplied recordings): sh studio/tools/setup.sh asr   or   link-asr <dir>"; fi
  [ "$MISS" = 0 ] && echo "ready." || echo "not ready: fix the MISSING lines."
}

case "$1" in
  lib)
    if [ ! -f "$LIB/AGENTS.md" ]; then
      LEMO_OPUSCAR_HOME="$LIB" LEMO_OPUSCAR_REPO="$LIB_REPO" sh "$HERE/lemo-setup.sh"
      if git -C "$LIB" fetch --quiet --depth 1 origin "$LIB_PIN" 2>/dev/null && git -C "$LIB" reset --quiet --hard FETCH_HEAD; then echo "library pinned to ${LIB_PIN%"${LIB_PIN#???????}"}"; else echo "! could not pin the library commit; using main (re-test a still)"; fi
      git -C "$LIB" config lemo.managed false          # so a later setup run does not move it to a newer main by itself
    elif [ "$2" = "--update" ]; then git -C "$LIB" config lemo.managed true; LEMO_OPUSCAR_HOME="$LIB" sh "$HERE/lemo-setup.sh"; git -C "$LIB" config lemo.managed false
    fi
    LEMO_OPUSCAR_HOME="$LIB" sh "$HERE/lemo-setup.sh" deps ;;
  asr)
    if [ -n "$ASR_PY" ] && [ -x "$ASR_PY" ]; then echo "speech env already there: $ASR_PY"; exit 0; fi
    mkdir -p "$STUDIO_HOME"; V="$STUDIO_HOME/asr-venv"
    # faster-whisper cannot install on Python 3.15 (tokenizers has no wheel); use 3.12
    if command -v uv >/dev/null; then uv venv --quiet --python 3.12 "$V"; UV=1
    elif command -v python3.12 >/dev/null; then python3.12 -m venv "$V"
    elif command -v py >/dev/null && py -3.12 -V >/dev/null 2>&1; then py -3.12 -m venv "$V"
    else echo "Python 3.12 not found. Install it (Windows: winget install Python.Python.3.12) or uv, then run this again."; exit 1; fi
    P="$V/Scripts/python.exe"; [ -x "$P" ] || P="$V/bin/python"
    if [ -n "$UV" ]; then uv pip install --quiet --python "$P" faster-whisper==1.2.1; else "$P" -m pip install --quiet --disable-pip-version-check faster-whisper==1.2.1; fi
    HF_HOME="$HF_HOME" "$P" -c "from faster_whisper import WhisperModel; WhisperModel('small', device='cpu', compute_type='int8'); print('Whisper small ready')"
    echo "speech env: $P" ;;
  link-asr)
    d=$2; [ -n "$d" ] || { echo "usage: sh studio/tools/setup.sh link-asr <dir that contains asr-venv and hf-cache>"; exit 1; }
    P="$d/asr-venv/Scripts/python.exe"; [ -x "$P" ] || P="$d/asr-venv/bin/python"; [ -x "$P" ] || { echo "no asr-venv in $d"; exit 1; }
    mkdir -p "$STUDIO_HOME"; printf 'ASR_PY=%s\nHF_HOME=%s\n' "$P" "$d/hf-cache" > "$STUDIO_HOME/local.env"; echo "linked: $STUDIO_HOME/local.env" ;;
  ""|--check|check) check ;;
  *) sed -n '2,9p' "$0"; exit 1 ;;
esac

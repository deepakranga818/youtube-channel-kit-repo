# studio/tools/env.sh: SOURCE this (  . studio/tools/env.sh  ); the build.sh files do it for you.
# Sets LIB (the Lemo-Opuscar library), PATH (ffmpeg from winget on Windows), ASR_PY + HF_HOME (the speech-recognition env, only needed for supplied recordings).
# Machine-specific overrides go in $STUDIO_HOME/local.env (written by:  sh studio/tools/setup.sh link-asr <dir>), never in the kit.
STUDIO_HOME=${STUDIO_HOME:-$HOME/.video-studio}
[ -f "$STUDIO_HOME/local.env" ] && . "$STUDIO_HOME/local.env"
LIB=${LIB:-${LEMO_OPUSCAR_HOME:-$HOME/lemo-opuscar}}
WG="$HOME/AppData/Local/Microsoft/WinGet/Links"
[ -d "$WG" ] && case ":$PATH:" in *":$WG:"*) ;; *) PATH="$PATH:$WG" ;; esac
if [ -z "$ASR_PY" ]; then
  for c in "$STUDIO_HOME/asr-venv/Scripts/python.exe" "$STUDIO_HOME/asr-venv/bin/python"; do [ -x "$c" ] && { ASR_PY=$c; break; }; done
fi
HF_HOME=${HF_HOME:-$STUDIO_HOME/hf-cache}
export STUDIO_HOME LIB PATH ASR_PY HF_HOME PYTHONIOENCODING=utf-8

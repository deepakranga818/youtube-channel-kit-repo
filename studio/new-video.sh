#!/bin/sh
# Start a new video from a style's working code:   sh studio/new-video.sh <style> <slug>      e.g.  sh studio/new-video.sh sketchnote upi-explained
# Copies studio/templates/<style> to videos/<slug>-<style>/ . Only the topic files change per video (see the new BRIEF.md); the engine is never rewritten.
# Refuses while channel/CHANNEL.md still has TODO markers (run the channel-setup skill first); FORCE=1 overrides (smoke tests).
set -e
HERE=$(cd "$(dirname "$0")" && pwd); ROOT=$(cd "$HERE/.." && pwd); STYLE=$1; SLUG=$2
[ -n "$STYLE" ] && [ -n "$SLUG" ] || { echo "usage: sh studio/new-video.sh <style> <slug>"; echo "styles: $(ls "$HERE/templates" | tr '\n' ' ')"; exit 1; }
SRC="$HERE/templates/$STYLE"; DST="$ROOT/videos/$SLUG-$STYLE"
[ -d "$SRC" ] || { echo "no template '$STYLE'. styles: $(ls "$HERE/templates" | tr '\n' ' ')"; exit 1; }
[ ! -e "$DST" ] || { echo "$DST already exists"; exit 1; }
if grep -q 'TODO' "$ROOT/channel/CHANNEL.md" 2>/dev/null && [ -z "$FORCE" ]; then
  echo "channel/CHANNEL.md still has TODO markers: set the channel up first (open Claude Code here and say: set up this channel)."; exit 1
fi
mkdir -p "$ROOT/videos"; cp -r "$SRC" "$DST"
cat > "$DST/BRIEF.md" <<B
# $SLUG ($STYLE)
Channel profile: ../../channel/CHANNEL.md   Standard flow: ../../studio/FLOW.md   Playbooks: ../../studio/docs/   Voices: ../../studio/shared/voices.json

Edit ONLY these (the rest is the engine):
$(cat "$SRC/TOPIC_FILES" 2>/dev/null)

Then: sh build.sh      (needs ffmpeg on PATH and the Lemo-Opuscar library; run  sh ../../studio/tools/setup.sh --check  if unsure)
B
echo "created $DST"; echo "next: read $DST/BRIEF.md, write the script + FACTS.md, edit the topic files, then sh build.sh"

#!/bin/sh
# Build MASTER_PROMPT.md at the kit root: CLAUDE.md + FLOW + every playbook + the skills + the blank profile, in one file you can paste into a chat that cannot see the folder.
# Re-run after any change to those files:   sh studio/tools/make-master-prompt.sh
set -e
ROOT=$(cd "$(dirname "$0")/../.." && pwd); OUT="$ROOT/MASTER_PROMPT.md"
{
  echo "# MASTER PROMPT: the channel studio, in one file"
  echo
  echo "Paste this into a chat that cannot see the studio folder. It is generated from CLAUDE.md, studio/FLOW.md, studio/docs/*.md, .claude/skills/*/SKILL.md and channel/CHANNEL.md. Where it says 'this folder', read 'the studio'; commands need the real folder to run."
  for f in CLAUDE.md studio/FLOW.md studio/docs/OVERVIEW.md studio/docs/PIPELINE.md studio/docs/STYLES.md studio/docs/VOICE_AND_SUBTITLES.md studio/docs/FONTS_AND_TEXT.md studio/docs/SOUND.md studio/docs/QA_GATES.md studio/docs/YOUTUBE.md studio/docs/PITFALLS.md studio/docs/TOOLS_AND_ENV.md studio/docs/CONTENT_AND_LICENCES.md studio/docs/LEARNINGS.md channel/CHANNEL.md .claude/skills/channel-setup/SKILL.md .claude/skills/new-video/SKILL.md .claude/skills/align-recording/SKILL.md .claude/skills/youtube-package/SKILL.md .claude/skills/add-style/SKILL.md; do
    echo; echo "=================================================================="; echo "FILE: $f"; echo "=================================================================="; echo
    cat "$ROOT/$f"
  done
} > "$OUT"
echo "wrote $OUT ($(wc -c < "$OUT") bytes, about $(( $(wc -c < "$OUT") / 4 )) tokens)"

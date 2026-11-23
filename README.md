# Channel studio: narrated explainer videos made entirely in code

A ready-to-run studio for YouTube-style explainer films. A coding agent (built for [Claude Code](https://claude.com/claude-code)) writes the script with you, draws every picture as code, records nothing by hand, and masters the sound; you approve the script and the result. Everything learned while making the first channel's films (rules, pitfalls, two film styles, QA checks, thumbnails and the YouTube checklist) is in this repo, so a clone starts producing films for **your** niche right away.

## What you get
- **Two finished film styles**: *Sketchnote* (one big hand-drawn page the camera moves over) and *Mid-century Cartoon* (1950s classroom-film cards with a host character, numbered lessons, bilingual captions). Any of the 99 styles of the [Lemo-Opuscar](https://github.com/lemomo-ai/lemo-opuscar) library can be added the same way.
- **A standard pipeline**: brief, treatment, approved script with a facts table, voice (synthetic, or your own recording aligned to the scenes), pictures, sound (no music by default), render, QA gates, thumbnails, YouTube title/description/chapters/tags.
- **The agent's brain in the repo**: `CLAUDE.md` (read automatically), five skills in `.claude/skills/`, twelve playbooks in `studio/docs/`, and a one-file `MASTER_PROMPT.md` for chats that cannot see the folder.

## Requirements
| Need | Notes |
|---|---|
| Claude Code (or another coding agent that reads `CLAUDE.md` / `AGENTS.md`) | the skills are Claude Code skills |
| Node.js 20+, ffmpeg 7+, git, Python 3.11+ | `sh studio/tools/setup.sh` checks them and tells you what is missing (it never installs system software) |
| Internet | the film library, fonts and the Microsoft Edge neural voices (edge-tts, an online service) are fetched on use |
| Windows: Git Bash | the build scripts are `sh`. Built and tested on Windows 11; macOS and Linux are written portably but **untested** |
| About 1.5 GB disk for the film library; about 800 MB more only if you record your own voice (speech recognition) | installed once per computer, not in this repo |

## Quick start
```bash
git clone <this repo's url> my-channel
cd my-channel
```
Open the folder in Claude Code and say:

> Set up this channel.

The agent interviews you (niche, audience, language, host, voice, look), fills `channel/CHANNEL.md`, checks the tools, installs the film library if needed (`sh studio/tools/setup.sh lib`), and asks for your first topic. Then: *"Make a video about …"*.

`channel/CHANNEL.md` contains `TODO` markers on purpose: `studio/new-video.sh` refuses to start a film until the channel is set up. `channel/examples/explaineveryday/` is the first channel's filled-in profile, an example only.

Already have a channel folder? Copy this repo's contents into it instead (keep `CLAUDE.md` and `.claude/` at the top).

## Repo layout
```
CLAUDE.md  AGENTS.md  MASTER_PROMPT.md      master context for the agent
.claude/skills/        channel-setup  new-video  align-recording  youtube-package  add-style
channel/               your channel profile (CHANNEL.md, channel.json) + an example
studio/
  FLOW.md  new-video.sh  shared/            the standard flow, voices, fonts
  templates/             sketchnote/  midcentury-toon/   (engine + stub topic files + a worked example)
  references/            a third film's source (Euclid / scale zoom), not a template
  tools/                 setup.sh  env.sh  chapters.py  make-master-prompt.sh ...
  docs/                  12 playbooks + LEARNINGS.md
videos/                one folder per film (git ignores renders, audio and caches; topic files are kept)
```

## Make it yours
- Keep your clone private, or on GitHub use **Fork** or **Use this template** so your channel profile and videos live in your own repo.
- Improvements to `studio/`, `.claude/` or `CLAUDE.md` can be committed on a branch and sent back as a pull request; `git pull` brings in other people's.
- Re-generate `MASTER_PROMPT.md` after changing docs: `sh studio/tools/make-master-prompt.sh`.

## Good to know
- No agent can hear audio: every delivery lists what a human should listen to before publishing.
- YouTube asks whether content is altered or synthetic; that answer is yours to give (see `studio/docs/YOUTUBE.md`).
- Do not publish a film you have not watched, and check any facts the script relies on.

## Licence
MIT, see `LICENSE`. Third-party code, fonts and services are listed in `THIRD_PARTY_NOTICES.md`. The Lemo-Opuscar library itself is downloaded by the setup script and is not part of this repo; it keeps its own licence terms (code MIT, docs CC BY-NC).

---
name: channel-setup
description: First-run setup of a new channel folder. Use when channel/CHANNEL.md still contains TODO, when the user says "set up this channel", "new channel", "new niche", or before the first film in a fresh copy of the kit.
---

# Channel setup (once per channel folder)

Goal: turn the blank profile into the channel's real profile, check the tools, and leave nothing for the first film to ask again.

1. Read `channel/CHANNEL.md`, `channel/examples/explaineveryday/CHANNEL.md` (a filled example) and `studio/docs/OVERVIEW.md`.
2. Interview the owner in at most two rounds (use AskUserQuestion when available, with a recommended option and sensible defaults from the example):
   - Round 1: niche, audience and country, narration language, on-screen language, subtitle lines, host (none / default boy host / new design), film length, cadence.
   - Round 2: voice (synthetic voice from `studio/shared/voices.json`, or the owner records), background music yes/no (default no), a starting style palette (sketchnote / midcentury-toon / library styles; only a palette: every film's style is chosen by its topic, never fixed per channel), look and thumbnail feel, topic cautions (finance, health, legal, kids), YouTube defaults (language, category, kids, AI-content answer policy).
   Offer ExplainEveryday's defaults as the recommended answer for taste rules and say they come from that channel.
3. Fill every TODO in `channel/CHANNEL.md`, and `channel/channel.json` to match. Add a voice key to `studio/shared/voices.json` if the language is new (list edge-tts voices with `python -m edge_tts --list-voices` in the library venv; pick a voice that matches the host).
4. If the font needs differ (another script, another look): note it in CHANNEL.md and follow `studio/docs/FONTS_AND_TEXT.md` when the first film starts.
5. Run `sh studio/tools/setup.sh`. Fix MISSING items: the library with `sh studio/tools/setup.sh lib` (a few minutes, needs internet); if the owner will record their own voice and an ASR env from another channel already exists on this machine (`~/.video-studio/local.env`, or a folder holding `asr-venv` + `hf-cache`), ask, then `sh studio/tools/setup.sh link-asr <dir>`; otherwise `setup.sh asr` later, only when a recording arrives.
6. Save the channel's standing rules in your memory for this folder (taste rules + where CHANNEL.md is), so a new session in this folder recalls them.
7. Show the owner a 6-line summary of the profile and ask one question: the first film's topic. Then continue with the `new-video` skill.

Never start a film while any `TODO` is left; do not invent channel facts (handle, links, brand colours): ask or leave them for the owner.

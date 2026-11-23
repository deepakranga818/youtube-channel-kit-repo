# Channel profile (fill every TODO; the channel-setup skill does it with the owner)

While any `TODO` remains in this file, `studio/new-video.sh` refuses to start a film. Keep `channel.json` in step with this file. Standing rules written here apply to every film without being asked again.

## 1. Identity
- Channel name: TODO
- Tagline: TODO (one line, shown on the end card)
- Niche / what the channel explains: TODO
- Audience (who, where, what they already know): TODO
- Film length target: TODO (6-10 min was the norm for the first channel)
- Posting cadence: TODO

## 2. Language plan
- Narration language: TODO (en, hi, ...; the voice key goes in section 4)
- On-screen text language: TODO (default: English)
- Subtitles, top line: TODO (default: English)
- Subtitles, bottom line: TODO (default: the narration language's own script, or none for an English-only channel)
- Other soft-subtitle files to upload: TODO

## 3. Host and look
- Host character: TODO (none | the default boy host from the Mid-century template | a new design; describe age, clothes, colours, personality)
- Host gender / voice implication: TODO
- Styles to use: TODO (sketchnote | midcentury-toon | others from the library; 1-2 to start)
- Colour palette / fonts / brand feel: TODO
- Thumbnail look: TODO (default: 3-5 big words, one number, the host's face, the hero object in its own zone, saturated flat ground)

## 4. Voice and sound
- Voice: TODO (a key in `studio/shared/voices.json`, or "owner records": then the speech env is needed)
- Background music: TODO (default: none, voice + sound effects only)
- Loudness: -14 LUFS, true peak <= -1 dBTP (default; change only with a reason)

## 5. Rules for every film
- TODO confirm: no library / "made with" sign-off in the film; credits go in `CREDITS`
- TODO confirm: every number on screen comes from the approved script and `FACTS.md`; illustrative numbers are labelled
- TODO confirm: confirm with the owner before uploads, posts or anything that spends credits
- Topic-specific cautions (finance, health, legal, kids ...): TODO
- Anything else the owner always wants / never wants: TODO

## 6. YouTube settings
- Default language, category, "made for kids": TODO
- AI/synthetic content answer policy: TODO (the owner answers per film; record their rule here)
- Handle / links to put in descriptions: TODO

## 7. Where things live
- Studio upstream (where improvements to `studio/` are shared): see `git remote -v` (blank if you only use this folder locally)
- Library: `~/lemo-opuscar` (pinned commit in `studio/tools/setup.sh`)
- Speech env (only if recordings are used): TODO (path, or "not used")

---
name: youtube-package
description: Make the YouTube package for a finished film: two thumbnails, titles, description with chapters, hashtags, tags, subtitle files, studio settings and a pinned comment. Use when the owner asks for a thumbnail, title, description, hashtags, listing, or "what do I put on YouTube".
---

# YouTube package

Read `studio/docs/YOUTUBE.md` and the worked example `studio/templates/midcentury-toon/example/youtube_listing.md`.

1. **Thumbnails**: edit `BRAND.thumb.a/.b` in `brand.js` (Mid-century) or design on the same recipe in another style: 3-5 big words, one number/badge, one face, the hero object in its own clear zone, readable at 168 px wide. Render with `still.mjs ... --q 'test=thumb&v=a'`, scale to 1280x720 JPEG under 2 MB, and LOOK at both (Read the images) before showing them. Variant A = curiosity question, B = paradox.
2. **Chapters** from `timeline.json`: `python studio/tools/chapters.py <project> "<hook title>" "<lesson 1 title>" ...` (library python). Never type times by hand.
3. **`youtube_listing.md`**: 3-4 titles (mark the recommended one), description (hook, language line, chapters, bullet list, NOTE for illustrative numbers/not-advice, comment prompt, subscribe line, "visuals are original animation" line, 3 hashtags last), extra hashtags, tags under 500 characters, studio settings, pinned comment, community-post line.
4. **Subtitles**: `subtitles_english.srt` (+ the narration-language `.srt` and `subtitles_en-hindi.srt`) from the timeline; check the first and last cue against the film.
5. **Synthetic-content question**: ask the owner how the audio was made and record their answer in the listing; add a disclosure line if the voice is synthetic.
6. Deliver the files; **do not upload or change anything on YouTube without an explicit yes** (and a signed-in owner for Studio steps).

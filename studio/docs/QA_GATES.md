# QA gates (run all before saying "done")

Run from the project folder; `ffmpeg` on PATH (`. ../../studio/tools/env.sh`). A gate you could not run is reported as not run, never as passed. Fix the cause, not the number.

| # | Gate | How | Pass |
|---|---|---|---|
| 1 | Duration | `ffprobe -v error -show_entries format=duration -of csv=p=0 film.mp4` | equals `timeline.json` dur (+/- 0.1 s); matches the length promised in the listing |
| 2 | Loudness + peak | `ffmpeg -i film.mp4 -af ebur128=peak=true -f null - 2>&1` (last block: `I:` and `Peak:`) | I = -14 LUFS +/- 1; true peak <= -1 dBTP (mux.sh prints the same) |
| 3 | No black frames | `ffmpeg -i film.mp4 -vf blackdetect=d=0.4:pic_th=0.98 -an -f null - 2>&1 | grep black_start` | none (the delivered credit-card film had 0; an intended dark moment such as the end iris must be shorter than 0.4 s or you explain it) |
| 4 | Reading time | `python tools/holds.py events.json` (Mid-century) or `readcheck.mjs` | 0 short holds, or each justified in the delivery note |
| 5 | Speech vs picture timing | `python tools/audio_sync_check.py` (library python) | no quiet windows, no loud pauses; for a recording also look at the `align.py` weak-match list |
| 6 | Stills at scene start, middle, end | `still.mjs` + Read the JPEGs (contact sheet: `core/render/sheet.py`) | nothing overlaps; text fits; subject clear of the caption band; the host's pose fits the line |
| 7 | Facts | open `FACTS.md` next to the script and the stills | every number on screen and in the voice is in the table and agrees; illustrative numbers are labelled on screen |
| 8 | Language | all on-screen text in the channel's language rule; Hindi reviewed or flagged as the builder's translation | no stray Devanagari/English where the rule says otherwise |
| 9 | Sign-off | grep the stills/text for the library's name | no library sign-off in a channel film; credits only in `CREDITS` |
| 10 | Files | the delivery list below exists and opens | yes |

## Delivery list (project folder)
`<name>.mp4`, `poster.jpg`, two thumbnails (1280x720), `subtitles_en-hindi.srt` + `subtitles_english.srt` (+ `subtitles_<lang>.srt`), `youtube_listing.md`, `CREDITS`, `FACTS.md`, `TREATMENT.md`, review notes for any translated script.

## The honest-delivery note (always)
End the delivery message with: what was checked (the table above, with numbers); what was NOT checked (the voice has not been heard by the builder; sample 5-6 lines against the picture; the whole film was not watched end to end); which terms and numbers the owner should listen for (amounts, names, acronyms, anything pronounced in a non-obvious way); open choices (thumbnail A or B, title). Never claim "perfect sync", only the measurements.

## Frame checks that caught real bugs
- A label covering the hero object on a thumbnail (looked fine in code).
- Devanagari text rendering in a serif fallback (font stack bug), a missing rupee sign, clipped captions on long lines.
- Texts vanishing before they can be read after the voice got faster.
Check these three on every film.

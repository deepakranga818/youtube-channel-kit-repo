# Learnings log (append-only)

Add a dated entry after every film or every time something new was learned: what surprised us, what broke, the fix, and where the fix now lives (file/doc). Keep entries short. When a learning is general, also update the matching playbook (PITFALLS, VOICE_AND_SUBTITLES, ...) and, if the template changed, the template. To share an improvement: commit it on a branch (only `studio/`, `.claude/`, `CLAUDE.md`), re-run `sh studio/tools/make-master-prompt.sh`, and tell the owner they can push the branch / open a pull request upstream; `git pull` brings in others' improvements.

Format:  `## YYYY-MM-DD  <film or topic>`  then bullets `- what / why / fix (file)`.

## 2026-11-20 to 11-23  credit-cards explainer (ExplainEveryday): Sketchnote, Euclid, Mid-century
- Built three films and extracted two templates (`sketchnote`, `midcentury-toon`); standing rules set by the owner (no music, English on screen, EN-over-Devanagari subtitles, boy host, male voice) became channel defaults.
- Fonts: Devanagari as separate `Deva*` families in canvas font stacks; never unicode-range split; rupee sign needs a fallback (FONTS_AND_TEXT.md).
- Voice: edge-tts `hi-IN-MadhurNeural` for Hindi; the owner later supplied a 4-part recording. Long-form ASR garbled Hindi; per-utterance recognition + consonant-skeleton matching aligned all 105 chunks; a faster speaker needed `fitT` (VOICE_AND_SUBTITLES.md).
- Timing: real pauses kept, 0.7 s minimum around a scene change; film shrank from 8:54 (synthetic) to 7:21 (recorded).
- Thumbnails: the first design covered the hero object with a strap; the hero object now has its own clear zone (YOUTUBE.md).
- Packaging: wrote the channel kit (this folder) so a new niche starts with all of this; generalised both templates (`brand.js`, `keyChunk`, `EXTRA`, project-relative ASR tools, poster from `timeline.json`).
- Kit verification (2026-11-23): the kit was copied to a clean folder; `setup.sh` check, the TODO refusal and `new-video.sh` worked; a full `build.sh` of both stub templates produced a film (Mid-century 23.6 s, Sketchnote 14.2 s, both about -14 LUFS / -1.6 dBFS); the recording tools (`segment_asr`, `align`, `cut_chunks`, `timeline`) recovered 6 chunks and their 0.8 s pauses from a synthetic test recording; `chapters.py` and `audio_sync_check.py` reproduced the credit film's real chapters and passed on its real audio. Not tested: building the ASR env from scratch (`setup.sh asr`) and a library install on a clean PC (`setup.sh lib`).
- Not done / never verified: no one on the build side has heard any voice; VoiceStudio not tried; Sketchnote has no supplied-recording timeline; the Euclid film still has Devanagari on-screen text.

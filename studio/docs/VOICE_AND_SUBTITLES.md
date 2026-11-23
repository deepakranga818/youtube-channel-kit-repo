# Voice and subtitles

## Voices (`studio/shared/voices.json`)
| key | voice | use |
|---|---|---|
| `hi-deva` | `hi-IN-MadhurNeural`, rate -4% | male Hindi voice reading **Devanagari** text; write amounts as words in the spoken text |
| `hinglish` | `en-IN-PrabhatNeural`, rate -4% | male English-India voice reading Roman Hinglish; recognition is only approximate |
| `en` | `en-US-GuyNeural`, rate 0% | English; list all voices with `python -m edge_tts --list-voices` (library venv) |
Add a key per channel voice. edge-tts needs internet (Microsoft's online service) and is synthetic speech: say so in `CREDITS` and tell the owner about YouTube's altered/synthetic-content question.

Command (what `build.sh` runs): `SSL_CERT_FILE=$(python -c 'import certifi;print(certifi.where())') python $LIB/core/tts/tts_zh.py vo/lines.json vo --voice <voice> --rate <rate>`. It reads each line's `say` field if present (what is spoken) else `text`, and writes `vo/<id>.wav`, `vo/dur.json`. About 3.4 s per chunk.

## Script text rules
- `text` = what the caption shows in the narration language; `say` = what the voice reads: amounts as words (`₹10,000` -> "ten thousand rupees"), `%` -> "percent", abbreviations spaced (`MDR` -> "M D R"), dashes and ellipses -> commas. Keep the `say()` function in `lines_src.py` and extend it for new terms; pronunciation fixes live there.
- Hindi films: narration text in Devanagari, plus a Roman Hinglish `hi` line and an English `en` line per chunk (`hinglish_src.py`). Colloquial everyday words beat Sanskritised ones; the English loan words people actually say (card, bank, interest) stay as they are in Devanagari spelling.
- Hindi/other-language wording is the builder's translation unless the owner supplied it. Write `HINDI_REVIEW.md`-style notes (terms chosen, risky phrases) and offer a review; apply the owner's edits to both the voice text and the captions.
- Keep each caption line under about 92 characters.

## Subtitles
- Burned-in caption card: English on top (big), narration-language script below (smaller). Soft subtitles: `subtitles_en-hindi.srt` (both lines per cue), `subtitles_english.srt`, `subtitles_hindi.srt` for YouTube upload.
- A cue lasts: from 0.05 s before the voice to voice end + 0.6 s, at least 1.8 s and chars/12 + 1 s, never into the next cue (`timeline.py`).
- English-only film: set `SECOND_LINE = False` in `lines_src.py` (Mid-century). `vo/lines.json` then has `dv: ''`, the caption card becomes one line and the `.srt` carries the English line only. Record it as `subtitles_bottom: none` in `channel.json`.
- Never letter-space Devanagari; give it its own font family (FONTS_AND_TEXT.md).

## Mouth
`mouth.json` = voice loudness per 1/12 s per chunk (0..1), drawn on twos so the host's mouth follows the voice. Silent chunks keep a closed mouth.

## Using a supplied recording (worked example: the credit-card film, 4 parts, 105 chunks)
The owner records the approved script in 3-5 parts (`Voice Script/part1.mp3 ...`, any order of chunks as in the script) and sends the Roman script per part.
1. Tools: `sh studio/tools/setup.sh asr` (or `link-asr <dir>`) once. The ASR env is Python 3.12 + faster-whisper 1.2.1 + Whisper `small` (about 0.7x real time on CPU; a 9-minute recording takes 6-7 minutes). It must NOT be the library's Python 3.15 env: `tokenizers` has no wheel there.
2. In the project: list which chunk ids each part covers in `tools/parts.json`, e.g. `[["part1","h1","p13"],["part2","f1","i11"]]`.
3. `$ASR_PY tools/segment_asr.py [--lang hi|en]`: splits each part at pauses (an utterance ends after a 0.20 s pause, threshold = 95th percentile level minus 30 dB, floor -52 dB), recognises every utterance separately with word times -> `out/asr/seg_<part>.json`. Recognising a 2-minute stream in one go garbled the Hindi in two of the four parts: always per utterance.
4. Library python: `python tools/align.py` matches words to chunks (consonant-skeleton matching of the Roman script against the recogniser's Devanagari or Roman words, dynamic programme over the word stream with a pause bonus and a duration term) -> `out/align.json`; it prints weak matches: check those chunks by ear/waveform.
5. `python tools/cut_chunks.py`: a chunk starts at its first word (snapped to the utterance start when close) and ends at the last speech before the next chunk; cuts tight 24 kHz wavs `vo/<id>.wav` (50 ms in, 80 ms out padding, 6 ms fades), writes `vo/dur.json`, `vo/gaps.json` (the speaker's real pause before each chunk, null at a part start), `out/cuts.json`; moves the synthetic voice to `vo_synthetic/`.
6. `python timeline.py` now keeps the speaker's pauses: inside a scene `t += max(gap, 0.12)`; first chunk of a scene `t += max(gap, 0.7)` and the scene starts 0.3 s before its voice (L-cut).
7. Rebuild: events, `tools/holds.py` (a faster speaker shortens scenes: `fitT` pops texts earlier; the credit film had 15 short holds before that fix, 0 after), render, mix, mux. Voice is levelled to a fixed RMS in `mix.py`.
8. Verify with the audio check in QA_GATES.md (speech inside each chunk window, pauses quiet), update chapters/SRT/listing times (they all come from `timeline.json`).
Only the recogniser's word TIMES are used; its Hindi spelling is approximate. The builder still has not heard the voice: say so.

## Other voice options (decided)
- **VoiceStudio** (github.com/debpalash/voicestudio): evaluated on paper, not installed. Default OmniVoice weights are CC-BY-NC (not safe for a monetised channel); would need a licence check per voice model. Revisit only if the owner wants cloned/studio voices.
- Kokoro offline TTS (`core/tts/tts.py`, library voice tier + a model download) exists; we have not tried it for Hindi. edge-tts is the default.

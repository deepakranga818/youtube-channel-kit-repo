# Sound

## Channel default (ExplainEveryday): **no background music**
Voice + sound effects only (foley, whooshes, stamps, pen sounds, a ding for the number that lands, a very quiet room tone). The owner removed music from every film (Sketchnote, Euclid, Mid-century). A new channel may want music: it is a channel decision in `channel/CHANNEL.md`; if yes, see "Adding music".

## How the effects are made (no samples, no downloads)
The page emits events while it is collected: `ev(t, type, {gain, pan, dur})` in `kit.js` for the scenes (`pop`, `stamp`, `whoosh`, `paper_swish`, `slide`, `ding`, `iris`) and cues (`lock`, `end`, optionally `fee`, `silence`). `events.mjs` exports them to `events.json`; `mix.py` synthesises each type with `$LIB/core/audio/sfx.py` helpers (`env_exp bp lp hp norm brown clack whoosh ding add compress limit`):
- stamp: 140 Hz thump falling plus a paper smack; pop: 880 Hz + 1760 Hz pip (pops closer than 0.12 s are skipped); paper_swish: band-passed noise 1.8-8 kHz; slide; iris: noise sweep; ding: bell 1568/2349/3136 Hz.
- Pan comes from the x position (`panOf(x)`); gains: stamp .55, pop .10, whoosh .2, paper_swish .28, ding .35, iris .22.
- Room tone: brown noise low-passed at 900 Hz at amplitude 0.016, slightly decorrelated per channel. A held breath: foley muted 0.35 s before the key number (`cue 'fee'`), room tone only before the lockup (`cue 'lock'`).

## Voice level and mastering
- Voice: high-passed at 80 Hz, normalised, compressed (thr .22, ratio 3), then set to a **fixed RMS of 0.10** while speaking (about -20 dB); effects keep their own gains, so they sit around -40 dB under speech. Sketchnote keeps the voice about 5 dB over the pen foley; Euclid used voice .55 + fx. Final limiter + 0.25 s fade-out.
- `core/render/mux.sh video.mp4 mix.wav out.mp4 [fps=24] [grain=2]` masters: two-pass loudnorm to **-14 LUFS**, true peak under **-1 dBTP** (4x oversampled limiter at -1.6 dBFS, re-encodes the audio with a lower ceiling if AAC still peaks). Results on delivered films: -14.0 to -14.4 LUFS, peak -1.5 dBFS. `grain` is film grain (Mid-century used 4, Sketchnote 1, pixel/vector styles 0).
- Check with `python tools/audio_sync_check.py` (speech inside each chunk window, quiet pauses) and `ffmpeg -i film.mp4 -af ebur128=peak=true -f null -` (QA_GATES.md).

## Adding music (only if the channel wants it)
The library has `core/audio/sampler.py` (CC0 sample libraries: marimba, glockenspiel, vibraphone, harp, pizzicato cellos, kalimba; fetched on demand) and `pluck.py`. What the first Mid-century treatment planned: a vibraphone chord per lesson reused in the lockup, half/double time at the payoff, silence before the key number, music ducked 8 dB under voice. Free-licence tracks from a site like freetouse.com need their credit line in `CREDITS` and in the description if the licence says so.

## Rules
- Sound follows the picture's grammar: at a lesson change the stamp lands one beat before the new scene starts, under the closing iris, and the whoosh half a beat later; inside a lesson a paper swish marks the colour wipe.
- Synthetic voice and recordings sound different in level: always level to a fixed RMS, never to peak.
- Nobody on the build side has heard the voice. The delivery note must list the numbers and terms the owner should listen for.

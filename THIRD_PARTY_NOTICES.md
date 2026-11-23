# Third-party notices

This repository's own files are MIT (see `LICENSE`). The following third-party material is included or used, with its own terms.

## Lemo-Opuscar (MIT)
Source: https://github.com/lemomo-ai/lemo-opuscar, Copyright (c) 2026 Lemomo (LemoLab). Its code is MIT licensed; its Markdown docs and image prompts are CC BY-NC 4.0 and are **not** included here; third-party assets inside its demos keep their own terms and are **not** included.

Included from it (MIT):
- `studio/templates/midcentury-toon/engine/toon.js`, `chars.js`, `icons.js` (copied from the library's Mid-century Cartoon demo; this repo's `host.js`, `icons2.js`, `film.js`, `kit.js` and the scenes are original work built on them).
- `studio/tools/lemo-setup.sh` (vendored copy of the library skill's `scripts/setup.sh`).
- The idea and file layout of the Scale Zoom Explainer film in `studio/references/euclid-scale-zoom/` (source code only; see its `CREDITS`).

The library itself (renderer, text-to-speech wrapper, sound helpers, 99 styles) is downloaded by `sh studio/tools/setup.sh lib` at install time and is not part of this repository.

```
MIT License

Copyright (c) 2026 Lemomo (LemoLab)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
USE OR OTHER DEALINGS IN THE SOFTWARE.
```

## Fonts (SIL Open Font License 1.1)
The full licence text of each font is saved next to it in `studio/templates/*/fonts/OFL-*.txt`.
- Kalam, Copyright (c) 2014 Indian Type Foundry (`Kalam-Bold.ttf` is included)
- Patrick Hand, Copyright (c) 2010-2012 Patrick Wagesreiter (`PatrickHand-Regular.ttf` is included)
- ZCOOL KuaiLe, Copyright 2018 The ZCOOL KuaiLe Project Authors (licence text only)
- Oleo Script, Copyright (c) 2012 Soytutype; Alfa Slab One, Copyright 2016 The Alfa Slab One Project Authors; Jost, Copyright 2020 The Jost Project Authors; Poppins (Indian Type Foundry) and Rozha One (Indian Type Foundry): downloaded from https://github.com/google/fonts by `tools/fonts.sh` when a film is built, not included.

## Installed or used at run time (not included)
- faster-whisper and OpenAI Whisper (MIT): only used to find word times when you supply a voice recording.
- edge-tts: a client for Microsoft Edge's online neural text-to-speech service; the service's own terms apply to the voices it returns (synthetic speech; check the current terms before a monetised launch).
- Playwright / headless Chromium, ffmpeg, Node.js, Python packages (numpy, scipy, soundfile, soxr, pillow, fonttools, certifi): installed from their own sources under their own licences.

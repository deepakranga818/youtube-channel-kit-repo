// brand.js: THE CHANNEL + TITLE-CARD TEXT FOR THIS FILM (topic file). Everything on screen is English; Devanagari only in the caption's second line.
// Worked example (7 lessons, "How a bank earns from a credit card"): example/brand.js
export const BRAND = {
  channel: 'Your Channel',                 // end card name + thumbnail corner tag
  tagline: 'Your tagline here.',           // end card line
  kicker: 'How this thing works',          // lockup headline (one line, about 40 characters)
  cta: 'Subscribe to Your Channel',        // lockup button
  lessons: ['First idea', 'Last idea'],    // 1 to 7 numbered lessons; scenes.py uses 1..N (hook = 0). Titles about 30 characters.
  keyChunk: null,                          // id of the chunk where THE number/idea lands (a held breath before it + the ding): set e.g. 'f2'; null = no such moment
  lockIcons: ['bulb', 'check'],           // one icon name (engine/icons.js or icons2.js) per lesson, shown on the lockup medallions
  lockNames: ['First', 'Last'],            // short label under each medallion
  thumb: {                                 // thumbnail text; variant a = ?test=thumb&v=a, b = v=b
    a: { l1: 'BIG', l2: 'WORDS', strap: 'one short promise', badge: '1', icon: 'bulb' },
    b: { l1: 'ANOTHER', l2: 'ANGLE?', strap: 'a different hook', badge: '2', icon: 'bulb' },
  },
};

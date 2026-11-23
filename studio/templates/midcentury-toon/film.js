// film.js: the renderer. Scenes come from scenes_a.js / scenes_b.js (one pure function each); this file owns the timeline lookups, the transitions
// (medallion iris at every lesson change, colour-block wipe inside a lesson), the caption card, the lockup and the end card, and the sound events.
import { PAL, setClock, shape, ink, ellipse, rect, rrect, star, sparkle, text, fit, measure, paperFinish, clamp, lerp, seg, ss, eo, eio, back, twos, TAU } from './engine/toon.js';
import { K, W, H, BEAT, BAR, GROUND, ACC, T, ev, pop, tint, shade, stage, sunburst, slab, body, kick, icon, medal, banner, host, LESSONS, NL, lessonHeader, panOf } from './kit.js';
import { BRAND } from './brand.js';
import * as A from './scenes_a.js';
import * as B from './scenes_b.js';

const SCENE = { ...A, ...B };
const placeholder = (g, t, s) => { stage(g, GROUND[s.ground] || PAL.paper); body(g, s.id, 960, 540, 60); };
let SC = [];
export function setup(tl, mouth) {
  K.TL = tl; K.MOUTH = mouth; SC = tl.scenes;
  K.EVS = []; K.COLLECT = true;
  const cg = new OffscreenCanvas(64, 64).getContext('2d');
  SC.forEach((s, i) => {
    if (s.id === 'lockup' || s.id === 'end') return;
    K.CUR_START = s.t0; K.CUR_END = s.t1; try { (SCENE[s.id] || placeholder)(cg, s.t1 - 0.01, s); } catch (e) { console.error('collect', s.id, e); }
    if (i > 0) { const pv = SC[i - 1]; if (pv.lesson !== s.lesson && s.lesson >= 1) { ev(s.t0 - BEAT, 'stamp', { gain: 0.9 }); ev(s.t0 - BEAT * 0.5, 'whoosh', { dur: 0.4 }); } else ev(s.t0, 'paper_swish', { gain: 0.6 }); }
  });
  const lk = SC.find(s => s.id === 'lockup'), en = SC.find(s => s.id === 'end');
  ev(lk.t0, 'paper_swish', { gain: 0.6 }); for (let i = 0; i < NL; i++) ev(lk.t0 + 0.3 + i * BEAT * 0.75, 'stamp', { gain: 0.8, n: i });
  ev(lk.t0 + 0.3 + BEAT * (NL * 0.75 + 0.05), 'pop', { gain: 0.5 }); ev(en.t0, 'iris', { dur: BEAT * 1.2 }); ev(en.t0 + BEAT * 1.6, 'pop', { gain: 0.5 });
  K.COLLECT = false;
  K.EVS = K.EVS.filter(e => e.t > 0.05 && e.t < tl.dur).sort((a, b) => a.t - b.t);
  const cue = (name, t) => K.EVS.push({ t: +t.toFixed(4), type: 'cue', name });
  cue('lock', lk.t0); cue('end', en.t0);
  const kc = BRAND.keyChunk && tl.start[BRAND.keyChunk]; if (kc) { cue('fee', kc + 1.6); cue('silence', kc + 0.9); }      // the key number lands: mix.py holds a breath before it
}
export const DUR = () => K.TL.dur;
export const events = () => K.EVS;
export function srtCues() { return K.TL.lines.map(l => ({ t0: l.c0, t1: l.c1, text: l.dv ? l.en + '\n' + l.dv : l.en })); }
const sceneAt = t => { const S = SC; let i = S.length - 1; while (i > 0 && t < S[i].t0) i--; return i; };

// ---------- caption card: English line (big) over the narration-language line (small, Devanagari for Hindi) ----------
function caption(g, t) {
  const L = K.TL.lines.find(l => t >= l.c0 && t < l.c1); if (!L) return;
  const a = Math.min(clamp((t - L.c0) / 0.16), clamp((L.c1 - t) / 0.16)), maxW = 1620;
  const two = !!L.dv, f1 = fit(g, L.en, '600 {px}px Jost, Deva', 40, maxW, 1, 24), f2 = two ? fit(g, L.dv, '500 {px}px Deva', 31, maxW, 1, 24) : null;   // one-line card for an English-only film (dv = '')
  const w = Math.max(measure(g, f1.lines[0], f1.font), two ? measure(g, f2.lines[0], f2.font) : 0) + 150, h = two ? 128 : 84, x = W / 2 - w / 2, y = H - 26 - h;
  g.save(); g.globalAlpha = a; g.translate(0, (1 - a) * 10);
  shape(g, rrect(x, y, w, h, 14), { fill: PAL.paper, line: 3.2, seed: 901, grain: 0.15, breaks: 0.08, off: [5, 5] });
  star(g, x + 34, y + h / 2, 15, { n: 8, inner: 0.4, fill: ACC, off: [0, 0], rot: t * 0.8 }); star(g, x + w - 34, y + h / 2, 15, { n: 8, inner: 0.4, fill: ACC, off: [0, 0], rot: -t * 0.8 });
  text(g, f1.lines[0], W / 2, y + 56, { font: f1.font, fill: PAL.ink, align: 'center' });
  if (two) text(g, f2.lines[0], W / 2, y + 102, { font: f2.font, fill: PAL.inkSoft, align: 'center' });
  g.restore();
}

// ---------- lockup (the frame to screenshot) and end card ----------
const LOCK_ICONS = BRAND.lockIcons, LOCK_NAMES = BRAND.lockNames;
const LOCK_COL = [PAL.blue, PAL.coral, PAL.avocado, PAL.plum, PAL.kraft, PAL.pink, PAL.mustard];     // one per lesson, 7 at most
function lockup(g, t, s) {
  stage(g, PAL.paper, { floorY: 980 });
  const b = x => s.t0 + x * BEAT;
  const kt = pop(t, b(0.2), 0.3);
  if (kt > 0) { g.save(); g.translate(W / 2, 200); g.scale(kt, kt); g.translate(-W / 2, -200); kick(g, BRAND.kicker, W / 2, 150, 58, ACC, { maxW: 1500 }); slab(g, `${NL} LESSON${NL > 1 ? 'S' : ''}, 1 PICTURE`, W / 2, 238, 52, { plate: PAL.mustard }); g.restore(); }
  const R = 84, span = 1560, cy = 520;
  for (let i = 0; i < NL; i++) {
    const cx = W / 2 - span / 2 + span * (i + 0.5) / NL, t0 = s.t0 + 0.3 + i * BEAT * 0.75, k = pop(t, t0, 0.26); if (k <= 0) continue;
    g.save(); g.translate(cx, cy); g.scale(k, k);
    star(g, 0, 0, R * 1.18, { n: 16, inner: 0.84, fill: PAL.white, off: [0, 0], rot: i * 0.2, grain: 0.1 });
    shape(g, ellipse(0, 0, R, R, 64), { fill: LOCK_COL[i], line: 4.5, seed: 300 + i, grain: 0.35 });
    icon(g, LOCK_ICONS[i], 0, 6, R * 1.15, { main: i === 0 ? PAL.avocadoD : PAL.tealD, light: PAL.white, dark: PAL.ink });
    shape(g, ellipse(-R * 0.74, -R * 0.74, R * 0.3, R * 0.3, 30), { fill: PAL.ink, line: 0, seed: 310 + i, grain: 0.1, off: [0, 0] });
    text(g, String(i + 1), -R * 0.74, -R * 0.74 + R * 0.14, { font: `${Math.round(R * 0.4)}px Slab, DevaSlab`, fill: PAL.paper, align: 'center' });
    g.restore();
    g.save(); g.globalAlpha = clamp(k); body(g, LOCK_NAMES[i], cx, cy + R + 56, 29, { w: 600, maxW: 190 }); g.restore();
  }
  const cta = NL * 0.75 + 0.25, kb = pop(t, b(cta), 0.3);
  if (kb > 0) { g.save(); g.translate(W / 2, 800); g.scale(kb, kb); shape(g, rrect(-330, -38, 660, 76, 38), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0.1 }); text(g, BRAND.cta, 0, 12, { font: '600 33px Jost, Deva', fill: PAL.paper, align: 'center', maxW: 620 }); g.restore(); }
  const kh = pop(t, b(cta), 0.3); if (kh > 0) { g.save(); g.globalAlpha = clamp(kh); host(g, t, 1830, 1010, 0.55, [[s.t0, 'wave', 'wink']], { dir: -1, silent: true }); g.restore(); }
  return { focus: [W / 2 - span / 2 + span * (NL - 0.5) / NL, cy] };
}
function endCard(g, t, s) {
  const b = x => s.t0 + x * BEAT, lk = SC.find(x => x.id === 'lockup');
  const close = eio(seg(t, s.t0, b(1.2)));
  if (close < 1) {
    const f = lockup(g, lk.t1 - 1e-3, lk).focus, r = lerp(2300, 70, close);
    g.save(); g.fillStyle = PAL.ink; g.beginPath(); g.rect(-10, -10, W + 20, H + 20); g.arc(f[0], f[1], r, 0, TAU, true); g.fill(); g.restore();
    ink(g, ellipse(f[0], f[1], r, r, 80), 5, { closed: true, color: PAL.paper, seed: 950 });
    return;
  }
  g.fillStyle = PAL.ink; g.fillRect(-10, -10, W + 20, H + 20);
  const k = back(seg(t, b(1.5), b(2.3)), 1.4), R = 440 * k; if (R <= 1) return;
  shape(g, ellipse(W / 2, H / 2, R, R, 90), { fill: PAL.paper, line: 0, grain: 0.2, off: [0, 0] });
  ink(g, ellipse(W / 2, H / 2, R + 18, R + 18, 90), 4, { closed: true, color: PAL.paper, seed: 951, breaks: 0.3 });
  const ka = seg(t, b(2.2), b(2.8)); g.save(); g.globalAlpha = ka;
  icon(g, 'bulb', W / 2, 360, 190, { main: PAL.mustard, light: PAL.white, dark: PAL.mustardD });
  text(g, BRAND.channel, W / 2, 560, { font: '700 100px Oleo, DevaScript', fill: PAL.ink, plate: PAL.mustard, off: [5, 4], align: 'center', maxW: 760 });
  ink(g, [[W / 2 - 170, 600], [W / 2 + 170, 600]], 3, { seed: 952, breaks: 0.2 });
  text(g, BRAND.tagline, W / 2, 664, { font: '500 34px Jost, Deva', fill: PAL.ink, align: 'center' });
  g.restore();
}

// ---------- renderer + transitions ----------
function drawSection(g, t, s) {
  if (s.id === 'lockup') return lockup(g, t, s);
  if (s.id === 'end') return endCard(g, t, s);
  g.save();
  K.CUR_START = s.t0; K.CUR_END = s.t1;
  const u = clamp((t - s.t0) / (s.t1 - s.t0)), z = 1 + 0.035 * ss(u);
  g.translate(W / 2, 520); g.scale(z, z); g.translate(-W / 2, -520);
  (SCENE[s.id] || placeholder)(g, Math.max(t, s.t0 + 1e-3), s);
  g.restore();
  lessonHeader(g, Math.max(t, s.t0 + 1e-3), s);
}
export function renderFilm(g, t, Q) {
  setClock(t);
  const i = sceneAt(t), s = SC[i], nx = SC[i + 1], pv = SC[i - 1];
  const irisIn = x => x && pv_(x) && x.lesson >= 1 && x.lesson <= NL && SC[SC.indexOf(x) - 1].lesson !== x.lesson;
  const pv_ = x => SC.indexOf(x) > 0;
  g.save();
  const irisNext = nx && irisIn(nx) && t >= nx.t0 - BEAT * 0.5 ? nx : null, irisCur = irisIn(s) && t < s.t0 + BEAT * 0.4 ? s : null;
  const inc = irisNext || irisCur;
  if (inc) {
    const prev = SC[SC.indexOf(inc) - 1], k = eio(seg(t, inc.t0 - BEAT * 0.5, inc.t0 + BEAT * 0.4));
    drawSection(g, Math.min(t, inc.t0 - 1e-3), prev);
    const cx = W / 2, cy = H / 2 - 40, r = lerp(104, 1250, k * k);
    g.save(); g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.clip(); drawSection(g, Math.max(t, inc.t0 + 1e-3), inc); g.restore();
    ink(g, ellipse(cx, cy, r, r, 90), 7, { closed: true, seed: 960 });
    if (k < 0.5) { g.save(); g.globalAlpha = 1 - k * 2; g.translate(cx, cy); g.scale(1 + k * 3, 1 + k * 3); text(g, String(inc.lesson), 0, 104 * 0.38, { font: '114px Slab, DevaSlab', fill: PAL.ink, plate: PAL.white, off: [5, 5], align: 'center' }); g.restore(); }
  } else if (i > 0 && t < s.t0 + 0.3 && s.id !== 'end') {
    const d = s.id === 'lockup' ? 0.25 : 0.3, k = eio(seg(t, s.t0, s.t0 + d)), up = s.id === 'lockup' || i % 2 === 0;
    drawSection(g, s.t0 - 1e-3, pv);
    g.save(); g.beginPath(); if (up) g.rect(0, H * (1 - k), W, H); else g.rect(W * (1 - k), 0, W, H); g.clip(); drawSection(g, t, s); g.restore();
    if (up) ink(g, [[-10, H * (1 - k)], [W + 10, H * (1 - k)]], 6, { seed: 963 }); else ink(g, [[W * (1 - k), -10], [W * (1 - k), H + 10]], 6, { seed: 962 });
  } else drawSection(g, t, s);
  g.restore();
  paperFinish(g, W, H, 1);
  if (!(Q && Q.has('nosubs'))) caption(g, t);
}

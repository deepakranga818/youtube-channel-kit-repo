// kit.js: shared state and liftable helpers for the scenes (stage, lesson header, tag, callout, medallion, stamp, host with pose keys).
// On-screen text is English (Alfa Slab One 'Slab' for titles, Jost for body, Oleo Script for kickers); Devanagari appears only in the caption's second line
// ('Deva' / 'DevaSlab' / 'DevaScript' families, used as the fallback in a font stack). Fonts are registered in fonts/fonts.css.
// NEVER pass `track` for Devanagari text: letter-spacing breaks the conjuncts. Lesson titles and counts come from brand.js.
import { PAL, shape, plane, ink, rays, ellipse, rect, rrect, spline, star, sparkle, text, fit, measure, arrow, dashed, clamp, lerp, seg, ss, eo, eio, back, twos, TAU, hash, starPts } from './engine/toon.js';
import { drawHost, POSE, HC } from './engine/host.js';
import { icon } from './engine/icons2.js';
import { BRAND } from './brand.js';
export { starPts, PAL, shape, plane, ink, rays, ellipse, rect, rrect, spline, star, sparkle, text, fit, measure, arrow, dashed, clamp, lerp, seg, ss, eo, eio, back, twos, TAU, hash, icon, drawHost, POSE, HC };

export const W = 1920, H = 1080, BPM = 132, BEAT = 60 / BPM, BAR = BEAT * 4;
export const K = { TL: null, MOUTH: null, EVS: [], COLLECT: false, CUR_END: 0, CUR_START: 0 };
// reading time: a text must stay up max(1.8 s, chars/12 + 1 s) before its scene ends; if the recording is faster than the scene was written for, pop it earlier (never before 0.3 s into the scene)
export const fitT = (t0, str) => { const need = Math.max(1.8, String(str).length / 12 + 1.0) + 0.05, lim = K.CUR_END - need; return (K.CUR_END && t0 > lim) ? Math.max(lim, K.CUR_START + 0.3) : t0; };
export const T = id => K.TL.start[id], DN = id => K.TL.len[id];
export const txt = (t0, str) => { if (K.COLLECT && t0 > 0) K.EVS.push({ t: +t0.toFixed(3), type: 'txt', s: str, until: +K.CUR_END.toFixed(3) }); };
export const ev = (t, type, o = {}) => { if (K.COLLECT && t > 0) K.EVS.push({ t: +t.toFixed(4), type, ...o }); };
export const GROUND = { mustard: '#E8B43A', blue: '#7F9CC0', coral: '#E98A6C', avocado: '#A7AE5B', plum: '#8A6487', sand: '#D9B77E', pink: '#F0B4A8', paper: PAL.paper, ink: PAL.ink };
export const CARD = PAL.teal, CARDD = PAL.tealD, ACC = PAL.coral;           // the hero object keeps one colour through the film (teal); coral is the accent
const hx = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
const mixc = (a, b, k) => { const A = hx(a), B = hx(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); };
export const tint = (c, k) => mixc(c, '#FFFFFF', k), shade = (c, k) => mixc(c, '#2B2420', k);
export const pop = (t, t0, d = 0.28) => back(seg(t, t0, t0 + d), 1.9);
export const panOf = x => +clamp((x / W) * 2 - 1, -1, 1).toFixed(2);

// ---------- stage: one ground colour, a floor band, a broken horizon line ----------
export function stage(g, col, o = {}) {
  g.fillStyle = col; g.fillRect(-300, -300, W + 600, H + 600);
  const fy = o.floorY ?? 800;
  plane(g, rect(-300, fy, W + 600, H + 400), shade(col, 0.16), { grain: 0.3 });
  ink(g, [[60, fy], [W - 60, fy + 2]], 4, { breaks: 0.35, seed: 801, taper: true });
}
export function sunburst(g, x, y, r, col, t, a = 0.5) { rays(g, x, y, 30, r, tint(col, 0.35), { rot: t * 0.05, alpha: a }); }

// ---------- lettering ----------
export const slab = (g, s, x, y, px, o = {}) => text(g, s, x, y, { font: `${px}px Slab, DevaSlab`, fill: PAL.ink, plate: o.plate ?? PAL.white, off: o.off || [4, 4], align: o.align || 'center', rot: o.rot || 0, maxW: o.maxW || 0, alpha: o.alpha ?? 1, fill: o.fill || PAL.ink });
export const body = (g, s, x, y, px, o = {}) => text(g, s, x, y, { font: `${o.w || 500} ${px}px Jost, Deva`, fill: o.fill || PAL.ink, align: o.align || 'center', maxW: o.maxW || 0, alpha: o.alpha ?? 1, rot: o.rot || 0 });
export const kick = (g, s, x, y, px, col, o = {}) => text(g, s, x, y, { font: `700 ${px}px Oleo, DevaScript`, fill: col, plate: o.plate || null, off: o.off || [4, 3], align: o.align || 'center', rot: o.rot ?? -0.03, maxW: o.maxW || 0, alpha: o.alpha ?? 1 });

// ---------- parts ----------
// detail tag: paper card, accent star, pops on its beat. Returns its box.
export function tag(g, t, t0, str, x, y, o = {}) {
  t0 = fitT(t0, str);
  ev(t0, 'pop', { pan: panOf(x) }); txt(t0, str);
  const k = pop(t, t0); if (k <= 0) return null;
  const f = fit(g, str, `500 {px}px Jost, Deva`, o.px || 34, o.maxW || 560, o.lines || 2, 22);
  const w = Math.max(...f.lines.map(l => measure(g, l, f.font))) + 92, h = 28 + f.lines.length * f.px * 1.4;
  const X = o.align === 'right' ? x - w : o.align === 'center' ? x - w / 2 : x;
  g.save(); g.translate(X + w / 2, y + h / 2); g.scale(k, k); g.translate(-(X + w / 2), -(y + h / 2));
  shape(g, rrect(X, y, w, h, 14), { fill: o.fill || PAL.paper, line: 3.4, seed: 710 + (o.seed || 0), grain: 0.15, off: [6, 5] });
  star(g, X + 36, y + h / 2, 16, { n: 8, inner: 0.42, fill: o.star || ACC, off: [0, 0], rot: t * 0.6 });
  f.lines.forEach((l, i) => body(g, l, X + 62, y + 14 + f.px * 1.0 + i * f.px * 1.4, f.px, { align: 'left', fill: o.ink || PAL.ink }));
  g.restore();
  return { x: X, y, w, h };
}
// big paper card with an icon and a label (a player, a charge, a rule)
export function iconCard(g, t, t0, name, label, x, y, o = {}) {
  t0 = fitT(t0, label);
  ev(t0, 'pop', { pan: panOf(x) }); txt(t0, label);
  const k = pop(t, t0); if (k <= 0) return null;
  const w = o.w || 300, h = o.h || 300, X = x - w / 2, Y = y - h / 2;
  g.save(); g.translate(x, y); g.scale(k, k); g.translate(-x, -y);
  shape(g, rrect(X, Y, w, h, 22), { fill: o.fill || PAL.paper, line: 4, seed: 720 + (o.seed || 0), grain: 0.2, off: [7, 6] });
  icon(g, name, x, Y + (o.iy ?? h * 0.4), (o.size || h * 0.56), { main: o.main || CARD, dark: o.dark || CARDD, light: PAL.white });
  const f = fit(g, label, `600 {px}px Jost, Deva`, o.px || 30, w - 30, 2, 22);
  f.lines.forEach((l, i) => body(g, l, x, Y + h - 22 - (f.lines.length - 1 - i) * f.px * 1.35, f.px, { w: 600 }));
  if (o.sub) { const sf = fit(g, o.sub, `400 {px}px Jost, Deva`, 24, w - 30, 2, 18); sf.lines.forEach((l, i) => body(g, l, x, Y + h + 34 + i * 30, sf.px, { w: 400, fill: PAL.inkSoft })); }
  g.restore();
  return { x: X, y: Y, w, h };
}
// the round detail circle (the manual's magnifier)
export function callout(g, t, t0, cx, cy, r, inner, bgc, leader) {
  ev(t0, 'pop', { pan: panOf(cx) });
  const k = back(seg(t, t0, t0 + 0.32), 1.5); if (k <= 0) return;
  const R = r * k;
  if (leader) { const a = Math.atan2(leader[1] - cy, leader[0] - cx); dashed(g, [[cx + Math.cos(a) * (R + 14), cy + Math.sin(a) * (R + 14)], leader], 4, 14, 10, -t * 40, PAL.ink, clamp(k)); shape(g, ellipse(leader[0], leader[1], 9, 9, 12), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 }); }
  shape(g, ellipse(cx, cy, R + 16, R + 16, 72), { fill: PAL.paper, line: 4.5, seed: 730, grain: 0.15, breaks: 0.05 });
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.clip(); g.fillStyle = bgc; g.fillRect(cx - R, cy - R, 2 * R, 2 * R); g.translate(cx, cy); g.scale(k, k); inner(g); g.restore();
  ink(g, ellipse(cx, cy, R, R, 72), 4, { closed: true, seed: 731, breaks: 0.1 });
}
// numbered medallion (a door and a hierarchy marker)
export function medal(g, t, t0, x, y, n, col, r = 62, o = {}) {
  ev(t0, 'stamp', { pan: panOf(x), gain: o.gain ?? 0.7 });
  const k = pop(t, t0, 0.24); if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k); g.rotate((1 - k) * 0.4);
  star(g, 0, 0, r * 1.2, { n: 16, inner: 0.84, fill: PAL.white, off: [0, 0], rot: n * 0.2 });
  shape(g, ellipse(0, 0, r, r, 64), { fill: col, line: 5, seed: 740 + n, grain: 0.3 });
  text(g, String(n), 0, r * 0.38, { font: `${Math.round(r * 1.1)}px Slab, DevaSlab`, fill: PAL.ink, plate: PAL.white, off: [4, 4], align: 'center' });
  g.restore();
}
// a rubber stamp (slightly turned): "example only", "not to scale"
export function stamp(g, t, t0, str, x, y, col, o = {}) {
  t0 = fitT(t0, str);
  ev(t0, 'stamp', { pan: panOf(x), gain: 0.8 }); txt(t0, str);
  const k = pop(t, t0, 0.22); if (k <= 0) return;
  const px = o.px || 40, w = measure(g, str, `${px}px Slab, DevaSlab`) + 56, h = px + 40;
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.08); g.scale(1 + (1 - k) * 0.6, 1 + (1 - k) * 0.6); g.globalAlpha = clamp(k);
  ink(g, rrect(-w / 2, -h / 2, w, h, 12), 5, { closed: true, color: col, seed: 750, breaks: 0.15, wob: 0.5 });
  ink(g, rrect(-w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 8), 2.4, { closed: true, color: col, seed: 751, breaks: 0.15 });
  text(g, str, 0, px * 0.34, { font: `${px}px Slab, DevaSlab`, fill: col, align: 'center', off: [0, 0] });
  g.restore();
}
// check mark, cross, swash underline (ink strokes that draw on)
export function tick(g, t, t0, x, y, s = 1, col = '#3C8D5A') { ev(t0, 'pop', { pan: panOf(x), gain: 0.5 }); const u = eo(seg(t, t0, t0 + 0.3)); if (u <= 0) return; ink(g, [[x - 22 * s, y], [x - 6 * s, y + 18 * s], [x + 26 * s, y - 22 * s]], 9 * s, { color: col, seed: 760, taper: false, upto: u }); }
export function cross(g, t, t0, x, y, s = 1, col = ACC) { ev(t0, 'pop', { pan: panOf(x), gain: 0.5 }); const u = eo(seg(t, t0, t0 + 0.3)); if (u <= 0) return; ink(g, [[x - 20 * s, y - 20 * s], [x + 20 * s, y + 20 * s]], 9 * s, { color: col, seed: 761, taper: false, upto: clamp(u * 2) }); if (u > 0.5) ink(g, [[x + 20 * s, y - 20 * s], [x - 20 * s, y + 20 * s]], 9 * s, { color: col, seed: 762, taper: false, upto: clamp(u * 2 - 1) }); }
export function swash(g, t, t0, x0, x1, y, col = ACC, w = 7) { const u = eo(seg(t, t0, t0 + 0.4)); if (u <= 0) return; ink(g, spline([[x0, y], [(x0 + x1) / 2, y + 7], [x1, y - 3]], false, 8), w, { color: col, seed: 763, taper: true, upto: u }); }
// a to-scale bar: parts = [[fraction, colour, label]]
export function bar(g, t, t0, x, y, w, h, parts, o = {}) {
  const u = eo(seg(t, t0, t0 + (o.d ?? 0.8))); if (u <= 0) return;
  ev(t0, 'whoosh', { pan: panOf(x + w / 2), dur: 0.4, gain: 0.4 });
  let cx = x; g.save(); g.beginPath(); g.rect(x - 10, y - 10, (w + 20) * u, h + 20); g.clip();
  parts.forEach(([f, col], i) => { const pw = w * f; shape(g, rrect(cx, y, pw, h, Math.min(10, pw / 2)), { fill: col, line: 3.6, seed: 770 + i, grain: 0.25, breaks: 0.1 }); cx += pw; });
  g.restore();
}
export const lines = (g, arr, x, y, px, gap, o = {}) => arr.forEach((s, i) => body(g, s, x, y + i * gap, px, o));

// ---------- the host: pose keys [[t, poseName | {armF,..}, face]], held body, hands move with one in-between, mouth from the voice ----------
const poseOf = p => (typeof p === 'string' ? POSE[p] : p) || {};
const REST = { F: { a1: 1.3, a2: 1.52 }, B: { a1: 1.86, a2: 1.7 } };
export function mouthAt(t) {
  const L = K.TL.lines; let c = null; for (const l of L) { if (t >= l.t0 && t < l.t1) { c = l; break; } }
  if (!c) return 0; const a = K.MOUTH[c.id]; if (!a) return 0;
  const i = Math.floor((t - c.t0) * 12 + 1e-6); return a[i] ?? 0;
}
export function host(g, t, x, y, s, keys, o = {}) {
  const tt = twos(t); let i = 0; while (i + 1 < keys.length && tt >= keys[i + 1][0]) i++;
  const cur = poseOf(keys[i][1]), prev = i ? poseOf(keys[i - 1][1]) : poseOf('rest'), k = i ? ss(seg(tt, keys[i][0], keys[i][0] + 0.22)) : 1;
  const mix = (a, b, d) => ({ a1: lerp(a.a1, b.a1, d), a2: lerp(a.a2, b.a2, d) });
  const armF = mix(prev.armF || REST.F, cur.armF || REST.F, k), armB = mix(prev.armB || REST.B, cur.armB || REST.B, k);
  const blink = hash(Math.floor(tt * 1.6), 3) > 0.9 && (tt * 1.6) % 1 < 0.2 ? 1 : 0;
  const pose = { x, y, s, dir: o.dir ?? 1, view: o.view || 'q', face: keys[i][2] || 'neutral', armF, armB, handF: (k > 0.5 ? cur : prev).handF || 'open', handB: (k > 0.5 ? cur : prev).handB || 'open', blink, mouth: o.silent ? 0 : mouthAt(tt), prop: o.prop, look: o.look };
  g.save(); g.globalAlpha *= o.alpha ?? 1; drawHost(g, pose, t); g.restore();
  return pose;
}

// ---------- lesson header: ink numeral disc, "LESSON n OF N", slab title (slides in on twos). Titles come from brand.js (1 to 7 lessons; 8 and 9 are the lockup and end card) ----------
export const LESSONS = ['', ...BRAND.lessons], NL = BRAND.lessons.length;
export function lessonHeader(g, t, s) {
  if (s.lesson < 1 || s.lesson > NL) return;
  const k = eo(seg(twos(t), s.t0 + 0.05, s.t0 + 0.45)); if (k <= 0) return;
  ev(s.t0 + 0.05, 'slide', { gain: 0.4 });
  g.save(); g.translate(-(1 - k) * 560, 0);
  shape(g, ellipse(122, 118, 50, 50, 40), { fill: PAL.ink, line: 0, seed: 700, grain: 0.1, off: [0, 0] });
  text(g, String(s.lesson), 122, 138, { font: '58px Slab, DevaSlab', fill: PAL.paper, align: 'center' });
  body(g, `LESSON ${s.lesson} OF ${NL}`, 196, 96, 24, { align: 'left', w: 600 });
  const f = fit(g, LESSONS[s.lesson], '{px}px Slab, DevaSlab', 54, 1200, 1, 36);
  text(g, f.lines[0], 194, 150, { font: f.font, fill: PAL.ink, plate: PAL.white, off: [4, 4] });
  g.restore();
}
// speech-free "ribbon" label (a manual's banner)
export function banner(g, t, t0, str, x, y, col, o = {}) {
  t0 = fitT(t0, str);
  ev(t0, 'pop', { pan: panOf(x), gain: 0.7 }); txt(t0, str);
  const k = pop(t, t0, 0.3); if (k <= 0) return;
  const f = fit(g, str, `{px}px Slab, DevaSlab`, o.px || 44, o.maxW || 900, 1, 28), w = measure(g, f.lines[0], f.font) + 130, h = (o.px || 44) + 38;
  g.save(); g.translate(x, y); g.scale(k, k);
  shape(g, [[-w / 2 - 34, -h / 2], [w / 2 + 34, -h / 2], [w / 2 + 8, 0], [w / 2 + 34, h / 2], [-w / 2 - 34, h / 2], [-w / 2 - 8, 0]], { fill: col, line: 4, seed: 780, off: [6, 5], grain: 0.25 });
  text(g, f.lines[0], 0, f.px * 0.34, { font: f.font, fill: o.ink || PAL.ink, align: 'center', off: [0, 0] });
  g.restore();
}
// a big number/word that lands (slab, ink over a plate), with a pop
export function slam(g, t, t0, str, x, y, px, o = {}) {
  t0 = fitT(t0, str);
  ev(t0, 'pop', { pan: panOf(x), gain: 0.8 }); txt(t0, str);
  const k = pop(t, t0, 0.3); if (k <= 0) return;
  g.save(); g.translate(x, y); g.scale(k, k); slab(g, str, 0, 0, px, { plate: o.plate ?? PAL.white, off: o.off || [6, 6], rot: o.rot || 0, fill: o.fill || PAL.ink, maxW: o.maxW }); g.restore();
}

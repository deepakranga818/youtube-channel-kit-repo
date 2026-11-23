// Finance icons for the credit-card film, in the same mid-century manual style as engine/icons.js (200-unit box centred on 0,0).
// card, bank, shop, terminal, network, coin, calendar, atm, gift, scale, globe, book, bag, piggy, tag. All other names fall through to icons.js.
import { PAL, shape, ink, ellipse, rrect, rect, spline, starPts, TAU, sparkle, text } from './toon.js';
import { ICONS as BASE } from './icons.js';
const L = 5;
export const ICONS2 = {
  card(ctx, c) {
    shape(ctx, rrect(-92, -58, 184, 116, 16), { fill: c.main, line: L, seed: 301, shade: [{ pts: rect(20, -60, 80, 124), color: c.dark, alpha: 0.3 }] });
    shape(ctx, rect(-92, -30, 184, 26), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 });
    shape(ctx, rrect(-72, 12, 40, 30, 6), { fill: PAL.mustardL, line: 3, seed: 302 });
    for (let i = 0; i < 3; i++) ink(ctx, [[-14 + i * 0, 22 + i * 12], [60 - i * 14, 22 + i * 12]], 3.2, { seed: 303 + i, color: PAL.white, taper: false });
  },
  bank(ctx, c) {
    shape(ctx, [[-90, -36], [0, -90], [90, -36]], { fill: c.main, line: L, seed: 311 });
    shape(ctx, rect(-82, -34, 164, 18), { fill: c.light, line: 4, seed: 312 });
    [-60, -20, 20, 60].forEach((x, i) => shape(ctx, rect(x - 11, -14, 22, 66), { fill: c.light, line: 4, seed: 313 + i, shade: [{ pts: rect(x + 2, -16, 12, 70), color: PAL.paperD }] }));
    shape(ctx, rect(-92, 52, 184, 20), { fill: c.main, line: 4.5, seed: 317 });
    shape(ctx, ellipse(0, -52, 11, 11, 16), { fill: PAL.white, line: 3, seed: 318, grain: 0 });
  },
  shop(ctx, c) {
    shape(ctx, rect(-76, -10, 152, 80), { fill: c.light, line: L, seed: 321 });
    const aw = [[-92, -14], [-76, -62], [76, -62], [92, -14]];
    shape(ctx, aw, { fill: c.main, line: L, seed: 322 });
    for (let i = 0; i < 4; i++) shape(ctx, [[-92 + i * 46, -14], [-92 + i * 46 + 23, -14], [-76 + i * 38 + 19, -62], [-76 + i * 38, -62]].map(p => p), { fill: i % 2 ? PAL.white : c.main, line: 0, seed: 323 + i, grain: 0.1 });
    shape(ctx, rrect(-24, 20, 48, 50, 5), { fill: c.dark, line: 4, seed: 330 }); shape(ctx, rrect(36, 12, 30, 28, 4), { fill: PAL.blueL, line: 3.5, seed: 331 });
  },
  terminal(ctx, c) {                               // card machine: body, screen, keypad, a slot
    shape(ctx, rrect(-54, -88, 108, 176, 16), { fill: c.main, line: L, seed: 341, shade: [{ pts: rect(20, -90, 50, 180), color: c.dark, alpha: 0.35 }] });
    shape(ctx, rrect(-40, -72, 80, 44, 6), { fill: PAL.white, line: 3.5, seed: 342 });
    text(ctx, '₹', 0, -40, { font: '36px Slab', fill: PAL.ink, align: 'center', off: [0, 0] });
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) shape(ctx, rrect(-34 + k * 26, -10 + r * 24, 20, 16, 4), { fill: PAL.paper, line: 2.6, seed: 343 + r * 3 + k, grain: 0 });
    shape(ctx, rect(-40, 64, 80, 8), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 });
  },
  network(ctx, c) {                                // two overlapping discs, the card-network mark (no brand)
    shape(ctx, ellipse(-34, 0, 62, 62, 40), { fill: PAL.coral, line: L, seed: 361, alpha: 0.95 });
    shape(ctx, ellipse(34, 0, 62, 62, 40), { fill: PAL.mustard, line: L, seed: 362, alpha: 0.9 });
    ink(ctx, ellipse(0, 0, 100, 100, 40, 0, TAU), 3.2, { closed: true, seed: 363, breaks: 0.3, color: c.dark });
    [[-86, -76], [86, -76], [-86, 76], [86, 76]].forEach(([x, y], i) => sparkle(ctx, x, y, 14, { fill: c.dark }));
  },
  coin(ctx, c) {
    shape(ctx, ellipse(0, 0, 78, 78, 48), { fill: PAL.mustard, line: L, seed: 371, shade: [{ pts: ellipse(22, 26, 78, 78, 30), color: PAL.mustardD, alpha: 0.4 }] });
    ink(ctx, ellipse(0, 0, 58, 58, 40), 3.2, { closed: true, seed: 372, breaks: 0.3, color: PAL.mustardD });
    text(ctx, '₹', 0, 30, { font: '88px Slab', fill: PAL.ink, align: 'center', off: [0, 0] });
  },
  calendar(ctx, c) {
    shape(ctx, rrect(-76, -66, 152, 142, 12), { fill: PAL.white, line: L, seed: 381 });
    shape(ctx, rect(-76, -66, 152, 38), { fill: c.main, line: L, seed: 382 });
    [-40, 40].forEach((x, i) => shape(ctx, rrect(x - 6, -84, 12, 34, 5), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 }));
    for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) shape(ctx, rect(-60 + k * 32, -14 + r * 26, 20, 16), { fill: r === 2 && k === 2 ? c.main : PAL.paperD, line: 0, seed: 383 + r * 4 + k, grain: 0 });
  },
  atm(ctx, c) {
    shape(ctx, rrect(-70, -90, 140, 180, 12), { fill: c.main, line: L, seed: 391, shade: [{ pts: rect(26, -92, 50, 184), color: c.dark, alpha: 0.35 }] });
    shape(ctx, rrect(-52, -72, 104, 56, 6), { fill: PAL.white, line: 3.5, seed: 392 });
    text(ctx, '₹', 0, -30, { font: '44px Slab', fill: PAL.ink, align: 'center', off: [0, 0] });
    shape(ctx, rect(-46, 10, 92, 10), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 }); shape(ctx, rect(-40, 40, 80, 30), { fill: PAL.paper, line: 3, seed: 393 });
    shape(ctx, rect(-30, 44, 60, 14), { fill: PAL.mustardL, line: 2.4, seed: 394 });
  },
  gift(ctx, c) {
    shape(ctx, rect(-66, -16, 132, 86), { fill: c.main, line: L, seed: 401, shade: [{ pts: rect(26, -18, 48, 90), color: c.dark, alpha: 0.35 }] });
    shape(ctx, rect(-76, -44, 152, 32), { fill: c.light, line: L, seed: 402 });
    shape(ctx, rect(-12, -44, 24, 114), { fill: PAL.mustard, line: 3.5, seed: 403 });
    shape(ctx, spline([[0, -44], [-48, -88], [-60, -52]], true, 6), { fill: PAL.mustard, line: 3.5, seed: 404 }); shape(ctx, spline([[0, -44], [48, -88], [60, -52]], true, 6), { fill: PAL.mustard, line: 3.5, seed: 405 });
  },
  scale(ctx, c) {
    ink(ctx, [[0, -80], [0, 60]], 8, { seed: 411, taper: false }); shape(ctx, rect(-44, 56, 88, 16), { fill: c.main, line: 4, seed: 412 });
    ink(ctx, [[-80, -56], [80, -56]], 8, { seed: 413, taper: false });
    [-80, 80].forEach((x, i) => { ink(ctx, [[x, -56], [x - 26, -4]], 3.4, { seed: 414 + i }); ink(ctx, [[x, -56], [x + 26, -4]], 3.4, { seed: 416 + i }); shape(ctx, spline([[x - 36, -4], [x + 36, -4], [x + 24, 18], [x - 24, 18]], true, 5), { fill: i ? PAL.mustard : c.light, line: 4, seed: 418 + i }); });
  },
  globe(ctx, c) {
    shape(ctx, ellipse(0, 0, 80, 80, 48), { fill: c.light, line: L, seed: 421 });
    shape(ctx, spline([[-46, -38], [-14, -56], [10, -30], [-6, -4], [-40, 6]], true, 6), { fill: c.main, line: 3, seed: 422, grain: 0.2 });
    shape(ctx, spline([[20, 6], [50, 0], [54, 36], [28, 56], [14, 30]], true, 6), { fill: c.main, line: 3, seed: 423, grain: 0.2 });
    ink(ctx, ellipse(0, 0, 36, 80, 30), 3, { closed: true, seed: 424, breaks: 0.3 }); ink(ctx, [[-80, 0], [80, 0]], 3, { seed: 425, breaks: 0.3 });
  },
  book(ctx, c) {                                   // the fine-print booklet (MITC)
    shape(ctx, rrect(-58, -80, 116, 160, 8), { fill: c.main, line: L, seed: 431, shade: [{ pts: rect(36, -82, 30, 164), color: c.dark, alpha: 0.35 }] });
    shape(ctx, rect(-46, -62, 92, 34), { fill: PAL.white, line: 3, seed: 432 });
    text(ctx, 'MITC', 0, -36, { font: '26px Slab', fill: PAL.ink, align: 'center', off: [0, 0] });
    for (let i = 0; i < 5; i++) ink(ctx, [[-38, -8 + i * 18], [38 - (i % 2) * 22, -8 + i * 18]], 3, { seed: 433 + i, color: PAL.white, taper: false });
  },
  tag(ctx, c) {
    shape(ctx, [[-78, -30], [20, -30], [78, 0], [20, 30], [-78, 30]], { fill: c.main, line: L, seed: 441 });
    shape(ctx, ellipse(-56, 0, 9, 9, 12), { fill: PAL.paper, line: 3, seed: 442, grain: 0 });
  },
  piggy(ctx, c) {
    shape(ctx, ellipse(0, 6, 78, 58, 40), { fill: PAL.pink, line: L, seed: 451 });
    shape(ctx, spline([[-40, -46], [-30, -78], [-14, -50]], true, 5), { fill: PAL.pinkD, line: 3.5, seed: 452 });
    shape(ctx, ellipse(78, 12, 22, 18, 20), { fill: PAL.pinkD, line: 4, seed: 453 }); shape(ctx, ellipse(-4, -40, 22, 6, 16), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 });
    [-40, 34].forEach((x, i) => shape(ctx, rect(x, 50, 16, 26), { fill: PAL.pinkD, line: 3.4, seed: 454 + i }));
    shape(ctx, ellipse(52, -4, 5, 6, 10), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 });
  },
};
export function icon(ctx, name, cx, cy, size, o = {}) {
  const c = { main: o.main || PAL.teal, light: o.light || PAL.white, dark: o.dark || PAL.tealD };
  const f = ICONS2[name] || BASE[name] || BASE.spark;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(size / 200, size / 200); f(ctx, c); ctx.restore();
}

// scenes_b.js: lessons 3-7 (interest, other charges, rewards, business, close). Same rules as scenes_a.js: pure functions, everything starts on its chunk.
import { PAL, shape, ink, ellipse, rect, rrect, spline, star, text, fit, measure, arrow, dashed, clamp, lerp, seg, ss, eo, back, TAU, icon, W, H, BEAT, K, T, DN, ev, GROUND, CARD, CARDD, ACC, tint, shade, pop, panOf,
  stage, sunburst, slab, body, kick, tag, iconCard, callout, medal, stamp, tick, cross, swash, bar, host, banner, slam } from './kit.js';

const popIcon = (g, t, t0, name, x, y, size, o = {}) => { ev(t0, 'pop', { pan: panOf(x) }); const k = pop(t, t0, 0.3); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); g.rotate((1 - k) * 0.3); icon(g, name, 0, 0, size, { main: o.main || CARD, dark: o.dark || CARDD, light: PAL.white }); g.restore(); };
const HY = 902, hk = (s, ...r) => [[s.t0, ...r[0]], ...r.slice(1)];
const GREEN = '#3C8D5A';
const arr = (g, t, t0, a, b, o = {}) => { const u = eo(seg(t, t0, t0 + (o.d ?? 0.7))); ev(t0, 'whoosh', { pan: panOf((a[0] + b[0]) / 2), dur: 0.3, gain: 0.35 }); if (u > 0) arrow(g, a, b, { u, bend: o.bend ?? -0.2, fill: o.fill || PAL.mustard, w: 6, head: o.head || 30, seed: o.seed || 60 }); };
const vbar = (g, t, t0, x, base, w, h, col, seed) => { const u = eo(seg(t, t0, t0 + 0.6)); ev(t0, 'pop', { pan: panOf(x), gain: 0.5 }); if (u > 0) shape(g, rrect(x - w / 2, base - h * u, w, h * u, 8), { fill: col, line: 3.6, seed, grain: 0.25, breaks: 0.1 }); };

// ======================================================================= LESSON 3: interest
export function int1(g, t, s) {
  stage(g, GROUND.avocado);
  kick(g, 'The second earning', 960, 260, 64, ACC, { alpha: pop(t, T('i1') + 0.2, 0.3) * (1 - seg(t, T('i3') - 0.4, T('i3'))) });
  slam(g, t, T('i2') + 0.2, 'Interest', 560, 400, 150); tag(g, t, T('i2') + 1.2, 'Finance charges', 560, 510, { align: 'center', maxW: 420 });
  popIcon(g, t, T('i3') + 0.1, 'bank', 1180, 400, 200, { main: PAL.plum, dark: PAL.plum }); popIcon(g, t, T('i3') + 0.8, 'card', 1620, 400, 170);
  arr(g, t, T('i3') + 1.2, [1300, 420], [1500, 410], { seed: 61 }); tag(g, t, T('i3') + 1.8, 'Credit for a fixed period', 1400, 540, { align: 'center', maxW: 520 });
  const lu = eo(seg(t, T('i4') + 0.1, T('i4') + 0.9)); if (lu > 0) ink(g, [[320, 720], [1620, 720]], 6, { seed: 62, upto: lu, taper: false });
  [[390, 'Today'], [1550, 'Later']].forEach(([x, l], i) => { const t0 = T('i4') + 0.4 + i * 1.5; const k = pop(t, t0, 0.3); ev(t0, 'pop', { pan: panOf(x) }); if (k > 0) { shape(g, ellipse(x, 720, 30 * k, 30 * k, 30), { fill: i ? PAL.mustard : ACC, line: 4, seed: 63 + i, grain: 0.2 }); } });
  tag(g, t, T('i4') + 0.6, 'Today: you buy', 480, 640, { align: 'center', maxW: 400 }); tag(g, t, T('i4') + 2.2, 'Later: you pay', 1480, 640, { align: 'center', maxW: 400 });
  host(g, t, 150, HY, 0.62, hk(s, ['explain', 'happy'], [T('i3'), 'point', 'neutral'], [T('i4'), 'explain', 'happy']));
}
export function int2(g, t, s) {
  stage(g, GROUND.avocado); sunburst(g, 700, 480, 800, GROUND.avocado, t, 0.3);
  popIcon(g, t, T('i5a') + 0.1, 'calendar', 700, 470, 300, { main: ACC });
  const rk = pop(t, T('i5a') + 2.0, 0.3); if (rk > 0) { ink(g, ellipse(740, 520, 70 * rk, 52 * rk, 40, 0, TAU, -0.1), 6, { closed: true, color: PAL.ink, seed: 64, breaks: 0.15 }); }
  tag(g, t, T('i5a') + 0.7, 'Full statement amount', 700, 690, { align: 'center', maxW: 520 }); tag(g, t, T('i5a') + 2.2, 'By the due date', 700, 780, { align: 'center', maxW: 420 });
  banner(g, t, T('i5b') + 0.3, 'Interest-free period', 1420, 400, PAL.white, { px: 48, maxW: 700 }); popIcon(g, t, T('i5b') + 0.9, 'check', 1420, 600, 190, { main: GREEN, dark: GREEN });
  tag(g, t, T('i5b') + 1.6, 'On eligible purchases', 1420, 760, { align: 'center', maxW: 480 });
  host(g, t, 1760, HY, 0.62, hk(s, ['explain', 'happy'], [T('i5b'), 'point', 'happy']), { dir: -1 });
}
export function int3(g, t, s) {
  stage(g, GROUND.avocado);
  const bx = 300, bw = 1320, by = 290;
  body(g, 'Your bill', bx, by - 14, 32, { align: 'left', w: 600, alpha: pop(t, T('i6a') + 0.1, 0.3) });
  bar(g, t, T('i6a') + 0.2, bx, by, bw, 74, [[0.14, PAL.mustard], [0.86, PAL.paper]]);
  tag(g, t, T('i6a') + 1.5, 'Paid only the minimum due', 560, 400, { align: 'center', maxW: 560, star: PAL.mustardD });
  tag(g, t, T('i6b') + 0.4, 'Rest of the bill unpaid', 1250, 400, { align: 'center', maxW: 460, star: ACC });
  tag(g, t, T('i7') + 0.3, 'Interest on what is left', 960, 500, { align: 'center', maxW: 560, star: PAL.ink });
  [['Month 1', 90], ['Month 2', 160], ['Month 3', 250], ['Month 4', 360]].forEach(([l, h], i) => { const t0 = T('i8') + 0.6 + i * 1.2; vbar(g, t, t0, 1000 + i * 190, 860, 120, h, ACC, 70 + i); body(g, l, 1000 + i * 190, 892, 24, { alpha: pop(t, t0, 0.3), w: 500 }); });
  tag(g, t, T('i8') + 0.3, 'The interest burden grows', 700, 640, { align: 'center', maxW: 520 });
  host(g, t, 200, HY, 0.7, hk(s, ['explain', 'neutral'], [T('i6b'), 'think', 'wow'], [T('i8'), 'pointUp', 'wow']));
}
export function int4(g, t, s) {
  stage(g, GROUND.avocado);
  iconCard(g, t, T('i9') + 0.1, 'tag', 'Paying the minimum due', 500, 470, { w: 320, h: 290, main: PAL.mustardD, dark: PAL.mustardD });
  slam(g, t, T('i9') + 1.0, '≠', 960, 520, 190); iconCard(g, t, T('i10') + 0.2, 'check', 'Clearing the full bill', 1420, 470, { w: 320, h: 290, main: GREEN, dark: GREEN });
  popIcon(g, t, T('i11') + 0.3, 'bank', 560, 770, 150, { main: PAL.plum, dark: PAL.plum });
  banner(g, t, T('i11') + 0.7, 'Interest on revolving credit: an earning source', 1160, 770, PAL.white, { px: 38, maxW: 1100 });
  host(g, t, 1790, HY, 0.58, hk(s, ['explain', 'neutral'], [T('i10'), 'point', 'focus']), { dir: -1 });
}

// ======================================================================= LESSON 4: other charges
export function chg1(g, t, s) {
  stage(g, GROUND.plum);
  kick(g, 'Other ways to earn', 960, 260, 60, PAL.white, { alpha: pop(t, T('c1') + 0.2, 0.3) });
  const cards = [['tag', 'Joining fee', T('c2a') + 0.3], ['calendar', 'Annual fee', T('c2a') + 1.7], ['atm', 'Cash withdrawal fee', T('c2a') + 3.2], ['globe', 'Forex markup', T('c2b') + 0.4], ['gear', 'Charges for special services', T('c2b') + 2.6]];
  cards.forEach(([ic, l, t0], i) => iconCard(g, t, t0, ic, l, 380 + i * 335, 520, { w: 290, h: 300, main: [PAL.mustardD, ACC, PAL.blueD, PAL.avocadoD, PAL.plum][i], dark: PAL.ink, px: 28, seed: i }));
  stamp(g, t, T('c3') + 0.4, 'Not on every card', 960, 800, PAL.white, { px: 54, rot: -0.03 });
  host(g, t, 100, HY, 0.5, hk(s, ['explain', 'neutral'], [T('c3'), 'point', 'happy']));
}
export function chg2(g, t, s) {
  stage(g, GROUND.plum);
  iconCard(g, t, T('c4a') + 0.3, 'card', 'Lifetime free', 440, 500, { w: 340, h: 320, main: CARD, dark: CARDD, seed: 1 }); stamp(g, t, T('c4a') + 1.0, 'FREE', 560, 360, ACC, { px: 46, rot: 0.1 });
  iconCard(g, t, T('c4a') + 1.9, 'card', 'Annual fee', 960, 500, { w: 340, h: 320, main: CARD, dark: CARDD, seed: 2 }); tag(g, t, T('c4a') + 2.6, 'Every year', 960, 700, { align: 'center', maxW: 260 });
  iconCard(g, t, T('c4b') + 0.4, 'check', 'Target met → fee waived', 1480, 500, { w: 340, h: 320, main: GREEN, dark: GREEN, seed: 3 }); tag(g, t, T('c4b') + 2.4, 'Spending target', 1480, 700, { align: 'center', maxW: 320 });
  host(g, t, 150, HY, 0.6, hk(s, ['explain', 'happy'], [T('c4b'), 'point', 'neutral']));
}
export function chg3(g, t, s) {
  stage(g, GROUND.plum);
  kick(g, 'Remember one thing', 960, 260, 58, PAL.white, { alpha: pop(t, T('c5') + 0.2, 0.3) * (1 - seg(t, T('c6a') + 0.2, T('c6a') + 0.6)) });
  iconCard(g, t, T('c6a') + 0.3, 'atm', 'Cash at an ATM', 480, 500, { w: 320, h: 330, main: PAL.blueD, dark: PAL.blueD });
  banner(g, t, T('c6a') + 2.6, 'Not like normal shopping', 480, 740, PAL.white, { px: 34, maxW: 480 });
  tag(g, t, T('c6b') + 0.3, 'Cash advance fee', 1020, 400, { align: 'center', maxW: 420, star: ACC }); tag(g, t, T('c6b') + 1.4, 'Interest', 1020, 510, { align: 'center', maxW: 300, star: ACC });
  iconCard(g, t, T('c7a') + 0.2, 'book', 'MITC', 1560, 500, { w: 320, h: 330, main: PAL.avocadoD, dark: PAL.ink, sub: 'Most Important Terms & Conditions' });
  banner(g, t, T('c7b') + 0.6, 'Check the benefits and the MITC', 1000, 830, PAL.white, { px: 40, maxW: 1100 });
  host(g, t, 110, HY, 0.5, hk(s, ['both', 'wow'], [T('c6b'), 'explain', 'neutral'], [T('c7b'), 'point', 'happy']));
}

// ======================================================================= LESSON 5: rewards
export function rew1(g, t, s) {
  stage(g, GROUND.sand); sunburst(g, 960, 470, 900, GROUND.sand, t, 0.3);
  kick(g, 'The most interesting question', 960, 260, 60, ACC, { alpha: pop(t, T('r1') + 0.2, 0.3) });
  popIcon(g, t, T('r2') + 0.1, 'bank', 520, 500, 230, { main: PAL.plum, dark: PAL.plum }); tag(g, t, T('r2') + 0.9, 'Not taking interest', 520, 660, { align: 'center', maxW: 420 });
  arr(g, t, T('r2') + 1.5, [700, 500], [1180, 500], { bend: -0.2, seed: 64 }); popIcon(g, t, T('r2') + 2.2, 'gift', 1400, 500, 230, { main: ACC, dark: ACC });
  tag(g, t, T('r2') + 3.0, 'Still cashback and points?', 1400, 660, { align: 'center', maxW: 540 });
  banner(g, t, T('r3') + 0.3, 'The bank wants you to keep using the card', 960, 830, PAL.white, { px: 40, maxW: 1300 });
  host(g, t, 150, HY, 0.6, hk(s, ['think', 'think'], [T('r3'), 'explain', 'happy']));
}
export function rew2(g, t, s) {
  stage(g, GROUND.sand);
  body(g, 'Eligible transactions', 520, 270, 30, { w: 600, alpha: pop(t, T('r4') + 0.1, 0.3) });
  [90, 170, 260, 350].forEach((h, i) => vbar(g, t, T('r4') + 0.5 + i * 1.3, 330 + i * 150, 740, 100, h, i === 3 ? PAL.mustard : PAL.mustardL, 80 + i));
  arr(g, t, T('r4') + 3.0, [280, 330], [800, 300], { bend: -0.1, seed: 65 }); tag(g, t, T('r4') + 3.8, 'More merchant-side revenue', 620, 800, { align: 'center', maxW: 700, star: PAL.mustardD });
  popIcon(g, t, T('r5') + 0.1, 'gift', 1450, 330, 170, { main: ACC, dark: ACC });
  ['Merchant partnerships', 'Co-branded offers', 'Promotional offers'].forEach((x, i) => tag(g, t, T('r5') + 0.9 + i * 1.4, x, 1450, 470 + i * 100, { align: 'center', maxW: 440, seed: i }));
  host(g, t, 1820, HY, 0.55, hk(s, ['explain', 'neutral'], [T('r5'), 'point', 'happy']), { dir: -1 });
}
export function rew3(g, t, s) {
  stage(g, GROUND.sand); sunburst(g, 960, 520, 800, GROUND.sand, t, 0.25);
  slam(g, t, T('r6') + 0.2, 'No magic', 960, 330, 100); tag(g, t, T('r7') + 0.3, 'Part of the business model', 960, 400, { align: 'center', maxW: 640 });
  const N = [[960, 560, 'Reward'], [1450, 680, 'Prefers the card'], [960, 800, 'More transactions'], [470, 680, 'Long-term customer']];
  N.forEach(([x, y, l], i) => tag(g, t, T('r8') + 0.2 + i * 1.6, l, x, y - 38, { align: 'center', maxW: 420, seed: i }));
  [[1130, 590, 1350, 650, -0.3], [1360, 735, 1160, 800, -0.3], [800, 820, 600, 760, -0.3], [520, 640, 760, 585, -0.3]].forEach(([a, b, c, d, bd], i) => arr(g, t, T('r8') + 1.2 + i * 1.6, [a, b], [c, d], { bend: bd, seed: 70 + i, head: 26 }));
  host(g, t, 1830, HY, 0.55, hk(s, ['both', 'wow'], [T('r7'), 'explain', 'neutral'], [T('r8'), 'point', 'happy']), { dir: -1 });
}
export function rew4(g, t, s) {
  stage(g, GROUND.sand);
  slam(g, t, T('r9') + 0.1, 'Not every reward is free', 960, 290, 80);
  iconCard(g, t, T('r10a') + 0.3, 'tag', 'Annual fee', 460, 540, { w: 310, h: 290, main: ACC, dark: ACC, seed: 1 }); iconCard(g, t, T('r10a') + 2.6, 'gift', 'Redemption limits', 960, 540, { w: 310, h: 290, main: PAL.plum, dark: PAL.plum, seed: 2 });
  iconCard(g, t, T('r10b') + 0.3, 'coin', 'Minimum-spend condition', 1460, 540, { w: 310, h: 290, main: PAL.mustardD, dark: PAL.mustardD, seed: 3 });
  banner(g, t, T('r11') + 0.5, 'Before choosing a card: know the total cost', 960, 830, PAL.white, { px: 40, maxW: 1300 });
  host(g, t, 130, HY, 0.5, hk(s, ['explain', 'neutral'], [T('r10b'), 'point', 'focus'], [T('r11'), 'pointUp', 'happy']));
}

// ======================================================================= LESSON 6: is it always profit?
export function biz1(g, t, s) {
  stage(g, GROUND.pink); sunburst(g, 1050, 470, 900, GROUND.pink, t, 0.3);
  kick(g, 'An important clarification', 960, 260, 60, ACC, { alpha: pop(t, T('b1') + 0.2, 0.3) });
  slam(g, t, T('b2') + 0.2, 'Guaranteed profit?', 1000, 470, 120); cross(g, t, T('b2') + 1.6, 1000, 580, 3.4, ACC);
  stamp(g, t, T('b2') + 2.4, 'Not on every transaction', 1000, 740, PAL.ink, { px: 50, rot: -0.04 });
  host(g, t, 230, HY, 0.74, hk(s, ['explain', 'neutral'], [T('b2'), 'both', 'wow']));
}
export function biz2(g, t, s) {
  stage(g, GROUND.pink);
  banner(g, t, T('b3a') + 0.1, 'The bank\'s costs', 960, 260, PAL.white, { px: 44, maxW: 600 });
  const C = [['Rewards', 'b3a', 0.5], ['Fraud prevention', 'b3a', 1.5], ['Payment processing', 'b3a', 2.6], ['Customer support', 'b3a', 3.7], ['Technology', 'b3b', 0.4], ['Signing up customers', 'b3b', 1.5], ['Risk of unpaid dues', 'b3b', 3.0]];
  C.forEach(([l, id, o], i) => tag(g, t, T(id) + o, l, i < 4 ? 620 : 1300, 360 + (i < 4 ? i : i - 4) * 105, { align: 'center', maxW: 560, seed: i, star: ACC }));
  host(g, t, 1790, HY, 0.58, hk(s, ['explain', 'neutral'], [T('b3b'), 'point', 'focus']), { dir: -1 });
}
export function biz3(g, t, s) {
  stage(g, GROUND.pink);
  const rows = [['Some customers: more profit', 0.86, GREEN, 'b4a', 0.3], ['Some customers: less profit', 0.3, PAL.mustard, 'b4a', 2.8], ['Some transactions: cost > revenue', -0.2, ACC, 'b4b', 0.4]];
  rows.forEach(([l, v, col, id, o], i) => {
    const y = 350 + i * 150, t0 = T(id) + o; body(g, l, 300, y - 20, 34, { align: 'left', w: 600, alpha: pop(t, t0, 0.3) });
    ink(g, [[300, y + 30], [1700, y + 30]], 2.4, { seed: 80 + i, color: PAL.inkSoft, alpha: clamp(pop(t, t0, 0.3)) });
    if (v >= 0) bar(g, t, t0 + 0.2, 300, y + 4, 1400 * v, 52, [[1, col]]); else bar(g, t, t0 + 0.2, 300, y + 4, 1400 * 0.5, 52, [[1, col]], { d: 0.9 });
  });
  const kk = pop(t, T('b4b') + 1.4, 0.3); if (kk > 0) { ev(T('b4b') + 1.4, 'pop', {}); stamp(g, t, T('b4b') + 1.4, 'Cost above revenue', 1280, 780, PAL.ink, { px: 42, rot: -0.04 }); }
  host(g, t, 170, HY, 0.66, hk(s, ['explain', 'neutral'], [T('b4b'), 'think', 'think']));
}
export function biz4(g, t, s) {
  stage(g, GROUND.pink); sunburst(g, 1200, 470, 900, GROUND.pink, t, 0.3);
  body(g, 'Several income sources', 960, 250, 36, { w: 600, alpha: pop(t, T('b5') + 0.2, 0.3) });
  const S = [['Merchant-side transaction income', 'merchant', 0.4], ['Interest', 'interest', 0.4], ['Applicable fees', 'fees', 1.6], ['Partnerships', 'partner', 2.8]];
  S.forEach(([l, _, o], i) => { const t0 = T('b6') + o; tag(g, t, t0, l, 560, 340 + i * 105, { align: 'center', maxW: 620, seed: i, star: PAL.mustardD }); arr(g, t, t0 + 0.4, [880, 340 + i * 105 + 36], [1180, 560], { bend: 0.15, seed: 90 + i, head: 22 }); });
  popIcon(g, t, T('b7') + 0.2, 'piggy', 1450, 560, 250); banner(g, t, T('b7') + 0.9, 'Together: a profitable business', 1300, 790, PAL.white, { px: 38, maxW: 900 });
  host(g, t, 170, HY, 0.66, hk(s, ['explain', 'happy'], [T('b7'), 'fist', 'happy']));
}

// ======================================================================= LESSON 7: the close
export function end1a(g, t, s) {
  stage(g, GROUND.blue); sunburst(g, 1000, 450, 900, GROUND.blue, t, 0.3);
  tag(g, t, T('z1') + 0.4, 'Full bill, on time', 1000, 330, { align: 'center', maxW: 600 }); tick(g, t, T('z1') + 1.4, 1420, 366, 1.5);
  slam(g, t, T('z1b') + 0.3, 'The bank earned nothing?', 1000, 560, 70, { maxW: 1100 }); cross(g, t, T('z1b') + 2.4, 1000, 680, 3, ACC);
  host(g, t, 270, HY, 0.74, hk(s, ['explain', 'happy'], [T('z1b'), 'think', 'wow']));
}
export function end1b(g, t, s) {
  stage(g, GROUND.blue);
  popIcon(g, t, T('z2') + 0.2, 'bank', 560, 440, 220, { main: PAL.plum, dark: PAL.plum }); tag(g, t, T('z2') + 0.8, 'No interest received', 560, 590, { align: 'center', maxW: 420, star: ACC });
  arr(g, t, T('z2') + 2.4, [1200, 440], [800, 440], { bend: 0.2, seed: 66 }); popIcon(g, t, T('z2') + 2.0, 'shop', 1350, 440, 190, { main: PAL.coralD, dark: PAL.coralD });
  tag(g, t, T('z2') + 3.4, 'Income from the merchant-side fee', 960, 300, { align: 'center', maxW: 780 });
  popIcon(g, t, T('z3') + 0.2, 'gift', 700, 740, 140, { main: ACC, dark: ACC });
  ['Cashback', 'Rewards', 'Discounts'].forEach((x, i) => tag(g, t, T('z3') + 0.9 + i * 1.2, x, 1130 + (i % 2) * 120, 650 + i * 70, { align: 'center', maxW: 300, seed: i }));
  host(g, t, 1790, HY, 0.6, hk(s, ['explain', 'neutral'], [T('z3'), 'point', 'happy']), { dir: -1 });
}
export function end2(g, t, s) {
  stage(g, GROUND.blue); sunburst(g, 960, 480, 900, GROUND.blue, t, 0.3);
  kick(g, 'Just three rules', 960, 250, 62, ACC, { alpha: pop(t, T('z4') + 0.2, 0.3) });
  const R = [[400, 'Total due, on time', 'z5'], [960, 'Not just the minimum', 'z6'], [1520, 'A payment tool, not income', 'z7a']];
  R.forEach(([x, l, id], i) => { const t0 = T(id) + 0.2; medal(g, t, t0, x, 480, i + 1, [PAL.mustard, PAL.pink, PAL.avocadoL][i], 110, { gain: 0.9 }); body(g, l, x, 680, 34, { w: 600, alpha: pop(t, t0 + 0.8, 0.3), maxW: 460 }); });
  banner(g, t, T('z7b') + 0.5, 'Use it responsibly', 960, 820, PAL.white, { px: 44, maxW: 1000 });
  host(g, t, 120, HY, 0.5, hk(s, ['explain', 'neutral'], [T('z5'), 'point', 'happy'], [T('z7a'), 'fist', 'happy']));
}
export function end3(g, t, s) {
  stage(g, GROUND.blue);
  iconCard(g, t, T('z8a') + 0.2, 'gift', 'A real benefit', 520, 500, { w: 340, h: 330, main: ACC, dark: ACC }); slam(g, t, T('z8b') + 0.2, 'OR', 960, 520, 100);
  iconCard(g, t, T('z8b') + 0.9, 'bank', 'The bank\'s smart strategy', 1400, 500, { w: 340, h: 330, main: PAL.plum, dark: PAL.plum });
  banner(g, t, T('z9') - 0.9, 'Tell us in the comments', 960, 810, PAL.white, { px: 46, maxW: 900 });
  host(g, t, 150, HY, 0.6, hk(s, ['think', 'think'], [T('z8b'), 'explain', 'wow'], [T('z9'), 'point', 'happy']));
}
export function end4(g, t, s) {
  stage(g, GROUND.blue); sunburst(g, 1330, 450, 1000, GROUND.blue, t, 0.35);
  host(g, t, 520, HY, 1.0, hk(s, ['wave', 'happy'], [T('z11'), 'explain', 'wink']));
  popIcon(g, t, T('z10') + 0.2, 'bulb', 1330, 260, 190, { main: PAL.mustard, dark: PAL.mustardD });
  const k = pop(t, T('z10') + 0.8, 0.3); if (k > 0) { g.save(); g.translate(1330, 470); g.scale(k, k); text(g, 'ExplainEveryday', 0, 0, { font: '700 96px Oleo, DevaScript', fill: PAL.ink, plate: PAL.mustard, off: [5, 4], align: 'center', maxW: 820 }); g.restore(); }
  kick(g, 'Big Questions. Simple Explanations.', 1330, 560, 40, PAL.white, { alpha: pop(t, T('z11') + 0.2, 0.3), rot: -0.02 });
  const kb = pop(t, T('z10') + 3.4, 0.3); if (kb > 0) { ev(T('z10') + 3.4, 'pop', {}); g.save(); g.translate(1330, 700); g.scale(kb, kb); shape(g, rrect(-280, -42, 560, 84, 42), { fill: ACC, line: 4, seed: 91, off: [5, 5] }); text(g, 'SUBSCRIBE', 0, 14, { font: '600 38px Jost, Deva', fill: PAL.white, align: 'center', off: [0, 0] }); g.restore(); }
}

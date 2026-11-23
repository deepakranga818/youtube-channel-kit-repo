// scenes_a.js: the hook and lessons 1-2 (players, the fee). Each scene is a pure function (g, t, s); everything starts when its chunk is spoken.
import { PAL, shape, ink, ellipse, rect, rrect, spline, star, sparkle, text, fit, measure, arrow, dashed, clamp, lerp, seg, ss, eo, back, twos, TAU, starPts, icon, W, H, BEAT, K, T, DN, ev, GROUND, CARD, CARDD, ACC, tint, shade, pop, panOf,
  stage, sunburst, slab, body, kick, tag, iconCard, callout, medal, stamp, tick, cross, swash, bar, host, banner, slam } from './kit.js';

const popIcon = (g, t, t0, name, x, y, size, o = {}) => { ev(t0, 'pop', { pan: panOf(x) }); const k = pop(t, t0, 0.3); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); g.rotate((1 - k) * 0.3); icon(g, name, 0, 0, size, { main: o.main || CARD, dark: o.dark || CARDD, light: PAL.white }); g.restore(); };
const disc = (g, t, t0, x, y, r, fill = PAL.white) => { const k = pop(t, t0, 0.32); if (k > 0) shape(g, ellipse(x, y, r * k, r * k, 64), { fill, line: 4, seed: 600, grain: 0.2, breaks: 0.3 }); };
const HY = 902;                                   // the host's feet
const hk = (s, ...rest) => [[s.t0, ...rest[0]], ...rest.slice(1)];

// ======================================================================= HOOK
export function hook1(g, t, s) {
  stage(g, GROUND.mustard); sunburst(g, 1000, 430, 1100, GROUND.mustard, t, 0.4);
  disc(g, t, T('h1') + 0.05, 1000, 430, 230);
  popIcon(g, t, T('h1') + 0.2, 'card', 1000, 430, 330);
  slab(g, 'Credit card', 1000, 735, 74, { alpha: pop(t, T('h1') + 0.9, 0.3) });
  ['Shopping', 'Online payments', 'Restaurant bills'].forEach((x, i) => tag(g, t, T('h2a') + 0.2 + i * 1.5, x, 1340, 250 + i * 92, { maxW: 480, seed: i }));
  popIcon(g, t, T('h2b') + 0.1, 'calendar', 1480, 690, 170, { main: ACC });
  tag(g, t, T('h2b') + 0.9, 'Full bill before the due date', 1340, 790, { maxW: 470 });
  tick(g, t, T('h2b') + 2.6, 1790, 720, 1.2);
  slam(g, t, T('h3') + 0.3, 'INTEREST = ₹0', 880, 850, 84); swash(g, t, T('h3') + 1.3, 570, 1190, 884, ACC);
  host(g, t, 230, HY, 0.74, hk(s, ['explain', 'happy'], [T('h2a'), 'point', 'neutral'], [T('h3'), 'think', 'wow']));
}
export function hook2(g, t, s) {
  stage(g, GROUND.mustard);
  kick(g, 'A simple question', 1000, 230, 66, ACC, { alpha: pop(t, T('h4') + 0.2, 0.3) });
  popIcon(g, t, T('h5a') + 0.1, 'card', 700, 480, 230); popIcon(g, t, T('h5a') + 0.7, 'bank', 1190, 480, 230, { main: PAL.plum, dark: PAL.plum });
  const au = eo(seg(t, T('h5a') + 1.2, T('h5a') + 1.8)); if (au > 0) { arrow(g, [820, 470], [1060, 470], { u: au, bend: -0.25, fill: PAL.white, w: 6, head: 30, seed: 5 }); }
  tag(g, t, T('h5a') + 1.9, 'Interest ₹0', 945, 330, { align: 'center', maxW: 300 });
  slam(g, t, T('h5b') + 0.4, 'Free? Why?', 940, 760, 100);
  ['Cashback', 'Reward points', 'Lounge access', 'Discounts'].forEach((x, i) => tag(g, t, T('h6a') + 0.3 + i * 1.0, x, 1480, 280 + i * 90, { maxW: 420, seed: i, star: PAL.coralD }));
  popIcon(g, t, T('h6a') + 0.2, 'gift', 1700, 700, 150, { main: ACC });
  banner(g, t, T('h6b') + 0.4, 'How does it earn?', 940, 870, PAL.white, { px: 48 });
  host(g, t, 230, HY, 0.74, hk(s, ['think', 'think'], [T('h5b'), 'explain', 'wow'], [T('h6b'), 'pointUp', 'think']));
}
export function hook3(g, t, s) {
  stage(g, GROUND.mustard); sunburst(g, 1250, 520, 1000, GROUND.mustard, t, 0.3);
  slam(g, t, T('h7') + 0.1, 'A loss?', 900, 330, 120); cross(g, t, T('h7') + 1.3, 1230, 300, 2.2, ACC);
  stamp(g, t, T('h7') + 1.8, 'NOT AT ALL!', 900, 500, PAL.ink, { px: 62, rot: -0.07 });
  disc(g, t, T('h8a') + 0.1, 1590, 330, 150); popIcon(g, t, T('h8a') + 0.2, 'bulb', 1590, 330, 220, { main: ACC });
  tag(g, t, T('h8a') + 1.3, 'Business model', 1590, 520, { align: 'center', maxW: 340 });
  banner(g, t, T('h8b') + 0.4, 'Earning even without interest', 1020, 690, PAL.pink, { px: 50, maxW: 1000 });
  popIcon(g, t, T('h8b') + 2.0, 'piggy', 1700, 770, 170);
  const au = eo(seg(t, T('h9') + 0.2, T('h9') + 0.8)); if (au > 0) arrow(g, [700, 830], [1300, 830], { u: au, bend: 0, fill: ACC, w: 7, head: 36, seed: 8, bob: (t / BEAT) % 1 });
  kick(g, 'Let\'s understand', 1000, 790, 52, PAL.ink, { alpha: pop(t, T('h9') + 0.3, 0.3), rot: -0.02 });
  host(g, t, 230, HY, 0.74, hk(s, ['both', 'wow'], [T('h8a'), 'point', 'happy'], [T('h9'), 'explain', 'happy']));
}

// ======================================================================= LESSON 1: players
const XS = { merchant: 380, acquirer: 760, network: 1140, issuer: 1520 };
const PLAYERS = {
  issuer:   { icon: 'bank',     label: 'Issuer',        sub: 'Your bank, which issued the card', n: 1, main: PAL.plum },
  merchant: { icon: 'shop',     label: 'Merchant',        sub: 'The shop you bought the phone from',     n: 2, main: PAL.coral },
  acquirer: { icon: 'terminal', label: 'Acquirer / PSP', sub: 'Lets the merchant accept cards', n: 3, main: PAL.blueD },
  network:  { icon: 'network',  label: 'Payment network',  sub: 'Visa · Mastercard · RuPay',        n: 4, main: PAL.avocadoD },
};
function playerCard(g, t, k, t0, y = 520) {
  const p = PLAYERS[k]; if (t < t0 - 0.01 && !K.COLLECT) return;
  iconCard(g, t, t0, p.icon, p.label, XS[k], y, { w: 290, h: 300, main: p.main, dark: shade(p.main, 0.25), sub: p.sub, seed: p.n });
  medal(g, t, t0 + 0.35, XS[k] - 130, y - 140, p.n, PAL.mustard, 40);
}
export function pl1(g, t, s) {
  stage(g, GROUND.blue);
  kick(g, 'One transaction', 1180, 280, 62, ACC, { alpha: pop(t, T('p1') + 0.2, 0.3) * (1 - seg(t, T('p3') - 0.3, T('p3'))) });
  iconCard(g, t, T('p2') + 0.2, 'shop', 'Store', 420, 540, { w: 300, h: 300, main: PAL.coral, dark: PAL.coralD });
  tag(g, t, T('p2') + 1.4, '₹10,000 phone', 420, 730, { align: 'center', maxW: 420 });
  popIcon(g, t, T('p3') + 0.3, 'terminal', 940, 520, 220, { main: PAL.blueD, dark: PAL.blueD });
  const au = eo(seg(t, T('p3') + 0.8, T('p3') + 1.5)); if (au > 0) arrow(g, [1480, 590], [1070, 540], { u: au, bend: 0.2, fill: ACC, w: 6, head: 30, seed: 9 });
  tag(g, t, T('p3') + 1.6, 'Card swipe', 1300, 625, { align: 'center', maxW: 340 });
  tag(g, t, T('p3') + 3.0, 'Payment done', 940, 690, { align: 'center', maxW: 340, star: '#3C8D5A' }); tick(g, t, T('p3') + 3.6, 1160, 735, 1.1);
  [0, 1, 2, 3].forEach(i => { const t0 = T('p4') + 0.5 + i * 0.4, k = pop(t, t0, 0.3); ev(t0, 'pop', { pan: panOf(1080 + i * 130), gain: 0.5 }); if (k > 0) { shape(g, ellipse(1080 + i * 130, 300, 46 * k, 46 * k, 40), { fill: PAL.paper, line: 4, seed: 610 + i, grain: 0.2 }); text(g, '?', 1080 + i * 130, 323, { font: `${Math.round(60 * k)}px Slab, DevaSlab`, fill: PAL.ink, align: 'center', off: [0, 0] }); } });
  tag(g, t, T('p4') + 0.2, 'Many players behind the scenes…', 1400, 400, { align: 'center', maxW: 560 });
  host(g, t, 1740, HY, 0.74, hk(s, ['hold', 'neutral'], [T('p3') + 0.6, 'point', 'happy'], [T('p4'), 'think', 'wow']), { dir: -1, prop: { kind: 'card', col: CARD, hand: 'F', dx: 36, dy: -14 } });
}
export function pl2(g, t, s) {
  stage(g, GROUND.blue);
  playerCard(g, t, 'issuer', T('p5') + 0.2); playerCard(g, t, 'merchant', T('p6') + 0.2);
  host(g, t, 130, HY, 0.62, hk(s, ['explain', 'happy'], [T('p6'), 'point', 'neutral']));
}
export function pl3(g, t, s) {
  stage(g, GROUND.blue);
  playerCard(g, t, 'issuer', -9); playerCard(g, t, 'merchant', -9);
  playerCard(g, t, 'acquirer', T('p7a') + 0.2); playerCard(g, t, 'network', T('p8a') + 0.2);
  host(g, t, 130, HY, 0.62, hk(s, ['point', 'neutral'], [T('p7a'), 'explain', 'happy'], [T('p8a'), 'point', 'neutral']));
}
export function pl4(g, t, s) {
  stage(g, GROUND.blue);
  ['merchant', 'acquirer', 'network', 'issuer'].forEach(k => { const p = PLAYERS[k]; icon(g, p.icon, XS[k], 330, 120, { main: p.main, dark: shade(p.main, 0.25), light: PAL.white }); medal(g, t, -9, XS[k] - 70, 270, p.n, PAL.mustard, 28); });
  ['issuer', 'network', 'acquirer'].forEach((k, i) => { const nx = ['network', 'acquirer', 'merchant'][i], u = eo(seg(t, T('p9') + 0.4 + i * 0.5, T('p9') + 0.9 + i * 0.5)); if (u > 0) arrow(g, [XS[k] - 100, 330], [XS[nx] + 100, 330], { u, bend: -0.2, fill: PAL.mustard, w: 6, head: 28, seed: 20 + i }); });
  body(g, 'The money trail', 960, 450, 28, { fill: PAL.ink, alpha: pop(t, T('p9') + 1.0, 0.3), w: 600 });
  body(g, 'You paid', 300, 565, 32, { align: 'left', alpha: pop(t, T('p10a') + 0.1, 0.3), w: 600 });
  bar(g, t, T('p10a') + 0.3, 300, 590, 1400, 80, [[1, PAL.mustard]]); slam(g, t, T('p10a') + 0.9, '₹10,000', 1000, 650, 54, { plate: null });
  body(g, 'Merchant received', 300, 745, 32, { align: 'left', alpha: pop(t, T('p10b') + 0.1, 0.3), w: 600 });
  bar(g, t, T('p10b') + 0.3, 300, 770, 1400, 80, [[0.8, PAL.mustardL], [0.2, PAL.paperD]]);
  slam(g, t, T('p10b') + 1.0, '?', 1600, 840, 90, { plate: null });
  host(g, t, 130, HY, 0.62, hk(s, ['explain', 'happy'], [T('p10b'), 'think', 'think']));
}
export function pl5(g, t, s) {
  stage(g, GROUND.blue); sunburst(g, 960, 430, 900, GROUND.blue, t, 0.35);
  slam(g, t, T('p11') + 0.1, 'Why?', 960, 360, 170);
  iconCard(g, t, T('p12') + 0.2, 'shop', 'Merchant', 520, 640, { w: 250, h: 250, main: PAL.coral, dark: PAL.coralD, size: 140, h2: 0 });
  iconCard(g, t, T('p12') + 0.9, 'terminal', 'Acquirer / PSP', 1180, 640, { w: 250, h: 250, main: PAL.blueD, dark: PAL.blueD });
  const au = eo(seg(t, T('p12') + 1.5, T('p12') + 2.2)); if (au > 0) arrow(g, [680, 640], [1020, 640], { u: au, bend: -0.2, fill: PAL.mustard, w: 6, head: 30, seed: 30 });
  tag(g, t, T('p12') + 2.3, 'Card payment fee', 850, 520, { align: 'center', maxW: 420, star: PAL.coral });
  stamp(g, t, T('p13') + 0.4, 'MDR', 1590, 520, PAL.ink, { px: 84, rot: -0.06 });
  body(g, 'Merchant Discount Rate', 1590, 625, 32, { alpha: pop(t, T('p13') + 1.0, 0.3), w: 600 });
  host(g, t, 130, HY, 0.62, hk(s, ['both', 'wow'], [T('p12'), 'explain', 'neutral'], [T('p13'), 'point', 'happy']));
}

// ======================================================================= LESSON 2: the fee
export function fee1(g, t, s) {
  stage(g, GROUND.coral); sunburst(g, 960, 360, 900, GROUND.coral, t, 0.4);
  banner(g, t, T('f1') + 1.0, 'Hypothetical example', 1450, 250, PAL.white, { px: 40, maxW: 520 });
  slam(g, t, T('f1') + 0.2, '1.5%', 760, 380, 200); body(g, 'The merchant\'s card-payment fee', 760, 480, 34, { alpha: pop(t, T('f1') + 0.9, 0.3), w: 600 });
  const e = pop(t, T('f2') + 0.1, 0.3); if (e > 0) { g.save(); g.translate(760, 600); g.scale(e, e); slab(g, '₹10,000 × 1.5% =', 0, 0, 76, {}); g.restore(); }
  slam(g, t, T('f2') + 1.6, '₹150', 1390, 600, 128, { fill: PAL.white, plate: PAL.ink, off: [6, 6] }); ev(T('f2') + 1.6, 'ding', { gain: 0.9 });
  const bx = 260, bw = 1400, by = 740, fee = bw * 0.015;
  bar(g, t, T('f3a') + 0.2, bx, by, bw, 70, [[0.985, PAL.mustard], [0.015, PAL.ink]], { d: 1.0 });
  tag(g, t, T('f3a') + 1.3, 'Merchant gets ₹9,850', 700, 660, { align: 'center', maxW: 500, star: PAL.mustardD });
  const lu = eo(seg(t, T('f3b') + 0.2, T('f3b') + 0.8)); if (lu > 0) { ink(g, [[bx + bw - fee / 2, by - 4], [bx + bw - fee / 2 - 40, by - 50]], 4, { seed: 31, upto: lu }); }
  tag(g, t, T('f3b') + 0.9, '₹150 → payment-ecosystem charges', 1660, 640, { align: 'right', maxW: 620, star: PAL.ink });
  body(g, 'This bar is drawn to scale', 960, 870, 28, { alpha: pop(t, T('f3b') + 2.2, 0.3), w: 500, fill: PAL.ink });
  host(g, t, 120, HY, 0.6, hk(s, ['explain', 'happy'], [T('f2'), 'point', 'wow'], [T('f3a'), 'explain', 'happy']));
}
export function fee2(g, t, s) {
  stage(g, GROUND.coral); sunburst(g, 960, 480, 900, GROUND.coral, t, 0.3);
  stamp(g, t, T('f4a') + 0.3, 'JUST AN EXAMPLE', 960, 300, PAL.ink, { px: 76, rot: -0.04 });
  ['Card type', 'Merchant category', 'Payment setup', 'Agreement'].forEach((x, i) => tag(g, t, T('f4b') + 0.3 + i * 1.1, x, 640 + (i % 2) * 640, 470 + Math.floor(i / 2) * 120, { align: 'center', maxW: 480, seed: i }));
  banner(g, t, T('f4b') + 4.2, 'The real fee can differ', 960, 790, PAL.white, { px: 46, maxW: 1100 });
  host(g, t, 160, HY, 0.66, hk(s, ['explain', 'neutral'], [T('f4b'), 'point', 'focus']));
}
const SL = [{ k: 'a', a0: Math.PI * 0.5, a1: Math.PI * 1.17, col: PAL.blue, name: 'Acquirer / PSP charge' }, { k: 'b', a0: Math.PI * 1.17, a1: Math.PI * 1.83, col: '#B08BB0', name: 'Card network charge' }, { k: 'c', a0: Math.PI * 1.83, a1: Math.PI * 2.5, col: PAL.mustard, name: 'Interchange fee' }];
function slicePts(cx, cy, r, a0, a1) { const p = [[cx, cy]]; for (let i = 0; i <= 24; i++) { const a = a0 + (a1 - a0) * i / 24; p.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return p; }
const COIN = (g, t, t0, x, y, r) => { const k = pop(t, t0, 0.35); if (k <= 0) return; ev(t0, 'pop', { pan: panOf(x) }); shape(g, ellipse(x, y, r * k, r * k, 64), { fill: PAL.mustard, line: 4.5, seed: 620, grain: 0.25, breaks: 0.2, shade: [{ pts: ellipse(x + 30, y + 36, r, r, 40), color: PAL.mustardD, alpha: 0.35 }] }); };
export function fee3a(g, t, s) {
  stage(g, GROUND.coral); sunburst(g, 700, 520, 800, GROUND.coral, t, 0.3);
  COIN(g, t, T('f5') + 0.1, 700, 520, 200); slab(g, '₹150', 700, 548, 86 * pop(t, T('f5') + 0.4, 0.3), { plate: PAL.white });
  slam(g, t, T('f5') + 1.2, '?', 1000, 330, 140);
  iconCard(g, t, T('f6') + 0.1, 'bank', 'Issuer bank', 1500, 480, { w: 290, h: 300, main: PAL.plum, dark: PAL.plum, sub: 'Gave you the card' });
  const au = eo(seg(t, T('f6') + 0.9, T('f6') + 1.6)); if (au > 0) arrow(g, [930, 540], [1330, 500], { u: au, bend: -0.12, fill: PAL.mustard, w: 7, head: 32, seed: 41 });
  tag(g, t, T('f6') + 1.8, 'The full ₹150', 1130, 640, { align: 'center', maxW: 300 }); cross(g, t, T('f6') + 2.5, 1130, 560, 2.2, PAL.ink);
  host(g, t, 160, HY, 0.66, hk(s, ['think', 'think'], [T('f6'), 'point', 'neutral']));
}
export function fee3b(g, t, s) {
  stage(g, GROUND.coral);
  const cx = 700, cy = 520, R = 200;
  COIN(g, t, -9, cx, cy, R);
  const when = { a: T('f7a') + 0.4, b: T('f7b') + 0.3, c: T('f7b') + 2.8 };
  SL.forEach((sl, i) => { const u = eo(seg(t, when[sl.k], when[sl.k] + 0.4)); ev(when[sl.k], 'pop', { pan: -0.3 }); if (u > 0) shape(g, slicePts(cx, cy, R * 0.98, sl.a0, lerp(sl.a0, sl.a1, u)), { fill: sl.col, line: 4.5, seed: 621 + i, grain: 0.25, breaks: 0.1 }); });
  const cv = 1 - eo(seg(t, when.a, when.a + 0.3)); if (cv > 0) { g.save(); g.globalAlpha = cv; slab(g, '₹150', cx, cy + 28, 86, {}); g.restore(); }
  tag(g, t, when.a + 0.6, 'Acquirer / PSP', 500, 740, { align: 'right', maxW: 440, star: PAL.blueD }); tag(g, t, when.b + 0.6, 'Card network', 700, 250, { align: 'center', maxW: 400, star: '#8A5F8A' });
  tag(g, t, when.c + 0.6, 'Interchange fee', 930, 690, { align: 'left', maxW: 420, star: PAL.mustardD });
  iconCard(g, t, -9, 'bank', 'Issuer bank', 1500, 480, { w: 290, h: 300, main: PAL.plum, dark: PAL.plum, sub: 'Gave you the card' });
  const au = eo(seg(t, T('f8a') + 0.3, T('f8a') + 1.0)); if (au > 0) arrow(g, [1150, 690], [1370, 600], { u: au, bend: -0.2, fill: PAL.mustard, w: 7, head: 32, seed: 40 });
  stamp(g, t, T('f7a') + 1.2, 'Split varies · NOT TO SCALE', 1100, 850, PAL.ink, { px: 28, rot: -0.02 });
  host(g, t, 1770, HY, 0.58, hk(s, ['explain', 'neutral'], [T('f7a'), 'point', 'focus'], [T('f8a'), 'pointUp', 'happy']), { dir: -1 });
}
export function fee4a(g, t, s) {
  stage(g, GROUND.coral);
  const rx = 560, ry = 250, rw = 800, rh = 500, k = pop(t, T('f9') + 0.1, 0.3);
  if (k > 0) { g.save(); g.translate(rx + rw / 2, ry + rh / 2); g.scale(k, k); g.translate(-(rx + rw / 2), -(ry + rh / 2)); shape(g, rrect(rx, ry, rw, rh, 20), { fill: PAL.paper, line: 4, seed: 630, grain: 0.2, off: [8, 7] }); body(g, 'Your bill', rx + rw / 2, ry + 66, 40, { w: 600 }); ink(g, [[rx + 40, ry + 92], [rx + rw - 40, ry + 92]], 3, { seed: 632, breaks: 0.2 }); g.restore(); }
  [['Spent ₹10,000', 'f10', 0.3], ['Full bill, on time', 'f10', 3.4], ['Interest to the bank: ₹0', 'f10', 6.4]].forEach(([x, id, o], i) => { const t0 = T(id) + o; body(g, x, rx + 70, ry + 190 + i * 110, 44, { align: 'left', alpha: pop(t, t0, 0.3), w: 500 }); tick(g, t, t0 + 0.4, rx + rw - 80, ry + 174 + i * 110, 1.3); });
  popIcon(g, t, T('f9') + 0.3, 'card', 1580, 420, 200);
  host(g, t, 200, HY, 0.7, hk(s, ['think', 'think'], [T('f10'), 'explain', 'neutral'], [T('f10') + 6, 'point', 'happy']));
}
export function fee4b(g, t, s) {
  stage(g, GROUND.coral); sunburst(g, 1250, 480, 900, GROUND.coral, t, 0.3);
  iconCard(g, t, T('f11') + 0.2, 'bank', 'Issuer bank', 520, 470, { w: 280, h: 290, main: PAL.plum, dark: PAL.plum });
  const au = eo(seg(t, T('f11') + 0.9, T('f11') + 1.7)); if (au > 0) arrow(g, [960, 470], [700, 470], { u: au, bend: 0.2, fill: PAL.mustard, w: 7, head: 32, seed: 50 });
  popIcon(g, t, T('f11') + 0.9, 'shop', 1090, 470, 190, { main: PAL.coralD, dark: PAL.coralD });
  tag(g, t, T('f11') + 2.2, 'A share of merchant-side income', 850, 650, { align: 'center', maxW: 620, star: PAL.mustardD });
  medal(g, t, T('f12') + 0.3, 1580, 330, 1, PAL.mustard, 66, { gain: 0.9 }); banner(g, t, T('f12') + 0.7, 'The first big reason', 1560, 470, PAL.white, { px: 38, maxW: 520 });
  popIcon(g, t, T('f13') + 0.1, 'card', 1480, 700, 140);
  const lu = eo(seg(t, T('f13') + 0.8, T('f13') + 1.6)); if (lu > 0) { ink(g, spline([[1580, 640], [1700, 690], [1620, 770], [1470, 790], [1380, 740]], false, 8), 6, { color: PAL.ink, seed: 52, upto: lu }); }
  tag(g, t, T('f13') + 1.4, 'Banks want the card used more', 960, 835, { align: 'center', maxW: 760 });
  host(g, t, 150, HY, 0.66, hk(s, ['explain', 'neutral'], [T('f12'), 'fist', 'happy'], [T('f13'), 'point', 'wink']));
}

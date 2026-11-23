// parts.js: the page's own drawings (icons, the host doodle). Everything is registered on the stroke timeline (engine.js).
// Order inside one element: outline -> paper fill -> marker -> shadow -> label. Yellow only on the money thread.
function slow(o, k, fn) { const prev = SCL; SCL = { o, k }; const r = fn(); SCL = prev; return r; }
let SCL = null;
const _addEl = addEl;
addEl = function (t0, d, kind, draw, wx) { if (SCL) { t0 = SCL.o + (t0 - SCL.o) * SCL.k; d = d * SCL.k; } return _addEl(t0, d, kind, draw, wx); };

// a closed shape: paper fill, marker, pen outline
function shape(pts, t0, d = 0.4, o = {}) {
  FILL(pts, t0);
  if (o.mark !== false) MRK([pts, ...(o.shade ? [shift(pts, -6, -7)] : [])], { col: o.col || GRY, w: o.mw || 12, ang: o.ang == null ? -0.55 : o.ang }, t0 + d * 0.5, d * 0.35);
  if (o.sh) dropShadow(pts, 7, 8, t0 + d * 0.8, 0.1);
  return INK_(pts, { closed: true, w: o.w || 3, amp: o.amp == null ? 0.9 : o.amp, passes: o.passes || 2 }, t0, d * 0.7);
}
const note = (s, x, y, size, t0, o = {}) => TXT(s, x, y, size, { f: 'PH', col: INK2, ...o }, t0, o.d);
const head = (s, x, y, size, t0, o = {}) => TXT(s, x, y, size, { f: 'KB', ...o }, t0, o.d);
function swash(x0, x1, y, w, t0, d = 0.3) { return MST(bez([x0, y + 4], [x0 + (x1 - x0) * 0.3, y - 6], [x0 + (x1 - x0) * 0.7, y + 3], [x1, y - 3]), { w, col: YEL, amp: 1.2 }, t0, d); }
function circleNote(cx, cy, rx, ry, t0, d = 0.5, col = YELD) { return MST(ell(cx, cy, rx, ry, -0.5, -0.5 + TAU * 1.04, 80), { w: 7, col, amp: 2 }, t0, d); }
function tick(x, y, s, t0) { return INK_([[x - 14 * s, y], [x - 4 * s, y + 12 * s], [x + 16 * s, y - 14 * s]], { w: 4.2, amp: 0.5, passes: 1 }, t0, 0.2); }
function cross(x, y, s, t0) { INK_(line(x - 16 * s, y - 16 * s, x + 16 * s, y + 16 * s), { w: 4.2, amp: 0.4, passes: 1 }, t0, 0.12); return INK_(line(x + 16 * s, y - 16 * s, x - 16 * s, y + 16 * s), { w: 4.2, amp: 0.4, passes: 1 }, t0 + 0.12, 0.12); }
function labelTag(x, y, w, s, size, t0, o = {}) { const b = rrect(x - w / 2, y - 34, w, 66, 16); shape(b, t0, 0.3, { col: o.col || GRY, sh: true }); return note(s, x, y + 10, size, t0 + 0.2, { align: 'center', col: INK, ...o.t }); }

// ---------- icons ----------
function cardIcon(cx, cy, s, t0, yel = false) {
  const b = rrect(cx - 90 * s, cy - 56 * s, 180 * s, 112 * s, 14 * s);
  dropShadow(b, 8 * s, 9 * s, t0 + 0.35, 0.12);
  FILL(b, t0); MRK([b], { col: yel ? YEL : GRY, w: 14 }, t0 + 0.28, 0.2);
  INK_(b, { closed: true, w: 3.4, amp: 1 }, t0, 0.38);
  const st = [[cx - 90 * s, cy - 30 * s], [cx + 90 * s, cy - 30 * s], [cx + 90 * s, cy - 10 * s], [cx - 90 * s, cy - 10 * s]];
  MRK([st], { col: GRYD, w: 8, edge: false }, t0 + 0.4, 0.1);
  const chip = rrect(cx - 66 * s, cy + 4 * s, 40 * s, 30 * s, 6 * s);
  FILL(chip, t0 + 0.42); INK_(chip, { closed: true, w: 2.4, amp: 0.4, passes: 1 }, t0 + 0.42, 0.1);
  INK_(line(cx - 6 * s, cy + 26 * s, cx + 60 * s, cy + 26 * s), { w: 2, amp: 0.5, passes: 1 }, t0 + 0.5, 0.1);
  return t0 + 0.6;
}
function bankIcon(cx, cy, s, t0) {
  const roof = [[cx - 100 * s, cy - 30 * s], [cx, cy - 92 * s], [cx + 100 * s, cy - 30 * s]];
  const base = rrect(cx - 104 * s, cy + 58 * s, 208 * s, 22 * s, 4), step = rrect(cx - 116 * s, cy + 80 * s, 232 * s, 16 * s, 4);
  shape(step, t0, 0.2, { mark: true, w: 2.6 }); shape(base, t0 + 0.1, 0.2, { w: 2.6 });
  for (let i = 0; i < 4; i++) { const x = cx - 66 * s + i * 44 * s, c = rrect(x - 11 * s, cy - 26 * s, 22 * s, 82 * s, 4); shape(c, t0 + 0.2 + i * 0.05, 0.2, { w: 2.4, mw: 8 }); }
  shape(roof, t0 + 0.4, 0.3, { col: GRY2, w: 3 });
  const r = ell(cx, cy - 52 * s, 9 * s, 9 * s, 0, TAU, 20); FILL(r, t0 + 0.6); INK_(r, { closed: true, w: 2, amp: 0.2, passes: 1 }, t0 + 0.6, 0.06);
  return t0 + 0.75;
}
function shopIcon(cx, cy, s, t0) {
  const body = rrect(cx - 92 * s, cy - 10 * s, 184 * s, 100 * s, 8); shape(body, t0, 0.3, { w: 3 });
  const aw = [[cx - 104 * s, cy - 10 * s], [cx - 84 * s, cy - 58 * s], [cx + 84 * s, cy - 58 * s], [cx + 104 * s, cy - 10 * s]];
  for (let i = 0; i < 6; i++) { const x = cx - 104 * s + i * 34.7 * s; const st = [[x, cy - 10 * s], [x + 34.7 * s, cy - 10 * s], [x + 30 * s, cy - 56 * s], [x + 4 * s, cy - 56 * s]]; if (i % 2 == 0) MRK([st], { col: GRY2, w: 10, edge: false }, t0 + 0.35 + i * 0.03, 0.08); }
  INK_(aw.concat([aw[0]]), { w: 3, amp: 0.8 }, t0 + 0.3, 0.3);
  const door = rrect(cx - 18 * s, cy + 30 * s, 36 * s, 60 * s, 4); shape(door, t0 + 0.5, 0.2, { w: 2.4, mw: 8 });
  const win = rrect(cx + 36 * s, cy + 20 * s, 40 * s, 34 * s, 4); INK_(win, { closed: true, w: 2.4, amp: 0.4, passes: 1 }, t0 + 0.6, 0.12);
  return t0 + 0.75;
}
function phoneIcon(cx, cy, s, t0) {
  const b = rrect(cx - 40 * s, cy - 70 * s, 80 * s, 140 * s, 16 * s); shape(b, t0, 0.35, { w: 3.2, sh: true });
  const sc = rrect(cx - 31 * s, cy - 56 * s, 62 * s, 100 * s, 6); INK_(sc, { closed: true, w: 2, amp: 0.4, passes: 1 }, t0 + 0.35, 0.15);
  INK_(ell(cx, cy + 58 * s, 5 * s, 5 * s, 0, TAU, 14), { w: 2, amp: 0.1, passes: 1, closed: true }, t0 + 0.5, 0.05);
  return t0 + 0.6;
}
function terminalIcon(cx, cy, s, t0) {
  const b = rrect(cx - 56 * s, cy - 62 * s, 112 * s, 130 * s, 12 * s); shape(b, t0, 0.35, { w: 3.2, sh: true });
  const sc = rrect(cx - 40 * s, cy - 48 * s, 80 * s, 34 * s, 4); FILL(sc, t0 + 0.3); MRK([sc], { col: GRY2, w: 8 }, t0 + 0.34, 0.08); INK_(sc, { closed: true, w: 2.2, amp: 0.4, passes: 1 }, t0 + 0.3, 0.1);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) INK_(ell(cx - 24 * s + c * 24 * s, cy + 2 * s + r * 22 * s, 4.2 * s, 4.2 * s, 0, TAU, 12), { w: 2, amp: 0.1, passes: 1, closed: true }, t0 + 0.42 + (r * 3 + c) * 0.02, 0.04);
  return t0 + 0.75;
}
function networkIcon(cx, cy, s, t0) {
  const nodes = [[-80, -50], [80, -50], [-80, 54], [80, 54]];
  nodes.forEach(([x, y], i) => INK_(line(cx, cy, cx + x * s, cy + y * s), { w: 2.6, amp: 0.5, passes: 1 }, t0 + 0.05 * i, 0.12));
  nodes.forEach(([x, y], i) => { const c = ell(cx + x * s, cy + y * s, 17 * s, 17 * s, 0, TAU, 30); shape(c, t0 + 0.2 + i * 0.05, 0.18, { w: 2.6, mw: 8 }); });
  const h = ell(cx, cy, 34 * s, 34 * s, 0, TAU, 40); shape(h, t0 + 0.4, 0.3, { col: GRY2, w: 3.2 });
  INK_(ell(cx, cy, 14 * s, 14 * s, 0, TAU, 24), { closed: true, w: 2.2, amp: 0.3, passes: 1 }, t0 + 0.6, 0.1);
  return t0 + 0.75;
}
function coinIcon(cx, cy, r, t0, yel = true, label = '₹') {
  const c = ell(cx, cy, r, r, 0, TAU, 50); dropShadow(c, r * 0.12, r * 0.14, t0 + 0.3, 0.1);
  FILL(c, t0); MRK([c], { col: yel ? YEL : GRY, w: 12 }, t0 + 0.2, 0.18); MRK([c, shift(c, -r * 0.1, -r * 0.12)], { col: yel ? YELS : GRY2, w: 8 }, t0 + 0.34, 0.08);
  INK_(c, { closed: true, w: 3, amp: 0.8 }, t0, 0.3);
  INK_(ell(cx, cy, r * 0.78, r * 0.78, 0, TAU, 40), { closed: true, w: 1.6, amp: 0.3, passes: 1, alpha: 0.7 }, t0 + 0.3, 0.2);
  if (label) TXT(label, cx, cy + r * 0.3, r * 0.9, { f: 'KB', align: 'center', jit: 0.4 }, t0 + 0.35, 0.18);
  return t0 + 0.6;
}
function calendarIcon(cx, cy, s, t0, mark = true) {
  const b = rrect(cx - 80 * s, cy - 70 * s, 160 * s, 140 * s, 12 * s); shape(b, t0, 0.35, { w: 3.2, sh: true, col: GRY });
  const hd = [[cx - 80 * s, cy - 70 * s], [cx + 80 * s, cy - 70 * s], [cx + 80 * s, cy - 36 * s], [cx - 80 * s, cy - 36 * s]]; MRK([hd], { col: GRY2, w: 10, edge: false }, t0 + 0.3, 0.1);
  for (let i = 1; i < 4; i++) INK_(line(cx - 80 * s + i * 40 * s, cy - 36 * s, cx - 80 * s + i * 40 * s, cy + 70 * s), { w: 1.6, amp: 0.4, passes: 1, alpha: 0.8 }, t0 + 0.4 + i * 0.03, 0.1);
  for (let i = 1; i < 3; i++) INK_(line(cx - 80 * s, cy - 36 * s + i * 35 * s, cx + 80 * s, cy - 36 * s + i * 35 * s), { w: 1.6, amp: 0.4, passes: 1, alpha: 0.8 }, t0 + 0.5 + i * 0.03, 0.1);
  INK_(line(cx - 40 * s, cy - 84 * s, cx - 40 * s, cy - 58 * s), { w: 4, amp: 0.2, passes: 1 }, t0 + 0.55, 0.05); INK_(line(cx + 40 * s, cy - 84 * s, cx + 40 * s, cy - 58 * s), { w: 4, amp: 0.2, passes: 1 }, t0 + 0.58, 0.05);
  if (mark) circleNote(cx + 40 * s, cy + 34 * s, 22 * s, 20 * s, t0 + 0.7, 0.35);
  return t0 + 0.8;
}
function atmIcon(cx, cy, s, t0) {
  const b = rrect(cx - 60 * s, cy - 90 * s, 120 * s, 180 * s, 12 * s); shape(b, t0, 0.35, { w: 3.2, sh: true });
  const sc = rrect(cx - 44 * s, cy - 74 * s, 88 * s, 50 * s, 5); FILL(sc, t0 + 0.3); MRK([sc], { col: GRY2, w: 8 }, t0 + 0.34, 0.08); INK_(sc, { closed: true, w: 2.2, amp: 0.4, passes: 1 }, t0 + 0.3, 0.1);
  const sl = rrect(cx - 36 * s, cy + 6 * s, 72 * s, 12 * s, 4); MRK([sl], { col: GRYD, w: 6, edge: false }, t0 + 0.45, 0.06); INK_(sl, { closed: true, w: 2, amp: 0.2, passes: 1 }, t0 + 0.45, 0.06);
  INK_(rrect(cx - 30 * s, cy + 40 * s, 60 * s, 34 * s, 4), { closed: true, w: 2, amp: 0.3, passes: 1 }, t0 + 0.55, 0.1);
  return t0 + 0.7;
}
function giftIcon(cx, cy, s, t0) {
  const b = rrect(cx - 60 * s, cy - 20 * s, 120 * s, 90 * s, 8); shape(b, t0, 0.3, { w: 3, sh: true });
  const lid = rrect(cx - 68 * s, cy - 50 * s, 136 * s, 34 * s, 8); shape(lid, t0 + 0.2, 0.25, { w: 3, col: GRY2 });
  MRK([[[cx - 10 * s, cy - 50 * s], [cx + 10 * s, cy - 50 * s], [cx + 10 * s, cy + 70 * s], [cx - 10 * s, cy + 70 * s]]], { col: GRYD, w: 8, edge: false }, t0 + 0.4, 0.1);
  INK_(bez([cx, cy - 50 * s], [cx - 50 * s, cy - 100 * s], [cx - 54 * s, cy - 56 * s], [cx, cy - 50 * s], 20), { w: 2.6, amp: 0.4, passes: 1 }, t0 + 0.5, 0.15);
  INK_(bez([cx, cy - 50 * s], [cx + 50 * s, cy - 100 * s], [cx + 54 * s, cy - 56 * s], [cx, cy - 50 * s], 20), { w: 2.6, amp: 0.4, passes: 1 }, t0 + 0.6, 0.15);
  return t0 + 0.8;
}
function bookletIcon(cx, cy, s, t0) {
  const b = rrect(cx - 70 * s, cy - 50 * s, 140 * s, 100 * s, 6); shape(b, t0, 0.3, { w: 3, sh: true });
  INK_(line(cx, cy - 50 * s, cx, cy + 50 * s), { w: 2.4, amp: 0.3, passes: 1 }, t0 + 0.3, 0.1);
  for (let i = 0; i < 4; i++) { INK_(line(cx - 56 * s, cy - 28 * s + i * 20 * s, cx - 14 * s, cy - 28 * s + i * 20 * s), { w: 1.6, amp: 0.4, passes: 1 }, t0 + 0.4 + i * 0.04, 0.08); INK_(line(cx + 14 * s, cy - 28 * s + i * 20 * s, cx + 56 * s, cy - 28 * s + i * 20 * s), { w: 1.6, amp: 0.4, passes: 1 }, t0 + 0.45 + i * 0.04, 0.08); }
  return t0 + 0.7;
}
function globeIcon(cx, cy, s, t0) {
  const c = ell(cx, cy, 60 * s, 60 * s, 0, TAU, 60); shape(c, t0, 0.35, { w: 3.2, sh: true });
  INK_(ell(cx, cy, 24 * s, 60 * s, 0, TAU, 50), { closed: true, w: 1.8, amp: 0.4, passes: 1 }, t0 + 0.35, 0.2);
  INK_(line(cx - 60 * s, cy, cx + 60 * s, cy), { w: 1.8, amp: 0.4, passes: 1 }, t0 + 0.5, 0.1);
  return t0 + 0.7;
}
function scaleIcon(cx, cy, s, t0) {   // a balance: post, beam, two pans
  INK_(line(cx, cy + 150 * s, cx, cy - 90 * s), { w: 4, amp: 0.8 }, t0, 0.3);
  shape(rrect(cx - 80 * s, cy + 150 * s, 160 * s, 18 * s, 6), t0 + 0.2, 0.2, { w: 3 });
  INK_(line(cx - 300 * s, cy - 70 * s, cx + 300 * s, cy - 70 * s), { w: 4.4, amp: 0.8 }, t0 + 0.3, 0.4);
  for (const sd of [-1, 1]) {
    const px = cx + sd * 300 * s;
    INK_(line(px, cy - 70 * s, px - 70 * s, cy + 60 * s), { w: 2.2, amp: 0.4, passes: 1 }, t0 + 0.55, 0.15); INK_(line(px, cy - 70 * s, px + 70 * s, cy + 60 * s), { w: 2.2, amp: 0.4, passes: 1 }, t0 + 0.6, 0.15);
    const pan = [[px - 100 * s, cy + 60 * s], [px + 100 * s, cy + 60 * s], [px + 70 * s, cy + 96 * s], [px - 70 * s, cy + 96 * s]];
    shape(pan, t0 + 0.7, 0.3, { w: 3, col: GRY2 });
  }
  return t0 + 1.1;
}
// the host: a doodle boy in ink and grey marker. pose: 'point' (right arm out), 'wave', 'shrug', 'think'
function host(cx, cy, s, t0, pose = 'point', flip = 1) {
  const X = x => cx + x * s * flip, Y = y => cy + y * s;
  const P = pts => pts.map(([x, y]) => [X(x), Y(y)]);
  // legs and shoes
  for (const [lx, a] of [[-18, 0], [14, 0]]) { const leg = P(rrect(lx - 16, 36, 32, 100, 10)); shape(leg, t0, 0.2, { w: 2.8, mw: 9, col: GRY2 }); }
  for (const lx of [-20, 16]) { const sh = P(ell(lx + 4, 140, 26, 12, 0, TAU, 24)); shape(sh, t0 + 0.2, 0.15, { w: 2.6, mw: 6, mark: false }); }
  // jacket, T-shirt, scarf
  const jk = P(rrect(-50, -66, 100, 108, 22)); shape(jk, t0 + 0.25, 0.3, { w: 3, col: GRY, sh: true });
  INK_(P([[-8, -64], [0, 20], [8, -64]]), { w: 2, amp: 0.4, passes: 1 }, t0 + 0.5, 0.12);
  const sc = P([[-34, -72], [34, -72], [36, -54], [14, -48], [-14, -48], [-36, -54]]); shape(sc, t0 + 0.45, 0.25, { w: 2.6, col: GRYD, mw: 8 });
  const tl = P([[8, -52], [28, -52], [30, 0], [14, 4]]); shape(tl, t0 + 0.55, 0.2, { w: 2.4, col: GRYD, mw: 8 });
  // arms
  if (pose === 'point') {
    INK_(P(bez([48, -50], [84, -62], [110, -82], [134, -92], 14)), { w: 6, amp: 0.5, passes: 1 }, t0 + 0.6, 0.2);
    INK_(P(ell(142, -94, 9, 8, 0, TAU, 14)), { closed: true, w: 2.4, amp: 0.2, passes: 1 }, t0 + 0.75, 0.06);
    INK_(P([[-48, -46], [-62, -6], [-56, 24]]), { w: 6, amp: 0.4, passes: 1 }, t0 + 0.65, 0.15);
  } else if (pose === 'wave') {
    INK_(P(bez([48, -50], [84, -70], [96, -110], [92, -140], 14)), { w: 6, amp: 0.5, passes: 1 }, t0 + 0.6, 0.2);
    INK_(P(ell(92, -148, 11, 10, 0, TAU, 14)), { closed: true, w: 2.4, amp: 0.2, passes: 1 }, t0 + 0.75, 0.06);
    INK_(P([[-48, -46], [-62, -6], [-56, 24]]), { w: 6, amp: 0.4, passes: 1 }, t0 + 0.65, 0.15);
  } else if (pose === 'shrug') {
    INK_(P(bez([48, -50], [78, -52], [96, -30], [92, -6], 14)), { w: 6, amp: 0.5, passes: 1 }, t0 + 0.6, 0.2); INK_(P(bez([-48, -50], [-78, -52], [-96, -30], [-92, -6], 14)), { w: 6, amp: 0.5, passes: 1 }, t0 + 0.65, 0.2);
  } else {   // think: hand to chin
    INK_(P(bez([48, -50], [70, -40], [40, -50], [10, -82], 14)), { w: 6, amp: 0.5, passes: 1 }, t0 + 0.6, 0.2);
    INK_(P([[-48, -46], [-62, -6], [-56, 24]]), { w: 6, amp: 0.4, passes: 1 }, t0 + 0.65, 0.15);
  }
  // head: face, hair in grey marker, curls in pen
  const hd = P(ell(0, -112, 36, 40, 0, TAU, 50)); shape(hd, t0 + 0.8, 0.3, { w: 3, col: GRY, mark: false });
  const hair = P(ell(-2, -132, 42, 26, 0, TAU, 40)); FILL(hair, t0 + 1.0); MRK([hair], { col: GRYD, w: 10, edge: false }, t0 + 1.05, 0.12);
  for (let i = 0; i < 8; i++) { const a = Math.PI * (1.1 + i * 0.1), r = 44; INK_(P(ell(Math.cos(a) * r, -128 + Math.sin(a) * 34, 9, 9, 0, TAU * 0.8, 12)), { w: 2.4, amp: 0.2, passes: 1 }, t0 + 1.1 + i * 0.02, 0.05); }
  INK_(P(ell(-2, -132, 42, 26, Math.PI * 1.02, Math.PI * 1.98, 30)), { w: 3, amp: 0.8, passes: 1 }, t0 + 1.0, 0.2);
  for (const ex of [-13, 13]) INK_(P(ell(ex, -112, 3.2, 4.2, 0, TAU, 10)), { closed: true, w: 3, amp: 0.1, passes: 1 }, t0 + 1.3, 0.04);
  INK_(P(bez([-12, -94], [-4, -86], [6, -86], [14, -94], 12)), { w: 2.6, amp: 0.3, passes: 1 }, t0 + 1.35, 0.1);
  return t0 + 1.5;
}

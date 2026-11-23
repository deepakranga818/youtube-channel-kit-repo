// PULL (needed by runtime.js): the final pull-back camera
const PULL = { from: [4380, 2640, 1.15], to: [2650, 1470, 0.34] };
// page.js: the page. Eight blocks on one sheet; each block is written when its narration plays (times come from timeline.json).
// The yellow thread is the ₹10,000 purchase and the ₹150 slice of it; yellow is also the banners, fat arrows and the three circled rules.
let TL = null; const T = id => TL.start[id], DN = id => TL.len[id], SEC0 = k => TL.lines.find(l => l.id[0] === k).t0;
const CAMK = []; const CK = (t, x, y, z) => CAMK.push([t, x, y, z]);
const CUE = {};
const BK = { 0: [0, 0], 1: [1800, 0], 2: [3600, 0], 3: [3600, 950], 4: [1800, 950], 5: [0, 950], 6: [0, 1900], 7: [1800, 1900] };
const twid = (s, size, f = 'KB') => { ctx.save(); ctx.font = `${size}px ${f}`; const w = ctx.measureText(s).width; ctx.restore(); return w; };
function blockBanner(k, label, t0, w = 640) { const [ox, oy] = BK[k]; slow(t0, 1.4, () => ribbon(ox + 850, oy + 56, w, 86, label, 48, t0, { d: 0.3, td: 0.5 })); }
function blockFrame(k, t0, h = 640) { const [ox, oy] = BK[k]; slow(t0, 3.0, () => box(ox + 14, oy + 120, 1672, h, t0, 0.5)); }

// ======================= B0: the question =======================
function B0() {
  const [ox, oy] = BK[0], X = x => ox + x, Y = y => oy + y;
  cardIcon(X(330), Y(330), 1.9, T('h1') + 0.1);
  head('CREDIT CARD', X(330), Y(520), 40, T('h1') + 0.9, { align: 'center' });
  // h2a: where you use it
  ['shopping', 'online payments', 'restaurant bills'].forEach((s, i) => { bullet(X(590), Y(232 + i * 62), T('h2a') + 0.2 + i * 1.5); note(s, X(612), Y(242 + i * 62), 34, T('h2a') + 0.3 + i * 1.5, { col: INK }); });
  // h2b: full bill on the due date
  calendarIcon(X(1060), Y(320), 1.2, T('h2b') + 0.1);
  note('due date se pehle', X(1060), Y(450), 28, T('h2b') + 1.4, { align: 'center' });
  note('poora bill pay', X(1060), Y(486), 28, T('h2b') + 2.0, { align: 'center' }); tick(X(1210), Y(472), 1.1, T('h2b') + 2.9);
  // h3: interest zero
  head('INTEREST = ', X(60), Y(620), 62, T('h3') + 0.3);
  const w = twid('INTEREST = ', 62), w0 = twid('₹0', 62);
  head('₹0', X(60 + w), Y(620), 62, T('h3') + 1.4); swash(X(60 + w - 6), X(60 + w + w0 + 6), Y(644), 50, T('h3') + 1.8, 0.25);
  // the bank and the question
  blockBanner(0, 'FREE KYUN?', T('h4') + 0.2, 560);
  bankIcon(X(1400), Y(350), 1.15, T('h5a') + 0.1);
  host(X(1620), Y(480), 0.85, T('h4') + 0.5, 'think');
  inkArrow(bez([X(1400), Y(470)], [X(1400), Y(520)], [X(1410), Y(570)], [X(1420), Y(604)]), { w: 3, amp: 0.8, head: 14 }, T('h5b') + 0.3, 0.4);
  labelTag(X(1440), Y(650), 340, 'credit card free?', 32, T('h5b') + 0.8);
  // h6: the perks
  ['cashback', 'reward points', 'lounge access', 'discounts'].forEach((s, i) => { const t0 = i < 2 ? T('h6a') + 0.3 + i * 1.8 : T('h6b') + (i - 2) * 1.2 - 0.2; labelTag(X(250 + i * 300), Y(740), 270, s, 28, t0); });
  // h7: loss? no!
  head('LOSS?', X(640), Y(540), 52, T('h7') + 0.1); const wl = twid('LOSS?', 52); cross(X(640 + wl + 40), Y(526), 1.6, T('h7') + 1.2);
  head('NAHI!', X(640 + wl + 100), Y(540), 56, T('h7') + 1.8, { col: INK });
  swash(X(640 + wl + 96), X(640 + wl + 100 + twid('NAHI!', 56) + 6), Y(562), 40, T('h7') + 1.9, 0.2);
  // h8: earns even without interest
  const ntxt = 'bank interest ke bina bhi kama sakta hai', wn = twid(ntxt, 30, 'PH');
  note(ntxt, X(250), Y(830), 30, T('h8b') + 0.4, { col: INK });
  swash(X(250 + wn * 0.5), X(250 + wn), Y(842), 32, T('h8b') + 3.0, 0.3);
  CK(0, X(330), Y(340), 3.4); CK(T('h1') + 3.6, X(330), Y(350), 2.7);
  CK(T('h2a') - 0.3, X(640), Y(300), 1.75); CK(T('h2b'), X(960), Y(330), 1.7);
  CK(T('h3') - 0.2, X(330), Y(560), 1.9); CK(T('h4') - 0.3, X(850), Y(380), 1.15);
  CK(T('h5a') - 0.2, X(1180), Y(360), 1.7); CK(T('h6a') - 0.3, X(760), Y(600), 1.5); CK(T('h7') - 0.3, X(900), Y(560), 1.9);
  CK(T('h8a') - 0.2, X(880), Y(560), 1.35); CK(T('h9') - 0.2, X(850), Y(430), 1.12);
}

// ======================= B1: four players =======================
function B1() {
  const [ox, oy] = BK[1], X = x => ox + x, Y = y => oy + y, y0 = 380;
  blockBanner(1, '1 · KAUN KAUN?', T('p1') + 0.2, 600);
  blockFrame(1, T('p1') + 0.7);
  // p2: you, the phone, the money
  phoneIcon(X(170), Y(y0), 1.15, T('p2') + 0.2);
  head('YOU', X(170), Y(y0 + 140), 32, T('p2') + 1.0, { align: 'center' });
  coinIcon(X(170), Y(250), 52, T('p2') + 1.8);
  head('₹10,000', X(170), Y(y0 + 215), 46, T('p2') + 2.6, { align: 'center' }); swash(X(60), X(280), Y(y0 + 228), 40, T('p2') + 3.7, 0.2);
  fatArrow(X(290), Y(y0), X(420), T('p3') + 0.4, { h: 26, hh: 30, hl: 30 });
  note('card swipe', X(355), Y(y0 - 44), 26, T('p3') + 1.3, { align: 'center' });
  // p4: background players
  note('background mein 4 players…', X(850), Y(190), 32, T('p4') + 0.3, { align: 'center', col: INK });
  // p5-p8: the four boxes, in the order the voice names them
  const nodeX = [500, 840, 1180, 1500];
  const lab = (x, n, name, sub, t) => { ribbon(X(x), Y(240), 64, 44, String(n), 30, t, { d: 0.22, td: 0.1 }); head(name, X(x), Y(y0 + 130), 30, t + 0.8, { align: 'center' }); note(sub, X(x), Y(y0 + 166), 25, t + 1.5, { align: 'center' }); };
  bankIcon(X(nodeX[3]), Y(y0), 1.0, T('p5') + 0.1); lab(nodeX[3], 1, 'ISSUER', 'your bank, gave the card', T('p5') + 0.9);
  shopIcon(X(nodeX[0]), Y(y0), 1.0, T('p6') + 0.1); lab(nodeX[0], 2, 'MERCHANT', 'the shop', T('p6') + 0.9);
  terminalIcon(X(nodeX[1]), Y(y0), 1.0, T('p7a') + 0.2); lab(nodeX[1], 3, 'ACQUIRER / PSP', 'lets shops take cards', T('p7b') + 0.3);
  networkIcon(X(nodeX[2]), Y(y0), 1.0, T('p8a') + 0.2); lab(nodeX[2], 4, 'NETWORK', 'Visa · Mastercard · RuPay', T('p8b') + 0.2);
  // p9: the money trail (the yellow thread)
  [[nodeX[0] + 110, nodeX[1] - 110], [nodeX[1] + 80, nodeX[2] - 110], [nodeX[2] + 110, nodeX[3] - 120]].forEach(([a, b], i) => fatArrow(X(a), Y(y0 + 6), X(b), T('p9') + 0.3 + i * 0.7, { h: 24, hh: 28, hl: 28 }));
  // p10-p13: not the full amount; why; the fee; MDR
  note('poore ₹10,000 nahi?', X(110), Y(712), 32, T('p10b') + 0.3, { col: INK });
  head('KYUN?', X(560), Y(660), 56, T('p11') + 0.05);
  const fb = rrect(X(800), Y(600), 480, 64, 16); shape(fb, T('p12') + 0.3, 0.3, { col: YEL, w: 3 });
  head('merchant ki FEE', X(1040), Y(646), 34, T('p12') + 0.7, { align: 'center' });
  head('MDR', X(1040), Y(738), 74, T('p13') + 0.7, { align: 'center' }); swash(X(930), X(1150), Y(752), 50, T('p13') + 2.2, 0.25);
  note('Merchant Discount Rate', X(1400), Y(728), 30, T('p13') + 3.1, { align: 'center' });
  CK(T('p1') - 0.5, X(850), Y(430), 1.12);
  CK(T('p2') - 0.3, X(240), Y(430), 1.9); CK(T('p4') - 0.3, X(860), Y(430), 1.3); CK(T('p5') - 0.3, X(1480), Y(460), 1.8); CK(T('p6') - 0.3, X(620), Y(460), 1.75);
  CK(T('p7a') - 0.3, X(900), Y(450), 1.7); CK(T('p8a') - 0.3, X(1200), Y(450), 1.7); CK(T('p9') - 0.3, X(900), Y(440), 1.25);
  CK(T('p10a') - 0.3, X(380), Y(560), 1.7); CK(T('p12') - 0.3, X(900), Y(560), 1.6); CK(T('p13') - 0.3, X(1100), Y(600), 1.7);
}

// ======================= B2: the merchant fee =======================
function B2() {
  const [ox, oy] = BK[2], X = x => ox + x, Y = y => oy + y;
  blockBanner(2, '2 · MERCHANT FEE', T('f1') + 0.1, 640);
  blockFrame(2, T('f1') + 0.8, 730);
  // left column: the numbers
  note('hypothetical example:', X(80), Y(205), 28, T('f1') + 1.0, { col: INK });
  head('fee = 1.5%', X(80), Y(275), 56, T('f1') + 2.0); const wa = twid('fee = ', 56), wb = twid('1.5%', 56);
  swash(X(80 + wa), X(80 + wa + wb), Y(294), 44, T('f1') + 3.8, 0.25);
  head('₹10,000', X(80), Y(380), 52, T('f2') + 0.1); head('× 1.5%', X(330), Y(380), 52, T('f2') + 1.0);
  head('= ₹150', X(540), Y(380), 62, T('f2') + 2.0); CUE.fee = T('f2') + 2.0;
  const w150 = twid('= ₹150', 62);
  swash(X(540), X(540 + w150), Y(402), 50, T('f2') + 3.1, 0.3); circleNote(X(540 + w150 / 2), Y(362), w150 / 2 + 24, 50, T('f2') + 3.5, 0.5);
  // f3: the payment to scale (150 is 1.5% of 10,000)
  const bx = 60, bw = 720, by = Y(470), sl = bw * 0.015;
  INK_([[X(bx), by], [X(bx + bw), by], [X(bx + bw), by + 50], [X(bx), by + 50], [X(bx), by]], { w: 3, amp: 0.9 }, T('f3a') + 0.1, 0.8);
  MRK([[[X(bx), by + 2], [X(bx + bw - sl), by + 2], [X(bx + bw - sl), by + 48], [X(bx), by + 48]]], { col: GRY, w: 14 }, T('f3a') + 0.6, 0.5);
  MRK([[[X(bx + bw - sl), by + 2], [X(bx + bw), by + 2], [X(bx + bw), by + 48], [X(bx + bw - sl), by + 48]]], { col: YEL, w: 10 }, T('f3a') + 1.4, 0.2);
  head('₹9,850', X(bx + 290), by + 112, 44, T('f3a') + 1.6, { align: 'center' }); note('merchant ko settlement', X(bx + 290), by + 148, 24, T('f3a') + 2.7, { align: 'center' });
  inkArrow(bez([X(bx + bw - 6), by + 84], [X(bx + bw - 6), by + 72], [X(bx + bw - 6), by + 64], [X(bx + bw - 6), by + 56]), { w: 3, amp: 0.3, head: 12 }, T('f3b') + 0.3, 0.3);
  head('₹150', X(bx + bw - 30), by + 124, 40, T('f3b') + 0.2, { align: 'center' }); note('ecosystem charges', X(bx + bw - 60), by + 158, 24, T('f3b') + 1.2, { align: 'center' });
  // f4: illustrative
  const tg = rrect(X(60), Y(660), 470, 56, 12); shape(tg, T('f4a') + 0.2, 0.3, { col: GRY2 });
  note('illustrative, not a standard MDR rate', X(295), Y(696), 27, T('f4a') + 0.7, { align: 'center', col: INK });
  note('actual fee varies: card type, merchant, setup', X(295), Y(750), 24, T('f4b') + 0.5, { align: 'center' });
  CK(T('f1') - 0.4, X(850), Y(480), 1.12);
  CK(T('f2') - 0.3, X(430), Y(380), 1.85); CK(T('f3a') - 0.3, X(420), Y(560), 1.55); CK(T('f3b') - 0.2, X(560), Y(560), 1.7);
  CK(T('f4a') - 0.3, X(300), Y(650), 1.8);
}
function B2b() {
  const [ox, oy] = BK[2], X = x => ox + x, Y = y => oy + y;
  const cx = X(1250), cy = Y(410), R = 105;
  head('who gets the ₹150?', X(900), Y(210), 34, T('f5') + 0.4);
  const wedge = (a0, a1) => { const p = [[cx, cy]]; for (let i = 0; i <= 24; i++) { const a = a0 + (a1 - a0) * i / 24; p.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]); } return p; };
  const ws = [[1.1, 3.2, GRY, T('f7a') + 0.4], [3.2, 5.283, GRY2, T('f7b') + 0.2], [-1.0, 1.1, YEL, T('f7b') + 3.0]];
  ws.forEach(([a0, a1, col, t]) => { const w = wedge(a0, a1); FILL(w, t); MRK([w], { col, w: 12 }, t + 0.2, 0.3); INK_(w.concat([w[0]]), { w: 3, amp: 0.8 }, t, 0.5); });
  head('ACQUIRER / PSP', X(1125), Y(525), 26, T('f7a') + 0.7, { align: 'right' });
  head('CARD NETWORK', X(1125), Y(300), 26, T('f7b') + 0.5, { align: 'right' });
  note('split varies · not to scale', X(1250), Y(560), 22, T('f7b') + 0.8, { align: 'center' });
  // f6: not all to your bank; f8: interchange goes to the issuer
  note('poora ₹150 aapke bank ko nahi', X(900), Y(615), 28, T('f6') + 0.5, { col: INK }); cross(X(1275), Y(604), 1.0, T('f6') + 2.6);
  head('INTERCHANGE FEE', X(1500), Y(335), 24, T('f7b') + 3.4, { align: 'center' });
  fatArrow(X(1380), Y(410), X(1470), T('f8b') + 0.3, { h: 20, hh: 26, hl: 24 });
  bankIcon(X(1565), Y(420), 0.62, T('f8a') + 0.3); head('ISSUER', X(1565), Y(512), 26, T('f8a') + 1.3, { align: 'center' });
  CK(T('f5') - 0.3, X(1180), Y(440), 1.55); CK(T('f7a') - 0.3, X(1220), Y(420), 1.8); CK(T('f8a') - 0.3, X(1400), Y(440), 1.75);
}
// f9-f13: the first reason
function B2c() {
  const [ox, oy] = BK[2], X = x => ox + x, Y = y => oy + y;
  [['₹10,000 spend', 0], ['poora bill, time par', 1], ['bank ko interest: ₹0', 2]].forEach(([s, i]) => { note(s, X(940), Y(668 + i * 46), 30, T('f10') + 0.4 + i * 2.6, { col: INK }); tick(X(910), Y(658 + i * 46), 0.8, T('f10') + 1.1 + i * 2.6); });
  note('but: issuer ko merchant-side income ka hissa', X(900), Y(812), 26, T('f11') + 0.4, { col: INK });
  ribbon(X(1500), Y(668), 290, 60, 'REASON #1', 34, T('f12') + 0.3, { d: 0.3, td: 0.4 });
  note('banks chahte hain', X(1500), Y(738), 26, T('f13') + 0.3, { align: 'center' });
  note('card zyada use karo', X(1500), Y(770), 26, T('f13') + 1.0, { align: 'center' });
  CK(T('f9') - 0.3, X(1250), Y(620), 1.45); CK(T('f12') - 0.3, X(1300), Y(700), 1.55); CK(T('f13'), X(1300), Y(660), 1.4);
}

// ======================= B3: interest =======================
function B3() {
  const [ox, oy] = BK[3], X = x => ox + x, Y = y => oy + y;
  blockBanner(3, '3 · INTEREST', T('i1') + 0.2, 560);
  blockFrame(3, T('i1') + 0.8);
  head('income #2', X(1220), Y(210), 44, T('i2') + 0.2); swash(X(1220), X(1450), Y(226), 38, T('i2') + 1.2, 0.2);
  note('interest / finance charges', X(1220), Y(262), 26, T('i2') + 1.4, { col: INK });
  // i3-i4: a timeline of the credit period
  const ly = Y(290); INK_([[X(110), ly], [X(1060), ly]], { w: 4, amp: 1 }, T('i3') + 0.4, 1.0);
  const marks = [[150, 'buy today'], [600, 'statement'], [1010, 'due date']];
  marks.forEach(([x, s], i) => { const c = ell(X(x), ly, 14, 14, 0, TAU, 20); MRK([c], { col: i == 2 ? YEL : GRY2, w: 8 }, T('i3') + 1.2 + i * 0.5, 0.1); INK_(c.concat([c[0]]), { w: 2.8, amp: 0.3, passes: 1 }, T('i3') + 1.2 + i * 0.5, 0.15); head(s, X(x), ly - 36, 30, T('i3') + 1.4 + i * 0.5, { align: 'center' }); });
  note('credit for a limited period', X(580), ly + 56, 28, T('i3') + 4.0, { align: 'center' });
  note('aaj kharido, baad mein pay', X(580), ly + 94, 28, T('i4') + 0.4, { align: 'center' });
  // i5: pay the total by the due date: interest-free
  INK_([[X(150), ly + 132], [X(150), ly + 150], [X(1010), ly + 150], [X(1010), ly + 132]], { w: 3, amp: 0.8 }, T('i5a') + 3.2, 0.6);
  head('TOTAL DUE paid', X(580), ly + 206, 38, T('i5a') + 0.3, { align: 'center' }); tick(X(880), ly + 194, 1.1, T('i5a') + 1.7);
  note('interest-free period', X(580), ly + 248, 28, T('i5b') + 0.5, { align: 'center' });
  // i6-i8: only the minimum: a balance that grows
  head('ONLY MINIMUM', X(1200), Y(380), 36, T('i6a') + 0.3); cross(X(1560), Y(368), 0.8, T('i6a') + 1.6);
  const stk = (n, x, y0, t0, col) => { for (let i = 0; i < n; i++) { const e = ell(x, y0 - i * 18, 52, 15, 0, TAU, 30); shape(e, t0 + i * 0.25, 0.2, { col: col(i), w: 2.6, mw: 8 }); } };
  stk(3, X(1290), Y(640), T('i6b') + 0.4, i => GRY); note('baaki bill', X(1290), Y(690), 26, T('i6b') + 2.0, { align: 'center' });
  inkArrow(bez([X(1370), Y(600)], [X(1420), Y(570)], [X(1470), Y(530)], [X(1500), Y(480)]), { w: 3, amp: 0.6, head: 14 }, T('i7') + 0.3, 0.4);
  note('+ interest', X(1230), Y(520), 30, T('i7') + 1.0, { col: INK });
  stk(5, X(1580), Y(640), T('i8') + 0.8, i => YEL); note('burden badhta hai', X(1570), Y(690), 24, T('i8') + 0.4, { align: 'center' });
  // i9-i10: not the same thing
  head('MINIMUM', X(120), Y(640), 40, T('i9') + 0.3); head('≠', X(460), Y(640), 66, T('i10') + 0.2); head('TOTAL BILL', X(560), Y(640), 40, T('i10') + 0.8);
  circleNote(X(560 + twid('TOTAL BILL', 40) / 2), Y(628), twid('TOTAL BILL', 40) / 2 + 30, 40, T('i10') + 2.4, 0.4);
  note('dono alag cheezein hain', X(440), Y(684), 28, T('i10') + 3.0, { align: 'center' });
  note('revolving credit par interest: ek important earning source', X(620), Y(738), 24, T('i11') + 0.4, { align: 'center', col: INK });
  CK(T('i1') - 0.4, X(850), Y(450), 1.12); CK(T('i2') - 0.3, X(1300), Y(260), 1.7); CK(T('i3') - 0.3, X(600), Y(340), 1.6);
  CK(T('i5a') - 0.3, X(600), Y(460), 1.65); CK(T('i6a') - 0.3, X(1380), Y(520), 1.55); CK(T('i8') - 0.3, X(1450), Y(560), 1.5);
  CK(T('i9') - 0.3, X(420), Y(600), 1.8); CK(T('i11') - 0.3, X(850), Y(500), 1.2);
}

// ======================= B4: fees and charges =======================
function B4() {
  const [ox, oy] = BK[4], X = x => ox + x, Y = y => oy + y;
  blockBanner(4, '4 · FEES', T('c1') + 0.2, 520);
  blockFrame(4, T('c1') + 0.8);
  const tiles = [[300, 'JOINING FEE', 0], [700, 'ANNUAL FEE', 1], [1100, 'CASH ADVANCE', 2], [1500, 'FOREX MARKUP', 3]];
  tiles.forEach(([x, s, i]) => {
    const t0 = T(i < 2 ? 'c2a' : 'c2b') + (i % 2) * 1.8 + 0.2;
    const b = rrect(X(x - 160), Y(180), 320, 250, 22); shape(b, t0, 0.35, { col: GRY, sh: true });
    if (i === 0) { coinIcon(X(x - 20), Y(280), 38, t0 + 0.4, false, '₹'); cardIcon(X(x + 50), Y(300), 0.45, t0 + 0.9); }
    if (i === 1) { calendarIcon(X(x), Y(290), 0.8, t0 + 0.4, false); coinIcon(X(x + 70), Y(330), 28, t0 + 0.9, false, '₹'); }
    if (i === 2) atmIcon(X(x), Y(290), 0.6, t0 + 0.4);
    if (i === 3) globeIcon(X(x), Y(290), 0.8, t0 + 0.4);
    head(s, X(x), Y(410), 26, t0 + 0.8, { align: 'center' });
  });
  note('har card par ye sab zaroori nahi', X(850), Y(490), 30, T('c3') + 0.3, { align: 'center', col: INK });
  // c4: three kinds of cards
  [['lifetime free', 0], ['annual fee', 1], ['fee waived at spend target', 2]].forEach(([s, i]) => { const x = 220 + i * 360, tt = T('c4a') + i * 1.7 + (i == 2 ? 1.2 : 0); cardIcon(X(x), Y(590), 0.62, tt); note(s, X(x), Y(670), 26, tt + 0.8, { align: 'center' }); });
  // c5-c6: the ATM warning
  head('!', X(1230), Y(590), 90, T('c5') + 0.2, { align: 'center' });
  note('ATM se cash ≠ shopping', X(1290), Y(580), 28, T('c6a') + 0.5, { col: INK });
  note('cash advance fee + interest', X(1290), Y(620), 26, T('c6b') + 0.3, { col: INK });
  // c7: MITC
  bookletIcon(X(1280), Y(705), 0.5, T('c7a') + 0.3); head('MITC', X(1420), Y(722), 34, T('c7b') + 0.8, { align: 'center' });
  circleNote(X(1420), Y(710), 80, 36, T('c7b') + 2.2, 0.4);
  CK(T('c1') - 0.4, X(850), Y(450), 1.12); CK(T('c2a') - 0.3, X(500), Y(320), 1.45); CK(T('c2b') - 0.3, X(1300), Y(320), 1.45);
  CK(T('c3') - 0.3, X(850), Y(500), 1.3); CK(T('c4a') - 0.3, X(560), Y(620), 1.5); CK(T('c5') - 0.3, X(1300), Y(600), 1.7); CK(T('c7a') - 0.3, X(1350), Y(650), 1.6);
}

// ======================= B5: rewards =======================
function B5() {
  const [ox, oy] = BK[5], X = x => ox + x, Y = y => oy + y;
  blockBanner(5, '5 · REWARDS', T('r1') + 0.2, 560);
  blockFrame(5, T('r1') + 0.8, 730);
  note('interest nahi, phir bhi rewards kyun?', X(850), Y(180), 28, T('r2') + 0.5, { align: 'center', col: INK });
  cardIcon(X(330), Y(330), 0.9, T('r2') + 1.2); head('YOU', X(330), Y(420), 28, T('r2') + 2.0, { align: 'center' });
  bankIcon(X(1370), Y(340), 0.9, T('r3') + 0.2); head('BANK', X(1370), Y(478), 28, T('r3') + 1.2, { align: 'center' });
  giftIcon(X(850), Y(540), 0.9, T('r6') + 0.3);
  fatArrow(X(450), Y(310), X(620), T('r3') + 1.8, { h: 22, hh: 26, hl: 26 });
  coinIcon(X(850), Y(270), 36, T('r4') + 0.4); note('zyada transactions', X(850), Y(332), 24, T('r4') + 1.4, { align: 'center' });
  fatArrow(X(1090), Y(310), X(1250), T('r4') + 2.6, { h: 22, hh: 26, hl: 26 });
  inkArrow(bez([X(1370), Y(470)], [X(1300), Y(570)], [X(1100), Y(590)], [X(960), Y(570)]), { w: 3.4, amp: 0.8, head: 14 }, T('r6') + 1.4, 0.7);
  inkArrow(bez([X(740), Y(570)], [X(560), Y(570)], [X(380), Y(530)], [X(340), Y(450)]), { w: 3.4, amp: 0.8, head: 14 }, T('r8') + 0.8, 0.7);
  // r5: partnerships help pay
  const pb = rrect(X(560), Y(650), 600, 60, 14); shape(pb, T('r5') + 0.3, 0.3, { col: GRY2 });
  note('+ merchant partnerships, co-branded offers', X(860), Y(690), 24, T('r5') + 0.9, { align: 'center', col: INK });
  // r6-r7: not magic
  head('cashback ≠ magic', X(60), Y(640), 40, T('r6') + 0.2); swash(X(60), X(60 + twid('cashback ≠ magic', 40)), Y(656), 34, T('r6') + 1.4, 0.2);
  note('overall business model ka hissa', X(60), Y(710), 26, T('r7') + 0.4);
  // r9-r11: not free money
  head('free money?', X(1200), Y(640), 36, T('r9') + 0.3); cross(X(1200 + twid('free money?', 36) + 40), Y(628), 1.0, T('r9') + 1.4);
  ['annual fee', 'redemption limits', 'minimum spend'].forEach((s, i) => { const t0 = i < 2 ? T('r10a') + i * 1.9 : T('r10b') + 0.2; bullet(X(1230), Y(690 + i * 42), t0); note(s, X(1254), Y(698 + i * 42), 26, t0 + 0.4, { col: INK }); });
  head('TOTAL COST?', X(1565), Y(752), 28, T('r11') + 0.3, { align: 'center' }); circleNote(X(1565), Y(742), 112, 30, T('r11') + 1.8, 0.4);
  CK(T('r1') - 0.4, X(850), Y(450), 1.12); CK(T('r2') - 0.3, X(600), Y(300), 1.5); CK(T('r3') - 0.3, X(1100), Y(330), 1.5); CK(T('r5') - 0.3, X(850), Y(560), 1.45);
  CK(T('r6') - 0.3, X(500), Y(640), 1.6); CK(T('r8') - 0.3, X(850), Y(500), 1.35); CK(T('r9') - 0.3, X(1350), Y(700), 1.6); CK(T('r11') - 0.3, X(1350), Y(700), 1.5);
}

// ======================= B6: does the bank always profit? =======================
function B6() {
  const [ox, oy] = BK[6], X = x => ox + x, Y = y => oy + y;
  blockBanner(6, 'PROFIT GUARANTEED?', T('b1') + 0.2, 760);
  blockFrame(6, T('b1') + 0.8);
  head('NOT guaranteed', X(120), Y(210), 46, T('b2') + 0.3); cross(X(560), Y(196), 1.1, T('b2') + 2.0);
  scaleIcon(X(880), Y(440), 1.0, T('b3a') - 0.4);
  head('COSTS', X(1430), Y(270), 28, T('b3a') + 0.1);
  ['rewards', 'fraud prevention', 'processing', 'support', 'technology', 'new customers', 'unpaid dues'].forEach((s, i) => note(s, X(1430), Y(310 + i * 38), 26, T(i < 4 ? 'b3a' : 'b3b') + 0.3 + (i < 4 ? i * 0.9 : (i - 4) * 1.4), { col: INK }));
  head('INCOME', X(120), Y(270), 28, T('b5') + 0.3);
  ['merchant-side income', 'interest', 'fees', 'partnerships'].forEach((s, i) => { bullet(X(130), Y(318 + i * 40), T('b6') + i * 1.1 - 0.1); note(s, X(152), Y(326 + i * 40), 26, T('b6') + i * 1.1, { col: INK }); });
  // b4: customers differ
  head('customers: mixed bag', X(120), Y(540), 32, T('b4a') + 0.1);
  const bars = [[130, 130, 'profitable', 0], [290, 70, 'less', 1], [450, 40, 'cost > revenue', 2]];
  bars.forEach(([x, h, s, i]) => { const y1 = Y(700); const r = [[X(x), y1], [X(x), y1 - h], [X(x + 90), y1 - h], [X(x + 90), y1]]; const t0 = T(i < 2 ? 'b4a' : 'b4b') + 0.3 + (i < 2 ? i * 1.6 : 0); MRK([r], { col: i == 0 ? YEL : GRY2, w: 14, ang: -0.7 }, t0, 0.5); INK_(r.concat([r[0]]), { w: 3, amp: 0.7 }, t0, 0.4); note(s, X(x + 45), Y(738), 24, t0 + 0.4, { align: 'center' }); });
  ribbon(X(1380), Y(700), 400, 64, 'TOGETHER = PROFIT', 30, T('b7') + 0.3, { d: 0.3, td: 0.5 });
  CK(T('b1') - 0.4, X(850), Y(450), 1.12); CK(T('b2') - 0.3, X(560), Y(260), 1.6); CK(T('b3a') - 0.3, X(1100), Y(450), 1.4); CK(T('b4a') - 0.3, X(360), Y(600), 1.8);
  CK(T('b5') - 0.3, X(420), Y(420), 1.5); CK(T('b7') - 0.3, X(1000), Y(520), 1.3);
}

// ======================= B7: three rules, the poster =======================
function B7() {
  const [ox, oy] = BK[7], X = x => ox + x, Y = y => oy + y;
  blockBanner(7, '3 RULES YAAD RAKHO', T('z4') + 0.1, 760);
  note('agli baar bill time par pay karo: bank ne kuch nahi kamaya?', X(850), Y(230), 28, T('z1') + 0.4, { col: INK, align: 'center' });
  note('interest nahi mila, par merchant-side fee se income', X(850), Y(276), 28, T('z2') + 0.3, { col: INK, align: 'center' });
  note('isi liye: cashback, rewards, discounts', X(850), Y(322), 28, T('z3') + 0.3, { col: INK, align: 'center' });
  const rules = [[300, '1', 'pay the TOTAL due, on time', 'z5'], [1000, '2', 'not just the MINIMUM', 'z6'], [1700, '3', 'a payment TOOL, not extra income', 'z7a']];
  rules.forEach(([x, n, s, id]) => {
    const t0 = T(id) + 0.2, c = ell(X(x), Y(560), 130, 130, 0, TAU, 60); shape(c, t0, 0.5, { col: GRY, sh: true });
    head(n, X(x), Y(600), 150, t0 + 0.5, { align: 'center' });
    note(s, X(x), Y(760), 32, t0 + 1.2, { align: 'center', col: INK });
  });
  rules.forEach(([x], i) => circleNote(X(x), Y(560), 160, 160, T(['z5', 'z6', 'z7b'][i]) + 1.6 + (i === 2 ? 1.0 : 0), 0.6));
  note('responsibly use karo', X(1700), Y(806), 28, T('z7b') + 0.5, { align: 'center' });
  // z8-z10: the question and the sign-off
  head('cashback: benefit ya smart strategy?', X(1000), Y(930), 44, T('z8a') + 0.3, { align: 'center' });
  swash(X(560), X(1440), Y(946), 36, T('z8b') + 1.5, 0.4);
  note('comments mein batayein', X(1000), Y(990), 30, T('z9') + 0.3, { align: 'center' });
  host(X(2700), Y(700), 0.95, T('z10') + 0.5, 'wave', -1);
  head('ExplainEveryday', X(2700), Y(960), 56, T('z10') + 3.0, { align: 'center' }); swash(X(2450), X(2960), Y(976), 40, T('z11') + 2.0, 0.3);
  note('Big Questions. Simple Explanations.', X(2700), Y(1020), 30, T('z11') + 0.4, { align: 'center' });
  CK(T('z1') - 0.4, X(850), Y(450), 1.1); CK(T('z4') - 0.3, X(1000), Y(440), 1.35); CK(T('z5') - 0.3, X(300), Y(580), 1.9); CK(T('z6') - 0.3, X(1000), Y(580), 1.9); CK(T('z7a') - 0.3, X(1700), Y(600), 1.9);
  CK(T('z8a') - 0.3, X(1000), Y(800), 1.5); CK(T('z10') - 0.3, X(2500), Y(800), 1.2);
}

function buildPage() {
  SEED = 42; EL.length = 0; CAMK.length = 0;
  B0(); B1(); B2(); B2b(); B2c(); B3(); B4(); B5(); B6(); B7();
  CUE.pull = T('z11') + 0.6; CUE.done = TL.dur - 2.0; CUE.silence = TL.dur - 3.0;
}

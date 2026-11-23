// film.js: "अदृश्य ब्रह्मांड का नक्शा". One timeline, pure functions of t. Scale Zoom Explainer, Hindi narration.
const FILM_DUR = 151.43, BPM = 84, BAR = 240 / BPM;   // bar = 2.857 s
const S0 = [W / 2, H / 2];
const QS = new URLSearchParams(location.search);
const FROM = +(QS.get('from') || 0), TO = QS.get('to') != null ? +QS.get('to') : FILM_DUR;

// ---------- easing ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => clamp((t - a) / (b - a));
const eio = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const eo = k => 1 - Math.pow(1 - clamp(k), 3);
const ei = k => Math.pow(clamp(k), 3);
const backE = (k, s = 1.4) => { k = clamp(k) - 1; return 1 + k * k * ((s + 1) * k + s); };
const spr = (t, t0, w = 16, d = 8) => { const x = t - t0; return x <= 0 ? 0 : 1 - Math.exp(-d * x) * (Math.cos(w * x) + (d / w) * Math.sin(w * x)); };
const wob = (t, t0, w = 12, d = 5) => { const x = t - t0; return x <= 0 ? 0 : Math.exp(-d * x) * Math.sin(w * x); };
const ebump = (t, a, b, c, d) => eio(seg(t, a, b)) * (1 - eio(seg(t, c, d)));
function kf(t, keys) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; return lerp(v0, v1, eio((t - t0) / (t1 - t0))); }
  return keys[keys.length - 1][1];
}
const blink = (t, t0) => eio(seg(t, t0, t0 + 0.07)) * (1 - eio(seg(t, t0 + 0.11, t0 + 0.22)));

// ---------- narration: start time, duration (from the rendered voice), subtitle cues [hindi, english] ----------
const VO = [
  { id: 'v1', t0: 2.0, d: 5.922, cues: [['आसमान में एक छोटा सा बिंदु…', 'A tiny dot in the sky…'], ['असल में एक पूरी आकाशगंगा है।', 'is really a whole galaxy.']] },
  { id: 'v2', t0: 10.0, d: 7.593, cues: [['यूरोपीय स्पेस एजेंसी के यूक्लिड टेलीस्कोप ने', "ESA's Euclid telescope has"], ['नब्बे करोड़ से ज़्यादा आकाशगंगाएँ सूचीबद्ध की हैं।', 'catalogued over 900 million galaxies.']] },
  { id: 'v3', t0: 20.8, d: 3.731, cues: [['लेकिन ब्रह्मांड का एक बड़ा हिस्सा', 'But a large part of the universe'], ['हमें दिखता ही नहीं।', 'never shows up.']] },
  { id: 'v4', t0: 26.0, d: 5.959, cues: [['इसे डार्क मैटर कहते हैं।', 'It is called dark matter.'], ['इसकी तस्वीर आज तक किसी ने नहीं खींची।', 'Nobody has ever photographed it.']] },
  { id: 'v5', t0: 36.0, d: 5.469, cues: [['तो वैज्ञानिक इसका नक्शा कैसे बनाते हैं?', 'So how do scientists map it?'], ['इसके असर को देखकर।', 'By watching what it does.']] },
  { id: 'v6', t0: 42.5, d: 6.098, cues: [['जैसे हवा नहीं दिखती, पर पत्ते हिलते हैं,', 'Wind is invisible, but leaves move,'], ['तो पता चल जाता है कि हवा है।', 'and you know it is there.']] },
  { id: 'v7', t0: 51.0, d: 6.783, cues: [['भारी चीज़ें स्पेस को मोड़ती हैं,', 'Heavy things bend space,'], ['और दूर की आकाशगंगा की रोशनी भी मुड़ जाती है।', "and a distant galaxy's light bends too."]] },
  { id: 'v8', t0: 59.2, d: 2.457, cues: [['इसे ग्रैविटेशनल लेंसिंग कहते हैं।', 'This is called gravitational lensing.']] },
  { id: 'v9', t0: 62.8, d: 5.009, cues: [['कभी रोशनी इतनी मुड़ती है', 'Sometimes light bends so much'], ['कि एक चमकता हुआ छल्ला बन जाता है।', 'that a glowing ring appears.']] },
  { id: 'v10', t0: 71.0, d: 7.651, cues: [['यूक्लिड को क़रीब पंद्रह हज़ार', 'Euclid found about 15,000'], ['ऐसे लेंस के उम्मीदवार मिले हैं।', 'lens candidates.'], ['अभी सबकी पुष्टि बाकी है।', 'All still need confirming.']] },
  { id: 'v11', t0: 82.0, d: 5.896, cues: [['आकाशगंगाओं की हल्की-सी बदली हुई आकृतियों से', 'Slight changes in galaxy shapes'], ['डार्क मैटर का नक्शा बनता है।', 'build the dark matter map.']] },
  { id: 'v12', t0: 89.5, d: 9.318, cues: [['यह अभी शुरुआती डेटा है, पूरा नक्शा नहीं।', 'This is early data, not the finished map.'], ['पूरा पहला डेटा रिलीज़', 'The full first data release'], ['दो हज़ार सत्ताईस के मध्य तक आएगा।', 'is due in mid-2027.']] },
  { id: 'v13', t0: 103.2, d: 6.398, cues: [['और डार्क एनर्जी?', 'And dark energy?'], ['वह ब्रह्मांड के फैलने से जुड़ा, एक अलग रहस्य है।', 'A separate mystery tied to expansion.']] },
  { id: 'v14', t0: 110.5, d: 9.632, cues: [['भारत का जीएमआरटी रेडियो टेलीस्कोप भी', "India's GMRT radio telescope also"], ['ब्रह्मांड को देखता है, पर रेडियो तरंगों से।', 'studies the universe, with radio waves.'], ['यह यूक्लिड से अलग यंत्र है।', 'It is a different instrument from Euclid.']] },
  { id: 'v15', t0: 124.5, d: 8.339, cues: [['हर चीज़ को सीधे देखना ज़रूरी नहीं।', "You don't have to see everything directly."], ['कभी-कभी किसी अदृश्य चीज़ का पता उसके असर से चलता है।', 'Sometimes an invisible thing is known by its effects.']] },
  { id: 'v16', t0: 135.5, d: 3.899, cues: [['एक्सप्लेन एवरीडे: बड़े सवाल, आसान जवाब।', 'ExplainEveryday: Big Questions, Simple Explanations.']] },
];
// flatten to cues with times (split by Hindi length), each held at least 1.8 s and speech + 0.6
const CUES = (() => {
  const out = [];
  for (const v of VO) {
    const tot = v.cues.reduce((a, c) => a + c[0].length, 0); let t = v.t0;
    v.cues.forEach((c, i) => {
      const d = v.d * c[0].length / tot, t1 = i === v.cues.length - 1 ? v.t0 + v.d + 0.6 : t + d;
      out.push({ t0: +t.toFixed(3), t1: +Math.max(t1, t + 1.8).toFixed(3), hi: c[0], en: c[1] });
      t += d;
    });
  }
  for (let i = 0; i < out.length - 1; i++) if (out[i].t1 > out[i + 1].t0 - 0.05) out[i].t1 = out[i + 1].t0 - 0.05;
  return out;
})();
// section starts on the bar grid (bar = 2.857 s)
const SEC = { S1: 0, S2: 3 * BAR, S3: 7 * BAR, S4: 13 * BAR, S5: 17 * BAR, S6: 24 * BAR, S7: 28 * BAR, S8: 36 * BAR, S9: 43 * BAR, END: 53 * BAR };

// ---------- text helpers ----------
const MEAS = {};
function measure(str, a) {
  const key = str + JSON.stringify(a);
  if (MEAS[key] == null) { const tx = el('text', { x: 0, y: -999, ...a }); tx.textContent = str; MEAS[key] = tx.getComputedTextLength(); tx.remove(); }
  return MEAS[key];
}
function wipeText(p, x, y, str, a, k, h = 60) {
  if (k <= 0) return;
  const w = measure(str, a) + (+a['letter-spacing'] || 0) * str.length, x0 = a['text-anchor'] === 'end' ? x - w : a['text-anchor'] === 'middle' ? x - w / 2 : x;
  const G = g(p, { 'clip-path': clipOf('rect', { x: r1(x0 - 8), y: r1(y - h), width: r1((w + 16) * clamp(k)), height: r1(h * 1.5) }) });
  return text(G, x, y, str, a);
}
const HI = { 'font-family': 'Deva, Jost, sans-serif' };
const tagA = { 'font-size': 18, 'font-weight': 600, fill: C.sun, 'letter-spacing': 3 };
// one label: a small-caps tag above, one cream line below, a leader to the thing (screen coords)
function label(p, t, t0, ax, ay, lx, ly, tag, hi, anchor = 'start') {
  const k = eo(seg(t, t0, t0 + 0.35)); if (k <= 0) return;
  const a = Math.atan2(ly - ay, lx - ax), sx = ax + Math.cos(a) * 30, sy = ay + Math.sin(a) * 30;
  const ex = lx + (anchor === 'start' ? -12 : 12), ey = ly - 4, kl = eio(seg(t, t0, t0 + 0.4));
  el('path', { d: `M${r1(sx)},${r1(sy)}L${r1(lerp(sx, ex, kl))},${r1(lerp(sy, ey, kl))}`, stroke: C.sun, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, p);
  wipeText(p, lx, ly - 30, tag, { ...tagA, 'text-anchor': anchor }, eo(seg(t, t0 + 0.2, t0 + 0.5)), 24);
  wipeText(p, lx, ly + 10, hi, { 'font-size': 38, 'font-weight': 600, fill: C.cream, 'text-anchor': anchor, ...HI }, eo(seg(t, t0 + 0.3, t0 + 0.7)), 44);
}
function nextRing(p, t, t0, x, y, r) {
  if (t < t0) return;
  const rr = r + 60 * (1 - spr(t, t0, 15, 8.5));
  el('circle', { cx: r1(x), cy: r1(y), r: r1(rr), fill: 'none', stroke: C.sun, 'stroke-width': 4 }, p);
  const ko = eo(seg(t, t0 + 0.08, t0 + 0.32));
  if (ko > 0) el('circle', { cx: r1(x), cy: r1(y), r: r1(rr + 13 * ko), fill: 'none', stroke: C.sun, 'stroke-width': 2.5, 'stroke-dasharray': '3 9', 'stroke-dashoffset': r1(-(t - t0) * 9), 'stroke-linecap': 'round' }, p);
}

// ---------- scale ribbon: one log track, field-of-view readout (m), stops ----------
const LY = 9.4607e15;
const STOPS = [
  { e: Math.log10(1e5 * LY), name: 'galaxy' },       // our galaxy's size, about 100,000 ly
  { e: Math.log10(1e7 * LY), name: 'halo' },         // a cluster's halo, about 10 million ly
  { e: Math.log10(1.5e9), name: 'L2' },              // Euclid is about 1.5 million km from Earth
  { e: Math.log10(2.5e4), name: 'GMRT' },            // GMRT's dishes spread over about 25 km
];
const fovKeys = [[0, 20.7], [3.0, 20.98], [SEC.S2, 20.98], [19.5, 24.4], [SEC.S3, 24.4], [22.5, 20.98], [SEC.S4, 20.98], [SEC.S4 + 3, 20.98], [SEC.S5 - 0.3, 20.98], [SEC.S5 + 3, 23.0], [SEC.S6 - 0.1, 23.0], [SEC.S6 + 1.6, 9.18], [SEC.S7 - 0.2, 9.18], [SEC.S7 + 1.5, 23.8], [SEC.S8 - 0.2, 23.8], [SEC.S8 + 1.6, 4.4], [SEC.S9 - 0.1, 4.4]];
function fovFmt(e) {
  const m = Math.pow(10, e);
  if (e >= 14) { const ly = m / LY; return ly >= 1e6 ? [(ly / 1e6).toFixed(ly >= 1e7 ? 0 : 1), 'million light-years'] : [Math.round(ly / 1000).toLocaleString('en-US') + ',000'.slice(Math.round(ly / 1000) > 0 ? 0 : 0), 'light-years']; }
  const km = m / 1000; return [km >= 1e6 ? (km / 1e6).toFixed(1) + ' million' : km >= 100 ? Math.round(km).toLocaleString('en-US') : km.toFixed(km >= 10 ? 0 : 1), 'km'];
}
function ribbon(p, t, cur, lit, centre, plate) {
  const x0 = centre ? 640 : 1220, L = centre ? 900 : 580, y = centre ? 640 : 1000, pos = e => x0 + (25 - e) / 21 * L;
  const G = g(p);
  if (plate) el('rect', { x: 1190, y: 838, width: 690, height: 232, rx: 18, fill: C.night }, G);
  const e = kf(t, fovKeys), [num, unit] = fovFmt(e);
  if (!centre) {
    text(G, x0, 872, 'FIELD OF VIEW', { 'font-size': 18, 'font-weight': 600, fill: C.mist, 'letter-spacing': 3 });
    const ly = Math.log10(1e5 * LY);
    const txt = e >= 14 ? (e > ly + 0.05 ? num : '100,000') : num;
    text(G, x0, 926, `${txt}<tspan font-size="28" font-weight="500" fill="${C.mist}" dx="10">${e >= 14 && e <= ly + 0.05 ? 'light-years' : unit}</tspan>`, { 'font-size': 52, 'font-weight': 600, fill: C.cream, 'data-noread': 1 });
  }
  el('rect', { x: x0, y: y - 5, width: L, height: 10, rx: 5, fill: C.n3 }, G);
  const fillTo = centre ? 0 : pos(clamp(e, 4, 25)) - x0;
  if (!centre) el('rect', { x: x0, y: y - 5, width: r1(Math.max(0, fillTo)), height: 10, rx: 5, fill: C.sun }, G);
  STOPS.forEach((st, i) => {
    const x = pos(st.e), cy = y - 34, on = centre ? lit[i] > 0 : i === cur, k = on ? 1 : 0.78;
    const kk = centre ? 0.8 + 0.5 * lit[i] : 1;
    if (on) el('circle', { cx: r1(x), cy, r: r1(21 * kk), fill: 'none', stroke: C.sun, 'stroke-width': 3 }, G);
    const col = (a, b) => on ? a : b;
    if (st.name === 'galaxy') { el('ellipse', { cx: r1(x), cy, rx: 13 * k * kk, ry: 6 * k * kk, fill: col(C.blue, C.n3), transform: `rotate(-18 ${r1(x)} ${cy})` }, G); el('circle', { cx: r1(x), cy, r: 4 * k * kk, fill: col(C.cream, C.n3) }, G); }
    else if (st.name === 'halo') { el('circle', { cx: r1(x), cy, r: 12 * k * kk, fill: 'none', stroke: col(C.mist, C.n3), 'stroke-width': 3, 'stroke-dasharray': '4 4' }, G); el('circle', { cx: r1(x), cy, r: 4 * k * kk, fill: col(C.cream, C.n3) }, G); }
    else if (st.name === 'L2') { el('rect', { x: r1(x - 9 * kk), y: cy - 6 * kk, width: 18 * kk, height: 12 * kk, rx: 3, fill: col(C.cream, C.n3) }, G); el('circle', { cx: r1(x), cy: cy + 14 * kk, r: 2.5, fill: col(C.sun, C.n3) }, G); }
    else { el('path', { d: `M${r1(x - 11 * kk)},${cy + 8 * kk}A${r1(11 * kk)},${r1(14 * kk)} 0 0 1 ${r1(x + 11 * kk)},${cy + 8 * kk}Z`, fill: col(C.mint, C.n3) }, G); el('rect', { x: r1(x - 1.5), y: cy + 6 * kk, width: 3, height: 8 * kk, fill: col(C.mintD, C.n3) }, G); }
    el('rect', { x: r1(x - 1.5), y: y - 16, width: 3, height: 8, rx: 1.5, fill: on ? C.sun : C.n3 }, G);
  });
  for (const [ee, lab] of [[24, '10²⁴ m'], [14, '10¹⁴'], [4, '10⁴ m']]) text(G, pos(ee), y + 44, lab, { 'font-size': 16, 'font-weight': 500, fill: C.mist, 'text-anchor': 'middle' });
}

// ---------- subtitles: Hindi over English, bottom left, sun bar ----------
function subtitles(p, t) {
  const c = CUES.find(q => t >= q.t0 && t < q.t1); if (!c) return;
  const k = eo(seg(t, c.t0, c.t0 + 0.16)), out = eio(seg(t, c.t1 - 0.12, c.t1)), kk = k * (1 - out);
  const G = g(p, { transform: `translate(0,${r1(14 * (1 - k))})`, opacity: r1(kk) });
  const hiA = { 'font-size': 40, 'font-weight': 500, fill: C.cream, ...HI }, enA = { 'font-size': 26, 'font-weight': 500, fill: C.mist };
  const w = Math.max(measure(c.hi, hiA), measure(c.en, enA)) + 56;
  el('rect', { x: 64, y: 928, width: r1(w + 28), height: 114, rx: 14, fill: C.night }, G);
  el('rect', { x: 78, y: 944, width: 5, height: 82, rx: 2.5, fill: C.sun }, G);
  text(G, 104, 982, c.hi, { ...hiA, 'data-noread': 1 }); text(G, 104, 1022, c.en, { ...enA, 'data-noread': 1 });
}

// ---------- the sight line ----------
function sightDots(p, pts, front, gap = 17, rad = 3.6, march = 0) {   // pts: polyline; front: distance reached
  let acc = 0, segs = [];
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push([acc, l, pts[i - 1], pts[i]]); acc += l; }
  const total = acc, off = march % gap;
  for (let d = off; d <= Math.min(front, total); d += gap) {
    const sg = segs.find(s => d <= s[0] + s[1]) || segs[segs.length - 1], u = (d - sg[0]) / sg[1];
    const pop = backE(clamp((front - d) / 55), 2.2), grow = clamp(d / gap), fade = clamp((total - d) / gap + 0.02);
    const k = Math.min(pop, grow, fade); if (k <= 0.02) continue;
    el('circle', { cx: r1(lerp(sg[2][0], sg[3][0], u)), cy: r1(lerp(sg[2][1], sg[3][1], u)), r: r1(rad * k), fill: C.sun }, p);
  }
  return total;
}
function bez(a, b, c, n = 40) { const o = []; for (let i = 0; i <= n; i++) { const u = i / n; o.push([(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * b[0] + u * u * c[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * b[1] + u * u * c[1]]); } return o; }

// ---------- galaxy drawing ----------
function spiral(p, cx, cy, R, tilt, sq, seed, k = 1) {
  const rr = rng(seed), G = g(p, { transform: `translate(${r1(cx)},${r1(cy)}) rotate(${tilt}) scale(1,${sq})` });
  el('circle', { r: r1(R * 1.1), fill: C.n2 }, G); el('circle', { r: r1(R * 0.78), fill: C.n3 }, G);
  const b = 0.29, r0 = R * 0.085, th = Math.log(1 / 0.085) / b;
  const pt = (ph, t, off = 0) => { const r = r0 * Math.exp(b * t), a = t + ph, nx = Math.cos(a) * b - Math.sin(a), ny = Math.sin(a) * b + Math.cos(a), nl = Math.hypot(nx, ny); return [Math.cos(a) * r - ny / nl * off, Math.sin(a) * r + nx / nl * off]; };
  const arm = (ph, wmax, t0, t1, col) => { const A = [], B = []; for (let i = 0; i <= 70; i++) { const u = i / 70, t = t0 + (t1 - t0) * u, w = wmax * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.25 + 0.05)), 0.8) * (0.55 + 0.45 * Math.exp(b * t) / Math.exp(b * t1)); A.push(pt(ph, t, w)); B.push(pt(ph, t, -w)); } el('path', { d: 'M' + A.concat(B.reverse()).map(q => `${r1(q[0])},${r1(q[1])}`).join('L') + 'Z', fill: col, 'stroke-linejoin': 'round' }, G); };
  for (const ph of [0, Math.PI]) arm(ph, R * 0.15, 1.0, th, C.blueD);
  for (const ph of [0, Math.PI]) arm(ph - 0.05, R * 0.09, 1.2, th - 0.2, C.blue);
  const n = Math.round(160 * k);
  for (let i = 0; i < n; i++) { const ph = (i % 2) * Math.PI, t = 1.2 + rr() * (th - 1.2), u = t / th, q = pt(ph, t, (rr() - 0.5) * R * 0.26), kk = rr(), s = (1 - u * 0.5) * 9 * (0.35 + rr()); el('circle', { cx: r1(q[0]), cy: r1(q[1]), r: r1(s), fill: kk < 0.06 ? C.coral : kk < 0.12 ? C.mint : u < 0.4 ? (kk < 0.6 ? C.sun : C.cream) : kk < 0.78 ? C.cream : C.sun }, G); }
  el('circle', { r: r1(R * 0.15), fill: C.sun }, G); el('circle', { r: r1(R * 0.075), fill: C.cream }, G);
}
function dotGalaxy(p, x, y, r, rot, col = 0) {
  const G = g(p, { transform: `translate(${r1(x)},${r1(y)}) rotate(${rot}) scale(1,0.5)` });
  el('circle', { r: r1(r * 1.5), fill: C.n2 }, G); el('circle', { r: r1(r), fill: C.n3 }, G);
  el('circle', { r: r1(r * 0.55), fill: col === 1 ? C.mintD : C.blueD }, G); el('circle', { r: r1(r * 0.22), fill: C.cream }, G);
}
function bg(p, seed = 11, n = 200, avoid) { el('rect', { width: W, height: H, fill: C.night }, p); stars(p, seed, n, avoid); }
const fieldRng = (seed, i) => { const R = rng(seed * 1000 + i); return [R(), R(), R(), R()]; };

// ---------- Tara's performance ----------
const TARA = { x: 400, y: 740, s: 250 };
function taraPose(t) {
  const P = { flick: t * 2 * Math.PI * 7 };
  P.look = [kf(t, [[0, 0.2], [4, 0.2], [4.6, 0.85], [8.5, 0.85], [9, 0.6], [20, 0.7], [20.8, 0.9], [34, 0.9], [36, 0.5], [48, 0.5], [51, 0.9], [90, 0.9], [100, 0.5], [122, 0.2], [140, 0]]),
            kf(t, [[0, 0], [4, 0], [4.6, -0.5], [8.5, -0.5], [9, -0.2], [20, -0.3], [34, -0.1], [48, 0.1], [122, 0], [140, 0]])];
  P.lid = Math.max(blink(t, 4.3), blink(t, 13.6), blink(t, 27.9), blink(t, 52.2), blink(t, 76.4), blink(t, 118.1), blink(t, 142.2));
  P.zoom = spr(t, 4.8, 18, 7) * (1 - eio(seg(t, 8.2, 8.8))) + spr(t, 25.2, 18, 7) * (1 - eio(seg(t, 31, 31.6))) + spr(t, 61.5, 18, 7) * (1 - eio(seg(t, 66.5, 67.1)));
  P.smile = eio(seg(t, 66.0, 66.2)) * (1 - eio(seg(t, 67.4, 67.8))) + eio(seg(t, 128.5, 128.7)) * (1 - eio(seg(t, 133, 133.4))) + eio(seg(t, 138.5, 138.7));
  const nod = [1.2, 4.3, 4.65].reduce((a, w) => a + wob(t, w + 0.03, 22, 9), 0);
  const ant = eio(seg(t, 4.3, 4.78)) * (1 - spr(t, 4.82, 20, 8));
  P.sq = 0.1 * ant + 0.03 * nod;
  P.rot = kf(t, [[0, -8], [4, -8], [4.5, -14], [8.5, -14], [9, -6], [140, -6]]) + 2 * nod + 4 * ant;
  P.tail = 6 * Math.sin(t * 2 * Math.PI * 0.6) + 14 * wob(t, 4.82, 14, 5);
  // entrance from below-left at 3.2 s
  const ent = eo(seg(t, 3.0, 4.1)), up = (1 - ent) * 420, bob = 5 * Math.sin(2 * Math.PI * 0.4 * t);
  const x = TARA.x + 3 * Math.sin(2 * Math.PI * 0.3 * t) - 70 * (1 - ent);
  const y = TARA.y + bob + up - 8 * ant;
  return { x, y, s: TARA.s, P };
}
function drawTara(p, t) { const q = taraPose(t); if (t < 3.0) return; tara(p, q.x, q.y, q.s, q.P); return q; }
function lensPt(t) { const q = taraPose(t); return taraLens(q.x, q.y, q.s, q.P); }

// ---------- scene routing ----------
function scene(t) {
  if (t < SEC.S2) return sceneS1(t);
  if (t < SEC.S3) return sceneS2(t);
  if (t < SEC.S4) return sceneS3(t);
  if (t < SEC.S5) return sceneS4(t);
  if (t < SEC.S6) return sceneS5(t);
  if (t < SEC.S7) return sceneS6(t);
  if (t < SEC.S8) return sceneS7(t);
  if (t < SEC.S9) return sceneS8(t);
  return sceneS9(t);
}

// ================= S1 0–8.57: one dot becomes a galaxy; Tara; title =================
const G1 = { x: 1300, y: 460 };
function sceneS1(t) {
  bg(g(), 11, 150, inBoxes([[100, 150, 700, 420]]));
  const grow = eio(seg(t, 0.9, 4.2)), R = lerp(7, 330, Math.pow(grow, 1.4)), cx = lerp(960, G1.x, eio(seg(t, 1.5, 4.5))), cy = lerp(520, G1.y, eio(seg(t, 1.5, 4.5)));
  if (t > 0.45) { const pop = backE(seg(t, 0.45, 0.8), 2); if (R < 60) { halo(g(), cx, cy, 20 * pop, 40 * pop); el('circle', { cx, cy, r: r1(7 * pop), fill: C.sun }); el('circle', { cx, cy, r: r1(3.5 * pop), fill: C.cream }); } }
  if (R >= 14) spiral(g(), cx, cy, R, -16, 0.5, 7, clamp(R / 330));
  // title in the left third
  const A = { 'font-size': 112, 'font-weight': 700, fill: C.cream, ...HI };
  for (const [i, s2] of ['अदृश्य ब्रह्मांड', 'का नक्शा'].entries()) {
    const t0 = 4.3 + i * 0.35, k = spr(t, t0, 15, 7.5), out = eio(seg(t, SEC.S2 - 0.25 + i * 0.05, SEC.S2 - 0.05 + i * 0.05));
    if (t > t0) { const G = g(null, { 'clip-path': clipOf('rect', { x: 80, y: 120 + i * 140, width: 900, height: 190 }) }); text(G, 112, r1(260 + i * 140 + 150 * (1 - k) + 160 * out), s2, A); }
  }
  const ko = 1 - eio(seg(t, SEC.S2 - 0.25, SEC.S2 - 0.05));
  wipeText(g(), 118, 478, 'MAPPING THE INVISIBLE UNIVERSE', { 'font-size': 28, 'font-weight': 600, fill: C.sun, 'letter-spacing': 3 }, eo(seg(t, 4.9, 5.5)) * ko, 36);
  // sight line from the lens to the galaxy rim at 5.2
  if (t > 5.2) { const q = lensPt(t), B = [G1.x - 330 * 0.62, G1.y + 30]; sightDots(g(), [q, B], lerp(30, Math.hypot(B[0] - q[0], B[1] - q[1]) - 30, eio(seg(t, 5.2, 6.2))), 17, 3.6, t > 6.3 ? (t - 6.3) * 14 : 0); }
  drawTara(g(), t);
  ribbon(g(), t, 0, [0, 0, 0, 0]);
  subtitles(g(), t);
}

// ================= S2 8.57–20: pull back, the sky fills with galaxies; 900M+ =================
function sceneS2(t) {
  bg(g(), 11, 150, inBoxes([[100, 150, 700, 420]]));
  const u = seg(t, SEC.S2, 18.0), z = Math.exp(Math.log(1 / 38) * eio(u)), C0 = [G1.x, G1.y];
  const wx = X => (X - C0[0]) * z + S0[0] + (C0[0] - S0[0]) * 0, wy = Y => (Y - C0[1]) * z + S0[1] + (C0[1] - S0[1]) * 0;
  // other galaxies scattered widely in world coords; each pops in as the zoom reaches it
  const N = 520; let shown = 0;
  for (let i = 0; i < N; i++) {
    const [a, b, c, d] = fieldRng(5, i), X = C0[0] + (a - 0.5) * 1920 * 40, Y = C0[1] + (b - 0.5) * 1080 * 40;
    const sx = wx(X), sy = wy(Y); if (sx < -40 || sx > W + 40 || sy < -40 || sy > H + 40) continue;
    const tt = 9.2 + 7.8 * Math.pow(Math.hypot(a - 0.5, b - 0.5) * 1.8, 1.2), pop = backE(seg(t, tt, tt + 0.35), 2); if (pop <= 0) continue;
    if (Math.hypot(sx - 960, sy - 540) < 30 && false) continue;
    dotGalaxy(g(), sx, sy, (3 + 5 * c) * pop, d * 180, d < 0.2 ? 1 : 0); shown++;
  }
  // our galaxy shrinks to a dot at the centre of the pull (kept readable as a spiral until small)
  const R = 330 * z;
  if (R > 14) spiral(g(), S0[0], S0[1], R, -16, 0.5, 7, clamp(R / 330)); else dotGalaxy(g(), S0[0], S0[1], Math.max(R, 6), -16, 0);
  // counter lands at 15.4
  const cnt = eo(seg(t, 12.2, 15.4));
  if (t > 12.0) {
    const lx = 1180, ly = 640, K = backE(seg(t, 15.4, 15.8), 2.2);
    nextRing(g(), t, 15.4, S0[0], S0[1], 30);
    label(g(), t, 15.6, S0[0] + 40, S0[1] + 20, 1330, 410, 'CATALOGUED BY EUCLID', 'सूचीबद्ध आकाशगंगाएँ', 'start');
    const n = Math.round(900 * cnt);
    text(g(), 1330, 332, `<tspan>${n}</tspan><tspan font-size="64" dx="4">M+</tspan>`, { 'data-noread': 1, 'font-size': 124, 'font-weight': 700, fill: C.cream, 'letter-spacing': -2, transform: `translate(0,${r1(-10 * (1 - K) * 0)})` });
  }
  drawTara(g(), t);
  ribbon(g(), t, 0, [0, 0, 0, 0]);
  subtitles(g(), t);
}

// ================= S3 20–34.3: the invisible; dashed halo printed =================
const G3 = { x: 1210, y: 440, R: 210 };
function sceneS3(t) {
  const tin = t - SEC.S3;
  bg(g(), 31, 120, inBoxes([[40, 80, 1300, 700]]));
  const hk = eo(seg(t, 31.8, 33.4));   // the halo prints
  if (hk > 0) {
    const rH = 640 * hk, G = g();
    el('circle', { cx: G3.x, cy: G3.y, r: r1(rH), fill: C.n2 }, G);
    el('circle', { cx: G3.x, cy: G3.y, r: r1(rH * 0.7), fill: C.n3, opacity: 1 }, G);
    el('circle', { cx: G3.x, cy: G3.y, r: r1(rH), fill: 'none', stroke: C.mist, 'stroke-width': 3, 'stroke-dasharray': '12 14', 'stroke-dashoffset': r1(-t * 8), 'stroke-linecap': 'round' }, G);
  }
  const k = backE(seg(t, SEC.S3 + 0.2, SEC.S3 + 1.4), 1.6);
  spiral(g(), G3.x, G3.y, G3.R * k, -16, 0.5, 7, 1);
  for (const [x, y, s] of [[700, 250, 0.7], [1700, 300, 0.5], [1780, 720, 0.6], [820, 700, 0.5]]) dotGalaxy(g(), x, y, 6 * s * k, 20);
  // "empty" look: a dashed lens ring on the dark region beside the galaxy while the narrator says nothing shows up
  if (t > 22.0 && t < 31.8) { const kk = eo(seg(t, 22.0, 22.5)) * (1 - eo(seg(t, 31.0, 31.8))); el('circle', { cx: G3.x, cy: G3.y, r: r1(G3.R * 2.6), fill: 'none', stroke: C.n3, 'stroke-width': 3, 'stroke-dasharray': '3 12', 'stroke-linecap': 'round', opacity: r1(kk) }); }
  if (t > 25.2) { const q = lensPt(t), B = [G3.x - 330, G3.y + 120]; sightDots(g(), [q, B], lerp(30, Math.hypot(B[0] - q[0], B[1] - q[1]) - 40, eio(seg(t, 25.2, 26.4))), 17, 3.6, t > 26.5 ? (t - 26.5) * 14 : 0); }
  if (t > 33.2) label(g(), t, 33.2, G3.x + 470, G3.y - 300, 1500, 190, 'INFERRED · NOT PHOTOGRAPHED', 'डार्क मैटर का अनुमानित घेरा', 'end');
  drawTara(g(), t);
  ribbon(g(), t, 1, [0, 0, 0, 0]);
  subtitles(g(), t);
}

// ================= S4 34.3–48.6: wind and leaves =================
function sceneS4(t) {
  const t0 = SEC.S4;
  bg(g(), 41, 70, inBoxes([[0, 520, 1920, 560]]));
  // ground: two mint hills, two-tone
  const hill = (cx, cy, rx, ry) => twoTone(g(), 'ellipse', { cx, cy, rx, ry }, rx * 0.1, ry * 0.1, (G, dark) => el('ellipse', { cx, cy, rx, ry, fill: dark ? C.mintD : C.mint }, G));
  const ek = eo(seg(t, t0, t0 + 1.2));
  hill(600, 1010 + 120 * (1 - ek), 900, 330); hill(1500, 1040 + 120 * (1 - ek), 800, 300);
  // the wind: a dashed streak path; leaves ride it
  const pathAt = u => [lerp(-60, 2000, u), 470 + 110 * Math.sin(u * 6.0) + 60 * Math.sin(u * 13)];
  const wk = seg(t, 40.5, 44);
  for (let i = 0; i < 3; i++) { const pts = []; for (let k = 0; k <= 40; k++) { const u = k / 40 * wk; const q = pathAt(u); pts.push([q[0], q[1] + (i - 1) * 46]); } if (wk > 0.02) el('path', { d: 'M' + pts.map(q => `${r1(q[0])},${r1(q[1])}`).join('L'), fill: 'none', stroke: C.mist, 'stroke-width': 3, 'stroke-dasharray': '4 16', 'stroke-linecap': 'round' }); }
  for (let i = 0; i < 12; i++) {
    const [a, b, c] = fieldRng(9, i), u = ((t - 41.0) * 0.045 + a) % 1.0, q = pathAt(u), lane = (b - 0.5) * 120;
    if (t < 41.0) continue; const sz = 16 + 14 * c, ang = 40 * Math.sin(t * 3 + i) + u * 360;
    const G = g(null, { transform: `translate(${r1(q[0])},${r1(q[1] + lane)}) rotate(${r1(ang)})` });
    el('path', { d: `M0,${-sz}Q${sz * 0.9},0 0,${sz}Q${-sz * 0.9},0 0,${-sz}Z`, fill: i % 3 === 0 ? C.coralD : i % 3 === 1 ? C.sunD : C.mintD }, G);
    el('path', { d: `M0,${-sz}Q${sz * 0.9},0 0,${sz}Z`, fill: i % 3 === 0 ? C.coral : i % 3 === 1 ? C.sun : C.mint }, G);
  }
  if (t > 38.2) label(g(), t, 38.2, 1100, 500, 1000, 250, 'AN EVERYDAY EXAMPLE', 'हवा नहीं दिखती, असर दिखता है', 'start');
  drawTara(g(), t);
  ribbon(g(), t, 1, [0, 0, 0, 0], false, true);
  subtitles(g(), t);
}

// ================= S5 48.6–68.6: light bends; Einstein ring =================
const FAR = [230, 440], OBS = [1680, 770], HALO = [930, 560];
function lightPaths() {
  const up = bez(FAR, [HALO[0], HALO[1] - 560], OBS, 60), down = bez(FAR, [HALO[0], HALO[1] + 520], OBS, 60);
  return [up, down];
}
function sceneS5(t) {
  const t0 = SEC.S5;
  bg(g(), 51, 90, inBoxes([[0, 0, 0, 0]]));
  const ek = backE(seg(t, t0, t0 + 1.2), 1.6);
  // dark halo as dim steps, dashed outline
  halo(g(), HALO[0], HALO[1], 270 * ek, 330 * ek); el('circle', { cx: HALO[0], cy: HALO[1], r: r1(330 * ek), fill: 'none', stroke: C.mist, 'stroke-width': 3, 'stroke-dasharray': '12 14', 'stroke-dashoffset': r1(-t * 8), 'stroke-linecap': 'round' });
  // cluster galaxies inside the halo
  for (const [dx, dy, s] of [[-70, -30, 18], [40, 40, 22], [-10, 90, 14], [90, -60, 16], [-110, 60, 12]]) dotGalaxy(g(), HALO[0] + dx, HALO[1] + dy, s * ek, dx);
  dotGalaxy(g(), FAR[0], FAR[1], 22 * ek, -20, 1);
  // observer (a telescope eye)
  const ob = g(null, { transform: `translate(${OBS[0]},${OBS[1]}) scale(${r1(ek)})` });
  el('circle', { r: 46, fill: C.n3 }, ob); el('circle', { r: 30, fill: C.cream }, ob); el('circle', { r: 16, fill: C.night }, ob); el('circle', { cx: -4, cy: -4, r: 5, fill: C.cream }, ob);
  // light walks along both paths, bending around the halo
  const [up, down] = lightPaths();
  const front = lerp(0, 1900, eio(seg(t, 51.0, 56.5))), march = t > 56.5 ? (t - 56.5) * 40 : (t - 51) * 40;
  if (t > 50.9) { const a = sightDots(g(), up, front, 18, 3.8, ((march % 18) + 18) % 18); sightDots(g(), down, front, 18, 3.8, ((march % 18) + 18) % 18); }
  if (t > 58.6) label(g(), t, 58.6, HALO[0] - 160, HALO[1] - 290, 700, 120, 'GRAVITATIONAL LENSING', 'ग्रैविटेशनल लेंसिंग', 'end');
  // frame within a frame: Einstein ring, from 62.5
  const ik = eio(seg(t, 62.0, 63.2)) * (1 - eio(seg(t, 67.8, 68.5)));
  if (ik > 0.01) {
    const cx = 1500, cy = 300, r = 200 * ik;
    const cl = clipOf('circle', { cx, cy, r: r1(r) });
    el('circle', { cx, cy, r: r1(r + 16), fill: C.n3 }); el('circle', { cx, cy, r: r1(r + 6), fill: C.creamD });
    const IG = g(null, { 'clip-path': cl }); el('circle', { cx, cy, r: r1(r), fill: C.night }, IG);
    const ring = eo(seg(t, 63.0, 66.2)), ang = ring * Math.PI * 2;
    el('circle', { cx, cy, r: 20 * ik, fill: C.sun }, IG); el('circle', { cx, cy, r: 10 * ik, fill: C.cream }, IG);
    const R0 = 116 * ik; let d = `M${r1(cx + R0)},${r1(cy)}`; const n = 80; for (let i = 1; i <= Math.round(n * ring); i++) { const a = i / n * Math.PI * 2; d += `L${r1(cx + Math.cos(a) * R0)},${r1(cy + Math.sin(a) * R0)}`; }
    el('path', { d, fill: 'none', stroke: C.blue, 'stroke-width': 24 * ik, 'stroke-linecap': 'round' }, IG); el('path', { d, fill: 'none', stroke: C.cream, 'stroke-width': 8 * ik, 'stroke-linecap': 'round' }, IG);
    for (let q = 0; q < 4; q++) { const a = q * Math.PI / 2 + 0.3; if (ring > q / 4) sparkle(IG, cx + Math.cos(a) * R0, cy + Math.sin(a) * R0, 14 * ik, C.sun); }
    if (t > 64.4) label(g(), t, 64.4, cx - 20, cy + 200, 1530, 590, 'EINSTEIN RING', 'आइंस्टाइन रिंग', 'start');
  }
  drawTara(g(), t);
  ribbon(g(), t, 1, [0, 0, 0, 0]);
  subtitles(g(), t);
}

// ================= S6 68.6–80: Euclid at L2; ~15,000 lens candidates =================
function sceneS6(t) {
  const t0 = SEC.S6, u = eo(seg(t, t0, t0 + 1.4));
  bg(g(), 61, 110, inBoxes([[0, 0, 0, 0]]));
  // frame: Earth (a marker, too small to draw at this scale), L2, the telescope inset
  const ex = 660, ey = 740, lx = 1560, ly = 740;
  el('circle', { cx: ex, cy: ey, r: 16, fill: C.blue }); el('circle', { cx: ex - 4, cy: ey - 4, r: 7, fill: C.mint });
  el('circle', { cx: ex, cy: ey, r: 34, fill: 'none', stroke: C.mist, 'stroke-width': 2.5, 'stroke-dasharray': '3 9', 'stroke-linecap': 'round' });
  el('rect', { x: ex + 40, y: ey - 3, width: r1((lx - ex - 80) * u), height: 6, rx: 3, fill: C.sun });
  for (let k = 1; k < 10; k++) if ((lx - ex - 80) * u > (lx - ex - 80) * k / 10) el('rect', { x: r1(ex + 40 + (lx - ex - 80) * k / 10 - 1.25), y: ey - 12, width: 2.5, height: 12, fill: C.sun });
  nextRing(g(), t, t0 + 0.9, lx, ly, 26);
  el('circle', { cx: lx, cy: ly, r: 8, fill: C.cream });
  text(g(), ex, 810, 'पृथ्वी', { 'font-size': 32, 'font-weight': 600, fill: C.cream, 'text-anchor': 'middle', ...HI });
  text(g(), (ex + lx) / 2, 700, '15 लाख किमी', { 'font-size': 36, 'font-weight': 600, fill: C.sun, 'text-anchor': 'middle', ...HI });
  // inset: Euclid drawn larger than real
  const ik = eio(seg(t, t0 + 1.2, t0 + 2.4)), cx = 1560, cy = 330, r = 170 * ik;
  if (ik > 0.01) {
    el('circle', { cx, cy, r: r1(r + 10), fill: C.n3 }); const IG = g(null, { 'clip-path': clipOf('circle', { cx, cy, r: r1(r) }) });
    el('circle', { cx, cy, r: r1(r), fill: C.night }, IG);
    shaded(IG, 'rect', { x: cx - 90 * ik, y: cy - 30 * ik, width: 180 * ik, height: 120 * ik, rx: 16 * ik }, C.cream, C.creamD, 10 * ik, 10 * ik);
    el('rect', { x: cx - 120 * ik, y: cy + 70 * ik, width: 240 * ik, height: 22 * ik, rx: 6 * ik, fill: C.blueD }, IG); el('rect', { x: cx - 120 * ik, y: cy + 70 * ik, width: 240 * ik, height: 10 * ik, rx: 5 * ik, fill: C.blue }, IG);
    el('circle', { cx, cy: cy - 6 * ik, r: 44 * ik, fill: C.creamD }, IG); el('circle', { cx, cy: cy - 6 * ik, r: 30 * ik, fill: C.night }, IG); el('circle', { cx: cx - 8 * ik, cy: cy - 14 * ik, r: 8 * ik, fill: C.blue }, IG);
    text(g(), cx, cy + 210, 'EUCLID · L2', { ...tagA, 'text-anchor': 'middle' });
  }
  // candidates: a field of lens-candidate dots, a few get a ring, counter ~15,000
  if (t > 73.2) {
    const fx = 600, fy = 100, fw = 740, fh = 300, ck = eo(seg(t, 73.2, 76.0));
    for (let i = 0; i < 700; i++) { const [a, b, c] = fieldRng(7, i), x = fx + a * fw, y = fy + b * fh, pop = backE(seg(t, 73.2 + a * 2.4, 73.6 + a * 2.4), 2); if (pop > 0.05) el('circle', { cx: r1(x), cy: r1(y), r: r1((2.2 + 1.5 * c) * pop), fill: c < 0.5 ? C.mist : C.cream }); }
    for (let i = 0; i < 9; i++) { const [a, b] = fieldRng(7, i * 7 + 3), x = fx + a * fw, y = fy + b * fh, kk = spr(t, 76.0 + i * 0.22, 15, 8); if (kk > 0) el('circle', { cx: r1(x), cy: r1(y), r: r1(11 + 28 * (1 - kk)), fill: 'none', stroke: C.sun, 'stroke-width': 3 }); }
    text(g(), 600, 520, `≈ ${Math.round(15000 * ck).toLocaleString('en-US')}`, { 'data-noread': 1, 'font-size': 92, 'font-weight': 700, fill: C.cream, 'letter-spacing': -1 });
    wipeText(g(), 604, 568, 'LENS CANDIDATES', tagA, eo(seg(t, 75.6, 76.2)), 24);
    wipeText(g(), 604, 624, 'अभी सबकी पुष्टि बाकी', { 'font-size': 34, 'font-weight': 600, fill: C.mist, ...HI }, eo(seg(t, 77.0, 77.6)), 40);
  }
  drawTara(g(), t);
  ribbon(g(), t, 2, [0, 0, 0, 0]);
  subtitles(g(), t);
}

// ================= S7 80–102.9: weak lensing, the early map =================
function sceneS7(t) {
  bg(g(), 71, 80, inBoxes([[0, 0, 0, 0]]));
  const H1 = [620, 480], H2 = [1280, 430];
  const shear = eo(seg(t, 84.0, 88.0));
  // web: filled on the left half, left unfinished on the right
  const wk = eo(seg(t, 89.0, 96.0)), web = [[H1, H2, 1], [[H1[0] - 300, H1[1] + 120], H1, 1], [[H1[0] - 80, H1[1] + 320], H1, 1], [H2, [H2[0] + 340, H2[1] - 80], 0], [H2, [H2[0] + 220, H2[1] + 260], 0], [[H1[0] + 100, H1[1] + 380], H2, 0]];
  for (const [a, b, done] of web) {
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 - 50, d = `M${a[0]},${a[1]}Q${mx},${my} ${b[0]},${b[1]}`;
    if (done) el('path', { d, fill: 'none', stroke: C.n3, 'stroke-width': r1(46 * wk), 'stroke-linecap': 'round' });
    else el('path', { d, fill: 'none', stroke: C.mist, 'stroke-width': 3, 'stroke-dasharray': '5 15', 'stroke-linecap': 'round', opacity: r1(wk) });
  }
  for (const [x, y, R] of [[H1[0], H1[1], 90], [H2[0], H2[1], 80]]) { el('circle', { cx: x, cy: y, r: r1(R * 1.7 * wk), fill: C.n2 }); el('circle', { cx: x, cy: y, r: r1(R * wk), fill: C.n3 }); }
  // galaxy shapes: random, then sheared tangentially around the two halos
  for (let i = 0; i < 110; i++) {
    const [a, b, c, d] = fieldRng(8, i), x = 80 + a * 1760, y = 120 + b * 640; if (y > 790 || (x < 1100 && y > 600)) continue;
    const near = [H1, H2].map(h => Math.hypot(x - h[0], y - h[1])), ni = near[0] < near[1] ? 0 : 1, dist = near[ni], hh = ni ? H2 : H1;
    const tang = Math.atan2(y - hh[1], x - hh[0]) * 180 / Math.PI + 90, rnd = d * 180, w = shear * Math.exp(-dist / 450);
    const ang = lerp(rnd, tang, Math.min(1, w * 1.6)), sq = 1 - 0.5 * Math.min(1, w * 1.1) * 0.6, r = 7 + 9 * c;
    const G = g(null, { transform: `translate(${r1(x)},${r1(y)}) rotate(${r1(ang)}) scale(1,${r1(sq * 0.55 + 0.45 * (1 - shear * 0.4))})` });
    el('ellipse', { rx: r * 1.3, ry: r * 0.9 * 1.0, fill: c < 0.3 ? C.mintD : C.blueD }, G); el('ellipse', { rx: r * 0.8, ry: r * 0.55, fill: c < 0.3 ? C.mint : C.blue }, G); el('circle', { r: r * 0.22, fill: C.cream }, G);
  }
  if (t > 91.0) label(g(), t, 91.0, H2[0] + 340, H2[1] - 80, 1520, 190, 'EARLY DATA · NOT THE FINISHED MAP', 'अभी अधूरा नक्शा', 'end');
  drawTara(g(), t);
  ribbon(g(), t, 1, [0, 0, 0, 0]);
  subtitles(g(), t);
}

// ================= S8 102.9–122.9: dark energy / GMRT, two separate things =================
function sceneS8(t) {
  const t0 = SEC.S8; bg(g(), 81, 60, inBoxes([[0, 0, 0, 0]]));
  const split = eo(seg(t, t0, t0 + 0.9));
  // divider
  el('rect', { x: 948, y: 60, width: 5, height: r1(780 * split), rx: 2.5, fill: C.n3 });
  // left: expansion, rings of galaxy dots spreading
  const kx = 480, ky = 440, ex = 1 + 0.9 * eio(seg(t, 104.0, 112.0));
  for (let ring = 1; ring <= 5; ring++) { el('circle', { cx: kx, cy: ky, r: r1(60 * ring * ex), fill: 'none', stroke: C.n3, 'stroke-width': 3, 'stroke-dasharray': '3 10', 'stroke-linecap': 'round' }); for (let i = 0; i < ring * 5; i++) { const a = i / (ring * 5) * Math.PI * 2 + ring; dotGalaxy(g(), kx + Math.cos(a) * 60 * ring * ex, ky + Math.sin(a) * 60 * ring * ex, 5 + ring, a * 57, ring % 2); } }
  el('circle', { cx: kx, cy: ky, r: 12, fill: C.sun });
  if (t > 104.6) label(g(), t, 104.6, kx + 12, ky - 16, 620, 220, 'DARK ENERGY · A SEPARATE MYSTERY', 'डार्क एनर्जी', 'start');
  // right: GMRT dishes on a ridge, radio rings
  if (t > 109.6) {
    const gk = eo(seg(t, 109.6, 111.2)), gy = 760;
    el('ellipse', { cx: 1440, cy: gy + 240, rx: 700, ry: 260, fill: C.mintD }); el('ellipse', { cx: 1420, cy: gy + 250, rx: 680, ry: 250, fill: C.mint });
    for (const [dx, dy, s] of [[1130, 0, 0.8], [1280, -40, 1], [1440, 10, 1.2], [1600, -30, 0.9], [1740, 20, 0.7], [1210, 60, 0.6], [1530, 70, 0.7]]) {
      const G = g(null, { transform: `translate(${dx},${gy + dy}) scale(${r1(s * gk)})` });
      el('rect', { x: -6, y: -10, width: 12, height: 74, rx: 4, fill: C.creamD }, G);
      el('path', { d: 'M-80,-70 A92,92 0 0 0 80,-70 Z', fill: C.creamD }, G); el('path', { d: 'M-80,-70 A92,92 0 0 0 40,-14 L10,-70Z', fill: C.cream }, G);
    }
    for (let i = 0; i < 3; i++) { const rk = ((t - 111.0) * 0.45 + i / 3) % 1; if (t > 111.0) el('circle', { cx: 1440, cy: gy - 190, r: r1(30 + 210 * rk), fill: 'none', stroke: C.mist, 'stroke-width': r1(3 * (1 - rk) + 1.5) }); }
    if (t > 111.0) label(g(), t, 111.2, 1440, gy - 400, 1500, 200, 'GMRT · INDIA · RADIO WAVES', 'एक अलग यंत्र', 'start');
  }
  drawTara(g(), t);
  ribbon(g(), t, 3, [0, 0, 0, 0], false, true);
  subtitles(g(), t);
}

// ================= S9 122.9–151.4: the ribbon summary, then one dot =================
function sceneS9(t) {
  const t0 = SEC.S9; bg(g(), 91, 120, inBoxes([[0, 0, 0, 0]]));
  const mv = eio(seg(t, t0, t0 + 1.6));
  // ribbon to centre: lit stops one by one at 125, 127, 129, 131
  const lit = [0, 1, 2, 3].map(i => spr(t, 125 + i * 2.0, 15, 8));
  const G = g(null, { transform: `translate(${r1(lerp(0, 0, mv))},0)` });
  ribbon(G, t, 3, lit, true);
  // sun-yellow dots run along the track
  const x0 = 640, L = 900, y = 640, run = eio(seg(t, 125, 133));
  for (let i = 0; i < 40; i++) { const u = i / 40; if (u > run) break; el('circle', { cx: r1(x0 + L * u), cy: y - 5 + 0, r: 3, fill: C.sun }); }
  // stop names
  const names = [['गैलेक्सी', 'GALAXY'], ['डार्क मैटर का घेरा', 'DARK MATTER HALO'], ['यूक्लिड · L2', 'EUCLID AT L2'], ['जीएमआरटी', 'GMRT']];
  names.forEach((n, i) => { const e = STOPS[i].e, x = x0 + (25 - e) / 21 * L; if (lit[i] > 0.3) { const k = eo(seg(t, 125.2 + i * 2.0, 125.7 + i * 2.0)); wipeText(g(), x, y - 90 - (i % 2) * 64, n[1], { ...tagA, 'text-anchor': 'middle' }, k, 24); wipeText(g(), x, y + 120 + (i % 2) * 54, n[0], { 'font-size': 32, 'font-weight': 600, fill: C.cream, 'text-anchor': 'middle', ...HI }, k, 38); } });
  // title card
  if (t > 135.2) { const k = spr(t, 135.5, 15, 7.5), A = { 'font-size': 120, 'font-weight': 700, fill: C.cream, 'text-anchor': 'middle', 'letter-spacing': -2 }; const Gc = g(null, { 'clip-path': clipOf('rect', { x: 200, y: 140, width: 1520, height: 200 }) }); text(Gc, 960, r1(300 + 160 * (1 - k)), 'ExplainEveryday', A); wipeText(g(), 960, 380, 'Big Questions. Simple Explanations.', { 'font-size': 34, 'font-weight': 500, fill: C.sun, 'text-anchor': 'middle', 'letter-spacing': 2 }, eo(seg(t, 136.4, 137.2)), 44); }
  // the last dot: everything quiets, one dot
  const fin = eio(seg(t, 143.5, 146.5));
  if (fin > 0) { el('rect', { width: W, height: H, fill: C.night, opacity: r1(fin) }); const k = backE(seg(t, 145.5, 146.2), 2); el('circle', { cx: 960, cy: 520, r: r1(40 * k), fill: C.n3 }); el('circle', { cx: 960, cy: 520, r: r1(22 * k), fill: C.n2 }); el('circle', { cx: 960, cy: 520, r: r1(7 * k), fill: C.sun }); el('circle', { cx: 960, cy: 520, r: r1(3.5 * k), fill: C.cream }); }
  if (fin < 0.3) drawTara(g(), t);
  if (fin < 0.5) subtitles(g(), t);
}

// ---------- page contract ----------
function film(t) { scene(t); }
function filmEvents() { return []; }   // sound cues are added with the score

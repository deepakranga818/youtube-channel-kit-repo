// runtime.js: camera over the one big page, paper, subtitle slip, render and boot.
const QS = new URLSearchParams(location.search), NOSUB = !!QS.get('nosub');
const FROM = +(QS.get('from') || 0);
let TOEND = null;

// ---------- camera: keys [t, x, y, zoom, ease]; page.js registers them with CK(). Sorted here; far hops whip. ----------
let CAM = [];
function buildCam() {
  const pullT = CUE.pull, endT = CUE.pull + 4.4;                 // page.js sets CUE.pull (when the last block is done) and PULL = {from:[x,y,zoom], to:[x,y,zoom]}
  CK(pullT, ...PULL.from); CK(endT, ...PULL.to); CK(TL.dur, ...PULL.to);
  const K = CAMK.map((k, i) => ({ t: k[0], x: k[1], y: k[2], z: k[3], i })).sort((a, b) => a.t - b.t || a.i - b.i);
  const out = [];
  for (const k of K) { while (out.length && k.t - out[out.length - 1].t < 0.45) out.pop(); out.push(k); }
  CAM = out.map((k, j) => { const p = out[j - 1]; const far = p && Math.hypot(k.x - p.x, k.y - p.y) > 900; return [k.t, k.x, k.y, k.z, far ? 'whip' : 'eio']; });
}
const toScreen = (c, x, y) => [(x - c.x) * c.z + W / 2, (y - c.y) * c.z + H / 2];
const VIEW = QS.get('view') ? QS.get('view').split(',').map(Number) : null;   // ?view=x,y,z pins the camera (layout checks)
function cam(t) {
  if (VIEW) return { x: VIEW[0], y: VIEW[1], z: VIEW[2] };
  let i = 0; while (i < CAM.length - 2 && t >= CAM[i + 1][0]) i++;
  const a = CAM[i], b = CAM[i + 1];
  if (t <= a[0]) return { x: a[1], y: a[2], z: a[3] };
  if (t >= b[0]) return { x: b[1], y: b[2], z: b[3] };
  let u = clamp((t - a[0]) / (b[0] - a[0]));
  u = b[4] === 'whip' ? (u < 0.5 ? 16 * u ** 5 : 1 - Math.pow(-2 * u + 2, 5) / 2) : eio(u);
  const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), u));
  const wa = 1 / a[3], wb = 1 / b[3], k = Math.abs(wa - wb) < 1e-6 ? u : (1 / z - wa) / (wb - wa);
  const kk = Math.abs(Math.log(a[3] / b[3])) > 0.5 ? k : u;
  return { x: lerp(a[1], b[1], kk), y: lerp(a[2], b[2], kk), z };
}

// ---------- paper ----------
let GRAIN = null; const GX0 = -600, GY0 = -400, GS = 0.5, GW = 6600, GH = 3800;
function makeGrain() {
  GRAIN = document.createElement('canvas'); GRAIN.width = Math.round(GW * GS); GRAIN.height = Math.round(GH * GS);
  const g = GRAIN.getContext('2d'); SEED = 9;
  for (let i = 0; i < 220000; i++) { g.fillStyle = `rgba(90,80,60,${rr(0.015, 0.05)})`; g.fillRect(rr(0, GRAIN.width), rr(0, GRAIN.height), rr(0.8, 2.2), rr(0.8, 2.2)); }
}
function paper(c) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = PAPER; ctx.fillRect(0, 0, W, H);
  ctx.setTransform(c.z, 0, 0, c.z, W / 2 - c.x * c.z, H / 2 - c.y * c.z);
  ctx.drawImage(GRAIN, GX0, GY0, GW, GH);
  const x0 = c.x - W / 2 / c.z, x1 = c.x + W / 2 / c.z, y0 = c.y - H / 2 / c.z, y1 = c.y + H / 2 / c.z;
  ctx.fillStyle = DOT; const st = 26, r = Math.max(1.3, 1.1 / c.z);
  for (let y = Math.floor((y0 - 13) / st) * st + 13; y < y1 + st; y += st) for (let x = Math.floor((x0 - 13) / st) * st + 13; x < x1 + st; x += st) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
}

// ---------- subtitles: a paper slip taped to the bottom of the frame, Hinglish over English, never wrapped ----------
function fitFont(s, px, f, maxW) { ctx.font = `${px}px ${f}`; let w = ctx.measureText(s).width; while (w > maxW && px > 22) { px -= 1; ctx.font = `${px}px ${f}`; w = ctx.measureText(s).width; } return [px, w]; }
function subtitles(t) {
  if (NOSUB || !TL) return;
  const L = TL.lines.find(l => t >= l.c0 && t < l.c1); if (!L) return;
  const a = clamp(Math.min((t - L.c0) / 0.2, (L.c1 - t) / 0.2)), rise = (1 - eo(clamp((t - L.c0) / 0.3))) * 6;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a;
  const maxW = W - 220, F = 'PH, KB, sans-serif';
  const same = L.hi === L.en;                                       // an English tagline: one line only
  const [ph, wh] = fitFont(L.hi, same ? 44 : 40, F, maxW), [pe, we] = same ? [0, 0] : fitFont(L.en, 29, F, maxW);
  const cw = Math.max(wh, we) + 76, ch = same ? 76 : 104, x0 = W / 2 - cw / 2, y0 = H - 24 - ch + rise;
  ctx.fillStyle = 'rgba(80,80,92,0.10)'; ctx.fill(pathOf(rrect(x0 + 4, y0 + 5, cw, ch, 10)));
  ctx.fillStyle = PAPER; ctx.globalAlpha = a * 0.96; ctx.fill(pathOf(rrect(x0, y0, cw, ch, 10)));
  ctx.globalAlpha = a; ctx.save(); ctx.translate(x0 + 30, y0 + 2); ctx.rotate(-0.16); ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = rgba(PL.shd, 0.22); ctx.fillRect(-34, -11, 68, 22); ctx.restore();
  ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = INK; ctx.font = `${ph}px ${F}`; ctx.fillText(L.hi, W / 2, y0 + (same ? 52 : 48));
  if (!same) { ctx.fillStyle = INK2; ctx.font = `${pe}px ${F}`; ctx.fillText(L.en, W / 2, y0 + 88); }
  ctx.restore();
}

// window.TEXTS: every text written on the page, with its screen box (the subtitle slip is checked through the .srt)
window.TEXTS = t => {
  t += FROM; const c = cam(t), out = [];
  PAGE_TEXTS.forEach(({ T: TT, t0 }, i) => {
    if (t < t0) return;
    const x0 = TT.x + TT.chars[0].ox, x1 = x0 + TT.tot, y0 = TT.y - TT.size * 0.85, y1 = TT.y + TT.size * 0.3;
    const [a0, b0] = toScreen(c, x0, y0), [a1, b1] = toScreen(c, x1, y1);
    out.push({ id: 'p' + i, text: TT.s, x0: a0, y0: b0, x1: a1, y1: b1 });
  });
  return out;
};

// ---------- render ----------
window.render = function (t) { renderFilm(t + FROM); };
function renderFilm(t) {
  const f = Math.round(t * FPS); BOIL = Math.floor(f / 2) % 3;
  const c = cam(t);
  paper(c);
  for (const e of EL) {
    if (t < e.t0) continue;
    SEED = e.seed;
    e.draw(clamp((t - e.t0) / e.d));
  }
  subtitles(t);
}
window.CAMAT = cam;

async function boot() {
  document.documentElement.style.background = document.body.style.background = PAPER;
  GLY = await (await fetch('glyphs.json')).json();
  TL = await (await fetch('timeline.json')).json();
  await Promise.all(['KB', 'PH'].map(f => document.fonts.load(`40px ${f}`, 'Ag₹')));
  window.DUR = +(QS.get('to') || TL.dur) - FROM;
  makeGrain();
  buildPage(); buildCam();
  window.EV = EL.filter(e => e.kind !== 'fill').map(e => { const c = cam(e.t0 + e.d / 2), x = toScreen(c, e.wx, 0)[0]; return { t: +e.t0.toFixed(4), type: e.kind, d: +e.d.toFixed(4), pan: +clamp((x / W) * 2 - 1, -1, 1).toFixed(3) }; });
  for (const [k, v] of Object.entries(CUE)) window.EV.push({ t: v, type: 'cue', name: k });
  window.CUE = CUE;
  window.render(0);
  window.READY = true;
}
boot();

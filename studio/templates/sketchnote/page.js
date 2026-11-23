// page.js: THE TOPIC FILE (stub). One sheet, blocks laid on it; each block is written when its narration plays (times come from timeline.json).
// Worked example with 8 blocks: example/page.credit-cards.js. Helpers live in parts.js (head, note, host, icons, ribbon, box, swash, tick, cross...).
// Rules that kept the credit-card film readable: one note per voice chunk; start each note at T(id)+0.2..; a block ~1700x900; CK() camera keys 0.45 s+ apart.
let TL = null; const T = id => TL.start[id], DN = id => TL.len[id], SEC0 = k => TL.lines.find(l => l.id[0] === k).t0;
const CAMK = []; const CK = (t, x, y, z) => CAMK.push([t, x, y, z]);
const CUE = {};                                               // CUE.pull, CUE.done, CUE.silence are set in buildPage; optional CUE.fee = the one number that lands
const BK = { 0: [0, 0], 1: [1800, 0] };                       // block origins on the page; the final pull-back shows them all
const PULL = { from: [2650, 450, 1.1], to: [1800, 450, 0.55] };   // final pull-back: from the last block to a view of the whole sheet (credit-card film: 8 blocks, to zoom 0.34)
const twid = (s, size, f = 'KB') => { ctx.save(); ctx.font = `${size}px ${f}`; const w = ctx.measureText(s).width; ctx.restore(); return w; };
function blockBanner(k, label, t0, w = 640) { const [ox, oy] = BK[k]; slow(t0, 1.4, () => ribbon(ox + 850, oy + 56, w, 86, label, 48, t0, { d: 0.3, td: 0.5 })); }
function blockFrame(k, t0, h = 640) { const [ox, oy] = BK[k]; slow(t0, 3.0, () => box(ox + 14, oy + 120, 1672, h, t0, 0.5)); }

function B0() {                                               // replace with your blocks
  const [ox, oy] = BK[0], X = x => ox + x, Y = y => oy + y;
  blockBanner(0, 'YOUR TOPIC', T('h1') + 0.2, 600);
  head('Hello!', X(850), Y(400), 90, T('h1') + 0.6, { align: 'center' });
  note('one note per chunk', X(850), Y(520), 34, T('h2') + 0.3, { align: 'center', col: INK });
  host(X(1400), Y(520), 0.9, T('h2') + 0.5, 'think');
  CK(0, X(850), Y(400), 1.6); CK(T('h2') - 0.3, X(850), Y(450), 1.3);
}
function B1() {
  const [ox, oy] = BK[1], X = x => ox + x, Y = y => oy + y;
  head('Your Channel', X(850), Y(450), 70, T('z1') + 0.3, { align: 'center' });
  host(X(850), Y(700), 0.9, T('z1') + 0.5, 'wave');
  CK(T('z1') - 0.3, X(850), Y(500), 1.3);
}
function buildPage() {
  SEED = 42; EL.length = 0; CAMK.length = 0;
  B0(); B1();
  CUE.pull = T('z1') + 0.6; CUE.done = TL.dur - 2.0; CUE.silence = TL.dur - 3.0;
}

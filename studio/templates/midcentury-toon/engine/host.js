// DEFAULT HOST (replaceable): the ExplainEveryday channel's boy host in the mid-century cartoon grammar (curly dark hair, navy hooded jacket, red scarf,
// white tee, olive cargo trousers, white sneakers). For another channel change the HC colours / hair / clothes here, or write a new host with the same pose API (see docs/STYLES.md).
// Same pose API as the demo's presenter: { x, y, s, dir, view:'q'|'front', face, mouth(0..1 talk amount), armF/armB:{a1,a2}, handF/handB, blink, look, prop }
// A held drawing: only arms, hands, eyes and mouth move. Units: feet at (0,0), hair top about -575. Angles: 0 = right, PI/2 = down.
import { PAL, shape, ink, ellipse, spline, xform, move, rrect, rect, TAU, reg } from './toon.js';
import { drawHand } from './chars.js';

export const HC = { jacket: '#35476E', jacketD: '#25344F', scarf: '#A23B33', scarfD: '#7D2A25', tee: '#F6EBD3', pants: '#7B7A44', pantsD: '#5C5B31',
  hair: '#4A2A1E', hairD: '#33190F', skin: '#E9B98F', skinD: '#D39B72', shoe: '#FBF6EA', shoeStripe: '#35476E' };
const UA = 100, FA = 92;
export function hostJoints(pose, which) {
  const front = pose.view === 'front';
  const sh = front ? [which === 'F' ? 48 : -48, -384] : (which === 'F' ? [40, -384] : [-36, -386]);
  const rest = front ? (which === 'F' ? { a1: 1.36, a2: 1.5 } : { a1: 1.78, a2: 1.64 }) : (which === 'F' ? { a1: 1.3, a2: 1.52 } : { a1: 1.86, a2: 1.7 });
  const arm = pose[which === 'F' ? 'armF' : 'armB'] || rest;
  const el = [sh[0] + Math.cos(arm.a1) * UA, sh[1] + Math.sin(arm.a1) * UA];
  const ha = [el[0] + Math.cos(arm.a2) * FA, el[1] + Math.sin(arm.a2) * FA];
  return { sh, el, ha, a2: arm.a2 };
}
// a few ready poses (armF = the arm nearest the viewer, pointing toward +x when dir = 1)
export const POSE = {
  rest:    {},
  explain: { armF: { a1: 0.5, a2: -0.15 }, handF: 'open' },
  point:   { armF: { a1: -0.2, a2: -0.32 }, handF: 'point' },
  pointUp: { armF: { a1: -0.7, a2: -1.2 }, handF: 'point' },
  think:   { armF: { a1: 1.0, a2: -1.9 }, handF: 'point', armB: { a1: 1.86, a2: 1.7 } },
  wave:    { armF: { a1: -0.45, a2: -1.35 }, handF: 'open' },
  both:    { armF: { a1: 0.4, a2: -0.2 }, armB: { a1: 2.7, a2: 3.35 }, handF: 'open', handB: 'open' },
  fist:    { armF: { a1: -0.2, a2: -1.5 }, armB: { a1: 2.9, a2: 4.4 }, handF: 'grip', handB: 'grip' },
  hold:    { armF: { a1: 0.9, a2: -0.6 }, handF: 'grip' },
};
function sleeve(ctx, J, seed) {
  const P = spline([J.sh, [(J.sh[0] + J.el[0]) / 2, (J.sh[1] + J.el[1]) / 2], J.el, [(J.el[0] + J.ha[0]) / 2, (J.el[1] + J.ha[1]) / 2], J.ha], false, 6);
  ink(ctx, P, 28, { seed, taper: false, wob: 0.08 });
  const o = reg(seed, 1);
  ink(ctx, move(P, o[0] * 0.6, o[1] * 0.6), 19, { seed: seed + 1, taper: false, wob: 0.05, color: HC.jacket });
  const a = J.a2, cx = J.ha[0] - Math.cos(a) * 8, cy = J.ha[1] - Math.sin(a) * 8;
  ink(ctx, [[cx + Math.cos(a + 1.57) * 13, cy + Math.sin(a + 1.57) * 13], [cx - Math.cos(a + 1.57) * 13, cy - Math.sin(a + 1.57) * 13]], 4, { seed: seed + 2, taper: false, color: HC.jacketD });
}
function arm(ctx, pose, which, seed) {
  const J = hostJoints(pose, which), prop = pose.prop && (pose.prop.hand || 'F') === which ? pose.prop : null;
  sleeve(ctx, J, seed);
  drawHand(ctx, J.ha[0], J.ha[1], J.a2, pose[which === 'F' ? 'handF' : 'handB'] || 'open', which === 'F' ? -1 : 1, 1, HC.skin);
  if (prop) drawProp(ctx, prop, J);
  return J;
}
// held things: the credit card, a phone, a tablet
function drawProp(ctx, p, J) {
  const [hx, hy] = J.ha; ctx.save(); ctx.translate(hx + (p.dx ?? 30), hy + (p.dy ?? -10)); ctx.rotate(p.rot ?? -0.25);
  if (p.kind === 'card') {
    shape(ctx, rrect(-46, -30, 92, 60, 8), { fill: p.col || PAL.teal, line: 3.5, seed: 210, grain: 0.2 });
    shape(ctx, rect(-46, -14, 92, 12), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 });
    shape(ctx, rrect(-36, 6, 22, 16, 3), { fill: PAL.mustardL, line: 2, seed: 211, grain: 0 });
  } else if (p.kind === 'phone') {
    shape(ctx, rrect(-26, -46, 52, 92, 10), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 }); shape(ctx, rrect(-20, -38, 40, 70, 5), { fill: p.screen || PAL.white, line: 0, off: [0, 0], grain: 0 });
  } else if (p.kind === 'tablet') {
    shape(ctx, rrect(-60, -44, 120, 88, 8), { fill: PAL.ink, line: 0, off: [0, 0], grain: 0 }); shape(ctx, rrect(-52, -36, 104, 72, 4), { fill: p.screen || PAL.white, line: 0, off: [0, 0], grain: 0 });
  }
  ctx.restore();
}
// curly hair: a bumpy outline (curls) around an ellipse; a0..a1 in radians
function curls(cx, cy, rx, ry, a0, a1, n, bump, ph = 0) {
  const pts = [];
  for (let i = 0; i <= n * 6; i++) { const u = i / (n * 6), a = a0 + (a1 - a0) * u, k = 1 + bump * Math.abs(Math.sin(u * n * Math.PI + ph)); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  return pts;
}
function head(ctx, pose, t) {
  const face = pose.face || 'neutral', front = pose.view === 'front', blink = pose.blink ?? 0, look = pose.look || [0, 0], mo = pose.mouth ?? 0;
  const hairBack = [...curls(front ? 0 : -6, -500, 70, 76, Math.PI * 0.95, Math.PI * 2.05, 7, 0.16), ...(front ? [[66, -470], [70, -440], [-70, -440], [-66, -470]] : [[58, -482], [44, -456], [-58, -452], [-72, -480]])];
  shape(ctx, hairBack, { fill: HC.hair, line: 3.4, seed: 220, grain: 0.3, breaks: 0.2 });
  if (front) {
    shape(ctx, [[-50, -440], [-30, -418], [0, -412], [30, -418], [50, -440], [50, -480], [-50, -480]].map(([x, y]) => [x, y]), { fill: HC.skin, line: 0, seed: 221, grain: 0.1 });   // neck/jaw filler
    shape(ctx, ellipse(0, -480, 56, 64, 36), { fill: HC.skin, line: 4, seed: 222, grain: 0.15, breaks: 0.22 });
    shape(ctx, ellipse(-58, -476, 10, 14, 12), { fill: HC.skin, line: 3, seed: 223, grain: 0 }); shape(ctx, ellipse(58, -476, 10, 14, 12), { fill: HC.skin, line: 3, seed: 224, grain: 0 });
    [-21, 21].forEach((x, i) => eye(ctx, x + look[0], -484 + look[1], face, blink, i));
    ink(ctx, spline([[2, -482], [-6, -460], [6, -457]], false, 4), 3.4, { seed: 225 });
    mouth(ctx, 0, -436, face, mo); cheeks(ctx, [[-34, -458], [34, -458]]);
  } else {
    const chain = [[52, -488], [50, -512], [34, -538], [-6, -552], [-44, -536], [-60, -496], [-56, -454], [-38, -424], [-8, -410], [22, -412], [38, -424], [44, -442], [52, -458]];
    shape(ctx, [...spline(chain, false, 6), [68, -468]], { fill: HC.skin, line: 4, seed: 226, grain: 0.15, breaks: 0.12 });
    shape(ctx, ellipse(-34, -470, 10, 14, 12), { fill: HC.skin, line: 3, seed: 227, grain: 0 });          // ear
    [[8, -490], [38, -493]].forEach(([x, y], i) => eye(ctx, x + look[0], y + look[1], face, blink, i, i === 1 ? 0.78 : 1));
    mouth(ctx, 28, -432, face, mo); cheeks(ctx, [[-10, -458]]);
  }
  // the fringe and front curls over the forehead
  shape(ctx, curls(front ? 0 : 4, -522, front ? 60 : 56, 38, Math.PI * 1.02, Math.PI * 1.98, 6, 0.22, 0.6), { fill: HC.hair, line: 3.2, seed: 228, grain: 0.3, breaks: 0.25 });
}
function eye(ctx, x, y, face, blink, i, sx = 1) {
  if (face === 'happy' || blink > 0.5 || (face === 'wink' && i === 0)) {
    const up = face === 'happy' || face === 'wink';
    ink(ctx, up ? [[x - 8 * sx, y + 3], [x, y - 5], [x + 8 * sx, y + 3]] : [[x - 8 * sx, y], [x + 8 * sx, y]], 4, { seed: 230 + i, taper: false });
  } else {
    const r = face === 'wow' ? 8.5 : 6.8;
    shape(ctx, ellipse(x, y, r * 0.8 * sx, r * 1.3, 14), { fill: PAL.ink, line: 0, grain: 0, off: [0, 0] });
    shape(ctx, ellipse(x + 1.5, y - 3.5, 2.2, 2.6, 8), { fill: PAL.white, line: 0, grain: 0, off: [0, 0] });
  }
  const by = face === 'wow' ? y - 25 : face === 'focus' || face === 'think' ? y - 14 : y - 19, tilt = face === 'focus' ? (i ? -3 : 3) : face === 'think' ? (i ? -4 : 1) : 0;
  ink(ctx, [[x - 9 * sx, by + tilt], [x + 9 * sx, by - tilt - 2]], 3.6, { seed: 240 + i, taper: true, color: HC.hairD });
}
function mouth(ctx, x, y, face, mo) {
  if (mo > 0.12) { const r = 4 + mo * 9; shape(ctx, ellipse(x - 2, y + 2, 8 + mo * 3, r, 14), { fill: PAL.coralD, line: 3, seed: 250, grain: 0, breaks: 0 }); if (mo > 0.5) shape(ctx, rect(x - 8, y - 4, 13, 4), { fill: PAL.white, line: 0, off: [0, 0], grain: 0 }); return; }
  if (face === 'happy') shape(ctx, spline([[x - 16, y - 6], [x + 12, y - 8], [x + 4, y + 11], [x - 10, y + 9]], true, 6), { fill: PAL.coralD, line: 3.2, seed: 251, grain: 0, breaks: 0 });
  else if (face === 'wow') shape(ctx, ellipse(x - 2, y + 2, 7, 10, 16), { fill: PAL.coralD, line: 3.2, seed: 252, grain: 0, breaks: 0 });
  else if (face === 'focus' || face === 'think') ink(ctx, [[x - 12, y], [x + 8, y - 2]], 3.4, { seed: 253 });
  else if (face === 'wink') ink(ctx, spline([[x - 16, y - 4], [x - 3, y + 6], [x + 11, y - 6]], false, 5), 3.6, { seed: 254 });
  else ink(ctx, spline([[x - 12, y - 2], [x - 1, y + 4], [x + 9, y - 3]], false, 5), 3.4, { seed: 255 });
}
function cheeks(ctx, pts) { pts.forEach(([x, y], i) => shape(ctx, ellipse(x, y, 11, 7.5, 14), { fill: PAL.pink, line: 0, grain: 0, seed: 260 + i, alpha: 0.7 })); }

export function drawHost(ctx, pose, t = 0) {
  const front = pose.view === 'front';
  ctx.save(); ctx.translate(pose.x, pose.y); ctx.scale((pose.s ?? 1) * (pose.dir ?? 1), pose.s ?? 1);
  if (pose.shadow !== false) { ctx.save(); ctx.globalAlpha = 0.16; ctx.fillStyle = PAL.ink; ctx.beginPath(); ctx.ellipse(6, 2, 86, 10, 0, 0, TAU); ctx.fill(); ctx.restore(); }
  arm(ctx, pose, 'B', 70);
  // cargo trousers + white sneakers
  const legs = front ? [[[-46, -290], [-2, -290], [-8, -26], [-38, -26]], [[2, -290], [46, -290], [38, -26], [8, -26]]] : [[[-42, -290], [4, -290], [-4, -26], [-32, -26]], [[-2, -290], [46, -290], [36, -26], [10, -26]]];
  legs.forEach((L, i) => {
    shape(ctx, L, { fill: HC.pants, line: 3.8, seed: 270 + i, grain: 0.3, breaks: 0.15, shade: i === 1 && !front ? [{ pts: [[28, -294], [60, -294], [60, 0], [24, 0]], color: HC.pantsD, alpha: 0.7 }] : null });
    const ax = (L[2][0] + L[3][0]) / 2; shape(ctx, rect(ax - (i ? 5 : 22) + (i ? 3 : 0), -150, 18, 26), { fill: HC.pantsD, line: 2.4, seed: 272 + i, grain: 0.1 });   // cargo pocket
    const sh = front ? ellipse(ax, -9, 20, 10, 16) : spline([[ax - 18, -16], [ax + 8, -20], [ax + 32, -8], [ax + 28, 0], [ax - 18, 0]], true, 4);
    shape(ctx, sh, { fill: HC.shoe, line: 3, seed: 274 + i, grain: 0.2 });
    ink(ctx, [[ax - 14, -4], [ax + 24, -4]], 3, { seed: 276 + i, color: HC.shoeStripe, taper: false });
  });
  // hood behind the neck, jacket, white tee, zip, scarf
  shape(ctx, spline([[-48, -404], [-30, -440], [30, -440], [50, -404], [30, -392], [-30, -392]], true, 5), { fill: HC.jacketD, line: 3.6, seed: 280, grain: 0.3, breaks: 0.2 });
  shape(ctx, spline([[-54, -384], [-42, -402], [42, -402], [54, -384], [48, -312], [50, -276], [-48, -276], [-50, -312]], true, 6), { fill: HC.jacket, line: 4.2, seed: 281, grain: 0.35, breaks: 0.2,
    shade: front ? null : [{ pts: [[22, -404], [70, -404], [70, -270], [26, -270]], color: HC.jacketD, alpha: 0.5 }] });
  shape(ctx, [[-20, -402], [20, -402], [14, -300], [-14, -300]], { fill: HC.tee, line: 3, seed: 282, grain: 0.2, breaks: 0.2 });
  ink(ctx, [[0, -392], [0, -278]], 2.4, { seed: 283, taper: false, color: HC.jacketD });
  shape(ctx, rrect(-36, -420, 72, 30, 12), { fill: HC.scarf, line: 3.6, seed: 284, grain: 0.3, breaks: 0.2 });
  shape(ctx, [[8, -396], [34, -392], [40, -330], [18, -322]], { fill: HC.scarf, line: 3.4, seed: 285, grain: 0.3, breaks: 0.2, shade: [{ pts: [[26, -396], [44, -396], [44, -320], [30, -320]], color: HC.scarfD, alpha: 0.6 }] });
  head(ctx, pose, t);
  arm(ctx, pose, 'F', 60);
  ctx.restore();
}

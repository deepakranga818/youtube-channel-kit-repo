// tara.js: the guide, "Tara" (तारा): a round sun-yellow comet with one lens for an eye.
// Pose P: look [x,y] (-1..1), lid 0..1 (blink), zoom 0..1 (barrel steps out), smile 0..1 (iris bends into an arch),
// sq (squash, +/-), rot (deg), tail (tail swing, deg), flick (phase for the flame).
// Everything is solid fills: base colour + one shade step. No outlines, gradients or transparency.
function taraLens(x, y, s, P = {}) {   // where the sight line starts (lens centre, world coords)
  const a = ((P.rot || 0) * Math.PI) / 180, ox = 0.06 * s, oy = -0.02 * s;
  const z = 1 + 0.22 * (P.zoom || 0);
  const lx = ox + (P.look ? P.look[0] : 0) * 0.02 * s, ly = oy + (P.look ? P.look[1] : 0) * 0.02 * s;
  return [x + (lx * Math.cos(a) - ly * Math.sin(a)) + Math.cos(a) * 0.3 * s * z * 0.8, y + (lx * Math.sin(a) + ly * Math.cos(a)) + Math.sin(a) * 0.3 * s * z * 0.8];
}
function tara(p, x, y, s, P = {}) {
  const look = P.look || [0, 0], lid = P.lid || 0, zoom = P.zoom || 0, smile = P.smile || 0, sq = P.sq || 0;
  const flick = P.flick || 0;
  const G = g(p, { transform: `translate(${r1(x)},${r1(y)}) rotate(${r1(P.rot || 0)}) scale(${r1((1 + sq * 0.6) * 1000) / 1000},${r1((1 - sq) * 1000) / 1000})` });
  const R = 0.5 * s;
  // tail: two tapered flames trailing behind (to the lower left), swinging with P.tail; darker one behind
  const tw = (P.tail || 0) * Math.PI / 180;
  const tailPath = (len, wid, ang) => {
    const a = Math.PI * 0.86 + ang + tw, dx = Math.cos(a), dy = Math.sin(a), nx = -dy, ny = dx;
    const bx = dx * R * 0.55, by = dy * R * 0.55, ex = dx * (R * 0.55 + len), ey = dy * (R * 0.55 + len);
    return `M${r1(bx + nx * wid)},${r1(by + ny * wid)}Q${r1(bx + dx * len * 0.55 + nx * wid * 1.1)},${r1(by + dy * len * 0.55 + ny * wid * 1.1)} ${r1(ex)},${r1(ey)}Q${r1(bx + dx * len * 0.55 - nx * wid * 1.1)},${r1(by + dy * len * 0.55 - ny * wid * 1.1)} ${r1(bx - nx * wid)},${r1(by - ny * wid)}Z`;
  };
  const fl = 1 + 0.06 * Math.sin(flick);
  el('path', { d: tailPath(R * 1.35 * fl, R * 0.46, 0.12), fill: C.coralD }, G);
  el('path', { d: tailPath(R * 1.0 * fl, R * 0.34, -0.1), fill: C.coral }, G);
  // body
  shaded(G, 'circle', { cx: 0, cy: 0, r: R }, C.sun, C.sunD, R * 0.16, R * 0.16);
  // cheeks
  el('circle', { cx: r1(-R * 0.5), cy: r1(R * 0.34), r: r1(R * 0.13), fill: C.coral }, G);
  el('circle', { cx: r1(R * 0.62), cy: r1(R * 0.42), r: r1(R * 0.11), fill: C.coral }, G);
  // lens barrel: steps out with zoom
  const bx = R * 0.18, by = -R * 0.04, br = R * 0.5, out = R * (0.1 + 0.26 * zoom);
  el('ellipse', { cx: r1(bx + out), cy: r1(by), rx: r1(br * 0.38), ry: r1(br), fill: C.creamD }, G);
  el('rect', { x: r1(bx), y: r1(by - br), width: r1(out), height: r1(br * 2), fill: C.creamD }, G);
  for (let i = 1; i <= 2; i++) el('rect', { x: r1(bx + out * (i / 3) - 2), y: r1(by - br), width: 4, height: r1(br * 2), fill: C.sunD }, G);
  const lx = bx + out, lr = br * 0.92;
  el('ellipse', { cx: r1(lx), cy: r1(by), rx: r1(lr * 0.4), ry: r1(lr), fill: C.cream }, G);
  el('ellipse', { cx: r1(lx + 1), cy: r1(by), rx: r1(lr * 0.3), ry: r1(lr * 0.82), fill: C.night }, G);
  // iris: look moves it inside the glass; the smile bends it into an arch
  const ix = lx + look[0] * lr * 0.1, iy = by + look[1] * lr * 0.35, ir = lr * 0.52 * (1 + 0.3 * (P.wide || 0));
  const open = 1 - lid;
  const top = `M${r1(ix - ir * 0.7)},${r1(iy)}A${r1(ir * 0.7)},${r1(ir * Math.max(0.05, open))} 0 0 1 ${r1(ix + ir * 0.7)},${r1(iy)}`;
  const bot = `Q${r1(ix)},${r1(iy + ir * Math.max(0.05, open) * (1.33 - 3.0 * smile))} ${r1(ix - ir * 0.7)},${r1(iy)}Z`;
  el('path', { d: top + bot, fill: C.blue }, G);
  if (open > 0.5 && smile < 0.4) {
    el('circle', { cx: r1(ix + ir * 0.06), cy: r1(iy), r: r1(ir * 0.28), fill: C.night }, G);
    el('circle', { cx: r1(ix - ir * 0.16), cy: r1(iy - ir * 0.2), r: r1(ir * 0.1), fill: C.cream }, G);
  }
  // little arms: two stubs
  el('ellipse', { cx: r1(-R * 0.2), cy: r1(R * 0.9), rx: r1(R * 0.12), ry: r1(R * 0.18), fill: C.sunD }, G);
  el('ellipse', { cx: r1(R * 0.2), cy: r1(R * 0.92), rx: r1(R * 0.12), ry: r1(R * 0.18), fill: C.sunD }, G);
  return G;
}

// YouTube thumbnail (?test=thumb&v=a|b): big words on the left, one host face, one number badge, and the HERO OBJECT in its own clear space (nothing is drawn over it).
// Text and icon come from brand.js (BRAND.thumb.a / .b). Rendered at 1920x1080, exported to 1280x720 by hand (PIL resize, JPEG q92, under 2 MB).
// Rules: 3 to 5 big words at most, one number, subject never covered, readable at 168 px wide. Worked example: example/thumb.credit-cards.js
import { PAL, setClock, shape, rrect, star, sparkle, rays, text } from './engine/toon.js';
import { icon } from './engine/icons2.js';
import { drawHost, POSE } from './engine/host.js';
import { BRAND } from './brand.js';
const W = 1920, H = 1080, ACC = PAL.coral;
const big = (g, s, x, y, px) => text(g, s, x, y, { font: `${px}px Slab, DevaSlab`, fill: PAL.ink, plate: PAL.white, off: [8, 8], align: 'left', rot: -0.03, maxW: 880 });
const label = (g, s, x, y, w, px) => {            // dark strap with a cream line
  g.save(); g.translate(x, y); g.rotate(-0.03);
  shape(g, rrect(0, 0, w, 120, 18), { fill: PAL.ink, line: 0, off: [8, 8], grain: 0.1 });
  text(g, s, w / 2, 82, { font: `700 ${px}px Jost, Deva`, fill: PAL.paper, align: 'center', maxW: w - 40 });
  g.restore();
};
// the hero object on a soft shadow, tilted, with sparkles; (cx, cy) centre, size = icon box edge
const obj = (g, name, cx, cy, size, rot) => {
  g.save(); g.translate(cx, cy); g.rotate(rot);
  g.save(); g.globalAlpha = 0.2; g.fillStyle = PAL.ink; g.beginPath(); g.ellipse(18, 24, size * 0.46, size * 0.36, 0, 0, Math.PI * 2); g.fill(); g.restore();
  icon(g, name, 0, 0, size, { main: PAL.teal, dark: PAL.tealD, light: PAL.white });
  g.restore();
  sparkle(g, cx - size * 0.5, cy + size * 0.5, 40, { fill: PAL.white }); sparkle(g, cx + size * 0.6, cy + size * 0.42, 34, { fill: PAL.white }); sparkle(g, cx + size * 0.5, cy - size * 0.5, 24, { fill: PAL.ink });
};
const badge = (g, s, x, y, r, px) => {
  g.save(); g.translate(x, y); g.rotate(0.12);
  star(g, 0, 0, r, { n: 16, inner: 0.78, fill: ACC, line: 6, off: [8, 8], rot: 0.1 });
  text(g, s, 0, px * 0.3, { font: `${px}px Slab, DevaSlab`, fill: PAL.white, plate: PAL.ink, off: [7, 7], align: 'center', maxW: r * 1.5 });
  g.restore();
};
export function drawThumb(g, t, v = 'a') {
  setClock(t);
  const c = BRAND.thumb[v] || BRAND.thumb.a;
  g.fillStyle = '#E8B43A'; g.fillRect(0, 0, W, H);
  rays(g, 1230, 520, 36, 1500, '#F3D37F', { rot: 0.1, alpha: 0.6 });
  g.fillStyle = 'rgba(43,36,32,0.10)'; g.fillRect(0, 960, W, 120);
  if (v === 'a') {
    big(g, c.l1, 590, 310, 215); big(g, c.l2, 590, 520, 215);
    label(g, c.strap, 590, 640, 860, 64);
    obj(g, c.icon, 1690, 800, 440, -0.14);                                  // clear: nothing else in x 1480-1900, y 560-1030
    badge(g, c.badge, 1690, 270, 200, 170);
  } else {
    big(g, c.l1, 590, 300, 170); big(g, c.l2, 590, 500, 170);
    label(g, c.strap, 590, 600, 900, 62);
    obj(g, c.icon, 1660, 860, 400, 0.12);                                   // clear: below the headline, right of the strap
    badge(g, c.badge, 1770, 200, 120, 100);
  }
  drawHost(g, { x: 270, y: 1090, s: 1.62, dir: 1, view: 'q', face: 'wow', armF: POSE.point.armF, handF: 'point', shadow: false }, t);
  g.save(); g.translate(60, 56); g.rotate(-0.04);
  shape(g, rrect(0, 0, 470, 84, 42), { fill: PAL.paper, line: 5, seed: 9, off: [6, 6] });
  star(g, 46, 42, 22, { n: 8, inner: 0.42, fill: ACC, off: [0, 0] });
  text(g, BRAND.channel, 82, 58, { font: '700 46px Oleo, DevaScript', fill: PAL.ink, maxW: 370 });
  g.restore();
}

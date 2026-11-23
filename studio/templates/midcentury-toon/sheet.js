// model sheet: the host in his poses and faces (?test=sheet)
import { PAL, setClock, plane, rect } from './engine/toon.js';
import { drawHost, POSE } from './engine/host.js';
export function drawSheet(ctx, t) {
  setClock(t); ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, 1920, 1080);
  const faces = ['neutral', 'happy', 'wow', 'think', 'wink'], poses = ['rest', 'explain', 'point', 'think', 'wave', 'both'];
  poses.forEach((p, i) => drawHost(ctx, { x: 160 + i * 300, y: 560, s: 0.62, dir: 1, view: i % 2 ? 'front' : 'q', face: faces[i % 5], ...POSE[p] }, t));
  [0, 0.4, 0.8, 1].forEach((m, i) => drawHost(ctx, { x: 200 + i * 300, y: 1040, s: 0.62, dir: i % 2 ? -1 : 1, view: 'q', face: 'neutral', mouth: m, ...POSE.explain }, t));
  faces.forEach((f, i) => drawHost(ctx, { x: 1500 + (i % 2) * 220, y: 1040 - Math.floor(i / 2) * 0, s: 0.0001, view: 'q', face: f }, t));
}

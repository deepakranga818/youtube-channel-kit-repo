// scenes_a.js: THE TOPIC FILE (stub). One exported function per scene id in scenes.py; signature (g, t, s). Start everything on its chunk: T('p1') + 0.2.
// Helpers (kit.js): stage, sunburst, slam, slab, body, kick, tag, iconCard, callout, medal, stamp, tick, cross, swash, bar, banner, host(g,t,x,y,scale,[[t,pose,face]],{dir}).
// Worked example (36 scenes): example/scenes_a.js, example/scenes_b.js. Rules: reading time chars/12 + 1 s per text (tools/holds.py), subjects clear of the 150 px caption band, all on-screen text in English (Devanagari only in the caption's Hindi line).
import { PAL, T, GROUND, ACC, stage, sunburst, slam, tag, host, banner } from './kit.js';
const hk = (s, ...r) => [[s.t0, ...r[0]], ...r.slice(1)];
export function hook1(g, t, s) {
  stage(g, GROUND.mustard); sunburst(g, 1000, 430, 1100, GROUND.mustard, t, 0.4);
  slam(g, t, T('h1') + 0.2, 'Hello!', 1000, 420, 120); tag(g, t, T('h2') + 0.3, 'Today: one question', 1000, 560, { align: 'center' });
  host(g, t, 230, 902, 0.74, hk(s, ['explain', 'happy'], [T('h2'), 'point', 'neutral']));
}
export function l1a(g, t, s) { stage(g, GROUND.blue); banner(g, t, T('p1') + 0.2, 'Lesson 1', 960, 400, PAL.white); host(g, t, 230, 902, 0.74, hk(s, ['explain', 'happy'])); }
export function end1(g, t, s) { stage(g, GROUND.blue); slam(g, t, T('z1') + 0.2, 'SUBSCRIBE', 960, 420, 90); host(g, t, 300, 902, 0.74, hk(s, ['wave', 'wink'])); }

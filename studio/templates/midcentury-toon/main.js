// Page contract: window.READY, window.render(t), window.DUR, window.EV
import { textures } from './engine/toon.js';
const Q = new URLSearchParams(location.search);
const cv = document.getElementById('c'), g = cv.getContext('2d');
const SAMPLE = 'Ag₹→≠·';
await Promise.all([...['700 80px Oleo', '80px Slab', '400 40px Jost', '500 40px Jost', '600 40px Jost'].map(f => document.fonts.load(f, SAMPLE)), ...['500 30px Deva', '600 30px Deva'].map(f => document.fonts.load(f, 'अआक'))]);
textures();
const TL = await (await fetch('timeline.json')).json();
const MOUTH = await (await fetch('mouth.json')).json();
const film = await import('./film.js');
film.setup(TL, MOUTH);
window.DUR = film.DUR(); window.EV = film.events(); window.SRT = film.srtCues();
window.render = async t => {
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (Q.get('test') === 'thumb') { (await import('./thumb.js')).drawThumb(g, 0.4, Q.get('v') || 'a'); return; }
  if (Q.get('test') === 'sheet') { (await import('./sheet.js')).drawSheet(g, t); return; }
  film.renderFilm(g, t, Q);
};
window.READY = true;

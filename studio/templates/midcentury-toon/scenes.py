# THE SCENE MAP: which chunks each scene covers, its lesson (0 = hook, 1-7 = numbered lessons), and its ground colour (GROUND key in kit.js). Order matters.
# timeline.py adds a silent 'lockup' scene and an 'end' iris after the last one. Worked example: example/scenes.py (36 scenes, 105 chunks).
SCENES = [
 ('hook1', 'h1', 'h2', 0, 'mustard'),
 ('l1a',   'p1', 'p2', 1, 'blue'),
 ('end1',  'z1', 'z2', 2, 'blue'),
]

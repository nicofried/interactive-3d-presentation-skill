// The story. Edit this file to change it; the slide menu (O) reorders and hides slides, author mode (A) edits their text.
// Scene: cam [[position], [target]] or focus (a point id), hs (points that show a label), links (draw the arcs), orbit (slow auto-rotate).
// Panel: kicker, t (title), sub, txt (simple HTML), kpis [[label, value]], blk (a block from ui/Blocks.jsx), scenario (sim/world.js).
const ALL = ['core', 'stack', 'data', 'menu', 'author', 'blocks', 'ship']

export const SLIDES = [
  { id: 'welcome', n: 'Welcome', kicker: 'Interactive 3D presentations', t: 'Presentations that live in a 3D world', sub: 'This deck is built with the skill it describes', orbit: true, cam: [[0, 5, 18], [0, 0, 0]], hs: ALL,
    txt: 'Drag to orbit, scroll to zoom and use <b>← →</b> to move. Press <b>O</b> for the slide menu and <b>A</b> for author mode at any time.',
    kpis: [['File', '1'], ['Scenes', '2'], ['Slides', '15']] },
  { id: 'idea', n: 'The idea', kicker: 'Why 3D', t: 'One scene instead of a pile of pages', sub: 'The camera carries the story', focus: 'core', hs: ['core'],
    txt: 'Each slide flies the camera, picks what lights up and fills this panel. The audience sees <b>one continuous world</b>, so every new point lands in context.' },
  { id: 'stack', n: 'The stack', kicker: 'Under the hood', t: 'A small, standard stack', sub: 'Click a step to fly to it', links: true, cam: [[-6, 6, 14], [0, 0, 0]], hs: ['stack', 'data', 'core', 'ship'], blk: 'steps',
    txt: '<b>Vite + React 18 + React Three Fiber + drei + three.js + zustand</b>. Per-frame motion stays out of React, so the scene stays smooth.' },
  { id: 'data', n: 'Story as data', kicker: 'Authoring', t: 'The story is a data file', sub: 'src/data/slides.js', focus: 'data', hs: ['data'],
    txt: 'A slide is a plain object: <b>title, text, camera or focus, labels, links, KPIs, a block and a scenario</b>. Points and chart series sit next to it.',
    kpis: [['Slide fields', '12'], ['Components to touch', '0']] },
  { id: 'menu', n: 'Slide menu', kicker: 'Press O', t: 'Reorder and hide slides live', sub: 'Try it now: press O', focus: 'menu', hs: ['menu'],
    txt: 'The slide menu shows every slide as a card. <b>Drag</b> a card or use <b>Shift+← →</b> to move it, and press <b>H</b> to hide it. Hidden slides are skipped while you present.' },
  { id: 'author', n: 'Author mode', kicker: 'Press A', t: 'Edit the deck in the browser', sub: 'Try it now: press A and click this text', focus: 'author', hs: ['author'],
    txt: 'In author mode every text on a slide is editable. Set the <b>title, subtitle, author and date</b>, then export the deck as JSON to share or ship it.' },
  { id: 'blocks', n: 'Interactive blocks', kicker: 'Beyond text', t: 'Slides you can interact with', sub: 'Hover a bar for its value', focus: 'blocks', hs: ['blocks'], blk: 'chart',
    txt: 'Blocks are small React components in the panel. This chart shows <b>illustrative hours</b> for a first deck and for the ones after it.' },
  { id: 'scenario', n: 'Scenarios', kicker: 'Scripted moments', t: 'From an edit to a shipped file', sub: 'Press play', links: true, cam: [[3, 7, 16], [0, 0, 0]], hs: ALL, blk: 'scenario', scenario: 'ship',
    txt: 'A scenario is a timeline: points light up, a clock runs and the log fills. Use it to play out an incident, a process or a customer journey.' },
  { id: 'b-tour', n: 'Building tour', kicker: 'Alternative scene', t: 'Same deck, a different world', sub: "scene: 'building'", scene: 'building', orbit: true, hs: ['b-lobby', 'b-conf'],
    txt: 'Any slide can pick its scene. This one switches to a <b>building with five floors</b>; the slide menu, author mode and blocks work exactly the same.',
    kpis: [['Floors', '5'], ['Rooms', '13'], ['People', '108']] },
  { id: 'b-floor', n: 'Open a floor', kicker: 'Navigate', t: 'Slide the floors apart', sub: 'Try ↑ ↓ or the floor rail', scene: 'building', floor: 2, hs: ['b-lab'],
    txt: 'The floors above the focused one <b>lift away</b>, so you look straight into it. Use <b>↑ ↓</b> or the rail on the left, or click any room to open its floor.' },
  { id: 'b-heat', n: 'Occupancy heatmap', kicker: 'Tint', t: 'Where the people are', sub: "tint: 'heat'", scene: 'building', floor: 3, tint: 'heat', hs: ['b-open', 'b-focus'],
    txt: 'Rooms are tinted by how full they are. The open plan is busy; the focus rooms are <b>booked but nearly empty</b>.' },
  { id: 'b-explode', n: 'Every floor at once', kicker: 'Exploded view', t: 'The whole building, opened up', sub: 'explode: true', scene: 'building', explode: true, tint: 'heat', hs: ['b-lobby', 'b-open', 'b-conf'],
    txt: 'An exploded view spreads <b>every floor</b> so the audience sees the whole picture in one shot.' },
  { id: 'b-event', n: 'Event day', kicker: 'Scenario', t: 'A conference morning', sub: 'Press play', scene: 'building', explode: true, hs: ['b-lobby', 'b-conf'], blk: 'scenario', scenario: 'event',
    txt: 'Scenarios work in the building too: <b>rooms light up</b> as the morning plays out, and the log tells the story.' },
  { id: 'ship', n: 'Ship it', kicker: 'Delivery', t: 'One file that works anywhere', sub: 'npm run build', focus: 'ship', hs: ['ship'],
    txt: 'The build is <b>one self-contained dist/index.html</b>. To ship your menu and author changes, export the deck, save it as <b>src/data/baked.json</b> and rebuild.',
    kpis: [['Size', '≈1 MB'], ['Internet needed', 'No']] },
  { id: 'close', n: 'Build your own', kicker: 'Next', t: 'Make the next one about your story', sub: 'Install the skill from this repo', orbit: true, links: true, cam: [[0, 4, 20], [0, 0, 0]], hs: [],
    txt: 'Copy <b>skill/interactive-3d-presentation</b> into <b>~/.claude/skills/</b> and ask Claude for an interactive 3D presentation about your topic.' }
]
export const SLIDE = Object.fromEntries(SLIDES.map((s) => [s.id, s]))

// Data for the interactive blocks.
export const STEPS = [
  { p: 'data', t: 'Write the story in src/data/' },
  { p: 'stack', t: 'React Three Fiber renders the scene' },
  { p: 'core', t: 'Slides move the camera through it' },
  { p: 'ship', t: 'Vite inlines it all into one file' }
]
export const CHART = {
  title: 'Illustrative hours per step',
  labels: ['Brief', 'Story', 'Scene', 'Polish'],
  series: [{ n: 'First deck', c: 'var(--acc)', v: [2, 3, 6, 3] }, { n: 'Next decks', c: 'var(--cyan)', v: [1, 2, 2, 1] }]
}

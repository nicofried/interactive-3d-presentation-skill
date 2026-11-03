// The story. Edit this file to change it; the slide menu (O) reorders and hides slides, author mode (A) edits their text.
// Scene: cam [[position], [target]] or focus (a point id), hs (points that show a label), links (draw the arcs), orbit (slow auto-rotate).
// Building slides (scene: 'building'): floor (focused floor index), explode (spread all floors), tint ('heat'), hs (hotspot ids from building.js).
// Panel: kicker, t (title), sub, txt (simple HTML), kpis [[label, value]], blk (a block from ui/Blocks.jsx), scenario (sim/world.js).
export const SLIDES = [
  { id: 'welcome', n: 'Welcome', kicker: 'Overview', t: 'One picture of the programme', sub: 'Four parts, one platform', orbit: true, cam: [[0, 5, 17], [0, 0, 0]],
    txt: 'Drag to orbit, scroll to zoom, <b>← →</b> to move. <b>O</b> opens the slide menu, <b>A</b> switches author mode.',
    hs: ['core', 'p1', 'p2', 'p3', 'p4'], kpis: [['Parts', '4'], ['Links', '6'], ['Slides', '6']] },
  { id: 'part1', n: 'Part one', kicker: 'Part 1', t: 'Part one', sub: 'The first building block', focus: 'p1', hs: ['p1'],
    txt: 'Say in two sentences what this part is and <b>why the audience should care</b>.', kpis: [['Teams', '3'], ['Releases', '2']] },
  { id: 'links', n: 'How it connects', kicker: 'Architecture', t: 'How the parts connect', sub: 'Click a step to fly there', links: true, cam: [[2, 9, 15], [0, 0, 0]],
    hs: ['core', 'p1', 'p2', 'p3', 'p4'], blk: 'steps', txt: 'Every part reports into the core. The arcs show the flows.' },
  { id: 'numbers', n: 'The numbers', kicker: 'Progress', t: 'Planned and delivered', sub: 'Hover a bar for its value', focus: 'p3', hs: ['p3'], blk: 'chart',
    txt: 'An interactive block: the chart lives in the panel, the scene keeps its focus.' },
  { id: 'scenario', n: 'Live scenario', kicker: 'Scenario', t: 'One event, every part reacts', sub: 'Press play', links: true, cam: [[-3, 7, 15], [0, 0, 0]],
    hs: ['core', 'p1', 'p2', 'p4'], blk: 'scenario', scenario: 'cascade', txt: 'A scripted timeline drives the scene: points light up, the log fills and the clock runs.' },
  { id: 'b-tour', n: 'Building tour', kicker: 'Building scene', t: 'The same deck in a building', sub: 'Use ↑ ↓ or the floor rail', scene: 'building', orbit: true, hs: ['b-lobby', 'b-conf'],
    txt: 'A slide can switch scene. Here the floors slide apart: pick one with <b>↑ ↓</b> or the rail, or click a room.' },
  { id: 'b-heat', n: 'Occupancy', kicker: 'Building scene', t: 'Where the people are', sub: 'Exploded view with a heatmap', scene: 'building', explode: true, tint: 'heat', hs: ['b-open', 'b-focus'], blk: 'scenario', scenario: 'event',
    txt: 'Every floor spread out, rooms tinted by occupancy. Press play for an event-day scenario.' },
  { id: 'close', n: 'Close', kicker: 'Summary', t: 'One platform, four parts', sub: 'Thank you', orbit: true, links: true, cam: [[0, 4, 19], [0, 0, 0]], hs: [],
    txt: '“The closing message the audience should remember.”' }
]
export const SLIDE = Object.fromEntries(SLIDES.map((s) => [s.id, s]))

// Data for the interactive blocks.
export const STEPS = [
  { p: 'p1', t: 'Part one sends events' },
  { p: 'core', t: 'The core correlates them' },
  { p: 'p3', t: 'Part three acts on the result' },
  { p: 'p4', t: 'Part four shows it to people' }
]
export const CHART = {
  title: 'Planned and delivered per quarter',
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  series: [{ n: 'Planned', c: 'var(--acc)', v: [4, 6, 8, 10] }, { n: 'Delivered', c: 'var(--cyan)', v: [3, 6, 7, 0] }]
}

// Points of interest on the globe (lat/lon in degrees) and the links drawn between them.
export const POINTS = [
  { id: 'core', lat: 58, lon: 8, c: '#2DD4BF', t: 'The core idea', b: 'The one thing everything else connects to.' },
  { id: 'p1', lat: 22, lon: -48, c: '#38BDF8', t: 'Part one', b: 'What part one does and why it matters.' },
  { id: 'p2', lat: -24, lon: -16, c: '#A78BFA', t: 'Part two', b: 'What part two does and why it matters.' },
  { id: 'p3', lat: 24, lon: 58, c: '#FB7185', t: 'Part three', b: 'What part three does and why it matters.' },
  { id: 'p4', lat: -16, lon: 30, c: '#F59E0B', t: 'Part four', b: 'What part four does and why it matters.' }
]
export const PT = Object.fromEntries(POINTS.map((p) => [p.id, p]))
export const LINKS = [['core', 'p1'], ['core', 'p2'], ['core', 'p3'], ['core', 'p4'], ['p1', 'p2'], ['p3', 'p4']]

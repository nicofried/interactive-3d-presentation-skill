// Points of interest on the globe (lat/lon in degrees) and the links drawn between them.
// In this deck every point is one idea of the skill.
export const POINTS = [
  { id: 'core', lat: 60, lon: 8, c: '#2DD4BF', t: 'One scene, many slides', b: 'The whole talk happens in one 3D world. A slide moves the camera and changes what the scene shows, so the audience never loses its place.' },
  { id: 'stack', lat: 28, lon: -52, c: '#38BDF8', t: 'The stack', b: 'Vite, React 18, React Three Fiber, drei, three.js and zustand. vite-plugin-singlefile inlines everything into one HTML file.' },
  { id: 'data', lat: -6, lon: -34, c: '#A78BFA', t: 'Story as data', b: 'Slides, points and chart series live in src/data/. Changing the story never means touching a component.' },
  { id: 'menu', lat: -32, lon: 2, c: '#F472B6', t: 'Slide menu (O)', b: 'Every slide as a card: drag or Shift+arrows to reorder, H to hide. Hidden slides keep their place and are skipped while presenting.' },
  { id: 'author', lat: -20, lon: 44, c: '#FB7185', t: 'Author mode (A)', b: 'Edit slide text in place, set the deck title and author, and export, import or reset the deck.' },
  { id: 'blocks', lat: 14, lon: 62, c: '#F59E0B', t: 'Interactive blocks', b: 'Charts, clickable steps and scenarios sit in the panel beside the text. Add your own in src/ui/Blocks.jsx.' },
  { id: 'ship', lat: 38, lon: 38, c: '#22C55E', t: 'One offline file', b: 'npm run build writes dist/index.html: no server, no internet, opens from a laptop or USB stick, and embeds in a wiki page.' }
]
export const PT = Object.fromEntries(POINTS.map((p) => [p.id, p]))
export const LINKS = [['core', 'stack'], ['core', 'data'], ['core', 'menu'], ['core', 'author'], ['core', 'blocks'], ['core', 'ship'], ['stack', 'data'], ['data', 'menu'], ['menu', 'author'], ['author', 'blocks'], ['blocks', 'ship']]

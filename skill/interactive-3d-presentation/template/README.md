# Interactive 3D presentation

A slide deck that lives in a 3D scene. Each slide flies the camera, sets up the scene and fills a side panel.
It's built with Vite, React 18, React Three Fiber, drei, three.js and zustand, and ships as one offline `dist/index.html`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/index.html: one self-contained file that opens from disk, no server, no internet
```

## Presenting

| Key | Action |
|---|---|
| `←` `→` (or PageUp/PageDown, Space) | Previous / next slide. Hidden slides are skipped. |
| `O` | Slide menu: drag cards (or Shift+`←` `→`) to reorder, `H` or the eye to hide or show, Enter to open |
| `A` | Author mode: click slide text to edit it, set the deck title, author and date, export / import / reset |
| `↑` `↓` | Building slides: move between floors (or use the floor rail) |
| `T` / `F` | Light/dark theme / fullscreen |
| Mouse | Drag to orbit, scroll to zoom, click a point for its detail |

## Changing the story

| What | Where |
|---|---|
| Slides: order, text, camera, focus, labels, blocks | `src/data/slides.js` |
| Points on the globe and the links between them | `src/data/points.js` |
| Deck id, title, author, default theme | `src/data/deck.js`. Use the same id in the theme snippet in `index.html`. |
| Scripted scenarios | `src/data/scenarios.js` |
| The building: floors, rooms, people, hotspots | `src/data/building.js` |
| Interactive panel blocks | `src/ui/Blocks.jsx` |
| Colours: scene / UI | `src/theme.js` / `src/styles.css` |

Changes made in the slide menu and in author mode are saved in the browser (`localStorage`). To ship them:

1. Press `A`, then **Export**.
2. Save the file as `src/data/baked.json`.
3. Run `npm run build`.

The built file then opens with that order, those hidden slides and those edits.

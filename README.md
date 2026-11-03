# Interactive 3D presentations

A slide deck that lives in one 3D scene. Each slide flies the camera, sets up the scene and fills a side panel. The
deck ships as **one offline HTML file**.

This repo holds two things:

- **The showcase deck** (the root of the repo): a fifteen-slide presentation about the skill, built with the skill.
  It uses both built-in scenes: a globe of connected ideas and a building whose floors slide apart.
- **The skill** ([`skill/interactive-3d-presentation`](skill/interactive-3d-presentation)): a Claude Code skill and a
  starter template, so Claude can build a deck like this about any topic.

Stack: Vite + React 18 + React Three Fiber + drei + three.js + zustand, with `vite-plugin-singlefile`.

## Run the showcase

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/index.html: one self-contained file that opens from disk, no server, no internet
```

| Key | Action |
|---|---|
| `←` `→` (or PageUp/PageDown, Space) | Previous / next slide. Hidden slides are skipped. |
| `O` | Slide menu: drag cards (or Shift+`←` `→`) to reorder, `H` or the eye to hide or show, Enter to open |
| `A` | Author mode: click slide text to edit it, set the deck title, author and date, export / import / reset |
| `↑` `↓` | Building slides: move between floors (or use the floor rail) |
| `T` / `F` | Light/dark theme / fullscreen |
| Mouse | Drag to orbit, scroll to zoom, click a point for its detail |

## Change the story

| What | Where |
|---|---|
| Slides: order, text, camera, focus, labels, blocks | `src/data/slides.js` |
| Points on the globe and the links between them | `src/data/points.js` |
| Deck id, title, author, default theme | `src/data/deck.js`. Use the same id in the theme snippet in `index.html`. |
| Scripted scenarios | `src/data/scenarios.js` |
| The building: floors, rooms, people, hotspots | `src/data/building.js` |
| Interactive panel blocks | `src/ui/Blocks.jsx` |
| Colours: scene / UI | `src/theme.js` / `src/styles.css` |

Changes made in the slide menu and in author mode are saved in your browser. To ship them:

1. Press `A`, then **Export**.
2. Save the file as `src/data/baked.json`.
3. Run `npm run build`.

## Use the skill

1. Copy `skill/interactive-3d-presentation` into `~/.claude/skills/`.
2. Ask Claude Code for "an interactive 3D presentation about …".

The skill agrees a brief with you, scaffolds from its template, writes the story as data, builds the scene and checks
the result against its checklist. [`SKILL.md`](skill/interactive-3d-presentation/SKILL.md) has the steps and
[`REFERENCE.md`](skill/interactive-3d-presentation/REFERENCE.md) has the architecture, patterns and gotchas.

## Structure

```
src/
  data/       deck.js, slides.js, points.js, baked.json   ← the story
  store.js    deck state (persisted) and UI state
  theme.js    light/dark palettes and shared materials
  sim/        world.js: per-frame motion and scenarios
  scene/      Canvas, camera rig, globe, points, arcs
  ui/         top bar, panel, nav, slide menu, author bar, blocks, keys
skill/
  interactive-3d-presentation/   SKILL.md, REFERENCE.md, template/
```

## Licence

[MIT](LICENSE).

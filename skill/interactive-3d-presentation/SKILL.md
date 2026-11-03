---
name: interactive-3d-presentation
description: Build interactive 3D presentations, a slide deck inside a live three.js scene (a globe of connected points, or a building whose floors slide apart) with a slide menu (reorder, hide), author mode (edit text, title, author; export/import), interactive panel blocks and scripted scenarios, shipped as one offline HTML file. Use when asked for an interactive or 3D presentation, a guided walkthrough or tour, a globe- or model-based story, or to add slides, scenes or scenarios to one.
---

# Interactive 3D presentation

A deck of slides that lives in one 3D scene. Each slide flies the camera, sets up the scene (focus, labels, links,
lighting, a scenario) and fills a side panel. The presenter walks it with the keyboard; the audience sees one continuous
world instead of separate pages.

**Stack:** Vite + React 18 + React Three Fiber + drei + three.js + zustand, with `vite-plugin-singlefile` so
`npm run build` writes one offline `dist/index.html`. Story data lives in `src/data/`, the per-frame simulation in
`src/sim/world.js`, themes and shared materials in `src/theme.js`.

[`template/`](template/) is a working starter with two scene kinds that any slide can switch between: a **globe** with
points and arcs, and a **building** whose floors slide apart (floor rail, `↑` `↓`, exploded view, people, occupancy
heatmap). It also has sample slides, the slide menu, author mode, three interactive blocks and two scenarios. Start every new deck from it. [`REFERENCE.md`](REFERENCE.md) holds the
architecture, the patterns to reuse and the gotchas; read it before changing the scene or the deck layer.

## Steps

1. **Brief.** Agree the story with the user before any code: audience, the one message, and a slide list in which every
   slide has a title, a one-sentence point, its scene setup (camera, focus, what lights up) and its interaction (click,
   chart, scenario, none). Also agree on the 3D subject (the globe, or a model to build), the brand colours and fonts,
   and where it will be shown. Write the brief to `BRIEF.md` in the project. It is done when every slide has all four.
2. **Scaffold.** Copy `template/` to the new project folder. Give the deck its own `id` in `src/data/deck.js` and the
   same id in the theme snippet in `index.html`, because the id keys the browser storage. Show the user `npm install`
   (it downloads packages) and wait for their OK. It is done when `npm run dev` shows the intro.
3. **Story.** Write the slides in `src/data/slides.js` and the scene's data (points, links, or your model's rooms and
   parts) in `src/data/`. Keep all story text in data files, never in components.
4. **Scene.** Pick the scene kind per slide (`scene: 'globe'` or `'building'`, default in `deck.js`), reshape its data
   (`points.js`, `building.js`), or add a new kind (see "Scene kinds" in REFERENCE.md). Meshes use the
   shared materials from `theme.js` and register with `world` in `sim/world.js`; anything that animates per frame lives
   there, never in React state.
5. **Interaction.** Add panel blocks to `src/ui/Blocks.jsx` (name them in `blk` on a slide) and scripted scenarios to
   `src/data/scenarios.js` (name them in `scenario`).
6. **Brand.** Swap the tokens in `src/styles.css` (UI) and `THEMES` in `src/theme.js` (scene) for the user's palette.
   Check that both light and dark themes hold contrast.
7. **Verify** against the checklist in REFERENCE.md. It is done when every item passes: every slide in both themes, the
   slide menu and author mode round trip, scenarios to the end, the build opens from disk, and the console has no
   errors.
8. **Ship.** `npm run build` and hand over `dist/index.html`. To ship slide-menu or author changes, export the deck in
   author mode, save it as `src/data/baked.json` and rebuild. For a wiki or intranet page, see "Embedding" in
   REFERENCE.md.

## Presenter controls (built into the template)

| Key | Action |
|---|---|
| `←` `→`, PageUp/PageDown, Space | Previous / next slide. Hidden slides are skipped while presenting. |
| `↑` `↓` | Building slides: focus the floor above / below; the floors above it lift away. The floor rail does the same. |
| `O` | Slide menu: drag cards or Shift+`←` `→` to reorder, `H` or the eye to hide or show, Enter to open, Esc to close |
| `A` | Author mode: edit slide text in place; set the deck title, subtitle, author and date; export, import or reset the deck |
| `T` / `F` | Light/dark theme / fullscreen |
| Mouse | Drag to orbit, scroll to zoom, click a point for its detail card |

## Rules

- Mock or approved data only. Put a line on the intro or the first slide when the numbers are illustrative.
- The output is one self-contained file. Anything loaded from the internet (fonts, a CDN, map tiles) makes it fail
  offline; bundle it or provide a system fallback.
- Keep the presenter path keyboard-only: every slide, block and scenario must work without the mouse.

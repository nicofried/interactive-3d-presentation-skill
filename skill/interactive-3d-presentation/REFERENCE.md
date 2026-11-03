# Interactive 3D presentation: reference

## Architecture

```
src/
  data/deck.js       deck id (storage key), title, subtitle, author, date, default theme
  data/slides.js     the slides, plus data for the panel blocks (steps, chart series)
  data/points.js     globe scene: points by lat/lon and the links between them
  data/building.js   building scene: floors, rooms (size, position, people) and hotspots
  data/scenarios.js  scripted timelines; steps light up globe points or rooms
  data/baked.json    an exported deck (order, hidden, edits, meta) shipped in the build; {} by default
  store.js           zustand: the deck (persisted) and the UI state (not persisted)
  theme.js           light/dark scene palettes and the shared materials they recolour
  sim/world.js       imperative per-frame state: scene switch, pulses, floors, people, room tints, scenarios
  scene/Scene.jsx    Canvas, lights, grid, camera rig, ThemeDriver, SimDriver
  scene/Globe.jsx    globe, points with HTML labels, arcs with flowing dots
  scene/Building.jsx floors (slab, facade, rooms, people, hotspots); world.js moves them
  ui/                top bar, intro, panel, nav (Ui.jsx), slide menu (Sorter.jsx), author bar, floor rail (Floors.jsx),
                     blocks, keys, html sanitiser
```

**The split that keeps it fast.** React renders structure: which meshes exist and which labels show. Everything that
changes per frame (positions, scale, colour, opacity, the scenario clock) is mutated directly on three.js objects in
`sim/world.js` or in a `useFrame`. Components register their meshes in `world` on mount. A store update per frame would
re-render the tree 60 times a second; only discrete events (a log line, a clock label that changed) go to the store.

## Slide fields

| Field | Effect |
|---|---|
| `scene` | `'globe'` or `'building'` (default `DECK.scene`). The active scene scales in, the others scale out. |
| `id`, `n` | Stable id (the deck order and edits refer to it) and the short name shown in the slide menu and nav |
| `kicker`, `t`, `sub`, `txt` | Panel text. `txt` is simple HTML. All four can be edited in author mode. |
| `cam: [[x,y,z],[tx,ty,tz]]` | Camera position and target. Without it, `focus` decides. |
| `focus` | A point id: the camera flies to it and the point is emphasised |
| `hs` | Ids that show a label: globe points or building hotspots |
| `links`, `orbit` | Fade in the arcs; slow auto-rotate |
| `floor` | Building: the focused floor index. The floors above lift away. `↑` `↓` and the floor rail change it live. |
| `explode`, `tint` | Building: spread every floor; `'heat'` tints rooms by occupancy |
| `kpis: [[label, value]]` | Tiles under the text |
| `blk` | A block from `ui/Blocks.jsx` (`steps`, `chart`, `scenario`, or one you add) |
| `scenario` | A key in `SCENARIOS` (data/scenarios.js), started by the scenario block's Play button |

Add fields freely: `applySlide()` in `sim/world.js` and `CameraRig` read the slide, so a new field (`night`, `xray`,
`tint`) means adding its effect in those two places and nowhere else.

## The deck layer: slide menu and author mode

- **State.** The deck is `order` (slide ids), `hidden` (ids), `edits` (`{ [id]: { t, sub, txt, kicker } }`) and `meta`
  (title, sub, author, date). It is persisted with zustand `persist` under `${DECK.id}-deck`. Session state (current
  slide, selection, scenario, author flag, menu open) is not persisted.
- **Reconcile.** On load, `merge` runs `reconcile()`: slides added to `slides.js` since the deck was saved are appended,
  and slides that no longer exist are dropped. A saved deck never hides a new slide or breaks on a removed one.
- **Navigation** walks `order` and skips `hidden`, except in author mode, where every slide is reachable and hidden ones
  carry a badge. Hiding the current slide while presenting moves on to the next visible one.
- **Slide menu (`O`).** The cards are `draggable` (HTML5 drag and drop) and also reorder with Shift+`←` `→`, so
  keyboard and touchpad users get the same power. Focus follows a moved card. Numbers count visible slides only.
- **Author mode (`A`).** Panel fields become `contentEditable` and save on blur. Plain fields save `textContent` and
  rich fields save cleaned HTML. The author bar edits `meta` and exports, imports or resets the deck.
- **Shipping edits.** localStorage is per browser and per origin. Export, save as `src/data/baked.json` and rebuild:
  `base()` starts from `baked.json`, so every viewer of the new build gets that order, those hidden slides and those
  edits.
- **Safety.** Author text and imported decks pass through `clean()` (`ui/html.js`). It keeps b, i, em, strong, br, p,
  span, lists and https links, and drops scripts, event handlers and styles, so a deck file someone sends you cannot
  run code.

## Patterns worth reusing

- **Camera fly-to:** tween position and target with an ease-in-out cubic over about 1.6 s. The controls' `start` event
  cancels it, so the presenter can always grab the scene. Use `OrbitControls makeDefault` so the rig can read
  `controls` from `useThree`.
- **Smoothing:** move toward a target with `x += (target - x) * (1 - Math.exp(-dt * k))`, which doesn't depend on frame
  rate. Clamp `dt` to 0.05 so a background tab doesn't jump.
- **Theme switch without re-render:** palettes are plain objects, materials are shared module-level instances, and
  `applyTheme()` recolours them in place. In dark mode, additive blending on lines and particles gives the glow. Set
  `data-theme` before first paint (snippet in `index.html`) so CSS and canvas agree from the first frame.
- **Labels in 3D:** drei `<Html>` with `zIndexRange` so labels stay under the panels, and `onPointerDown` that calls
  `stopPropagation` so clicking a label doesn't start an orbit drag.
- **Scenarios:** a list of `{ at, ...effect, log }` steps in seconds plus a clock range. `tick()` fires each step once,
  pushes the log line to the store and updates the clock label only when it changes. Replay is just bumping `runId`.
- **Personas or layers:** tag each hotspot with `per: [...]` and filter the visible set in one selector; dim the slides
  that aren't for the chosen persona in the nav and slide menu.

## Scene kinds

The globe is one subject. The same deck layer drives any scene:

| Kind | How to build it |
|---|---|
| Globe or network (built in) | Points by lat/lon on a sphere, great-circle arcs lifted by distance, a decorative spinning shell. |
| Building or site tour (built in) | Procedural boxes per floor and room from `building.js`. Floors above a focused one lift away; `explode` spreads them all; people are capsules wandering inside room bounds; rooms tint by occupancy or by a scenario step. To extend it: night lighting per slide, an X-ray mode that shows system links, persona filters on hotspots. |
| Product or machine | A glTF model (bundled as base64 by the single-file build, so keep it small) or primitives; exploded views by tweening part offsets; callouts with `<Html>`. |
| Process or timeline | Stations along a path, a moving token per step, and the camera following the token between slides. |

For every kind, put the geometry data in `src/data/`, recolourable materials in `theme.js` and motion in
`sim/world.js`. Wrap it in a `<SceneGroup kind="…">` in `Scene.jsx` and add its cameras to `camFor()`.

## Verification checklist

1. `npm run build` succeeds, and `dist/index.html` opens from disk with the network off.
2. Every slide in both themes: the camera lands well, labels are readable and nothing overlaps the panels.
3. Slide menu: reorder by drag and by Shift+arrows, hide a slide and confirm presenting skips it, reload and confirm the
   order and hidden set persist.
4. Author mode: edit a title and a rich text field, set the author, reload and confirm all of it persists. Export,
   save as `baked.json`, rebuild, clear storage and confirm the build opens with those changes.
5. Every scenario plays to the end and replays cleanly.
6. Building slides: `↑` `↓` and the floor rail move between floors, clicking a room opens its floor, and the exploded
   view fits on screen.
7. Keyboard only: the whole talk can be given without the mouse.
8. No console errors, and a steady frame rate. Close other tabs that run WebGL first, because they share the GPU and
   can drop a test page to a few frames per second.

Automated browsers often can't drive native HTML5 drag and drop with synthetic mouse moves. To test the drag handlers,
dispatch `dragstart`, `dragover`, `drop` and `dragend` events that share one `DataTransfer`.

## Gotchas

- **zustand selectors must return stable values.** `useStore((s) => s.slide())` builds a new object every call and
  loops forever. Select primitives or stored references, then read the composite with `useStore.getState()`.
- **GridHelper bakes its colours into the geometry.** Re-mount it with `key={theme}` instead of recolouring it.
- **Hidden scenes still need a group to scale.** Every scene kind sits in its own `SceneGroup`, so the switch is
  one scale tween and hidden scenes skip rendering (`visible = false`).
- **Decoration may spin, anchors may not.** Rotate only the decorative group, so the camera positions per slide stay
  valid.
- **The storage key is the deck id.** Two decks with the same id share their order and edits in the same browser.
- **Fonts:** web fonts from a CDN fail offline; use system fonts or bundle the font files.
- **Size:** the build is about 1 MB with three.js. Some wiki editors struggle with large page bodies, so upload the file
  as an attachment and load it from there.

## Embedding in a wiki or intranet page

Most wikis strip scripts, so you need an HTML macro or block that allows them (an admin setting). Two things work well:

- Load the file into an `<iframe>` from a blob URL. A small script fetches the attached file, or decodes a base64 copy,
  into a `Blob` and sets `iframe.src = URL.createObjectURL(blob)`. Inject `<base target="_top">` so links open in the
  full window. An iframe `srcdoc` can get unpacked into the host page by some wikis.
- The iframe keeps the deck's full-window CSS and keyboard handling away from the host page. The presenter clicks into
  the frame once to give it keyboard focus.

The blob iframe shares the host page's origin, so each viewer's slide-menu and author changes stay in their own
browser. Ship shared changes through `baked.json`.

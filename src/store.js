import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DECK } from './data/deck.js'
import { SLIDES, SLIDE } from './data/slides.js'
import BAKED from './data/baked.json'
import { initialTheme } from './theme.js'

// The deck: what an author changes (slide order, hidden slides, text edits, title and author). It starts from
// data/baked.json (an exported deck, shipped in the build) and is kept per browser under `${DECK.id}-deck`.
const DECK_KEYS = ['order', 'hidden', 'edits', 'meta']
const base = () => ({ order: BAKED.order ?? SLIDES.map((s) => s.id), hidden: BAKED.hidden ?? [], edits: BAKED.edits ?? {}, meta: { ...DECK, ...BAKED.meta } })
// Slides added to slides.js after a deck was saved are appended; slides removed from it are dropped.
const reconcile = (d) => {
  const known = d.order.filter((id) => SLIDE[id])
  return { ...d, order: [...known, ...SLIDES.map((s) => s.id).filter((id) => !known.includes(id))], hidden: d.hidden.filter((id) => SLIDE[id]) }
}
const pick = (o) => Object.fromEntries(DECK_KEYS.filter((k) => o[k] !== undefined).map((k) => [k, o[k]]))

// UI and journey state. Per-frame simulation state lives in sim/world.js instead, so the 3D loop never re-renders React.
export const useStore = create(persist((set, get) => ({
  ...base(),
  started: false,
  cur: null, // id of the current slide
  author: false,
  sorter: false, // the slide menu (O)
  theme: initialTheme(),
  sel: null, // selected point or hotspot id
  floor: null, // building scene: focused floor index, or null for the whole building
  runId: 0, // bumps to re-apply the current slide
  scenario: null,
  log: [],
  clock: null,

  slide: (id = get().cur) => (id ? { ...SLIDE[id], ...get().edits[id] } : null),
  visible: () => get().order.filter((id) => !get().hidden.includes(id)),
  start: () => get().goTo(get().visible()[0] ?? get().order[0]),
  goTo: (id) => id && set({ started: true, cur: id, sel: null, floor: SLIDE[id].floor ?? null, scenario: null, log: [], clock: null, runId: get().runId + 1 }),
  setFloor: (floor) => set({ floor, sel: null }),
  // Moves through the deck order and skips hidden slides, except in author mode.
  step: (d) => {
    const { order, hidden, cur, author } = get()
    let i = order.indexOf(cur)
    do i += d; while (i >= 0 && i < order.length && !author && hidden.includes(order[i]))
    if (i >= 0 && i < order.length) get().goTo(order[i])
  },
  move: (id, to) => {
    const order = get().order.filter((x) => x !== id)
    order.splice(Math.max(0, Math.min(order.length, to)), 0, id)
    set({ order })
  },
  toggleHidden: (id) => {
    const { hidden, cur, author } = get()
    set({ hidden: hidden.includes(id) ? hidden.filter((x) => x !== id) : [...hidden, id] })
    if (id === cur && !author && get().hidden.includes(id)) { get().step(1); if (get().cur === id) get().step(-1) }
  },
  edit: (id, field, value) => set({ edits: { ...get().edits, [id]: { ...get().edits[id], [field]: value } } }),
  setMeta: (k, v) => set({ meta: { ...get().meta, [k]: v } }),
  exportDeck: () => JSON.stringify(pick(get()), null, 2),
  importDeck: (obj) => set(reconcile({ ...base(), ...pick(obj) })),
  resetDeck: () => set(reconcile(base())),

  toggleAuthor: () => set({ author: !get().author }),
  setSorter: (sorter) => set({ sorter }),
  toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
  select: (sel) => set({ sel }),
  play: () => set({ scenario: get().slide().scenario, log: [], clock: null, runId: get().runId + 1 }),
  pushLog: (e) => set({ log: [...get().log, e] }),
  setClock: (clock) => set({ clock })
}), {
  name: `${DECK.id}-deck`,
  version: 1,
  partialize: pick,
  merge: (saved, current) => ({ ...current, ...(saved ? reconcile({ ...base(), ...pick(saved) }) : {}) })
}))

// Imperative per-frame state: the scene switch, the globe spin and point pulses, the floors, people and room tints of
// the building, and the scripted scenarios. Components register their objects here and SimDriver calls tick() every
// frame, so the 3D loop never re-renders React. Only scenario events (log lines, the clock) go through the store, and
// only when they change.
import * as THREE from 'three'
import { useStore } from '../store.js'
import { cur } from '../theme.js'
import { DECK } from '../data/deck.js'
import { SCENARIOS } from '../data/scenarios.js'
import { BASE, FH } from '../data/building.js'

export const world = {
  scenes: {}, // scene kind -> group, scaled in and out on a scene change
  points: {}, spin: null, // globe
  floors: [], rooms: {}, people: [], // building
  sc: null, T: 0, focus: null, tint: null, explode: false, clock: ''
}

const FX = { alert: new THREE.Color('#F43F5E'), ok: new THREE.Color('#22C55E'), busy: new THREE.Color('#F59E0B') }
const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`
const LIFT = 9, SPREAD = 2.6 // metres the floors above a focused floor rise; extra gap per floor when exploded
const tmp = new THREE.Color()
const rnd = (a, b) => a + Math.random() * (b - a)
// A random spot inside a room, in floor coordinates (people stand on the slab).
export const randIn = (r) => new THREE.Vector3(rnd(r.x - r.w / 2 + 0.8, r.x + r.w / 2 - 0.8), 0.55, rnd(r.z - r.d / 2 + 0.8, r.z + r.d / 2 - 0.8))

export const sceneOf = (s) => s?.scene ?? DECK.scene ?? 'globe'

export function applySlide(s) {
  world.sc = null; world.focus = s?.focus ?? null; world.tint = s?.tint ?? null; world.explode = !!s?.explode
  Object.values(world.points).forEach((p) => { p.fx = null })
  Object.values(world.rooms).forEach((r) => { r.fx = null })
}
export function startScenario(id) {
  const def = SCENARIOS[id]; if (!def) return
  world.sc = { def, t: 0, i: 0 }; world.clock = ''
}

function runScenario(dt) {
  const sc = world.sc
  sc.t += dt
  while (sc.i < sc.def.steps.length && sc.def.steps[sc.i].at <= sc.t) {
    const st = sc.def.steps[sc.i++]
    if (st.p && world.points[st.p]) world.points[st.p].fx = st.fx
    if (st.room && world.rooms[st.room]) world.rooms[st.room].fx = st.fx
    useStore.getState().pushLog(st.log)
  }
  const [a, b] = sc.def.clock, label = hhmm(a + (b - a) * Math.min(1, sc.t / sc.def.dur))
  if (label !== world.clock) { world.clock = label; useStore.getState().setClock({ label, done: sc.t >= sc.def.dur }) }
  if (sc.t >= sc.def.dur) world.sc = null
}

export function tick(dt) {
  world.T += dt
  const st = useStore.getState(), slide = st.slide(), k = 1 - Math.exp(-dt * 4), wave = 0.5 + 0.5 * Math.sin(world.T * 6)
  if (world.sc) runScenario(dt)

  // Scene switch: the active kind scales in, the others scale out and hide.
  const active = sceneOf(slide)
  Object.entries(world.scenes).forEach(([kind, g]) => {
    if (!g) return
    const s = g.scale.x + ((kind === active ? 1 : 0) - g.scale.x) * k
    g.scale.setScalar(Math.max(0.001, s)); g.visible = s > 0.01
  })

  // Globe
  if (world.spin) world.spin.rotation.y += dt * 0.05
  const sel = st.sel ?? world.focus
  Object.values(world.points).forEach((p) => {
    const f = p.fx === 'alert' || p.fx === 'busy' ? wave : 0
    p.mesh.scale.setScalar(1 + (p.id === sel ? 0.4 : 0) + f * 0.35)
    p.mat.color.copy(FX[p.fx] && p.fx !== 'busy' ? FX[p.fx] : p.base); p.mat.emissive.copy(p.mat.color)
    p.mat.emissiveIntensity = cur.t.glow + f * 0.8
  })

  // Building: floors above the focused one lift away; `explode` spreads every floor.
  const focus = st.floor
  world.floors.forEach((g, i) => {
    if (!g) return
    const y = BASE + i * FH + (focus != null && i > focus ? LIFT : 0) + (world.explode ? i * SPREAD : 0)
    g.position.y += (y - g.position.y) * k
  })
  world.people.forEach((p) => {
    if (p.wait > 0) { p.wait -= dt; return }
    const d = p.tg.clone().sub(p.m.position), len = d.length()
    if (len < 0.15) { p.tg = randIn(p.r); p.wait = 0.5 + Math.random() * 2.5; return }
    p.m.position.addScaledVector(d, Math.min(1, (p.sp * dt) / len))
  })
  const t = cur.t
  Object.values(world.rooms).forEach(({ r, lv, mat, fx }) => {
    let o = t.roomO
    tmp.set(t.room)
    if (world.tint === 'heat') { const u = Math.min(1, r.p / (r.w * r.d / 12)); tmp.set(t.heatA).lerp(new THREE.Color(t.heatB), u); o = 0.18 + u * 0.45 }
    if (fx) { tmp.copy(FX[fx]); o = 0.25 + (fx === 'ok' ? 0.1 : wave * 0.3) }
    if (focus != null && lv !== focus) o *= 0.35
    mat.color.lerp(tmp, k); mat.opacity += (o - mat.opacity) * k
  })
}

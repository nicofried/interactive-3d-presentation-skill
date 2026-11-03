// Light / dark scene themes and the shared materials they recolour. Components use these materials directly,
// so switching theme never re-renders the scene. Room tints are recoloured per frame in sim/world.js from `room`,
// `roomO`, `heatA` and `heatB`.
import * as THREE from 'three'
import { DECK } from './data/deck.js'

export const THEMES = {
  dark: {
    bg: 0x0b1020, grid: 0x2a3a6b, gridO: 0.35, additive: true, hemi: 0.45, glow: 1.1,
    globe: [0x818cf8, 0x22d3ee, 0xf59e0b], core: 0x111a3a, coreO: 0.7, lineO: 0.5, arcO: 0.6,
    slab: 0x111a3a, facade: 0x818cf8, facadeO: 0.55, roomEdge: 0x22d3ee, roomEdgeO: 0.35, room: 0x22d3ee, roomO: 0.06, heatA: 0x1e3a8a, heatB: 0x22d3ee, person: 0x2dd4bf
  },
  light: {
    bg: 0xf5f7fb, grid: 0xc3cbe0, gridO: 0.6, additive: false, hemi: 0.95, glow: 0.5,
    globe: [0x6366f1, 0x0891b2, 0xd97706], core: 0xe8ecfb, coreO: 0.55, lineO: 0.85, arcO: 0.5,
    slab: 0xffffff, facade: 0x6366f1, facadeO: 0.45, roomEdge: 0x8a94b4, roomEdgeO: 0.55, room: 0xc7d2fe, roomO: 0.18, heatA: 0xe0e7ff, heatB: 0x4f46e5, person: 0x4f46e5
  }
}
const KEY = `${DECK.id}-theme`
export const initialTheme = () => { try { return localStorage.getItem(KEY) || DECK.theme } catch { return DECK.theme } }
export const cur = { name: initialTheme(), t: null }
cur.t = THEMES[cur.name]

// Globe scene
export const globeLineM = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false })
export const globeCoreM = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false })
export const arcM = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, depthWrite: false })
export const flowM = new THREE.PointsMaterial({ size: 0.28, vertexColors: true, transparent: true, opacity: 0, depthWrite: false })
export const globeLines = [] // geometries recoloured with the theme gradient
// Building scene
export const slabM = new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0.05 })
export const facadeM = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false })
export const roomEdgeM = new THREE.LineBasicMaterial({ transparent: true, depthWrite: false })
export const personM = new THREE.MeshStandardMaterial({ roughness: 0.5 })
export const themed = { hemi: null }

export function applyTheme(name, scene) {
  cur.name = name; cur.t = THEMES[name]
  const t = cur.t
  document.documentElement.dataset.theme = name
  try { localStorage.setItem(KEY, name) } catch { /* private mode */ }
  scene.background = new THREE.Color(t.bg)
  scene.fog = new THREE.Fog(t.bg, 40, 130)
  if (themed.hemi) themed.hemi.intensity = t.hemi
  const blend = t.additive ? THREE.AdditiveBlending : THREE.NormalBlending
  ;[globeLineM, arcM, flowM, facadeM, roomEdgeM].forEach((m) => { m.blending = blend; m.needsUpdate = true })
  globeLineM.opacity = t.lineO
  globeCoreM.color.set(t.core); globeCoreM.opacity = t.coreO
  slabM.color.set(t.slab)
  facadeM.color.set(t.facade); facadeM.opacity = t.facadeO
  roomEdgeM.color.set(t.roomEdge); roomEdgeM.opacity = t.roomEdgeO
  personM.color.set(t.person); personM.emissive.set(t.person); personM.emissiveIntensity = t.additive ? 0.6 : 0
  const gc = t.globe.map((c) => new THREE.Color(c))
  globeLines.forEach((geo) => {
    const ca = geo.attributes.color, n = ca.count
    for (let s = 0; s < n; s++) {
      const u = (geo.userData.t0 + s / n * 0.6) % 1
      const c = u < 0.5 ? gc[0].clone().lerp(gc[1], u * 2) : gc[1].clone().lerp(gc[2], (u - 0.5) * 2)
      ca.setXYZ(s, c.r, c.g, c.b)
    }
    ca.needsUpdate = true
  })
}

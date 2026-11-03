// Canvas, lights, camera rig and the drivers that connect the store to the imperative world.
import React, { useEffect, useLayoutEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store.js'
import { PT } from '../data/points.js'
import { BH, ROOM, BASE, FH } from '../data/building.js'
import { world, applySlide, startScenario, tick, sceneOf } from '../sim/world.js'
import { applyTheme, themed, THEMES } from '../theme.js'
import { Globe, Points, Links, llToV } from './Globe.jsx'
import { Building } from './Building.jsx'

const OVERVIEW = [[0, 5, 17], [0, 0, 0]]
// Camera for a point: out along its direction and a little above, looking just past the surface.
const focusCam = (p) => { const d = llToV(p.lat, p.lon, 1); return [d.clone().multiplyScalar(13.5).add(new THREE.Vector3(0, 1.5, 0)).toArray(), d.multiplyScalar(2).toArray()] }
// Building cameras: the whole building, one floor (the floors above lift away), or the exploded view.
const B_OVERVIEW = [[44, 24, 52], [0, 4, 0]], B_EXPLODE = [[54, 32, 62], [0, 9, 0]]
const floorCam = (i) => { const y = BASE + i * FH; return [[32, y + 22, 40], [0, y + 1, 0]] }
function camFor(s, sel, floor) {
  if (sceneOf(s) === 'building') {
    if (sel && BH[sel]) return floorCam(ROOM[BH[sel].room].lv)
    if (floor != null) return floorCam(floor)
    return s.cam || (s.explode ? B_EXPLODE : B_OVERVIEW)
  }
  if (sel && PT[sel]) return focusCam(PT[sel])
  return s.cam || (s.focus ? focusCam(PT[s.focus]) : OVERVIEW)
}
const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)

// Eased fly-to on every slide or selection change; the first drag cancels it.
function CameraRig() {
  const camera = useThree((s) => s.camera), controls = useThree((s) => s.controls)
  const tw = useRef(null)
  const started = useStore((s) => s.started), cur = useStore((s) => s.cur), sel = useStore((s) => s.sel), floor = useStore((s) => s.floor)
  useEffect(() => {
    if (!controls) return
    const s = useStore.getState().slide()
    if (!started || !s) { controls.autoRotate = true; return }
    const cam = camFor(s, sel, floor)
    tw.current = { p0: camera.position.clone(), p1: new THREE.Vector3(...cam[0]), t0: controls.target.clone(), t1: new THREE.Vector3(...cam[1]), k: 0 }
    controls.autoRotate = !!s.orbit && !sel && floor == null
  }, [controls, started, cur, sel, floor, camera])
  useEffect(() => {
    if (!controls) return
    const stopTween = () => { tw.current = null }
    controls.addEventListener('start', stopTween)
    return () => controls.removeEventListener('start', stopTween)
  }, [controls])
  useFrame((_, dt) => {
    const t = tw.current; if (!t || !controls) return
    t.k = Math.min(1, t.k + dt / 1.6)
    const e = ease(t.k)
    camera.position.lerpVectors(t.p0, t.p1, e); controls.target.lerpVectors(t.t0, t.t1, e)
    if (t.k >= 1) tw.current = null
  })
  return null
}

// Recolours the shared materials whenever the light/dark theme changes.
function ThemeDriver() {
  const scene = useThree((s) => s.scene), theme = useStore((s) => s.theme)
  useLayoutEffect(() => { applyTheme(theme, scene) }, [theme, scene])
  return null
}

function SimDriver() {
  const cur = useStore((s) => s.cur), runId = useStore((s) => s.runId), scenario = useStore((s) => s.scenario)
  useEffect(() => {
    applySlide(useStore.getState().slide())
    if (scenario) startScenario(scenario)
  }, [cur, runId]) // eslint-disable-line react-hooks/exhaustive-deps
  useFrame((_, dt) => tick(Math.min(dt, 0.05)))
  return null
}

// The grid remounts on a theme switch: GridHelper bakes its colours into the geometry.
function Grid() {
  const theme = useStore((s) => s.theme), t = THEMES[theme]
  return <gridHelper key={theme} args={[90, 45, t.grid, t.grid]} position-y={-5.5} material-transparent material-opacity={t.gridO} />
}

// One group per scene kind; world.tick scales the active one in and the others out.
function SceneGroup({ kind, children }) {
  const g = useRef()
  useLayoutEffect(() => {
    world.scenes[kind] = g.current
    const on = sceneOf(useStore.getState().slide()) === kind
    g.current.scale.setScalar(on ? 1 : 0.001); g.current.visible = on
    return () => { delete world.scenes[kind] }
  }, [kind])
  return <group ref={g}>{children}</group>
}

function Lights() {
  const hemi = useRef()
  useLayoutEffect(() => { themed.hemi = hemi.current }, [])
  return (
    <>
      <hemisphereLight ref={hemi} args={['#ffffff', '#335544', 0.5]} />
      <directionalLight position={[20, 30, 20]} intensity={1.2} />
    </>
  )
}

export default function Scene() {
  return (
    <div className="scene">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 6, 22], fov: 40, near: 0.1, far: 400 }} onPointerMissed={() => useStore.getState().select(null)}>
        <Lights />
        <Grid />
        <SceneGroup kind="globe">
          <Globe />
          <Points />
          <Links />
        </SceneGroup>
        <SceneGroup kind="building">
          <Building />
        </SceneGroup>
        <OrbitControls makeDefault enableDamping enablePan={false} minDistance={7} maxDistance={110} autoRotateSpeed={0.5} />
        <CameraRig />
        <SimDriver />
        <ThemeDriver />
      </Canvas>
    </div>
  )
}

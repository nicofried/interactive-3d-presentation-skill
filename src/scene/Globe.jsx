// The globe (contour lines swirling around a sphere), the points of interest with their labels, and the arcs between
// them with dots flowing along. Colours come from the shared materials in theme.js.
import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store.js'
import { POINTS, PT, LINKS } from '../data/points.js'
import { world } from '../sim/world.js'
import { globeLineM, globeCoreM, globeLines, arcM, flowM, cur } from '../theme.js'

const R = 4
export const llToV = (lat, lon, r = R) => {
  const a = lat * Math.PI / 180, b = lon * Math.PI / 180
  return new THREE.Vector3(Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)).multiplyScalar(r)
}

export function Globe() {
  const spin = useRef()
  const lines = useMemo(() => {
    const out = []
    for (let k = 0; k < 54; k++) {
      const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI))
      const ph = Math.random() * 6.28, amp = 0.18 + Math.random() * 0.35, f = 2 + Math.floor(Math.random() * 3), lat = (Math.random() - 0.5) * 1.6, pos = []
      for (let s = 0; s <= 128; s++) {
        const a = s / 128 * Math.PI * 2, y = Math.sin(lat + amp * Math.sin(f * a + ph)), rr = Math.sqrt(Math.max(0, 1 - y * y))
        const v = new THREE.Vector3(rr * Math.cos(a), y, rr * Math.sin(a)).multiplyScalar(R * 0.98).applyQuaternion(q)
        pos.push(v.x, v.y, v.z)
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
      geo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(pos.length), 3))
      geo.userData.t0 = k / 54
      globeLines.push(geo); out.push(geo)
    }
    return out
  }, [])
  useLayoutEffect(() => { world.spin = spin.current }, [])
  return (
    <group>
      <mesh material={globeCoreM}><sphereGeometry args={[R * 0.95, 48, 32]} /></mesh>
      {/* Only the decoration spins; the points stay put so the camera positions per slide stay valid. */}
      <group ref={spin}>{lines.map((geo, i) => <line key={i} geometry={geo} material={globeLineM} />)}</group>
    </group>
  )
}

function Point({ p, label }) {
  const mesh = useRef()
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: p.c, emissive: p.c, emissiveIntensity: 1 }), [p.c])
  const select = useStore((s) => s.select), sel = useStore((s) => s.sel === p.id)
  useLayoutEffect(() => { world.points[p.id] = { id: p.id, mesh: mesh.current, mat, base: new THREE.Color(p.c), fx: null }; return () => { delete world.points[p.id] } }, [p, mat])
  const pos = useMemo(() => llToV(p.lat, p.lon, R + 0.12), [p])
  return (
    <group position={pos}>
      <mesh ref={mesh} material={mat} onClick={(e) => { e.stopPropagation(); select(p.id) }}><sphereGeometry args={[0.22, 24, 16]} /></mesh>
      {label && (
        <Html position={[0, 0.55, 0]} center zIndexRange={[20, 10]}>
          <button className={'hs' + (sel ? ' sel' : '')} onPointerDown={(e) => e.stopPropagation()} onClick={() => select(p.id)}>
            <i style={{ background: p.c }} />{p.t}
          </button>
        </Html>
      )}
    </group>
  )
}

export function Points() {
  const hs = useStore((s) => s.slide()?.hs), sel = useStore((s) => s.sel)
  const show = new Set([...(hs ?? []), ...(sel ? [sel] : [])])
  return <>{POINTS.map((p) => <Point key={p.id} p={p} label={show.has(p.id)} />)}</>
}

// Arcs fade in on slides with `links` (or while a scenario runs); one dot per arc flows from a to b.
export function Links() {
  const N = 48
  const { arcs, lineGeo, flowGeo } = useMemo(() => {
    const arcs = LINKS.map(([a, b]) => {
      const A = llToV(PT[a].lat, PT[a].lon, 1), B = llToV(PT[b].lat, PT[b].lon, 1), ca = new THREE.Color(PT[a].c), cb = new THREE.Color(PT[b].c)
      const pts = [], cols = []
      for (let s = 0; s <= N; s++) {
        const t = s / N, v = A.clone().lerp(B, t).normalize().multiplyScalar(R + 0.12 + 1.4 * Math.sin(Math.PI * t) * A.distanceTo(B) / 2)
        pts.push(v); const c = ca.clone().lerp(cb, t); cols.push(c.r, c.g, c.b)
      }
      return { pts, cols, c: ca }
    })
    const pos = [], col = []
    arcs.forEach(({ pts, cols }) => { for (let s = 0; s < N; s++) { pos.push(...pts[s].toArray(), ...pts[s + 1].toArray()); col.push(...cols.slice(s * 3, s * 3 + 6)) } })
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    lineGeo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
    const flowGeo = new THREE.BufferGeometry()
    flowGeo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(arcs.length * 3), 3))
    flowGeo.setAttribute('color', new THREE.Float32BufferAttribute(arcs.flatMap((a) => [a.c.r, a.c.g, a.c.b]), 3))
    return { arcs, lineGeo, flowGeo }
  }, [])
  useFrame((_, dt) => {
    const st = useStore.getState(), on = st.slide()?.links || !!st.scenario
    const target = on ? cur.t.arcO : 0, k = 1 - Math.exp(-dt * 4)
    arcM.opacity += (target - arcM.opacity) * k; flowM.opacity = arcM.opacity * 1.5
    const pa = flowGeo.attributes.position
    arcs.forEach((a, i) => { const u = (world.T * 0.3 + i * 0.17) % 1, p = a.pts[Math.floor(u * N)]; pa.setXYZ(i, p.x, p.y, p.z) })
    pa.needsUpdate = true
  })
  return (
    <>
      <lineSegments geometry={lineGeo} material={arcM} />
      <points geometry={flowGeo} material={flowM} />
    </>
  )
}

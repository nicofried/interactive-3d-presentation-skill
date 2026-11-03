// The building scene: one group per floor (slab, facade edges, rooms, people, hotspots). Floors are moved per frame in
// sim/world.js: the floors above a focused one lift away, and `explode` spreads them all.
import React, { useLayoutEffect, useMemo, useRef } from 'react'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store.js'
import { FLOORS, BHS, ROOM, FH, BASE, SIZE } from '../data/building.js'
import { world, randIn } from '../sim/world.js'
import { slabM, facadeM, roomEdgeM, personM } from '../theme.js'

const capG = new THREE.CapsuleGeometry(0.22, 0.6, 3, 8)
const edges = (w, h, d) => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d))

function Room({ r, lv }) {
  const people = useRef([])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ transparent: true, opacity: 0.1, depthWrite: false }), [])
  const edge = useMemo(() => edges(r.w - 0.3, FH * 0.72, r.d - 0.3), [r])
  useLayoutEffect(() => {
    world.rooms[r.id] = { r, lv, mat }
    const list = people.current.filter(Boolean).map((m) => { m.position.copy(randIn(r)); return { m, r, tg: randIn(r), wait: Math.random() * 2, sp: 0.6 + Math.random() * 0.6 } })
    world.people.push(...list)
    return () => { delete world.rooms[r.id]; world.people = world.people.filter((p) => !list.includes(p)) }
  }, [r, lv, mat])
  return (
    <group>
      <mesh material={mat} position={[r.x, FH * 0.36 + 0.2, r.z]} onClick={(e) => { e.stopPropagation(); useStore.getState().setFloor(lv) }}>
        <boxGeometry args={[r.w - 0.3, FH * 0.72, r.d - 0.3]} />
      </mesh>
      <lineSegments geometry={edge} material={roomEdgeM} position={[r.x, FH * 0.36 + 0.2, r.z]} />
      {Array.from({ length: r.p }, (_, k) => <mesh key={k} ref={(el) => { people.current[k] = el }} geometry={capG} material={personM} />)}
    </group>
  )
}

function Hotspot({ h }) {
  const r = ROOM[h.room], sel = useStore((s) => s.sel === h.id), select = useStore((s) => s.select)
  return (
    <Html position={[r.x, FH * 0.95, r.z]} center zIndexRange={[20, 10]}>
      <button className={'hs' + (sel ? ' sel' : '')} onPointerDown={(e) => e.stopPropagation()} onClick={() => select(h.id)}>
        <i style={{ background: h.c }} />{h.t}
      </button>
    </Html>
  )
}

function Floor({ f, lv, labels }) {
  const g = useRef()
  const facade = useMemo(() => edges(SIZE.w, FH, SIZE.d), [])
  useLayoutEffect(() => { world.floors[lv] = g.current; return () => { world.floors[lv] = null } }, [lv])
  return (
    <group ref={g} position-y={BASE + lv * FH}>
      <mesh material={slabM} position-y={0.1}><boxGeometry args={[SIZE.w, 0.2, SIZE.d]} /></mesh>
      <lineSegments geometry={facade} material={facadeM} position-y={FH / 2} />
      {f.rooms.map((r) => <Room key={r.id} r={r} lv={lv} />)}
      {labels.filter((h) => ROOM[h.room].lv === lv).map((h) => <Hotspot key={h.id} h={h} />)}
    </group>
  )
}

export function Building() {
  const hs = useStore((s) => s.slide()?.hs), sel = useStore((s) => s.sel)
  const show = new Set([...(hs ?? []), ...(sel ? [sel] : [])])
  const labels = BHS.filter((h) => show.has(h.id))
  return <>{FLOORS.map((f, lv) => <Floor key={f.id} f={f} lv={lv} labels={labels} />)}</>
}

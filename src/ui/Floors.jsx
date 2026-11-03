// Floor rail for building slides: pick a floor to lift the floors above it away, or the whole building. ↑ ↓ do the same.
import React from 'react'
import { useStore } from '../store.js'
import { FLOORS } from '../data/building.js'
import { sceneOf } from '../sim/world.js'

export function Floors() {
  const started = useStore((s) => s.started), floor = useStore((s) => s.floor)
  const building = useStore((s) => sceneOf(s.slide()) === 'building')
  if (!started || !building) return null
  const setFloor = useStore.getState().setFloor
  return (
    <aside className="floors glass">
      <h6>Floors</h6>
      {FLOORS.map((f, i) => ({ f, i })).reverse().map(({ f, i }) => (
        <button key={f.id} className={floor === i ? 'on' : ''} onClick={() => setFloor(floor === i ? null : i)}>
          <span className="n">{i === 0 ? 'G' : i}</span>{f.n}
        </button>
      ))}
      <button className={'all' + (floor == null ? ' on' : '')} onClick={() => setFloor(null)}>Whole building</button>
      <small>↑ ↓ to move between floors</small>
    </aside>
  )
}

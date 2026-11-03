// Keyboard: ← → (also PageUp/PageDown, Space) move, ↑ ↓ change floor on building slides, O slide menu, A author mode,
// T theme, F fullscreen, Esc closes.
import { useEffect } from 'react'
import { useStore } from '../store.js'
import { FLOORS } from '../data/building.js'
import { sceneOf } from '../sim/world.js'

export const toggleFs = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())

export function useKeys() {
  useEffect(() => {
    const on = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest?.('input,textarea,[contenteditable="true"]')) return
      const s = useStore.getState(), k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (s.sorter) { if (k === 'Escape' || k === 'o') { e.preventDefault(); s.setSorter(false) } return } // the menu handles its own keys
      if (k === 'o') s.setSorter(true)
      else if (k === 'a') s.toggleAuthor()
      else if (k === 't') s.toggleTheme()
      else if (k === 'f') toggleFs()
      else if (!s.started) { if (k === 'Enter' || k === ' ') { e.preventDefault(); s.start() } }
      else if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); s.step(1) }
      else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); s.step(-1) }
      else if ((k === 'ArrowUp' || k === 'ArrowDown') && sceneOf(s.slide()) === 'building') {
        e.preventDefault()
        const f = s.floor == null ? (k === 'ArrowUp' ? 0 : null) : s.floor + (k === 'ArrowUp' ? 1 : -1)
        s.setFloor(f == null || f < 0 ? null : Math.min(FLOORS.length - 1, f))
      }
      else if (k === 'Escape') s.select(null)
    }
    addEventListener('keydown', on)
    return () => removeEventListener('keydown', on)
  }, [])
}

// The slide menu (O): every slide as a card in deck order. Drag a card (or Shift+← →) to move it, the eye (or H) hides
// or shows it, click (or Enter) opens it. Hidden slides are skipped when presenting and keep their place in the order.
import React, { useEffect, useState } from 'react'
import { useStore } from '../store.js'

export function Sorter() {
  const open = useStore((s) => s.sorter), order = useStore((s) => s.order), hidden = useStore((s) => s.hidden), cur = useStore((s) => s.cur)
  useStore((s) => s.edits) // card titles follow author edits
  const [drag, setDrag] = useState(null), [over, setOver] = useState(null), [focusId, setFocusId] = useState(null)
  const { slide, move, toggleHidden, goTo, setSorter } = useStore.getState()
  // Keep keyboard focus on the card that just moved.
  useEffect(() => { if (open && focusId) document.querySelector(`[data-sid="${focusId}"]`)?.focus() }, [open, order, focusId])
  useEffect(() => { if (open) setFocusId(cur ?? order[0]) }, [open]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!open) return null
  const openSlide = (id) => { goTo(id); setSorter(false) }
  const onKey = (e, id, i) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
    if (e.shiftKey && (k === 'ArrowLeft' || k === 'ArrowRight')) { e.preventDefault(); move(id, i + (k === 'ArrowRight' ? 1 : -1)); setFocusId(id) }
    else if (k === 'ArrowLeft' || k === 'ArrowRight') { e.preventDefault(); setFocusId(order[Math.max(0, Math.min(order.length - 1, i + (k === 'ArrowRight' ? 1 : -1)))]) }
    else if (k === 'h') toggleHidden(id)
    else if (k === 'Enter') openSlide(id)
  }
  let n = 0
  return (
    <div className="sorter" onClick={() => setSorter(false)}>
      <div className="sorter-box glass" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3>Slides</h3>
          <small>Drag or Shift+← → to move · H or the eye to hide · Enter to open · Esc or O to close</small>
        </header>
        <div className="cards">
          {order.map((id, i) => {
            const s = slide(id), hid = hidden.includes(id), num = hid ? '–' : ++n
            const cls = ['card', id === cur && 'cur', hid && 'hid', drag === id && 'dragging', over === i && drag && drag !== id && 'over'].filter(Boolean).join(' ')
            return (
              <div key={id} data-sid={id} className={cls} tabIndex={0} draggable
                onFocus={() => setFocusId(id)} onKeyDown={(e) => onKey(e, id, i)} onDoubleClick={() => openSlide(id)}
                onDragStart={(e) => { setDrag(id); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', id) }}
                onDragOver={(e) => { e.preventDefault(); setOver(i) }}
                onDragEnd={() => { setDrag(null); setOver(null) }}
                onDrop={(e) => { e.preventDefault(); if (drag) move(drag, i); setFocusId(drag); setDrag(null); setOver(null) }}>
                <span className="num">{num}</span>
                <button className="eye" title={hid ? 'Show slide (H)' : 'Hide slide (H)'} onClick={() => toggleHidden(id)}>{hid ? 'Show' : 'Hide'}</button>
                <small className="k">{s.kicker}</small>
                <b>{s.n}</b>
                <span className="tags">{s.blk && <em>{s.blk}</em>}{s.scenario && <em>scenario</em>}{s.links && <em>links</em>}{s.scene === 'building' && <em>building</em>}</span>
                <button className="open" onClick={() => openSlide(id)}>Open</button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

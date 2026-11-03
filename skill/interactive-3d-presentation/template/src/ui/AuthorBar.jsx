// Author mode (A): deck title, subtitle, author and date, plus export / import / reset of the deck. Slide text is edited
// in place in the panel. Changes are kept in this browser only; to ship them, export the deck, save it as
// src/data/baked.json and rebuild.
import React, { useRef } from 'react'
import { useStore } from '../store.js'
import { DECK } from '../data/deck.js'
import { clean } from './html.js'

const META = [['title', 'Deck title'], ['sub', 'Subtitle'], ['author', 'Author'], ['date', 'Date']]

export function AuthorBar() {
  const author = useStore((s) => s.author), meta = useStore((s) => s.meta)
  const file = useRef()
  if (!author) return null
  const { setMeta, exportDeck, importDeck, resetDeck } = useStore.getState()
  const download = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([exportDeck()], { type: 'application/json' }))
    a.download = `${DECK.id}.json`; a.click(); URL.revokeObjectURL(a.href)
  }
  const load = async (e) => {
    const f = e.target.files[0]; e.target.value = ''
    if (!f) return
    try {
      const d = JSON.parse(await f.text())
      Object.values(d.edits ?? {}).forEach((ed) => { if (ed.txt) ed.txt = clean(ed.txt) })
      importDeck(d)
    } catch (err) { alert(`Could not read ${f.name}: ${err.message}`) }
  }
  return (
    <div className="author glass">
      <b className="badge on">Author mode</b>
      {META.map(([k, l]) => (
        <label key={k}>{l}<input value={meta[k] ?? ''} onChange={(e) => setMeta(k, e.target.value)} /></label>
      ))}
      <div className="row">
        <button onClick={download} title="Download the deck (order, hidden slides, edits, title) as JSON">Export</button>
        <button onClick={() => file.current.click()}>Import</button>
        <button onClick={() => confirm('Reset order, hidden slides and edits to the built-in deck?') && resetDeck()}>Reset</button>
        <input ref={file} type="file" accept="application/json,.json" hidden onChange={load} />
      </div>
      <small>Click any slide text to edit it. Saved in this browser; export and save as src/data/baked.json to ship it.</small>
    </div>
  )
}

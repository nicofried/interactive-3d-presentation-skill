// HTML overlay UI: top bar, intro, slide panel (editable in author mode) and navigation.
import React from 'react'
import { useStore } from '../store.js'
import { PT } from '../data/points.js'
import { BH } from '../data/building.js'
import { BLOCKS } from './Blocks.jsx'
import { clean, esc } from './html.js'
import { toggleFs } from './keys.js'

const html = (s) => ({ dangerouslySetInnerHTML: { __html: s } })

// One slide text field. In author mode it becomes contentEditable and saves on blur; `rich` fields keep simple HTML.
function Field({ id, f, as: Tag = 'p', rich, className }) {
  const author = useStore((s) => s.author), value = useStore((s) => s.slide(id)?.[f])
  const edit = useStore.getState().edit
  if (!author) return value ? <Tag className={className} {...html(rich ? value : esc(value))} /> : null
  return (
    <Tag key={`${id}-${f}`} className={(className || '') + ' ed'} data-ph={f} contentEditable suppressContentEditableWarning
      {...html(rich ? value || '' : esc(value))}
      onKeyDown={(e) => { if (!rich && e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur() } }}
      onBlur={(e) => edit(id, f, rich ? clean(e.currentTarget.innerHTML) : e.currentTarget.textContent.trim())} />
  )
}

export function TopBar() {
  const meta = useStore((s) => s.meta), author = useStore((s) => s.author), theme = useStore((s) => s.theme)
  const { setSorter, toggleAuthor, toggleTheme } = useStore.getState()
  return (
    <header className="top">
      <div className="brand glass"><b>{meta.title}</b><small>{meta.sub}</small></div>
      <div className="tools glass">
        <button onClick={() => setSorter(true)} title="Slide menu (O)">Slides</button>
        <button className={author ? 'on' : ''} onClick={toggleAuthor} title="Author mode (A)">Author</button>
        <button onClick={toggleTheme} title="Light / dark (T)">{theme === 'dark' ? 'Light' : 'Dark'}</button>
        <button onClick={toggleFs} title="Fullscreen (F)">Fullscreen</button>
      </div>
    </header>
  )
}

export function Intro() {
  const started = useStore((s) => s.started), meta = useStore((s) => s.meta)
  if (started) return null
  return (
    <div className="intro">
      <div className="intro-box">
        <small className="k">{meta.sub}</small>
        <h1>{meta.title}</h1>
        {(meta.author || meta.date) && <p className="by">{[meta.author, meta.date].filter(Boolean).join(' · ')}</p>}
        <button className="cta" onClick={() => useStore.getState().start()}>Start the presentation</button>
        <p className="hint">← → move · O slides · A author · T theme · F fullscreen</p>
      </div>
    </div>
  )
}

export function Panel() {
  const cur = useStore((s) => s.cur), sel = useStore((s) => s.sel), hidden = useStore((s) => s.hidden.includes(s.cur))
  useStore((st) => st.edits[st.cur]) // re-render on edits; selectors must return stable values, so not slide() itself
  const s = useStore.getState().slide()
  if (!s) return null
  const Block = BLOCKS[s.blk]
  return (
    <aside className="panel glass" key={cur}>
      {sel ? (
        <>
          <small className="k">Detail</small>
          <h2>{(PT[sel] ?? BH[sel]).t}</h2>
          <p className="txt">{(PT[sel] ?? BH[sel]).b}</p>
          <button className="link" onClick={() => useStore.getState().select(null)}>← Back to the slide</button>
        </>
      ) : (
        <>
          {hidden && <span className="badge">Hidden slide</span>}
          <Field id={cur} f="kicker" as="small" className="k" />
          <Field id={cur} f="t" as="h2" />
          <Field id={cur} f="sub" className="sub" />
          <Field id={cur} f="txt" rich className="txt" />
          {s.kpis && <div className="kpis">{s.kpis.map(([l, v]) => <div key={l} className="kpi"><b>{v}</b><span>{l}</span></div>)}</div>}
          {Block && <Block />}
        </>
      )}
    </aside>
  )
}

export function Nav() {
  const started = useStore((s) => s.started), cur = useStore((s) => s.cur), order = useStore((s) => s.order), hidden = useStore((s) => s.hidden), author = useStore((s) => s.author)
  if (!started) return null
  const { step, goTo } = useStore.getState()
  const shown = order.filter((id) => author || !hidden.includes(id)), i = shown.indexOf(cur)
  return (
    <nav className="nav glass">
      <button onClick={() => step(-1)} aria-label="Previous slide">←</button>
      <div className="dots">{shown.map((id) => <i key={id} title={useStore.getState().slide(id).n} className={(id === cur ? 'on' : '') + (hidden.includes(id) ? ' hid' : '')} onClick={() => goTo(id)} />)}</div>
      <span className="count">{i + 1} / {shown.length}</span>
      <button onClick={() => step(1)} aria-label="Next slide">→</button>
    </nav>
  )
}

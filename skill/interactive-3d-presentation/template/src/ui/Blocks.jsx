// Interactive blocks a slide can show under its text (`blk` in slides.js). Add a component here and name it in a slide.
import React, { useState } from 'react'
import { useStore } from '../store.js'
import { PT } from '../data/points.js'
import { STEPS, CHART } from '../data/slides.js'

// Clickable steps: each one flies the camera to its point.
function Steps() {
  const sel = useStore((s) => s.sel), select = useStore.getState().select
  return (
    <ol className="steps">
      {STEPS.map((st, i) => (
        <li key={i}><button className={sel === st.p ? 'on' : ''} onClick={() => select(st.p)}><i style={{ background: PT[st.p].c }} />{st.t}</button></li>
      ))}
    </ol>
  )
}

// Grouped bars with a hover readout.
function Chart() {
  const [hov, setHov] = useState(null)
  const max = Math.max(...CHART.series.flatMap((s) => s.v)), W = 300, H = 140, gw = W / CHART.labels.length, bw = (gw - 18) / CHART.series.length
  return (
    <div className="chart">
      <div className="legend">{CHART.series.map((s) => <span key={s.n}><i style={{ background: s.c }} />{s.n}</span>)}</div>
      <svg viewBox={`0 0 ${W} ${H + 18}`} role="img" aria-label={CHART.title}>
        {CHART.labels.map((l, g) => (
          <g key={l} transform={`translate(${g * gw + 9},0)`}>
            {CHART.series.map((s, k) => {
              const h = (s.v[g] / max) * H
              return <rect key={s.n} x={k * bw} y={H - h} width={bw - 3} height={h} rx="3" fill={s.c} opacity={hov && (hov.g !== g || hov.k !== k) ? 0.35 : 1}
                onMouseEnter={() => setHov({ g, k })} onMouseLeave={() => setHov(null)} />
            })}
            <text x={(gw - 18) / 2} y={H + 14} textAnchor="middle">{l}</text>
          </g>
        ))}
      </svg>
      <p className="readout">{hov ? `${CHART.labels[hov.g]} · ${CHART.series[hov.k].n}: ${CHART.series[hov.k].v[hov.g]}` : 'Hover a bar'}</p>
    </div>
  )
}

// Play / replay a scenario from sim/world.js, with its clock and event log.
function Scenario() {
  const log = useStore((s) => s.log), clock = useStore((s) => s.clock), running = useStore((s) => !!s.scenario)
  return (
    <div className="scenario">
      <div className="row">
        <button className="cta small" onClick={() => useStore.getState().play()}>{running ? 'Replay' : 'Play scenario'}</button>
        {clock && <b className="clock">{clock.label}</b>}
      </div>
      <ul className="log">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </div>
  )
}

export const BLOCKS = { steps: Steps, chart: Chart, scenario: Scenario }

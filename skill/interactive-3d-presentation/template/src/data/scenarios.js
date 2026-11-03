// Scripted scenarios, started by a slide's scenario block. A scenario is a timeline in seconds with a clock range in
// minutes. Each step adds a log line and can set the state (alert, busy, ok) of a globe point (`p`) or a room (`room`).
export const SCENARIOS = {
  cascade: {
    dur: 9, clock: [8 * 60, 8 * 60 + 12],
    steps: [
      { at: 0.5, p: 'p1', fx: 'alert', log: 'Part one raises an event' },
      { at: 2.2, p: 'core', fx: 'busy', log: 'The core correlates it with part two' },
      { at: 3.6, p: 'p2', fx: 'busy', log: 'Part two confirms the context' },
      { at: 5.2, p: 'p4', fx: 'ok', log: 'Part four shows the operator one clear action' },
      { at: 7.0, p: 'p1', fx: 'ok', log: 'Resolved, with the whole trail kept' },
      { at: 8.0, p: 'core', fx: 'ok', log: 'Done: one event, no manual hand-offs' }
    ]
  },
  event: {
    dur: 9, clock: [8 * 60 + 30, 10 * 60],
    steps: [
      { at: 0.5, room: 'lobby', fx: 'busy', log: '08:30 · Guests arrive for the conference' },
      { at: 2.2, room: 'conf', fx: 'busy', log: '09:00 · The conference hall fills up' },
      { at: 4.0, room: 'cafe', fx: 'alert', log: '09:20 · The café queue passes its limit' },
      { at: 5.8, room: 'terrace', fx: 'ok', log: '09:25 · The terrace opens as an overflow area' },
      { at: 7.4, room: 'cafe', fx: 'ok', log: '09:40 · Queue back to normal' },
      { at: 8.4, room: 'conf', fx: 'ok', log: '10:00 · Sessions start on time' }
    ]
  }
}

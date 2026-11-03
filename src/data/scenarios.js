// Scripted scenarios, started by a slide's scenario block. A scenario is a timeline in seconds with a clock range in
// minutes. Each step adds a log line and can set the state (alert, busy, ok) of a globe point (`p`) or a room (`room`).
export const SCENARIOS = {
  ship: {
    dur: 10, clock: [9 * 60, 9 * 60 + 30],
    steps: [
      { at: 0.5, p: 'author', fx: 'busy', log: 'An author retitles two slides in author mode' },
      { at: 2.0, p: 'menu', fx: 'busy', log: 'The slide menu moves the demo forward and hides a backup slide' },
      { at: 3.6, p: 'data', fx: 'busy', log: 'Export: the deck is saved as src/data/baked.json' },
      { at: 5.0, p: 'stack', fx: 'alert', log: 'A label overlaps the panel in light mode; the camera is moved in slides.js' },
      { at: 6.6, p: 'stack', fx: 'ok', log: 'npm run build inlines scripts, styles and data' },
      { at: 8.0, p: 'ship', fx: 'ok', log: 'dist/index.html opens offline, with the new order and titles' },
      { at: 9.0, p: 'core', fx: 'ok', log: 'Shipped: one file, every edit kept' }
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

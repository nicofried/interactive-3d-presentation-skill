// The example building for `scene: 'building'` slides: floors from the ground up, rooms as rectangles in floor
// coordinates (metres, centred on the building), people per room, and labelled hotspots. Every number is illustrative.
export const FH = 3.6 // floor height
export const BASE = -5.5 // ground level, on the grid
export const SIZE = { w: 30, d: 18 }

export const FLOORS = [
  { id: 'f0', n: 'Ground floor', rooms: [
    { id: 'lobby', n: 'Lobby', x: -7.5, z: 0, w: 13, d: 16, p: 8 },
    { id: 'cafe', n: 'Café', x: 6, z: 2.5, w: 15, d: 11, p: 12 },
    { id: 'mail', n: 'Mail room', x: 6, z: -6.5, w: 15, d: 4, p: 1 }] },
  { id: 'f1', n: 'Level 1 · Studio', rooms: [
    { id: 'studio', n: 'Studio', x: -6, z: 0, w: 16, d: 16, p: 9 },
    { id: 'meet', n: 'Meeting rooms', x: 8, z: 3.5, w: 12, d: 9, p: 6 },
    { id: 'quiet', n: 'Quiet room', x: 8, z: -5, w: 12, d: 6, p: 1 }] },
  { id: 'f2', n: 'Level 2 · Lab', rooms: [
    { id: 'lab', n: 'Lab', x: -7, z: -1, w: 14, d: 14, p: 5 },
    { id: 'open2', n: 'Open office', x: 7, z: 0, w: 14, d: 16, p: 16 }] },
  { id: 'f3', n: 'Level 3 · Open plan', rooms: [
    { id: 'open3', n: 'Open plan', x: -4, z: 0, w: 20, d: 16, p: 22 },
    { id: 'focus', n: 'Focus rooms', x: 10.5, z: 3.5, w: 7, d: 9, p: 1 },
    { id: 'phone', n: 'Phone booths', x: 10.5, z: -5, w: 7, d: 6, p: 1 }] },
  { id: 'f4', n: 'Level 4 · Conference', rooms: [
    { id: 'conf', n: 'Conference hall', x: -3, z: 0, w: 22, d: 16, p: 26 },
    { id: 'terrace', n: 'Terrace', x: 11.5, z: 0, w: 5, d: 16, p: 0 }] }
]
export const ROOM = Object.fromEntries(FLOORS.flatMap((f, lv) => f.rooms.map((r) => [r.id, { ...r, lv }])))

// Hotspots sit on a room and move with its floor. Use their ids in a slide's `hs`.
export const BHS = [
  { id: 'b-lobby', room: 'lobby', c: '#38BDF8', t: 'Lobby · 8 people', b: 'Arrivals, visitors and deliveries meet here. A good first stop for any building story.' },
  { id: 'b-lab', room: 'lab', c: '#A78BFA', t: 'Lab · restricted', b: 'Rooms can carry their own story: access rules, equipment, an incident.' },
  { id: 'b-open', room: 'open3', c: '#2DD4BF', t: 'Open plan · 22 people', b: 'The busiest room in the building, shown by the heatmap tint.' },
  { id: 'b-focus', room: 'focus', c: '#F59E0B', t: 'Focus rooms · booked 80%, used 30%', b: 'A mismatch the heatmap makes visible at a glance.' },
  { id: 'b-conf', room: 'conf', c: '#FB7185', t: 'Conference hall · 26 people', b: 'Event days fill this floor. Use a scenario to play one out.' }
]
export const BH = Object.fromEntries(BHS.map((h) => [h.id, h]))

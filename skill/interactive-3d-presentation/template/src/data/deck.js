// Deck identity. `id` keys the browser storage (slide order, hidden slides, author edits, theme): give every deck its own,
// and use the same id in the theme snippet in index.html. `scene` is the default scene kind ('globe' or 'building');
// a slide can switch with its own `scene` field.
export const DECK = { id: 'starter-deck', title: 'Programme overview', sub: 'Interactive 3D presentation', author: 'Author name', date: '2026', theme: 'dark', scene: 'globe' }

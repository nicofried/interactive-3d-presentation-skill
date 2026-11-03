// Deck identity. `id` keys the browser storage (slide order, hidden slides, author edits, theme): give every deck its own,
// and use the same id in the theme snippet in index.html. `scene` is the default scene kind ('globe' or 'building');
// a slide can switch with its own `scene` field.
export const DECK = { id: 'skill-showcase', title: 'Interactive 3D presentations', sub: 'A deck about the skill that builds it', author: '', date: '2026', theme: 'dark', scene: 'globe' }

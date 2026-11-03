// Slide text is simple HTML. Author edits and imported decks go through clean(), which keeps a few inline tags and
// drops everything else (scripts, event handlers, styles), so a shared deck file cannot run code.
const KEEP = new Set(['B', 'STRONG', 'I', 'EM', 'BR', 'UL', 'OL', 'LI', 'P', 'SPAN', 'A'])

export function clean(html) {
  const doc = new DOMParser().parseFromString(`<div>${html ?? ''}</div>`, 'text/html')
  const walk = (el) => [...el.childNodes].forEach((n) => {
    if (n.nodeType === 3) return
    if (n.nodeType !== 1 || !KEEP.has(n.tagName)) { n.replaceWith(...(n.nodeType === 1 ? n.childNodes : [])); return walk(el) }
    ;[...n.attributes].forEach((a) => { if (!(n.tagName === 'A' && a.name === 'href' && /^https?:/i.test(a.value))) n.removeAttribute(a.name) })
    if (n.tagName === 'A') { n.target = '_blank'; n.rel = 'noopener' }
    walk(n)
  })
  const root = doc.body.firstChild
  walk(root)
  return root.innerHTML
}

export const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

import { useEffect, useRef, useState } from 'react'
import { Card } from './Card'
import type { Selection } from './types'

const PAGE_SIZE = 9

export function Gallery() {
  const [selection, setSelection] = useState<Selection | null>(null)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const sentinel = useRef<HTMLDivElement>(null)
  useEffect(() => { fetch('/selection.json').then(response => response.json()).then(setSelection).catch(() => setSelection({ updatedAt: '', posts: [] })) }, [])
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => entry.isIntersecting && setVisible(count => count + PAGE_SIZE), { rootMargin: '500px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [selection])
  if (!selection) return <main className="status">Loading collages…</main>
  const posts = [...selection.posts].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  return <>
    <header className="gallery-head">
      <div className="gallery-head-row"><span className="gallery-title">Collages</span><span className="byline">by <a href="https://grantcuster.com" target="_blank" rel="noreferrer">Grant Custer</a></span></div>
      <p className="gallery-description">Collages made on the <a href="https://tabletop.grantcuster.com" target="_blank" rel="noreferrer">tabletop</a>.</p>
    </header>
    <main>{posts.length ? <div className="grid">{posts.slice(0, visible).map(post => <Card key={post.uri} post={post} />)}</div> : <section className="empty"><p>No collages selected yet.</p><a href="/curate">Open the curator</a></section>}<div ref={sentinel} className="sentinel" /></main>
  </>
}

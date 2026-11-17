import type { ReactNode } from 'react'
import type { CollagePost, TextFacet } from './types'
import { Photo } from './Photo'

function relativeDate(value: string) {
  const elapsed = new Date(value).getTime() - Date.now()
  const units: [Intl.RelativeTimeFormatUnit, number][] = [['year', 365 * 864e5], ['month', 30 * 864e5], ['week', 7 * 864e5], ['day', 864e5], ['hour', 36e5], ['minute', 6e4]]
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  for (const [unit, duration] of units) if (Math.abs(elapsed) >= duration) return formatter.format(Math.round(elapsed / duration), unit)
  return 'just now'
}

function linkedText(text: string, facets?: TextFacet[]) {
  const links = facets?.filter(facet => facet.features.some(feature => feature.uri)) ?? []
  if (!links.length) return text
  const bytes = new TextEncoder().encode(text), decode = (start: number, end: number) => new TextDecoder().decode(bytes.slice(start, end))
  const parts: ReactNode[] = []; let cursor = 0
  for (const facet of links.sort((a, b) => a.index.byteStart - b.index.byteStart)) {
    const uri = facet.features.find(feature => feature.uri)?.uri
    if (!uri || facet.index.byteStart < cursor) continue
    parts.push(decode(cursor, facet.index.byteStart), <a key={`${facet.index.byteStart}-${uri}`} href={uri} target="_blank" rel="noreferrer">{decode(facet.index.byteStart, facet.index.byteEnd)}</a>)
    cursor = facet.index.byteEnd
  }
  parts.push(decode(cursor, bytes.length)); return parts
}

export function Card({ post, selecting, selected, onToggle }: { post: CollagePost; selecting?: boolean; selected?: boolean; onToggle?: () => void }) {
  const date = post.createdAt ? relativeDate(post.createdAt) : ''
  return <article className={`card ${selected ? 'selected' : ''}`}>
    <div className="details"><div className="caption"><p>{post.text ? linkedText(post.text, post.facets) : <em>Untitled collage</em>}</p></div></div>
    <div className="media"><Photo src={post.images[0].fullsize} alt={post.images[0].alt} />{selecting && <button className="select" onClick={onToggle} aria-pressed={selected}><span>{selected ? '✓' : '+'}</span>{selected ? 'Selected' : 'Select'}</button>}</div>
    {post.images.length > 1 && <span className="image-count">{post.images.length} images</span>}
    {date && <a className="post-date" href={post.postUrl} target="_blank" rel="noreferrer"><time dateTime={post.createdAt}>{date}</time></a>}
  </article>
}

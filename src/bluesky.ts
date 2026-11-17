import type { CollagePost, FeedViewPost } from './types'

const API = 'https://public.api.bsky.app/xrpc'

export function toCollage(view: FeedViewPost): CollagePost | undefined {
  const { post } = view
  const images = post.embed?.images?.map(image => ({ ...image, alt: image.alt ?? '' })) ?? []
  if (!images.length) return undefined
  const rkey = post.uri.split('/').at(-1) ?? ''
  return {
    uri: post.uri, cid: post.cid, text: post.record.text ?? '', createdAt: post.record.createdAt ?? '',
    author: { handle: post.author.handle, displayName: post.author.displayName || post.author.handle, avatar: post.author.avatar },
    postUrl: `https://bsky.app/profile/${post.author.handle}/post/${rkey}`,
    facets: post.record.facets, images,
  }
}

export async function getAuthorPosts(actor: string, cursor?: string) {
  const params = new URLSearchParams({ actor, limit: '50', filter: 'posts_with_replies' })
  if (cursor) params.set('cursor', cursor)
  const response = await fetch(`${API}/app.bsky.feed.getAuthorFeed?${params}`)
  if (!response.ok) throw new Error(response.status === 400 ? 'That Bluesky profile could not be found.' : `Bluesky returned ${response.status}.`)
  const data = await response.json() as { feed: FeedViewPost[]; cursor?: string }
  return { posts: data.feed.filter(item => !item.reason).map(toCollage).filter((post): post is CollagePost => Boolean(post)), cursor: data.cursor }
}

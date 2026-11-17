export type TextFacet = {
  index: { byteStart: number; byteEnd: number }
  features: { $type?: string; uri?: string }[]
}

export type CollagePost = {
  uri: string
  cid: string
  text: string
  createdAt: string
  author: { handle: string; displayName: string; avatar?: string }
  postUrl: string
  facets?: TextFacet[]
  images: { thumb: string; fullsize: string; alt: string }[]
}

export type Selection = { updatedAt: string; posts: CollagePost[] }

export type FeedViewPost = {
  post: {
    uri: string; cid: string
    author: { handle: string; displayName?: string; avatar?: string }
    record: { text?: string; createdAt?: string; facets?: TextFacet[] }
    embed?: { images?: { thumb: string; fullsize: string; alt?: string }[] }
  }
  reason?: unknown
}

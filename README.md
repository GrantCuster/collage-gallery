# Collages

A static, image-first gallery curated from public Bluesky posts.

```sh
npm install
npm run dev
```

- `/` displays the selected collages.
- `/curate` loads image posts from `grantcuster.com`; selection changes save automatically to `public/selection.json` while running Vite locally.

The public gallery is static. Set the `actor` in `src/Curator.tsx` if the collages belong to another Bluesky account.

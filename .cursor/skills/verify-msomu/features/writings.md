# Writings

The `/writings` index lists every post from the `writing` content collection (newest first) with title, date, and slug links. Individual posts live at `/writings/[slug]` with `WritingLayout` (hero image optional, scroll progress, prose).

## Sub-features

- `writings.index` — `/writings` H1, description, RSS feed button
- `writings.detail` — `/writings/<slug>` article body from MDX
- `writings.rss` — `/rss.xml` feed (not driven by default `drive.sh`; curl separately if needed)

## How to get to it (user POV)

Click **writings** in the header or **View all posts** on the homepage. Open any listed title to read the full article.

## Driving it with curl

1. `curl -fsS -o evidence/writings.html http://127.0.0.1:4321/writings`
   - **Expect:** HTTP 200, page title area contains `writings`.
2. Extract first slug: `grep -oE 'href="/writings/[^"]+"' evidence/writings.html | head -1`
   - **Expect:** at least one `/writings/<slug>` link.
3. `curl -fsS -o evidence/writing-detail.html http://127.0.0.1:4321/writings/<slug>`
   - **Expect:** HTTP 200, slug appears in HTML.

Or run: `.cursor/skills/verify-msomu/scripts/drive.sh writings`

## Gotchas

- Slugs come from filenames under `src/content/writing/`; adding/removing posts changes which slug step 2 picks.
- Missing slugs 404 with agent-friendly markdown when `Accept: text/markdown` is set (see `agent-markdown` feature).
- Dates sort server-side; the first link is newest, not alphabetical.

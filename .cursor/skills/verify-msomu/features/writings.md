# Writings

The `/writings` index lists every post from the `writing` content collection (newest first) with title, date, and slug links. Individual posts live at `/{slug}` (Astro 7 catch-all). Legacy `/writings/{slug}` returns 308 to the flat path.

## Sub-features

- `writings.index` — `/writings` H1, description, RSS feed button
- `writings.detail` — `/{slug}` article body from MDX
- `writings.redirect` — `/writings/{slug}` → 308 `/{slug}`
- `writings.rss` — `/rss.xml` feed (not driven by default `drive.sh`; curl separately if needed)

## How to get to it (user POV)

Click **writings** in the header or **View all posts** on the homepage. Open any listed title to read the full article.

## Driving it with curl

1. `curl -fsS -o evidence/writings.html http://127.0.0.1:4321/writings`
   - **Expect:** HTTP 200, page title area contains `writings`.
2. Extract first post slug: a `href="/<slug>"` that is not a reserved nav path (`writings`, `talks`, `projects`, `uses`, `connect`, `about`, `contact`, `privacy`, `resources`).
   - **Expect:** at least one flat post link.
3. `curl -fsS -o evidence/writing-detail.html http://127.0.0.1:4321/<slug>`
   - **Expect:** HTTP 200, slug appears in HTML.
4. `curl -sS -o /dev/null -w '%{http_code} %{redirect_url}' --max-redirs 0 http://127.0.0.1:4321/writings/<slug>`
   - **Expect:** `308` and redirect URL ending in `/<slug>`.

Or run: `.cursor/skills/verify-msomu/scripts/drive.sh writings`

## Gotchas

- Slugs come from filenames under `src/content/writing/`; adding/removing posts changes which slug step 2 picks.
- Missing slugs 404 at `/{slug}` (not `/writings/{slug}`) with agent-friendly markdown when `Accept: text/markdown` is set (see `agent-markdown` feature).
- Dates sort server-side; the first link is newest, not alphabetical.
- Do not treat a 308 follow as a 200 on the old path. Drive with `--max-redirs 0`.

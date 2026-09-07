# Homepage

The `/` landing page introduces somu with a large hero headline, whoami prose, the three most recent writings, social profile links, and the shared header navigation.

## Sub-features

- `homepage.hero` — H1 with orange accent phrase `building ai agents`
- `homepage.whoami` — rendered whoami collection prose
- `homepage.recent-writings` — `#recent-writings` section with up to three `WritingItem` cards and “View all posts”
- `homepage.social` — `#social-links` row (@x, instagram, youtube, github, linkedin)
- `homepage.nav` — header links: home, writings, projects, uses, talks

## How to get to it (user POV)

Open the site root `/` from any inbound link or type the origin in a browser. No auth. Theme toggle is in the header (client-side; not required for smoke proof).

## Driving it with curl

1. `curl -fsS -D evidence/homepage.headers -o evidence/homepage.html http://127.0.0.1:4321/`
   - **Expect:** HTTP 200, `text/html`, body contains `building ai agents`.
2. `grep 'id="recent-writings"' evidence/homepage.html`
   - **Expect:** match (recent writings section present).
3. `grep 'href="/writings"' evidence/homepage.html`
   - **Expect:** match (nav + “View all posts”).
4. `grep 'id="social-links"' evidence/homepage.html`
   - **Expect:** match (outbound social URLs).

Or run: `.cursor/skills/verify-msomu/scripts/drive.sh homepage`

## Gotchas

- Hero copy can change; prefer `id="recent-writings"` and nav `href` paths over exact headline text when updating assertions.
- Only one dev server can own port 4321; a stale foreign process blocks `launch.sh`.
- SSR output includes analytics only when `UMAMI_*` / `CLARITY_*` env vars are set — absence is normal locally.

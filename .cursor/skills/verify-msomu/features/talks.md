# Talks

The `/talks` index lists presentations from the `talks` content collection. Slide decks are static Reveal.js HTML under `/talks/<slug>/` (excluded from the Cloudflare SSR worker; served from `public/talks/`).

## Sub-features

- `talks.index` — `/talks` prerendered listing with `TalkItem` cards
- `talks.deck.receipt` — `/talks/receipt/`
- `talks.deck.stop-building-ai-demos` — `/talks/stop-building-ai-demos/`
- `talks.deck.five-eras` — `/talks/five-eras-of-ai-assisted-android/`

## How to get to it (user POV)

Click **talks** in the header. Open a talk card’s slide link to view the Reveal.js deck in the browser.

## Driving it with curl

1. `curl -fsS -o evidence/talks.html http://127.0.0.1:4321/talks`
   - **Expect:** HTTP 200, talks listing markup.
2. For each deck path `/talks/receipt/`, `/talks/stop-building-ai-demos/`, `/talks/five-eras-of-ai-assisted-android/`:
   - `curl -fsS -o evidence/<slug>.html http://127.0.0.1:4321<path>`
   - **Expect:** HTTP 200, body mentions `reveal` (Reveal.js shell).

Or run: `.cursor/skills/verify-msomu/scripts/drive.sh talks`

## Gotchas

- `/talks/*` decks are static files; in dev they still respond 200, but routing differs from SSR pages.
- `astro.config.mjs` excludes `/talks` and `/talks/*` from the Cloudflare adapter; production relies on `public/talks/` plus `scripts/dedupe-talks-routes.mjs` after build.
- Trailing slashes matter for some deck URLs; drive script uses trailing `/` paths.

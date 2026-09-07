# Agent markdown surfaces

Agents and tools can request markdown representations of pages via `Accept: text/markdown` or `*.md` URL suffixes. `/llms.txt` documents when to use the site. Missing paths return HTTP 404 with recovery links.

## Sub-features

- `agent.homepage-md` — `GET /` with `Accept: text/markdown`
- `agent.llms-txt` — `GET /llms.txt`
- `agent.not-found` — missing slug 404 body points at `llms.txt` and sitemap
- `agent.vary` — responses include `Vary: Accept`

## How to get to it (user POV)

Not a human UI flow — HTTP clients set `Accept: text/markdown` or fetch `/about.md`, `/llms.txt`, etc. Browsers default to HTML.

## Driving it with curl

1. `curl -fsS -D evidence/homepage-md.headers -H 'Accept: text/markdown' -o evidence/homepage.md http://127.0.0.1:4321/`
   - **Expect:** HTTP 200, `Content-Type` contains `text/markdown`, body mentions somu/msomu, no `<html`.
2. `grep -qi 'vary: accept' evidence/homepage-md.headers`
   - **Expect:** match.
3. `curl -fsS -o evidence/llms.txt http://127.0.0.1:4321/llms.txt`
   - **Expect:** HTTP 200, contains `When to use this site`.

Or run: `.cursor/skills/verify-msomu/scripts/drive.sh agent-markdown`

## Gotchas

- Assets (`/images/*`), feeds (`/rss.xml`), and talk deck paths skip markdown negotiation per `shouldNegotiate()` in `src/utils/paths.ts`.
- Unsupported `Accept` values (e.g. `application/pdf`) return HTTP 406 on real pages.
- Kotlin playground MDX components become fenced `kotlin` blocks in markdown output.

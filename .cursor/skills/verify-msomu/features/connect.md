# Connect

The `/connect` page lists public profiles (X, Instagram, YouTube, GitHub, LinkedIn, WhatsApp channel) with platform icons, outbound URLs, and **Connect** buttons using `aria-label="Connect on <label>"`.

## Sub-features

- `connect.profiles` — six `connectLinks` rows from `src/data/index.ts`
- `connect.aria` — accessible Connect buttons per platform
- `connect.markdown` — same content available via `Accept: text/markdown` on `/connect`

## How to get to it (user POV)

Navigate to `/connect` directly or follow inbound links from resources/about copy. Tap **Connect** on a row to open the external profile in a new tab.

## Driving it with curl

1. `curl -fsS -o evidence/connect.html http://127.0.0.1:4321/connect`
   - **Expect:** HTTP 200, H1 `Connect`.
2. `grep 'aria-label="Connect on @x"' evidence/connect.html`
   - **Expect:** match.
3. `grep 'github.com/msomu' evidence/connect.html && grep 'whatsapp.com/channel' evidence/connect.html`
   - **Expect:** both match.

Or run: `.cursor/skills/verify-msomu/scripts/drive.sh connect`

## Gotchas

- URLs are centralized in `src/data/index.ts`; page HTML mirrors `connectLinks`.
- External links use `target="_blank"` — curl only checks href presence, not navigation.
- WhatsApp is channel-only on this page (not a direct chat deep link).

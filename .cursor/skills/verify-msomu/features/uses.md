# Uses

The `/uses` page lists the hardware and software somu uses, grouped into sections. Device entries show a personal name in orange, the product name, and a description. The data is the arrays at the top of `src/pages/uses.astro`.

## Sub-features

- `uses.sections` — section headings from Devices to Vehicles
- `uses.devices` — device rows with a personal name, product name, and description
- `uses.markdown` — `/uses.md` and `Accept: text/markdown` return a short summary from `src/utils/page-markdown.ts`, not the inventory

## How to get to it (user POV)

Click **uses** in the header.

## Driving it with curl

1. `curl -fsS -o evidence/uses.html http://127.0.0.1:4321/uses`
   - **Expect:** HTTP 200, body contains `Tools I use` and the headings `Devices`, `Development`, `Productivity`, and `Vehicles`.
2. `grep 'text-orange-500' evidence/uses.html`
   - **Expect:** match (personal names on device rows).
3. `curl -fsS -D evidence/uses-md.headers -o evidence/uses.md http://127.0.0.1:4321/uses.md`
   - **Expect:** HTTP 200, `Content-Type` contains `text/markdown`, body starts with `# Tools I use`.

Or run: `.cursor/skills/verify-msomu/scripts/drive.sh uses`

## Gotchas

- The inventory changes often, so the drive asserts sections rather than specific devices. Check an edited entry by searching the page for its new text.
- Layout changes also need the 1440 and 402 screenshots from `GUIDES/WEB_VERIFICATION.md`; curl cannot see wrapping.

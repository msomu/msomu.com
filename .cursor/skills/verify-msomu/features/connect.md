# Connect and Follow

Two terminal-style pages (JetBrains Mono, near-black, orange accent) built from `src/data/connect.ts`:

- `/connect` is the 1:1 networking card for investors and founders: "Founder & Product Builder" pitch, WhatsApp (from `WHATSAPP_NUMBER`; the card hides if it is null), Save contact (`/connect/somu.vcf`), Email (hi@msomu.com), LinkedIn, X, and a numbered track record.
- `/connect/qr` is a full-screen QR (noindex) that points to `https://www.msomu.com/connect`.
- `/follow` is for talk audiences: slides (`/talks`), YouTube, WhatsApp channel, writings + RSS, and X / LinkedIn / Instagram / GitHub.

## Sub-features

- `connect.card` - founder pitch, contact rows and track record on `/connect`
- `connect.vcard` - `/connect/somu.vcf` returns `text/vcard`
- `connect.qr` - `/connect/qr` renders the QR and "Point your camera here"
- `follow.profiles` - every `connectLinks` URL from `src/data/index.ts` appears on `/follow`
- `connect.markdown` - `/connect.md` and `/follow.md` via `Accept: text/markdown`

## Driving it with curl

1. `curl -fsS http://127.0.0.1:4321/connect | grep 'Founder &amp; Product Builder'`
2. `curl -fsS http://127.0.0.1:4321/connect/somu.vcf | grep BEGIN:VCARD`
3. `curl -fsS http://127.0.0.1:4321/follow | grep -e github.com/msomu -e whatsapp.com/channel`

Or run: `.cursor/skills/verify-msomu/scripts/drive.sh connect`

## Gotchas

- The QR path in `src/data/connect.ts` is precomputed. If the connect URL changes, regenerate it.
- `WHATSAPP_NUMBER` is digits only with country code. Setting it to null hides the WhatsApp card and drops the phone from the vCard.

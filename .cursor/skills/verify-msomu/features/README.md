# verify-msomu feature map

Baseline preconditions for every drive:

1. Dependencies installed: `bun install` at repo root.
2. Dev server running: `.cursor/skills/verify-msomu/scripts/launch.sh`.
3. Doctor green: `.cursor/skills/verify-msomu/scripts/doctor.sh`.
4. `BASE_URL` defaults to `http://127.0.0.1:4321` (match `DEV_PORT` if overridden).

## Driving conventions

- **Harness:** `curl` via `scripts/drive.sh <feature-id>` (or `capture-evidence.sh`).
- **Selectors:** prefer stable routes (`/writings`, `/connect`), element ids (`#recent-writings`), and `aria-label` attributes over visible copy that may change.
- **Proof:** drive prints `evidence: <dir>`; directory contains response bodies, headers, and `manifest.json`.
- **Skip reporting:** if the server cannot start, record the exact launch command and stderr from `.verify-state/dev-server.log` in the PR — do not claim a drive you did not run.
- **Parallelism:** only one Astro dev server per port 4321; stop with `scripts/cleanup.sh` before switching branches that require a rebuild.

## Feature index

| ID | File | User-visible behavior |
|----|------|------------------------|
| `homepage` | [homepage.md](./homepage.md) | Landing hero, intro copy, recent writings teaser, social links, top nav |
| `writings` | [writings.md](./writings.md) | Writings index, RSS link, individual MDX post pages |
| `connect` | [connect.md](./connect.md) | Public profiles with Connect buttons and outbound URLs |
| `talks` | [talks.md](./talks.md) | Talks listing plus static Reveal.js decks |
| `agent-markdown` | [agent-markdown.md](./agent-markdown.md) | `Accept: text/markdown`, `/llms.txt`, agent-friendly 404 bodies |

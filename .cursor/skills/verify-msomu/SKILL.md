---
name: verify-msomu
description: >-
  Drive msomu.com (somu nexus) — the Astro SSR personal site at https://www.msomu.com —
  through its primary web UI and HTTP agent surfaces. Use when verifying homepage, writings,
  connect, talks, or markdown/llms.txt negotiation after changes to pages, content, or routing.
---

# verify-msomu

Personal site for Somasundaram Mahesh (msomu). **Primary surface:** web UI (HTML over HTTP). **Secondary surfaces:** markdown negotiation (`Accept: text/markdown`, `*.md` paths), `/llms.txt`, RSS/sitemaps, and static Reveal.js talk decks under `/talks/*`.

**Repo root:** run all helpers from the git root; scripts resolve paths relative to this skill directory.

**Package manager:** `bun` only (never npm/yarn).

**Dev server:** Astro on `http://127.0.0.1:4321` (`bun dev --host 127.0.0.1 --port 4321`). Only one dev instance can bind to port 4321; do not launch a second copy while one is running.

## Launch

Start (or reuse) the dev server and wait until `GET /` returns HTTP 200:

```bash
.cursor/skills/verify-msomu/scripts/launch.sh
```

Optional env overrides: `BASE_URL` (default `http://127.0.0.1:4321`), `DEV_HOST`, `DEV_PORT`.

State: PID at `.cursor/skills/verify-msomu/.verify-state/dev-server.pid`, logs at `.verify-state/dev-server.log`.

If port 4321 is occupied by a process this skill did not start, launch exits with an error — stop that process or pick another `DEV_PORT`.

## Doctor

Preflight after launch (does not start the server):

```bash
.cursor/skills/verify-msomu/scripts/doctor.sh
```

Checks: `bun`, `node` ≥ 22, `curl`, `node_modules`, server responds at `BASE_URL`, homepage contains `building ai agents`, `#recent-writings`, and nav links to `/writings` and `/talks`.

## Drive

Pick a feature id from `.cursor/skills/verify-msomu/features/` and drive it with curl against the live server:

```bash
.cursor/skills/verify-msomu/scripts/drive.sh <feature-id>
```

Feature ids: `homepage`, `writings`, `connect`, `talks`, `agent-markdown`.

Each feature file documents user entry points, sub-feature ids, exact curl steps, and gotchas. Prefer route paths, element ids, and `aria-label` selectors over brittle copy matches.

## Evidence

Capture proof artifacts (headers + bodies) into a timestamped directory under `.cursor/skills/verify-msomu/evidence/`:

```bash
.cursor/skills/verify-msomu/scripts/capture-evidence.sh homepage
# equivalent to drive.sh; alias for the pstack evidence step
```

A successful drive prints `evidence: <path>` and writes `manifest.json` beside the captured files.

For UI walkthroughs, also save screenshots or recordings under `/opt/cursor/artifacts/` and reference that path in PR notes.

## Cleanup

Stop only the dev server this skill started (by saved PID — never `pkill` by name):

```bash
.cursor/skills/verify-msomu/scripts/cleanup.sh
```

Cleanup removes `.verify-state/dev-server.pid` but **does not** delete `evidence/`. After cleanup, confirm evidence still exists:

```bash
ls .cursor/skills/verify-msomu/evidence/
```

## Helpers

| Script | Purpose |
|--------|---------|
| `scripts/launch.sh` | Start or reuse Astro dev server |
| `scripts/doctor.sh` | Preflight toolchain + homepage health |
| `scripts/drive.sh` | Drive one feature id via curl |
| `scripts/capture-evidence.sh` | Alias for `drive.sh` (evidence step) |
| `scripts/cleanup.sh` | Stop tracked dev server only |

**Harness:** shell + `curl` (same HTTP assertions as `tests/http.test.ts` with `BASE_URL` set). Unit tests without a server: `bun run test`. Live HTTP suite: `BASE_URL=http://127.0.0.1:4321 bun run test:http`.

**Feature map:** `.cursor/skills/verify-msomu/features/README.md` — keep in sync when routes or selectors change. Maintenance contract: `/maintain-verification-skill`.

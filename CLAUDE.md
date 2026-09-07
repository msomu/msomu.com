# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Personal website for Somasundaram Mahesh (msomu), built with Astro 7 and deployed on Cloudflare. Content-focused site with SSR via the Cloudflare adapter. Site URL: https://www.msomu.com

## Development Commands

### Package Manager
This project uses **bun** as the package manager (not npm or yarn). Requires Node.js >=22.0.0.

### Core Commands
```bash
bun dev          # Development server (port 4321)
bun run build    # Type-check (astro check) and build for production
bun run preview  # Preview production build locally
bun run check    # Run Biome checks on ./src
bun run lint     # Lint with Biome on ./src
bun run format   # Format code with Biome (writes changes)
```

## Architecture

### Astro Configuration
- **Astro 7**, `output: "server"` (SSR), `trailingSlash: "never"`
- **Adapter**: `@astrojs/cloudflare` 14 (Workers + static assets; `wrangler.jsonc`). Talk decks are prerendered with `prerenderEnvironment: "node"` because `src/utils/talk-decks.ts` reads `public/talks/` with `node:fs`.
- **Integrations**: MDX, Sitemap. Tailwind 4 runs through `@tailwindcss/vite` (`astro.config.mjs`) with `src/styles/global.css` importing `tailwindcss` and the legacy `tailwind.config.mjs` via `@config`.

### Content Collections
Defined in `src/content.config.ts` (content layer, `glob` loaders). Entries expose `entry.id` (file name without extension) and render with `render(entry)` from `astro:content`. Article collections share the schema: `title`, `description`, `pubDate`, `updatedDate` (optional), `heroImage` (optional).

| Collection | Directory | Route | Description |
|------------|-----------|-------|-------------|
| `writing` | `src/content/writing/` | `/{id}` (flat, via `src/pages/[...slug].astro`) | Technical articles and blog posts |
| `thinkInCode` | `src/content/thinkInCode/` | `/think-in-code/{id}` | DSA content with interactive Kotlin examples |
| `whoami` | `src/content/whoami/` | (used internally) | Personal information |
| `talks` | `src/content/talks/*.json` | `/talks` listing | Talk metadata; decks live in `public/talks/` |

`src/content/motivation/` is not a collection. Legacy `/writings/{id}` URLs get a 308 to `/{id}` from `src/middleware.ts` (`src/utils/writing-routes.ts`).

Content is sorted by `pubDate` (newest first) on listing pages.

### MDX Content Conventions
- Import `EndCTA` from `@components/cta/EndCTA.astro` for call-to-action blocks at end of posts
- Import `KotlinPlayground` from `@components/misc/KotlinPlayground.astro` for interactive Kotlin code in thinkInCode posts
- Hero images go in `/public/images/` and are referenced as `/images/filename.ext` in frontmatter

### Routing Structure
- `/` — Homepage
- `/writings` — Blog posts index only; each post is served at `/{id}`
- `/{id}` — A writing (catch-all `src/pages/[...slug].astro`; unknown ids rewrite to `/404`)
- `/writings/{id}` — 308 redirect to `/{id}` (legacy links)
- `/think-in-code` — DSA content listing and detail pages
- `/uses` — Tools/hardware page
- `/talks` — Talks listing (prerendered) and reveal decks under `/talks/{slug}/` (static assets)
- `/projects` — Projects listing and detail pages
- `/projects/toongen/*` — Standalone project landing pages (privacy policy, terms of service)
- `/rss.xml` — RSS feed combining writing and thinkInCode collections

### Key Data & Constants
Site-wide constants in `src/data/index.ts`: `SITE_TITLE` ("somu nexus"), `SITE_DESCRIPTION`, `menuItems`, `socialLinks`.

### TypeScript Path Aliases
Defined in `tsconfig.json`:
```
@components/* → ./src/components/*
@contents     → ./src/contents/*
@layouts/*    → ./src/layouts/*
@pages/*      → ./src/pages/*
@styles/*     → ./src/styles/*
@utils/*      → ./src/utils/*
@data/*       → ./src/data/*
```

### Layout System
Layouts in `src/layouts/` exported via `index.ts`:
- **RootLayout** — Base wrapper for all pages (max-w-4xl container, Footer)
- **WritingLayout** — Blog post detail pages (header, date, hero image, scroll progress, prose styling)
- **ThinkInCodeLayout** — DSA detail pages (same structure as WritingLayout)
- **UsesLayout** — Tools/hardware detail pages

### Sitemap Generation
Custom programmatic sitemaps in `src/pages/`:
- `sitemap-index.xml.ts` — Main index pointing to sub-sitemaps
- `sitemap-main.xml.ts` — Static pages
- `sitemap-writings.xml.ts` — Blog posts (from writing collection)
- `sitemap-think-in-code.xml.ts` — DSA content (from thinkInCode collection)
- `sitemap-use.xml.ts` — The `/uses` page

### Styling
- **Framework**: Tailwind CSS 4 (`@tailwindcss/vite`) with typography plugin; `dark:` is a class variant (`@custom-variant dark` in `global.css`) toggled by the inline theme script in `BaseHead`
- **Theme**: Dark mode optimized with orange accent colors (#F97316)
- **Utilities** (`src/utils/index.ts`): `clsx()` for conditional class merging, `getCategoryColor()` and `getBackgroundColorClass()` for dynamic badge/CTA colors

## Environment Variables
Optional analytics (add to `.env`):
```
UMAMI_WEBSITE_ID=<your_umami_website_id>
UMAMI_TRACKING_URL=<your_umami_tracking_url>
CLARITY_TRACKING_ID=<your_clarity_tracking_id>
```

## Code Quality
- **Linter/Formatter**: Biome (config in `biome.json`, recommended rules + auto-import organization)
- **TypeScript**: Strict mode with null checks enabled

## Git Commit Guidelines
- Do NOT include "Co-Authored-By: Claude <noreply@anthropic.com>" in commit messages
- Use descriptive imperative style (e.g., "Add RSS feed link to writings section", "Fix hero image reference")

## Deployment
Cloudflare. `@astrojs/cloudflare` 14 builds a Workers bundle (`dist/server/entry.mjs` + `dist/client` assets, config in `wrangler.jsonc`) and no longer emits Pages `_routes.json`; `scripts/dedupe-talks-routes.mjs` is a no-op unless that file exists.

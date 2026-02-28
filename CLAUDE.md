# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Personal website for Somasundaram Mahesh (msomu), built with Astro and deployed on Cloudflare Pages. Content-focused site with SSR via Cloudflare adapter. Site URL: https://www.msomu.com

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
- **Output mode**: `server` (SSR enabled)
- **Adapter**: Cloudflare
- **Integrations**: MDX, Sitemap, Tailwind CSS

### Content Collections
Defined in `src/content/config.ts`. All collections share the same schema: `title`, `description`, `pubDate`, `updatedDate` (optional), `heroImage` (optional).

| Collection | Directory | Route | Description |
|------------|-----------|-------|-------------|
| `writing` | `src/content/writing/` | `/writings/[slug]` | Technical articles and blog posts |
| `thinkInCode` | `src/content/thinkInCode/` | `/think-in-code/[slug]` | DSA content with interactive Kotlin examples |
| `whoami` | `src/content/whoami/` | (used internally) | Personal information |
| `motivation` | `src/content/motivation/` | (used internally) | Motivational content |
| `use` | (no directory yet) | `/uses/[slug]` | Tools and hardware — defined in config but no content |

Content is sorted by `pubDate` (newest first) on listing pages.

### MDX Content Conventions
- Import `EndCTA` from `@components/cta/EndCTA.astro` for call-to-action blocks at end of posts
- Import `KotlinPlayground` from `@components/misc/KotlinPlayground.astro` for interactive Kotlin code in thinkInCode posts
- Hero images go in `/public/images/` and are referenced as `/images/filename.ext` in frontmatter

### Routing Structure
- `/` — Homepage
- `/writings` — Blog posts listing and detail pages
- `/think-in-code` — DSA content listing and detail pages
- `/uses` — Tools/hardware listing and detail pages
- `/projects` — Projects listing and detail pages
- `/projects/toongen/*` — Standalone project landing pages (privacy policy, terms of service)
- `/rss.xml` — RSS feed combining writing, use, and thinkInCode collections

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
- `sitemap-use.xml.ts` — Uses pages (from use collection)

### Styling
- **Framework**: Tailwind CSS with typography plugin
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
Hosted on Cloudflare Pages with automatic deployments from the main branch.

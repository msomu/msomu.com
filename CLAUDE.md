# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Personal website for Somasundaram Mahesh (msomu), built with Astro and deployed on Cloudflare Pages. This is a content-focused site showcasing Android development expertise, technical writing, and thought leadership. The site uses server-side rendering (SSR) with Cloudflare adapter.

## Development Commands

### Package Manager
This project uses **bun** as the package manager (not npm or yarn).

### Core Commands
```bash
# Development server (port 4321 by default)
bun dev

# Type-check and build for production
bun run build

# Preview production build locally
bun run preview

# Code quality checks
bun run check    # Run Biome checks
bun run lint     # Lint with Biome
bun run format   # Format code with Biome
```

## Architecture

### Astro Configuration
- **Output mode**: `server` (SSR enabled)
- **Adapter**: Cloudflare
- **Site URL**: https://www.msomu.com
- **Integrations**: MDX, Sitemap, Tailwind CSS

### Content Collections
The site uses Astro's content collections for type-safe content management:
- **writing**: Technical articles and blog posts
- **thinkInCode**: Data structures and algorithms content (includes Kotlin code examples)
- **use**: Tools and hardware used
- **whoami**: Personal information

All collections share the same schema with `title`, `description`, `pubDate`, `updatedDate` (optional), and `heroImage` (optional).

### Routing Structure
- `/` - Homepage
- `/writings` - Blog posts listing and detail pages (`/writings/[slug]`)
- `/think-in-code` - DSA content listing and detail pages (`/think-in-code/[slug]`)
- `/uses` - Tools/hardware listing and detail pages (`/uses/[slug]`)
- `/apps/toongen/*` - Standalone app landing pages (privacy policy, terms of service)

### TypeScript Path Aliases
The project uses path aliases defined in `tsconfig.json`:
```typescript
@components/* → ./src/components/*
@contents → ./src/contents/*
@layouts/* → ./src/layouts/*
@pages/* → ./src/pages/*
@styles/* → ./src/styles/*
@utils/* → ./src/utils/*
@data/* → ./src/data/*
```

### Component Organization
- `src/components/cards/` - Card components for content items (writing, thoughts, ships, uses)
- `src/components/cta/` - Call-to-action components
- `src/components/misc/` - Utility components (headers, dates, scroll progress, Kotlin playground)
- `src/components/seo/` - SEO and meta tag components
- `src/layouts/` - Page layout templates for different content types

### Kotlin Playground Integration
The site includes interactive Kotlin code execution using the `kotlin-playground` package. Use the `kotlin-playground` component for embedding runnable Kotlin code examples in MDX content.

### Sitemap Generation
The site generates multiple sitemaps programmatically:
- `sitemap-index.xml` - Main sitemap index
- `sitemap-main.xml` - Static pages
- `sitemap-writings.xml` - Blog posts
- `sitemap-think-in-code.xml` - DSA content
- `sitemap-use.xml` - Uses pages

### Styling
- **Framework**: Tailwind CSS with typography plugin
- **Theme**: Dark mode optimized with custom prose styling
- **Utilities**: Custom `clsx()` for conditional class merging and color utilities for category badges

## Environment Variables
Optional analytics configuration (add to `.env`):
```plaintext
UMAMI_WEBSITE_ID=<your_umami_website_id>
UMAMI_TRACKING_URL=<your_umami_tracking_url>
CLARITY_TRACKING_ID=<your_clarity_tracking_id>
```

## Code Quality
- **Linter/Formatter**: Biome (replaces ESLint + Prettier)
- **Config**: `biome.json` with recommended rules and auto-import organization
- **TypeScript**: Strict mode with null checks enabled

## Git Commit Guidelines
- Do NOT include "Co-Authored-By: Claude <noreply@anthropic.com>" in commit messages
- Follow the existing commit message style (see git log for examples)

## Deployment
Hosted on Cloudflare Pages with automatic deployments. The Cloudflare adapter enables SSR capabilities.
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	site: "https://www.msomu.com",
	trailingSlash: "never",
	vite: {
		plugins: [tailwindcss()],
	},
	// Sitemaps are hand-built in src/pages/sitemap-*.xml.ts. @astrojs/sitemap is
	// not used: its static sitemap-index.xml would shadow the custom route.
	integrations: [mdx()],
	output: "server",
	adapter: cloudflare({
		// Talk decks are prerendered from public/talks/**/index.html via node:fs
		// (src/utils/talk-decks.ts). workerd has no fs, so prerender in Node.
		// At runtime Workers static assets serve /talks/* before the worker, so
		// the old Pages `routes.exclude` (v9 adapter) is no longer needed;
		// scripts/dedupe-talks-routes.mjs stays a no-op unless _routes.json exists.
		prerenderEnvironment: "node",
	}),
});

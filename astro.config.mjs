import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: "https://www.msomu.com",
	integrations: [
		mdx(),
		sitemap({
			changefreq: "weekly",
			priority: 0.7,
			lastmod: new Date().toISOString().split("T")[0],
		}),
		tailwind(),
	],
	output: "server",
	adapter: cloudflare({
		// Decks stay on disk. Do not also exclude "/talks/" — Cloudflare
		// Pages error 8000057 rejects it as overlapping "/talks/*".
		// scripts/dedupe-talks-routes.mjs strips the auto-added twin.
		routes: {
			exclude: ["/talks", "/talks/*"],
		},
	}),
});

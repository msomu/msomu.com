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
	adapter: cloudflare(),
});

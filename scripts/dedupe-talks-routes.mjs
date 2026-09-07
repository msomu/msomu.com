import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// Cloudflare Pages error 8000057: "/talks/" overlaps "/talks/*".
// Astro prerender of the listing auto-adds "/talks/". Keep "/talks" (exact)
// plus "/talks/*" (decks) and drop the trailing-slash twin.
//
// @astrojs/cloudflare 14 targets Workers with static assets and no longer
// writes dist/_routes.json (assets are served before the worker, so decks in
// public/talks/ never reach SSR). When the file is absent this is a no-op so
// the build keeps working on either target.
export function dedupeTalksExclude(exclude) {
	const rest = exclude.filter(
		(rule) => rule !== "/talks/" && rule !== "/talks" && rule !== "/talks/*",
	);
	const next = [];
	const seen = new Set();
	for (const rule of ["/talks", "/talks/*", ...rest]) {
		if (seen.has(rule)) continue;
		seen.add(rule);
		next.push(rule);
	}
	return next;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	const routesPath = "dist/_routes.json";
	if (!existsSync(routesPath)) {
		console.log(
			"dedupe-talks-routes: no dist/_routes.json (Workers build); nothing to do.",
		);
	} else {
		const routes = JSON.parse(readFileSync(routesPath, "utf8"));
		routes.exclude = dedupeTalksExclude(routes.exclude ?? []);
		writeFileSync(routesPath, `${JSON.stringify(routes, null, 2)}\n`);
	}
}

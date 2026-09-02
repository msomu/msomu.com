import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// Cloudflare Pages error 8000057: "/talks/" overlaps "/talks/*".
// Astro prerender of the listing auto-adds "/talks/". Keep "/talks" (exact)
// plus "/talks/*" (decks) and drop the trailing-slash twin.
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
	const routes = JSON.parse(readFileSync(routesPath, "utf8"));
	routes.exclude = dedupeTalksExclude(routes.exclude ?? []);
	writeFileSync(routesPath, `${JSON.stringify(routes, null, 2)}\n`);
}

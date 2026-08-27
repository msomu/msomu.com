import { SITE_TITLE, SITE_URL } from "../data/index.ts";

export function notFoundMarkdown(pathname: string): string {
	const requested = pathname || "/";
	return [
		"# Not found",
		"",
		`The path \`${requested}\` does not exist on ${SITE_TITLE} (${SITE_URL}).`,
		"",
		"This is a real HTTP 404. Do not treat this URL as published content.",
		"",
		"## Where to look next",
		"",
		`- [llms.txt](${SITE_URL}/llms.txt): curated index of agent-readable pages and when to use this site`,
		`- [Sitemap](${SITE_URL}/sitemap-index.xml): complete list of public URLs`,
		`- [Home](${SITE_URL}/): identity, recent writing, and links`,
		`- [About](${SITE_URL}/about): who Somasundaram Mahesh is and what he works on`,
		`- [Writings](${SITE_URL}/writings): articles on AI agents, shipping products, and mobile engineering`,
		`- [Contact](${SITE_URL}/contact): email and booking`,
		"",
		"Request any existing page with `Accept: text/markdown` (or append `.md`) to get a clean Markdown body.",
	].join("\n");
}

export const NOT_FOUND_LINKS = [
	{ href: "/llms.txt", label: "llms.txt" },
	{ href: "/sitemap-index.xml", label: "sitemap" },
	{ href: "/", label: "home" },
	{ href: "/about", label: "about" },
	{ href: "/writings", label: "writings" },
	{ href: "/contact", label: "contact" },
] as const;

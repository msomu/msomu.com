import { SITE_URL } from "../data/index.ts";

const SKIP_EXTENSIONS = new Set([
	".png",
	".jpg",
	".jpeg",
	".webp",
	".gif",
	".svg",
	".ico",
	".css",
	".js",
	".mjs",
	".woff",
	".woff2",
	".ttf",
	".txt",
	".xml",
	".json",
	".map",
	".webmanifest",
]);

const SKIP_PREFIXES = [
	"/_astro/",
	"/images/",
	"/favicon",
	"/apple-icon",
	"/android-icon",
	"/ms-icon",
];

export interface NormalizedPath {
	path: string;
	forceMarkdown: boolean;
}

function decodePathname(pathname: string): string {
	try {
		return decodeURIComponent(pathname);
	} catch {
		return pathname;
	}
}

export function normalizeContentPath(pathname: string): NormalizedPath {
	let path = decodePathname(pathname);
	const queryIndex = path.indexOf("?");
	if (queryIndex >= 0) path = path.slice(0, queryIndex);
	path = path.replace(/\/+$/, "") || "/";

	let forceMarkdown = false;
	if (path.endsWith(".md")) {
		forceMarkdown = true;
		path = path.slice(0, -3);
		if (path.endsWith(".html")) path = path.slice(0, -5);
		if (path === "/index" || path === "") path = "/";
	}

	return { path, forceMarkdown };
}

function sameOriginPathname(path: string, site: string): string | null {
	try {
		const resolved = new URL(path, site);
		if (resolved.origin !== new URL(site).origin) return null;
		return resolved.pathname.replace(/\/+$/, "") || "/";
	} catch {
		return null;
	}
}

function checkedRequestedPath(raw: string, site: string): string | null {
	const { path } = normalizeContentPath(raw.trim());
	const first = sameOriginPathname(path, site);
	if (first == null) return null;
	return sameOriginPathname(first, site);
}

export function safeRequestedPath(
	from: string | null | undefined,
	fallback = "/404",
	site = SITE_URL,
): string {
	if (from != null && from !== "") {
		const kept = checkedRequestedPath(from, site);
		if (kept != null) return kept;
	}
	return checkedRequestedPath(fallback, site) ?? "/404";
}

export function markdownAlternatePath(pathname: string): string {
	const { path } = normalizeContentPath(pathname);
	if (path === "/") return "/index.md";
	return `${path}.md`;
}

export function shouldNegotiate(pathname: string): boolean {
	const { path, forceMarkdown } = normalizeContentPath(pathname);
	if (forceMarkdown) return true;
	if (
		SKIP_PREFIXES.some(
			(prefix) => path.startsWith(prefix) || pathname.startsWith(prefix),
		)
	) {
		return false;
	}
	const dot = path.lastIndexOf(".");
	if (dot > path.lastIndexOf("/")) {
		const ext = path.slice(dot).toLowerCase();
		if (SKIP_EXTENSIONS.has(ext)) return false;
	}
	return true;
}

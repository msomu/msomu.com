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

export function normalizeContentPath(pathname: string): NormalizedPath {
	let path = decodeURIComponent(pathname);
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

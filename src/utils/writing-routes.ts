// Writings live at /{id}. /writings is the index only; /writings/{id} is a
// legacy URL that redirects to the flat path so old links keep working.

export const WRITING_REDIRECT_STATUS = 308;

const LEGACY_WRITING = /^\/writings\/([^/]+?)\/?$/;

export function writingPath(id: string): string {
	return `/${id}`;
}

export function writingMarkdownPath(id: string): string {
	return `${writingPath(id)}.md`;
}

// Returns the flat path for a legacy /writings/{id} URL, or null when the
// pathname is not a legacy post URL. Keeps a trailing .md so agents that
// asked for markdown at the old path land on markdown at the new one.
export function legacyWritingRedirect(pathname: string): string | null {
	const match = pathname.match(LEGACY_WRITING);
	if (!match) return null;
	const rest = match[1];
	if (rest === "index.html") return null;
	return `/${rest}`;
}

export const VARY_ACCEPT = "Accept, Accept-Encoding";

export function applyVaryAccept(headers: Headers): void {
	headers.set("Vary", VARY_ACCEPT);
}

export function markdownHeaders(): Headers {
	const headers = new Headers();
	headers.set("Content-Type", "text/markdown; charset=utf-8");
	applyVaryAccept(headers);
	return headers;
}

export function notAcceptableBody(requested: string): string {
	return [
		"This resource is available in:",
		"- text/html",
		"- text/markdown",
		"",
		`You requested: ${requested}`,
	].join("\n");
}

export function notAcceptableResponse(requested: string): Response {
	return new Response(notAcceptableBody(requested), {
		status: 406,
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
			Vary: VARY_ACCEPT,
			"Cache-Control": "no-store",
		},
	});
}

export function markdownResponse(body: string, status = 200): Response {
	return new Response(body, {
		status,
		headers: markdownHeaders(),
	});
}

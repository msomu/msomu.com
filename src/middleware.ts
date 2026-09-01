import { defineMiddleware } from "astro:middleware";
import { MARKDOWN_TYPE, negotiateAccept } from "./utils/accept.ts";
import { resolvePageMarkdown } from "./utils/page-markdown.ts";
import {
	markdownAlternatePath,
	normalizeContentPath,
	shouldNegotiate,
} from "./utils/paths.ts";
import {
	applyVaryAccept,
	markdownResponse,
	notAcceptableResponse,
} from "./utils/vary.ts";

function describedByLink(pathname: string): string {
	const alternate = markdownAlternatePath(pathname);
	return `<${alternate}>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"`;
}

export const onRequest = defineMiddleware(async (context, next) => {
	const pathname = context.url.pathname;
	const rewrittenFrom =
		pathname === "/404" ? context.url.searchParams.get("from") : null;
	if (rewrittenFrom) {
		context.locals.requestedPath = normalizeContentPath(rewrittenFrom).path;
	} else if (!context.locals.requestedPath) {
		context.locals.requestedPath = normalizeContentPath(pathname).path;
	}
	if (!shouldNegotiate(pathname)) {
		return next();
	}

	const { path, forceMarkdown } = normalizeContentPath(pathname);
	const accept = context.request.headers.get("accept");
	const negotiated = forceMarkdown
		? { kind: "type" as const, type: MARKDOWN_TYPE }
		: negotiateAccept(accept);

	if (negotiated.kind === "not_acceptable") {
		const page = await resolvePageMarkdown(path);
		if (!page.exists) {
			return markdownResponse(page.body, 404);
		}
		return notAcceptableResponse(negotiated.requested);
	}

	if (negotiated.type === MARKDOWN_TYPE) {
		const page = await resolvePageMarkdown(path);
		const response = markdownResponse(page.body, page.exists ? 200 : 404);
		response.headers.set("Link", describedByLink(path));
		return response;
	}

	const response = await next();
	const headers = new Headers(response.headers);
	applyVaryAccept(headers);
	if (!headers.has("Link")) {
		headers.set("Link", describedByLink(path));
	}
	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers,
	});
});

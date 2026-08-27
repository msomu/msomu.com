import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { buildLlmsTxt } from "../utils/llms-txt.ts";

export const GET: APIRoute = async () => {
	const [writings, talks] = await Promise.all([
		getCollection("writing"),
		getCollection("talks"),
	]);

	const body = buildLlmsTxt({
		writings: writings
			.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
			.map((writing) => ({
				title: writing.data.title,
				slug: writing.slug,
				description: writing.data.description,
			})),
		talks: talks
			.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
			.map((talk) => ({
				title: talk.data.title,
				description: talk.data.description,
			})),
	});

	return new Response(body, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=300",
		},
	});
};

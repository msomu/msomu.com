import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { buildLlmsTxt } from "../utils/llms-txt.ts";

const headers = {
	"Content-Type": "text/markdown; charset=utf-8",
	"Cache-Control": "public, max-age=300",
};

async function llmsBody(): Promise<string> {
	const [writings, talks] = await Promise.all([
		getCollection("writing"),
		getCollection("talks"),
	]);

	return buildLlmsTxt({
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
}

export const GET: APIRoute = async () => {
	return new Response(await llmsBody(), { headers });
};

export const HEAD: APIRoute = async () => {
	return new Response(null, { headers });
};

// Worker entry: the Astro handler for every page, plus the live talk room
// (/api/live/{slug}/ws and /api/live/{slug}/notes) that lets a presenter's
// phone show speaker notes in sync with the deck.
import { handle } from "@astrojs/cloudflare/handler";
import { isPresenter, liveTalks } from "./live/talks.ts";

export { LiveRoom } from "./live/room.ts";

interface LiveEnv {
	LIVE: DurableObjectNamespace;
}

const LIVE_PATH = /^\/api\/live\/([a-z0-9-]+)\/(ws|notes)$/;

async function live(
	request: Request,
	env: LiveEnv,
	slug: string,
	action: string,
): Promise<Response> {
	const talk = liveTalks[slug];
	if (!talk) return new Response("Not found", { status: 404 });
	const noStore = { "cache-control": "no-store" };

	if (action === "notes") {
		const key = request.headers.get("x-presenter-key");
		if (!(await isPresenter(talk, key))) {
			return new Response("Unauthorized", { status: 401, headers: noStore });
		}
		return Response.json(talk.notes, { headers: noStore });
	}

	const url = new URL(request.url);
	url.searchParams.set("talk", slug);
	const room = env.LIVE.get(env.LIVE.idFromName(slug));
	return room.fetch(new Request(url.toString(), request));
}

export default {
	async fetch(
		request: Request,
		env: Parameters<typeof handle>[1] & LiveEnv,
		ctx: Parameters<typeof handle>[2],
	) {
		const match = LIVE_PATH.exec(new URL(request.url).pathname);
		if (match) return live(request, env, match[1], match[2]);
		return handle(request, env, ctx);
	},
};

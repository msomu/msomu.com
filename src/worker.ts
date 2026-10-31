// Worker entry: the Astro handler for every page, plus the live talk room
// (/api/live/{slug}/ws and /api/live/{slug}/notes) that lets a presenter's
// phone show speaker notes in sync with the deck. Rooms are keyed by a
// random pairing code the deck shows as a QR, so only the phone that scanned
// a laptop's QR can drive that laptop.
import { handle } from "@astrojs/cloudflare/handler";
import { PAIRING_CODE, liveTalks } from "./live/talks.ts";

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
		return Response.json(talk.notes, { headers: noStore });
	}

	// One room per pairing code: the laptop makes the code, the phone scans it.
	const url = new URL(request.url);
	const code = url.searchParams.get("room") ?? "";
	if (!PAIRING_CODE.test(code)) {
		return new Response("Missing pairing code", {
			status: 400,
			headers: noStore,
		});
	}
	url.searchParams.set("talk", slug);
	const room = env.LIVE.get(env.LIVE.idFromName(`${slug}:${code}`));
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

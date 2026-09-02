import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dedupeTalksExclude } from "../scripts/dedupe-talks-routes.mjs";

describe("Cloudflare _routes.json talks excludes", () => {
	it("drops /talks/ so it cannot overlap /talks/*", () => {
		const exclude = dedupeTalksExclude([
			"/talks/",
			"/talks/*",
			"/favicon.ico",
		]);
		assert.deepEqual(exclude, ["/talks", "/talks/*", "/favicon.ico"]);
		assert.ok(!exclude.includes("/talks/"));
	});

	it("is idempotent when already clean", () => {
		const clean = ["/talks", "/talks/*", "/favicon.ico"];
		assert.deepEqual(dedupeTalksExclude(clean), clean);
	});
});

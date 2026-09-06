import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { connectLinks } from "../src/data/index.ts";
import { connectPageMarkdown } from "../src/utils/connect-page.ts";

describe("connect page", () => {
	it("includes social profiles and WhatsApp channel", () => {
		const labels = connectLinks.map((link) => link.label);
		assert.deepEqual(labels, [
			"@x",
			"instagram",
			"youtube",
			"github",
			"linkedin",
			"whatsapp channel",
		]);
	});

	it("renders markdown with every public URL", () => {
		const body = connectPageMarkdown();
		assert.match(body, /^# Connect\n/);
		assert.match(body, /Founding AI Engineer at AGI Inc/);
		for (const link of connectLinks) {
			assert.match(body, new RegExp(link.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
		}
	});
});

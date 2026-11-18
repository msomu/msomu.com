import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { products, trackRecord, vcard } from "../src/data/connect.ts";
import { connectLinks } from "../src/data/index.ts";
import {
	connectPageMarkdown,
	followPageMarkdown,
} from "../src/utils/connect-page.ts";

const escapeRegex = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

describe("connect page", () => {
	it("pitches a founder and lists direct contact routes", () => {
		const body = connectPageMarkdown();
		assert.match(body, /^# Connect\n/);
		assert.match(body, /Founder & Product Builder/);
		assert.match(body, /hi@msomu\.com/);
		assert.match(body, /\/connect\/somu\.vcf/);
		assert.match(body, /\/follow\.md/);
		for (const item of trackRecord) {
			assert.match(body, new RegExp(escapeRegex(item.text)));
		}
		assert.match(body, /## More/);
		for (const product of products) {
			assert.match(body, new RegExp(escapeRegex(product.url)));
		}
	});

	it("serves a valid vCard", () => {
		const card = vcard();
		assert.match(card, /^BEGIN:VCARD\r\n/);
		assert.match(card, /FN:Somasundaram Mahesh/);
		assert.match(card, /EMAIL;TYPE=INTERNET:hi@msomu\.com/);
		assert.match(card, /END:VCARD\r\n$/);
	});

	it("keeps track record highlights inside their text", () => {
		for (const item of trackRecord) {
			assert.ok(item.text.includes(item.highlight), item.text);
		}
	});
});

describe("follow page", () => {
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
		const body = followPageMarkdown();
		assert.match(body, /^# Follow\n/);
		assert.match(body, /\/talks/);
		for (const link of connectLinks) {
			assert.match(body, new RegExp(escapeRegex(link.url)));
		}
	});
});

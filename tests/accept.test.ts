import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	HTML_TYPE,
	MARKDOWN_TYPE,
	negotiateAccept,
	prefersMarkdown,
} from "../src/utils/accept.ts";

const mdHtml = [MARKDOWN_TYPE, HTML_TYPE] as const;

describe("negotiateAccept", () => {
	it("serves markdown for Accept: text/markdown", () => {
		const result = negotiateAccept("text/markdown", mdHtml);
		assert.deepEqual(result, { kind: "type", type: MARKDOWN_TYPE });
	});

	it("honors q-values when markdown is preferred", () => {
		const result = negotiateAccept("text/markdown, text/html;q=0.8", mdHtml);
		assert.deepEqual(result, { kind: "type", type: MARKDOWN_TYPE });
	});

	it("serves html for Accept: text/html", () => {
		const result = negotiateAccept("text/html", mdHtml);
		assert.deepEqual(result, { kind: "type", type: HTML_TYPE });
	});

	it("respects q=0 on markdown when html remains", () => {
		const result = negotiateAccept("text/markdown;q=0, text/html", mdHtml);
		assert.deepEqual(result, { kind: "type", type: HTML_TYPE });
	});

	it("returns 406 when the only produced type is rejected", () => {
		const result = negotiateAccept("text/markdown;q=0", [MARKDOWN_TYPE]);
		assert.equal(result.kind, "not_acceptable");
	});

	it("returns 406 for an unsupported exclusive type", () => {
		const result = negotiateAccept("application/pdf", mdHtml);
		assert.equal(result.kind, "not_acceptable");
		if (result.kind === "not_acceptable") {
			assert.match(result.requested, /application\/pdf/);
		}
	});

	it("serves the default when Accept is missing", () => {
		const result = negotiateAccept(null, mdHtml);
		assert.deepEqual(result, { kind: "type", type: HTML_TYPE });
	});

	it("serves the default for */*", () => {
		const result = negotiateAccept("*/*", mdHtml);
		assert.deepEqual(result, { kind: "type", type: HTML_TYPE });
	});

	it("does not treat a Chrome Accept header as markdown", () => {
		const chrome =
			"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8";
		const result = negotiateAccept(chrome, mdHtml);
		assert.deepEqual(result, { kind: "type", type: HTML_TYPE });
		assert.equal(prefersMarkdown(chrome), false);
	});

	it("breaks ties by specificity so text/markdown beats text/*", () => {
		const result = negotiateAccept("text/*, text/markdown", mdHtml);
		assert.deepEqual(result, { kind: "type", type: MARKDOWN_TYPE });
	});
});

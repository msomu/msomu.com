import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	WRITING_REDIRECT_STATUS,
	legacyWritingRedirect,
	writingMarkdownPath,
	writingPath,
} from "../src/utils/writing-routes.ts";

describe("flat writing URLs", () => {
	it("serves a writing at /{id}", () => {
		assert.equal(
			writingPath("claude-code-changed-everything"),
			"/claude-code-changed-everything",
		);
		assert.equal(
			writingMarkdownPath("claude-code-changed-everything"),
			"/claude-code-changed-everything.md",
		);
	});

	it("redirects legacy /writings/{id} to /{id} permanently", () => {
		assert.equal(WRITING_REDIRECT_STATUS, 308);
		assert.equal(
			legacyWritingRedirect("/writings/arc-was-good"),
			"/arc-was-good",
		);
		assert.equal(
			legacyWritingRedirect("/writings/arc-was-good/"),
			"/arc-was-good",
		);
		assert.equal(
			legacyWritingRedirect("/writings/arc-was-good.md"),
			"/arc-was-good.md",
		);
	});

	it("leaves the index and non-writing paths alone", () => {
		assert.equal(legacyWritingRedirect("/writings"), null);
		assert.equal(legacyWritingRedirect("/writings/"), null);
		assert.equal(legacyWritingRedirect("/writings/index.html"), null);
		assert.equal(legacyWritingRedirect("/writings/a/b"), null);
		assert.equal(legacyWritingRedirect("/think-in-code/two-sum"), null);
		assert.equal(legacyWritingRedirect("/about"), null);
	});
});

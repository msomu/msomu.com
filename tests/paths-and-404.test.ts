import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { notFoundMarkdown } from "../src/utils/not-found.ts";
import {
	markdownAlternatePath,
	normalizeContentPath,
	shouldNegotiate,
} from "../src/utils/paths.ts";
import { notAcceptableBody } from "../src/utils/vary.ts";

describe("path normalization", () => {
	it("maps /index.md to /", () => {
		assert.deepEqual(normalizeContentPath("/index.md"), {
			path: "/",
			forceMarkdown: true,
		});
	});

	it("strips .md and .html.md suffixes", () => {
		assert.deepEqual(normalizeContentPath("/about.md"), {
			path: "/about",
			forceMarkdown: true,
		});
		assert.deepEqual(normalizeContentPath("/writings/foo.html.md"), {
			path: "/writings/foo",
			forceMarkdown: true,
		});
	});

	it("builds homepage alternate as /index.md", () => {
		assert.equal(markdownAlternatePath("/"), "/index.md");
		assert.equal(markdownAlternatePath("/about"), "/about.md");
	});

	it("skips assets, feeds, and robots from negotiation", () => {
		assert.equal(shouldNegotiate("/images/ogimage.png"), false);
		assert.equal(shouldNegotiate("/rss.xml"), false);
		assert.equal(shouldNegotiate("/robots.txt"), false);
		assert.equal(shouldNegotiate("/llms.txt"), false);
		assert.equal(shouldNegotiate("/about"), true);
		assert.equal(shouldNegotiate("/missing-page"), true);
	});
});

describe("agent 404 body", () => {
	it("is markdown that points at recovery URLs", () => {
		const body = notFoundMarkdown("/some-path-that-does-not-exist");
		assert.match(body, /^# Not found/m);
		assert.match(body, /some-path-that-does-not-exist/);
		assert.match(body, /llms\.txt/);
		assert.match(body, /sitemap-index\.xml/);
		assert.match(body, /https:\/\/www\.msomu\.com\/about/);
		assert.ok(body.length > 200);
	});
});

describe("406 body", () => {
	it("lists available representations", () => {
		const body = notAcceptableBody("application/pdf");
		assert.match(body, /text\/html/);
		assert.match(body, /text\/markdown/);
		assert.match(body, /application\/pdf/);
	});
});

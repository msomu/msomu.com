import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { stripMdxNoise } from "../src/utils/mdx-body.ts";
import { notFoundMarkdown, notFoundPage } from "../src/utils/not-found.ts";
import {
	markdownAlternatePath,
	normalizeContentPath,
	safeRequestedPath,
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

	it("keeps only same-origin rewrite from= values", () => {
		assert.equal(safeRequestedPath("/writings/missing"), "/writings/missing");
		assert.equal(safeRequestedPath("/about.md"), "/about");
		assert.equal(safeRequestedPath("https://evil.example"), "/404");
		assert.equal(safeRequestedPath("//evil.example"), "/404");
		assert.equal(safeRequestedPath("http://["), "/404");
		assert.equal(safeRequestedPath("  https://evil.example"), "/404");
		assert.equal(safeRequestedPath("/%5Cevil.example"), "/404");
		assert.equal(safeRequestedPath("/\\evil.example"), "/404");
		assert.equal(safeRequestedPath("/\t//evil.example"), "/404");
		assert.equal(safeRequestedPath("/\n//evil.example"), "/404");
		assert.equal(
			safeRequestedPath("https://www.msomu.com//evil.example"),
			"/404",
		);
		assert.equal(safeRequestedPath("//www.msomu.com//evil.example"), "/404");
		assert.equal(
			safeRequestedPath("https://www.msomu.com/%5Cevil.example"),
			"/404",
		);
		assert.equal(
			safeRequestedPath("https://evil.example", "/writings/x"),
			"/writings/x",
		);
		assert.equal(safeRequestedPath(null, "/writings/x"), "/writings/x");
		assert.equal(safeRequestedPath(null, "//evil.example"), "/404");
		assert.equal(safeRequestedPath("", "//evil.example"), "/404");
		assert.equal(safeRequestedPath("//evil.example", "//evil.example"), "/404");
	});

	it("does not throw on invalid percent-encoding", () => {
		assert.deepEqual(normalizeContentPath("/%"), {
			path: "/%",
			forceMarkdown: false,
		});
		assert.deepEqual(normalizeContentPath("/%E0%A4%A.md"), {
			path: "/%E0%A4%A",
			forceMarkdown: true,
		});
		assert.equal(shouldNegotiate("/%"), true);
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

describe("not-found markdown status", () => {
	it("marks /404 as missing so markdown does not report success", () => {
		const page = notFoundPage("/404");
		assert.equal(page.exists, false);
		assert.match(page.body, /`\/404`/);
		assert.match(page.body, /real HTTP 404/);
	});
});

describe("think-in-code markdown", () => {
	it("keeps KotlinPlayground samples as kotlin fences", () => {
		const body = stripMdxNoise(`import KotlinPlayground from '@components/misc/kotlin-playground.astro';

# Two sum

<KotlinPlayground hideMain={true} code={\`
fun twoSum(nums: IntArray, target: Int): IntArray {
    return intArrayOf()
}
\`} />

<KotlinPlaygroundScript />
`);
		assert.match(body, /```kotlin/);
		assert.match(body, /fun twoSum/);
		assert.doesNotMatch(body, /KotlinPlayground/);
		assert.doesNotMatch(body, /^import /m);
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

import assert from "node:assert/strict";
import { describe, it } from "node:test";

const BASE_URL = process.env.BASE_URL;

async function request(
	path: string,
	headers: Record<string, string> = {},
): Promise<{
	status: number;
	contentType: string;
	vary: string;
	body: string;
	raw: Headers;
}> {
	if (!BASE_URL) {
		throw new Error("BASE_URL is required");
	}
	const response = await fetch(new URL(path, BASE_URL), { headers });
	return {
		status: response.status,
		contentType: response.headers.get("content-type") ?? "",
		vary: response.headers.get("vary") ?? "",
		body: await response.text(),
		raw: response.headers,
	};
}

function requireBase(t: { skip: (msg?: string) => void }): boolean {
	if (!BASE_URL) {
		t.skip("Set BASE_URL to run HTTP checks against a live server");
		return false;
	}
	return true;
}

describe("public agent endpoints", () => {
	it("returns HTTP 404 with a markdown recovery body for missing paths", async (t) => {
		if (!requireBase(t)) return;
		const missing = "/some-path-that-does-not-exist";
		const html = await request(missing);
		assert.equal(html.status, 404);
		assert.match(html.body, /llms\.txt/);
		assert.match(html.body, /sitemap-index\.xml/);

		const markdown = await request(missing, { Accept: "text/markdown" });
		assert.equal(markdown.status, 404);
		assert.match(markdown.contentType, /text\/markdown/);
		assert.match(markdown.vary, /accept/i);
		assert.match(markdown.body, /^# Not found/m);
		assert.match(markdown.body, /llms\.txt/);
	});

	it("negotiates markdown and sets Vary: Accept", async (t) => {
		if (!requireBase(t)) return;
		const html = await request("/", { Accept: "text/html" });
		assert.equal(html.status, 200);
		assert.match(html.contentType, /text\/html/);
		assert.match(html.vary, /accept/i);

		const markdown = await request("/", { Accept: "text/markdown" });
		assert.equal(markdown.status, 200);
		assert.match(markdown.contentType, /text\/markdown/);
		assert.match(markdown.vary, /accept/i);
		assert.match(markdown.body, /Somasundaram|somu|msomu/i);
		assert.doesNotMatch(markdown.body, /<html/i);

		const dotted = await request("/index.md");
		assert.equal(dotted.status, 200);
		assert.match(dotted.contentType, /text\/markdown/);
	});

	it("returns 406 for unsupported exclusive Accept values on real pages", async (t) => {
		if (!requireBase(t)) return;
		const response = await request("/about", { Accept: "application/pdf" });
		assert.equal(response.status, 406);
		assert.match(response.body, /text\/markdown/);
		assert.match(response.vary, /accept/i);
	});

	it("embeds Person and Organization JSON-LD on the homepage", async (t) => {
		if (!requireBase(t)) return;
		const home = await request("/");
		assert.equal(home.status, 200);
		assert.match(home.body, /application\/ld\+json/);
		assert.match(home.body, /"@type":"Person"/);
		assert.match(home.body, /"@type":"Organization"/);
		assert.match(home.body, /"@type":"ContactPoint"/);
		assert.match(home.body, /"@type":"PostalAddress"/);
		assert.match(home.body, /msomasundaram93@gmail\.com/);
	});

	it("serves llms.txt with when-to-use guidance", async (t) => {
		if (!requireBase(t)) return;
		const file = await request("/llms.txt");
		assert.equal(file.status, 200);
		assert.match(file.contentType, /text\/(markdown|plain)/);
		assert.match(file.body, /^# somu nexus/m);
		assert.match(file.body, /When to use this site/);
		assert.match(file.body, /## When to use this/);

		const head = await fetch(new URL("/llms.txt", BASE_URL), {
			method: "HEAD",
		});
		assert.equal(head.status, 200);
		assert.match(
			head.headers.get("content-type") ?? "",
			/text\/(markdown|plain)/,
		);
	});

	it("keeps the requested slug on rewritten 404s", async (t) => {
		if (!requireBase(t)) return;
		const missing = "/writings/this-slug-does-not-exist";
		const html = await request(missing);
		assert.equal(html.status, 404);
		assert.match(html.body, /this-slug-does-not-exist/);
		assert.doesNotMatch(html.body, /rel="canonical" href="[^"]*\/404"/);
		assert.match(html.body, /this-slug-does-not-exist\.md/);
	});

	it("keeps 404 canonical on this origin when from= is off-site", async (t) => {
		if (!requireBase(t)) return;
		const html = await request("/404?from=https://evil.example");
		assert.equal(html.status, 404);
		assert.doesNotMatch(html.body, /evil\.example/);
		assert.match(html.body, /rel=['"]canonical['"][^>]*href=['"][^'"]+/);
		assert.match(
			html.body,
			/rel="canonical" href="https?:\/\/(www\.)?msomu\.com\/404"|rel="canonical" href="http:\/\/127\.0\.0\.1:\d+\/404"/,
		);

		const proto = await request("/404?from=//evil.example");
		assert.equal(proto.status, 404);
		assert.doesNotMatch(proto.body, /evil\.example/);

		const broken = await request("/404?from=http://[");
		assert.equal(broken.status, 404);

		const backslash = await request("/404?from=/%5Cevil.example");
		assert.equal(backslash.status, 404);
		assert.doesNotMatch(backslash.body, /evil\.example/);

		const tab = await request(`/404?from=${encodeURIComponent("/\t//evil.example")}`);
		assert.equal(tab.status, 404);
		assert.doesNotMatch(tab.body, /evil\.example/);
	});

	it("returns HTTP 404 for /404 markdown", async (t) => {
		if (!requireBase(t)) return;
		const markdown = await request("/404.md");
		assert.equal(markdown.status, 404);
		assert.match(markdown.body, /^# Not found/m);
		assert.match(markdown.body, /`\/404`/);
	});

	it("keeps Kotlin playground samples in think-in-code markdown", async (t) => {
		if (!requireBase(t)) return;
		const markdown = await request("/think-in-code/introduction-to-dsa.md");
		assert.equal(markdown.status, 200);
		assert.match(markdown.body, /```kotlin/);
		assert.match(markdown.body, /listOf\(1, 2, 3, 4, 5\)/);
		assert.doesNotMatch(markdown.body, /<KotlinPlayground/);
	});

	it("publishes about, contact, and privacy with enough copy", async (t) => {
		if (!requireBase(t)) return;
		for (const path of ["/about", "/contact", "/privacy"]) {
			const page = await request(path);
			assert.equal(page.status, 200, path);
			const text = page.body.replace(/<[^>]+>/g, " ");
			assert.ok(
				text.length >= 500,
				`${path} rendered less than 500 characters`,
			);

			const markdown = await request(path, { Accept: "text/markdown" });
			assert.equal(markdown.status, 200, `${path} markdown`);
			assert.match(markdown.contentType, /text\/markdown/);
			assert.ok(markdown.body.length >= 500, `${path} markdown is short`);
		}
	});
});

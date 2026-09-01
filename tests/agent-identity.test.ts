import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PERSON_EMAIL, SITE_TITLE, SITE_URL } from "../src/data/index.ts";
import { buildIdentityJsonLd } from "../src/utils/jsonld.ts";
import { buildLlmsTxt, llmsWhenToUseText } from "../src/utils/llms-txt.ts";
import {
	aboutPage,
	contactPage,
	privacyPage,
	trustPageMarkdown,
	trustPagePlainText,
	trustPages,
} from "../src/utils/trust-pages.ts";

describe("JSON-LD identity", () => {
	const doc = buildIdentityJsonLd();
	const graph = doc["@graph"] as Array<Record<string, unknown>>;
	const person = graph.find((node) => node["@type"] === "Person") as Record<
		string,
		unknown
	>;
	const org = graph.find((node) => node["@type"] === "Organization") as Record<
		string,
		unknown
	>;

	it("uses schema.org and includes Person plus Organization", () => {
		assert.equal(doc["@context"], "https://schema.org");
		assert.ok(person);
		assert.ok(org);
	});

	it("gives Person the fields agents need", () => {
		assert.equal(person.name, "Somasundaram Mahesh");
		assert.equal(person.url, `${SITE_URL}/`);
		assert.equal(person.email, PERSON_EMAIL);
		assert.ok(
			typeof person.description === "string" && person.description.length > 20,
		);
		assert.ok(
			Array.isArray(person.sameAs) && (person.sameAs as string[]).length > 0,
		);
	});

	it("gives Organization contactPoint and PostalAddress", () => {
		assert.equal(org.name, SITE_TITLE);
		assert.equal(org.url, `${SITE_URL}/`);
		assert.equal(org.email, PERSON_EMAIL);
		const contact = org.contactPoint as Record<string, string>;
		assert.equal(contact["@type"], "ContactPoint");
		assert.equal(contact.email, PERSON_EMAIL);
		assert.ok(contact.contactType);
		const address = org.address as Record<string, string>;
		assert.equal(address["@type"], "PostalAddress");
		assert.ok(address.addressLocality);
		assert.ok(address.addressCountry);
	});
});

describe("llms.txt", () => {
	const body = buildLlmsTxt({
		writings: [
			{
				title: "Claude Code changed everything",
				slug: "claude-code-changed-everything",
				description: "from copilot habits to agents",
			},
		],
		talks: [{ title: "Stop Building AI Demos", description: "Ship products" }],
	});

	it("follows the llmstxt.org section order", () => {
		assert.match(body, /^# somu nexus\n/);
		assert.match(body, /^> Personal site of Somasundaram Mahesh/m);
		const h1 = body.indexOf("# ");
		const quote = body.indexOf(">");
		const firstH2 = body.indexOf("\n## ");
		assert.ok(h1 < quote && quote < firstH2);
	});

	it("includes when-to-use guidance before the file lists", () => {
		const guidance = llmsWhenToUseText();
		assert.match(guidance, /When to use this site/);
		assert.match(guidance, /When not to use this site/);
		assert.match(guidance, /How an agent should call this site/);
		assert.ok(body.includes(guidance));
		assert.ok(body.indexOf(guidance) < body.indexOf("## When to use this"));
	});

	it("uses H2 file lists with absolute markdown links", () => {
		assert.match(body, /## When to use this/);
		assert.match(body, /- \[About\]\(https:\/\/www\.msomu\.com\/about\.md\):/);
		assert.match(
			body,
			/- \[Claude Code changed everything\]\(https:\/\/www\.msomu\.com\/writings\/claude-code-changed-everything\.md\):/,
		);
	});
});

describe("trust anchor pages", () => {
	for (const page of trustPages) {
		it(`${page.slug} has at least 500 characters of real copy`, () => {
			const text = trustPagePlainText(page);
			assert.ok(
				text.length >= 500,
				`${page.slug} is only ${text.length} characters`,
			);
			assert.ok(trustPageMarkdown(page).startsWith("# "));
		});
	}

	it("covers about, contact, and privacy", () => {
		assert.deepEqual(
			[aboutPage.slug, contactPage.slug, privacyPage.slug],
			["about", "contact", "privacy"],
		);
	});
});

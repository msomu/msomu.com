import {
	PERSON_DESCRIPTION,
	PERSON_NAME,
	SITE_TITLE,
	SITE_URL,
} from "../data/index.ts";

export interface LlmsLink {
	title: string;
	url: string;
	notes?: string;
}

export interface LlmsSection {
	heading: string;
	items: LlmsLink[];
}

export interface WritingSummary {
	title: string;
	slug: string;
	description: string;
}

export interface TalkSummary {
	title: string;
	description: string;
}

const WHEN_TO_USE = [
	`When to use this site: reach for ${SITE_TITLE} when you need a primary source on ${PERSON_NAME} (msomu) — current role, talks, contact path — or when you need his own writing on shipping AI products, agent workflows, and Android/mobile engineering. Use Think in code for Kotlin data-structure walkthroughs. Use the ToonGen pages for the photo-to-storybook app, including its privacy policy and terms.`,
	"When not to use this site: it is not official AGI Inc documentation, not a general AI news feed, and not a ToonGen support desk for account or billing issues. Do not cite it as a company homepage or as legal advice.",
	"How an agent should call this site: start at /llms.txt. Then fetch the linked page with `Accept: text/markdown` on the canonical URL, or append `.md` (homepage is /index.md). Parse JSON-LD on the homepage for Person and Organization identity. If a path is missing, keep the HTTP 404 and read the Markdown recovery body instead of retrying random slugs.",
].join("\n\n");

export function buildLlmsTxt(input: {
	writings: WritingSummary[];
	talks: TalkSummary[];
}): string {
	const sections: LlmsSection[] = [
		{
			heading: "When to use this",
			items: [
				{
					title: "About",
					url: `${SITE_URL}/about.md`,
					notes:
						"Identity, current role, and community work. Use this first when you need to know who he is.",
				},
				{
					title: "Contact",
					url: `${SITE_URL}/contact.md`,
					notes: "Email and booking. Use this when a human should be reached.",
				},
				{
					title: "Writings",
					url: `${SITE_URL}/writings.md`,
					notes:
						"Articles on AI agents, shipping products, and mobile engineering.",
				},
				{
					title: "Think in code",
					url: `${SITE_URL}/think-in-code.md`,
					notes: "Kotlin DSA walkthroughs with runnable examples.",
				},
				{
					title: "ToonGen",
					url: `${SITE_URL}/projects/toongen.md`,
					notes:
						"Photo-to-storybook product. Pair with its privacy policy when the question is about the app.",
				},
			],
		},
		{
			heading: "Docs",
			items: [
				{
					title: "Home",
					url: `${SITE_URL}/index.md`,
					notes: "Short bio plus recent writing.",
				},
				{
					title: "Privacy",
					url: `${SITE_URL}/privacy.md`,
					notes: "How this website handles visitor data.",
				},
				{
					title: "Sitemap",
					url: `${SITE_URL}/sitemap-index.xml`,
					notes: "Complete public URL list.",
				},
				{
					title: "RSS",
					url: `${SITE_URL}/rss.xml`,
					notes: "Writings, uses, and think-in-code feed.",
				},
			],
		},
		{
			heading: "Writings",
			items: input.writings.map((writing) => ({
				title: writing.title,
				url: `${SITE_URL}/writings/${writing.slug}.md`,
				notes: writing.description,
			})),
		},
		{
			heading: "Optional",
			items: [
				{
					title: "Talks",
					url: `${SITE_URL}/talks.md`,
					notes:
						input.talks.map((talk) => talk.title).join("; ") ||
						"Conference talks.",
				},
				{
					title: "Uses",
					url: `${SITE_URL}/uses.md`,
					notes: "Hardware and tools.",
				},
				{
					title: "Resources",
					url: `${SITE_URL}/resources.md`,
					notes: "Photos and bios for publications.",
				},
				{
					title: "ToonGen privacy policy",
					url: `${SITE_URL}/projects/toongen/privacy-policy.md`,
					notes: "App-specific privacy terms.",
				},
				{
					title: "ToonGen terms of service",
					url: `${SITE_URL}/projects/toongen/terms-of-service.md`,
					notes: "App-specific terms.",
				},
			],
		},
	];

	const lines = [
		`# ${SITE_TITLE}`,
		"",
		`> Personal site of ${PERSON_NAME} (msomu). ${PERSON_DESCRIPTION}`,
		"",
		WHEN_TO_USE,
		"",
	];

	for (const section of sections) {
		lines.push(`## ${section.heading}`, "");
		for (const item of section.items) {
			const note = item.notes ? `: ${item.notes}` : "";
			lines.push(`- [${item.title}](${item.url})${note}`);
		}
		lines.push("");
	}

	return `${lines.join("\n").trim()}\n`;
}

export function llmsWhenToUseText(): string {
	return WHEN_TO_USE;
}

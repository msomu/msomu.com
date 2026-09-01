import {
	PERSON_DESCRIPTION,
	PERSON_EMAIL,
	PERSON_NAME,
	SITE_TITLE,
	SITE_URL,
	TOPMATE_URL,
	socialLinks,
} from "../data/index.ts";

export interface TrustSection {
	heading: string;
	paragraphs: string[];
	list?: string[];
}

export interface TrustPage {
	slug: "about" | "contact" | "privacy";
	title: string;
	heading: string;
	description: string;
	sections: TrustSection[];
}

export const aboutPage: TrustPage = {
	slug: "about",
	title: `About ${PERSON_NAME}`,
	heading: "about",
	description:
		"Somasundaram Mahesh (msomu) is a founding AI engineer, community organiser, and writer based in Chennai.",
	sections: [
		{
			heading: "Who this is",
			paragraphs: [
				`${PERSON_NAME} (msomu) publishes ${SITE_TITLE} as a personal record of the work he ships and the things he is learning in public. The short version: ${PERSON_DESCRIPTION}`,
				"This is a personal site, not a company marketing page. Use it to verify who he is, what he is building, and which articles or talks are his.",
			],
		},
		{
			heading: "What he works on",
			paragraphs: [
				"At AGI Inc he works on AI products at the application layer: agents, tools, and the unglamorous work of making model-backed features survive contact with real users. That includes evaluation, product taste, and the gap between a demo that impresses a room and a system people return to.",
				"Outside work he founded United by AI, a community for builders who want peers rather than a pitch audience, and he organises GDG Chennai meetups and talks. Before this chapter he spent years on streaming clients at Disney+Hotstar, where playback quality and scale were the job.",
			],
		},
		{
			heading: "What you will find here",
			paragraphs: [
				"Writings cover shipping AI products, agent workflows, and the mobile engineering habits that still matter when the model is the new runtime. Think in code is a slower lane: Kotlin walkthroughs of data-structure problems with runnable examples. Projects currently highlights ToonGen, an app that started as a photo filter and became a way to put a child into a printed story.",
				"If you need a photo, a short bio, or social URLs for a talk or publication, the resources page is the press kit. If you need to reach him, use the contact page.",
			],
		},
	],
};

export const contactPage: TrustPage = {
	slug: "contact",
	title: `Contact ${PERSON_NAME}`,
	heading: "contact",
	description:
		"Email, booking, and public profiles for Somasundaram Mahesh. Use these when you want to invite him, cite him, or ask a specific question.",
	sections: [
		{
			heading: "How to reach him",
			paragraphs: [
				`The reliable inbox is ${PERSON_EMAIL}. Use it for speaking invitations, collaboration that already has a concrete ask, corrections to something published here, or privacy requests about this website. Put the reason in the subject line so it can be sorted.`,
				`For a scheduled conversation, book time on Topmate: ${TOPMATE_URL}. That is the right path when you want a 1:1 and do not already have an introduction.`,
			],
		},
		{
			heading: "What to write",
			paragraphs: [
				"Useful mail is specific. Name the talk, the article, the product, or the community event you have in mind. Include a date, a timezone, and whether you need a yes or a draft. Cold pitches that could be sent to anyone usually get a short no or silence.",
				"He is based in Chennai, India, and is most useful as a guest on AI product, agent workflows, Android, or community-building topics. He is the wrong person for generic keynote filler, undisclosed sponsored posts, or support tickets about a ToonGen account — those belong in the app stores or at the same email with the word ToonGen in the subject.",
			],
		},
		{
			heading: "Public profiles",
			paragraphs: [
				"If you only need a URL to cite or to confirm identity, use the profiles below. They are the same accounts listed in the site JSON-LD `sameAs` field.",
			],
			list: socialLinks.map((link) => `${link.label}: ${link.url}`),
		},
	],
};

export const privacyPage: TrustPage = {
	slug: "privacy",
	title: `${SITE_TITLE} privacy`,
	heading: "privacy",
	description:
		"How this personal website collects, uses, and does not sell visitor information.",
	sections: [
		{
			heading: "Scope",
			paragraphs: [
				`This privacy page covers ${SITE_URL} and the public pages on it. It does not replace the ToonGen mobile-app policy. If you use ToonGen, read the app-specific policy at ${SITE_URL}/projects/toongen/privacy-policy — that product processes photos and has its own vendors.`,
				`${SITE_TITLE} is a personal website operated by ${PERSON_NAME}. There are no user accounts on this site, no checkout, and no comment forms. You can read everything without sending a name or email.`,
			],
		},
		{
			heading: "What is collected",
			paragraphs: [
				"The site is hosted on Cloudflare. Like any public website, the host sees technical request data such as IP address, user agent, and the path you requested, which it uses to serve pages, absorb abuse, and keep the site online.",
				"In production, two analytics tools may run: Umami, for aggregate page-view counts, and Microsoft Clarity, for anonymized session insights that help find broken layouts. These tools exist to understand which pages are read, not to build an advertising profile. Theme preference is stored in your browser with localStorage so dark mode survives a refresh. That value does not leave your device as part of a site account, because there is no account.",
			],
		},
		{
			heading: "How it is used and shared",
			paragraphs: [
				"Analytics data is used to see which writing is useful and whether a release broke a page. It is not sold, not rented, and not used to retarget you on other sites. There are no ad networks on this website.",
				`If you email ${PERSON_EMAIL}, that message lives in the inbox it was sent to and is used only to reply. You can ask for a stored message to be deleted. For a deletion or correction request about analytics, email the same address with enough detail to find the visit (approximate time and page).`,
			],
		},
		{
			heading: "Agents, crawlers, and changes",
			paragraphs: [
				"robots.txt states a preference via Content-Signal: search indexing is welcome, using the public pages as model input is welcome, and using them to train foundation models is not. That is a stated preference, not a lock. Machine-readable copies of pages are offered through Accept: text/markdown and /llms.txt so agents can read the same words without scraping the layout.",
				"This page will be updated when the hosting, analytics, or product surface changes. The current text reflects the site as of August 2026. Questions about it go to the contact page or directly to the email above.",
			],
		},
	],
};

export const trustPages: TrustPage[] = [aboutPage, contactPage, privacyPage];

export function trustPagePlainText(page: TrustPage): string {
	const parts = [page.title, page.description];
	for (const section of page.sections) {
		parts.push(section.heading, ...section.paragraphs);
		if (section.list) parts.push(...section.list);
	}
	return parts.join("\n");
}

export function trustPageMarkdown(page: TrustPage): string {
	const lines = [`# ${page.title}`, "", page.description, ""];
	for (const section of page.sections) {
		lines.push(`## ${section.heading}`, "");
		for (const paragraph of section.paragraphs) {
			lines.push(paragraph, "");
		}
		if (section.list) {
			for (const item of section.list) {
				lines.push(`- ${item}`);
			}
			lines.push("");
		}
	}
	return `${lines.join("\n").trim()}\n`;
}

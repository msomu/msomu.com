import { getCollection } from "astro:content";
import {
	PERSON_DESCRIPTION,
	PERSON_NAME,
	SITE_DESCRIPTION,
	SITE_TITLE,
	SITE_URL,
} from "../data/index.ts";
import { notFoundMarkdown } from "./not-found.ts";
import {
	aboutPage,
	contactPage,
	privacyPage,
	trustPageMarkdown,
} from "./trust-pages.ts";

export interface MarkdownPage {
	body: string;
	exists: boolean;
}

function stripMdxNoise(body: string): string {
	return body
		.split("\n")
		.filter((line) => !/^import\s+.+from\s+.+;?\s*$/.test(line.trim()))
		.join("\n")
		.replace(/^\s*<[A-Z][\s\S]*?\/>\s*$/gm, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function articleMarkdown(
	title: string,
	description: string,
	pubDate: Date | undefined,
	body: string,
): string {
	const published = pubDate
		? `Published: ${pubDate.toISOString().slice(0, 10)}\n\n`
		: "";
	return `# ${title}\n\n> ${description}\n\n${published}${stripMdxNoise(
		body,
	)}\n`;
}

function listMarkdown(
	title: string,
	intro: string,
	items: Array<{ title: string; href: string; notes?: string }>,
): string {
	const lines = [`# ${title}`, "", intro, ""];
	for (const item of items) {
		const note = item.notes ? `: ${item.notes}` : "";
		lines.push(`- [${item.title}](${item.href})${note}`);
	}
	lines.push("");
	return lines.join("\n");
}

const STATIC_MARKDOWN: Record<string, () => string> = {
	"/about": () => trustPageMarkdown(aboutPage),
	"/contact": () => trustPageMarkdown(contactPage),
	"/privacy": () => trustPageMarkdown(privacyPage),
	"/projects": () =>
		listMarkdown(
			"Projects",
			"Mobile and AI products shipped by Somasundaram Mahesh.",
			[
				{
					title: "ToonGen",
					href: `${SITE_URL}/projects/toongen.md`,
					notes:
						"Turn a photo into a cartoon character that can stay consistent in a printed story and video.",
				},
			],
		),
	"/projects/toongen": () =>
		[
			"# ToonGen",
			"",
			"> An app that turns a child's photo into a character for a printed story and video.",
			"",
			"ToonGen started as a photo-to-cartoon filter and became a product after the author used it to put his son into a storybook. It is available on iOS and Android.",
			"",
			"- [App Store](https://apps.apple.com/in/app/toongen/id6745421916)",
			"- [Play Store](https://play.google.com/store/apps/details?id=com.msomu.toongen)",
			`- [Privacy policy](${SITE_URL}/projects/toongen/privacy-policy.md)`,
			`- [Terms of service](${SITE_URL}/projects/toongen/terms-of-service.md)`,
			`- [Why it was built](${SITE_URL}/writings/i-built-toongen-for-my-son.md)`,
			"",
		].join("\n"),
	"/projects/toongen/privacy-policy": () =>
		[
			"# ToonGen Privacy Policy",
			"",
			"ToonGen is a mobile app by Somasundaram Mahesh. It may collect device and usage data, and it processes facial images when you generate a cartoon avatar or story character. Images are sent to model providers (including Gemini) to produce the output.",
			"",
			"The full policy, including children, retention, third-party SDKs, and in-app purchases, is published at this URL for humans. Contact msomasundaram93@gmail.com for deletion requests.",
			"",
			`- Human-readable page: ${SITE_URL}/projects/toongen/privacy-policy`,
			"",
		].join("\n"),
	"/projects/toongen/terms-of-service": () =>
		[
			"# ToonGen Terms of Service",
			"",
			"Using ToonGen means you accept the published terms. Premium subscriptions unlock conversion features. Subscriptions renew at the listed App Store or Play Store price until cancelled.",
			"",
			"The full terms live at this URL for humans.",
			"",
			`- Human-readable page: ${SITE_URL}/projects/toongen/terms-of-service`,
			"",
		].join("\n"),
	"/uses": () =>
		[
			"# Tools I use",
			"",
			"Hardware and software Somasundaram Mahesh uses day to day, including phones, a MacBook, and the usual writing and coding tools.",
			"",
			`The illustrated inventory is on ${SITE_URL}/uses.`,
			"",
		].join("\n"),
	"/resources": () =>
		[
			"# Resources",
			"",
			`Media assets, bios, and social links for publications that want to mention ${PERSON_NAME}.`,
			"",
			`- Portraits: ${SITE_URL}/images/portrait-1.jpg, ${SITE_URL}/images/portrait-2.jpg, ${SITE_URL}/images/portrait-3.jpg`,
			`- Contact: ${SITE_URL}/contact.md`,
			`- About: ${SITE_URL}/about.md`,
			"",
		].join("\n"),
};

async function homeMarkdown(): Promise<string> {
	const [whoami, writings] = await Promise.all([
		getCollection("whoami"),
		getCollection("writing"),
	]);
	const intro = whoami[0];
	const recent = writings
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.slice(0, 3);
	const body = intro ? stripMdxNoise(intro.body) : PERSON_DESCRIPTION;
	const lines = [
		`# ${intro?.data.title ?? SITE_TITLE}`,
		"",
		`> ${SITE_DESCRIPTION}`,
		"",
		body,
		"",
		"## Recent writings",
		"",
	];
	for (const writing of recent) {
		lines.push(
			`- [${writing.data.title}](${SITE_URL}/writings/${writing.slug}.md): ${writing.data.description}`,
		);
	}
	lines.push(
		"",
		`See all posts: ${SITE_URL}/writings.md`,
		`Agent index: ${SITE_URL}/llms.txt`,
		"",
	);
	return lines.join("\n");
}

async function writingsIndexMarkdown(): Promise<string> {
	const writings = (await getCollection("writing")).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	return listMarkdown(
		"Writings",
		"Thoughts on shipping AI products, agent workflows, and mobile engineering.",
		writings.map((writing) => ({
			title: writing.data.title,
			href: `${SITE_URL}/writings/${writing.slug}.md`,
			notes: writing.data.description,
		})),
	);
}

async function thinkInCodeIndexMarkdown(): Promise<string> {
	const items = (await getCollection("thinkInCode")).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	return listMarkdown(
		"Think in code",
		"Kotlin data-structure walkthroughs with runnable playgrounds.",
		items.map((item) => ({
			title: item.data.title,
			href: `${SITE_URL}/think-in-code/${item.slug}.md`,
			notes: item.data.description,
		})),
	);
}

async function talksMarkdown(): Promise<string> {
	const talks = (await getCollection("talks")).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);
	return listMarkdown(
		"Talks",
		"Presentations on AI products, agents, and Android.",
		talks.map((talk) => ({
			title: talk.data.title,
			href: talk.data.slideUrl
				? new URL(talk.data.slideUrl, SITE_URL).href
				: `${SITE_URL}/talks`,
			notes: `${talk.data.venue} — ${talk.data.description}`,
		})),
	);
}

export async function resolvePageMarkdown(path: string): Promise<MarkdownPage> {
	if (path === "/" || path === "/404") {
		if (path === "/404") {
			return { exists: true, body: notFoundMarkdown("/404") };
		}
		return { exists: true, body: await homeMarkdown() };
	}

	const staticPage = STATIC_MARKDOWN[path];
	if (staticPage) {
		return { exists: true, body: staticPage() };
	}

	if (path === "/writings") {
		return { exists: true, body: await writingsIndexMarkdown() };
	}
	if (path === "/think-in-code") {
		return { exists: true, body: await thinkInCodeIndexMarkdown() };
	}
	if (path === "/talks") {
		return { exists: true, body: await talksMarkdown() };
	}

	const writingMatch = path.match(/^\/writings\/([^/]+)$/);
	if (writingMatch) {
		const posts = await getCollection("writing");
		const post = posts.find((entry) => entry.slug === writingMatch[1]);
		if (!post) return { exists: false, body: notFoundMarkdown(path) };
		return {
			exists: true,
			body: articleMarkdown(
				post.data.title,
				post.data.description,
				post.data.pubDate,
				post.body,
			),
		};
	}

	const thinkMatch = path.match(/^\/think-in-code\/([^/]+)$/);
	if (thinkMatch) {
		const posts = await getCollection("thinkInCode");
		const post = posts.find((entry) => entry.slug === thinkMatch[1]);
		if (!post) return { exists: false, body: notFoundMarkdown(path) };
		return {
			exists: true,
			body: articleMarkdown(
				post.data.title,
				post.data.description,
				post.data.pubDate,
				post.body,
			),
		};
	}

	return { exists: false, body: notFoundMarkdown(path) };
}

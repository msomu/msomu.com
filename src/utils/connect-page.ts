import { connectLinks, PERSON_NAME, SITE_URL } from "../data/index.ts";

export function connectPageMarkdown(): string {
	const lines = [
		"# Connect",
		"",
		`> Public social profiles and channels for ${PERSON_NAME} (msomu).`,
		"",
		"Use these URLs when you need to cite or link to a public profile in a talk listing, publication byline, podcast show notes, or event page. Each link below is the canonical public account on that platform.",
		"",
		"For email, booking, or a direct conversation, use the contact page instead. This page is only for social and channel URLs that are safe to publish widely.",
		"",
	];
	for (const link of connectLinks) {
		lines.push(`- ${link.label}: ${link.url}`);
	}
	lines.push("", `- Contact: ${SITE_URL}/contact.md`, "");
	return lines.join("\n");
}

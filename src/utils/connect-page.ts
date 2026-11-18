import {
	CONTACT_EMAIL,
	FOUNDER_PITCH,
	FOUNDER_ROLE,
	FOUNDER_STATUS,
	VCARD_PATH,
	WHATSAPP_NUMBER,
	formatPhone,
	trackRecord,
	whatsappUrl,
} from "../data/connect.ts";
import { PERSON_NAME, SITE_URL, connectLinks } from "../data/index.ts";

/** Markdown for /connect: the 1:1 networking card for founders and investors. */
export function connectPageMarkdown(): string {
	const lines = [
		"# Connect",
		"",
		`> ${PERSON_NAME} (msomu). ${FOUNDER_ROLE}. ${FOUNDER_PITCH}`,
		"",
		`${FOUNDER_STATUS}. This is the page he shares in person at events and meetups, so investors, founders and operators can reach him directly and save his details.`,
		"",
		"## Reach him",
		"",
	];
	if (WHATSAPP_NUMBER) {
		lines.push(
			`- WhatsApp (fastest reply): ${formatPhone(
				WHATSAPP_NUMBER,
			)}, ${whatsappUrl(WHATSAPP_NUMBER)}`,
		);
	}
	lines.push(
		`- Email: ${CONTACT_EMAIL}`,
		`- Save contact (vCard): ${SITE_URL}${VCARD_PATH}`,
		"- LinkedIn: https://www.linkedin.com/in/msomu/",
		"- X: https://x.com/msomuin",
		"",
		"## Track record",
		"",
	);
	for (const item of trackRecord) {
		lines.push(`- ${item.text}`);
	}
	lines.push(
		"",
		`For public social profiles, talks and channels, use ${SITE_URL}/follow.md.`,
		"",
	);
	return lines.join("\n");
}

/** Markdown for /follow: public channels for people who saw a talk. */
export function followPageMarkdown(): string {
	const lines = [
		"# Follow",
		"",
		`> Where ${PERSON_NAME} (msomu) posts talks, videos and writing on AI agents and shipping products.`,
		"",
		"Use these URLs when you need to cite or link to a public profile in a talk listing, publication byline, podcast show notes, or event page. Each link below is the canonical public account on that platform.",
		"",
		`Slides from his talks live at ${SITE_URL}/talks. Long-form writing lives at ${SITE_URL}/writings, with an RSS feed at ${SITE_URL}/rss.xml.`,
		"",
	];
	for (const link of connectLinks) {
		lines.push(`- ${link.label}: ${link.url}`);
	}
	lines.push(
		"",
		`- Talks: ${SITE_URL}/talks`,
		`- Connect (direct contact): ${SITE_URL}/connect.md`,
		"",
	);
	return lines.join("\n");
}

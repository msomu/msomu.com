import {
	PERSON_NAME,
	SITE_URL,
	WHATSAPP_CHANNEL_URL,
	YOUTUBE_URL,
} from "./index.ts";

/**
 * Personal WhatsApp number in international format, digits only
 * (e.g. "971501234567"). While this is null, /connect hides the WhatsApp
 * card and the vCard leaves out the phone number.
 */
export const WHATSAPP_NUMBER: string | null = null;

export const CONTACT_EMAIL = "hi@msomu.com";
export const CONNECT_URL = `${SITE_URL}/connect`;
export const VCARD_PATH = "/connect/somu.vcf";

export const FOUNDER_ROLE = "Founder & Product Builder";
export const FOUNDER_PITCH =
	"I take AI ideas from zero to products people actually use.";
export const FOUNDER_STATUS = "Open to investor conversations";

export function whatsappUrl(number: string): string {
	const text = encodeURIComponent("Hi Somu, we met at the event.");
	return `https://wa.me/${number}?text=${text}`;
}

export function formatPhone(number: string): string {
	return `+${number}`;
}

export interface TrackRecordItem {
	/** Plain text, used for markdown and the vCard note. */
	text: string;
	/** The phrase to set in bold on the page. Must appear inside text. */
	highlight: string;
}

export const trackRecord: TrackRecordItem[] = [
	{
		text: "Shipped streaming to millions at Disney+Hotstar",
		highlight: "millions",
	},
	{ text: "Founding engineer at AGI Inc.", highlight: "AGI Inc." },
	{ text: "Took products 0 to 1, like ToonGen", highlight: "0 to 1" },
	{
		text: "Co-founder, United by AI community. 8 talks on AI agents",
		highlight: "United by AI",
	},
];

export type ConnectIcon =
	| "contact"
	| "email"
	| "slides"
	| "youtube"
	| "megaphone"
	| "rss"
	| "x"
	| "linkedin"
	| "instagram"
	| "github"
	| "whatsapp";

export interface FollowLink {
	id: ConnectIcon;
	label: string;
	url: string;
}

/** Public channels for talk audiences, shown as rows on /follow. */
export const followChannels: Array<FollowLink & { note: string }> = [
	{
		id: "youtube",
		label: "YouTube",
		note: "Talks, builds, deep dives",
		url: YOUTUBE_URL,
	},
	{
		id: "megaphone",
		label: "WhatsApp channel",
		note: "AI news, no spam",
		url: WHATSAPP_CHANNEL_URL,
	},
	{
		id: "rss",
		label: "Writings + RSS",
		note: "Long-form notes on building",
		url: "/writings",
	},
];

/** Social profiles, shown as the icon strip on /follow. */
export const followSocials: FollowLink[] = [
	{ id: "x", label: "X", url: "https://x.com/msomuin" },
	{
		id: "linkedin",
		label: "LinkedIn",
		url: "https://www.linkedin.com/in/msomu/",
	},
	{
		id: "instagram",
		label: "Instagram",
		url: "https://www.instagram.com/msomu",
	},
	{ id: "github", label: "GitHub", url: "https://github.com/msomu" },
];

export function vcard(): string {
	const lines = [
		"BEGIN:VCARD",
		"VERSION:3.0",
		"N:Mahesh;Somasundaram;;;",
		`FN:${PERSON_NAME}`,
		"NICKNAME:Somu",
		`TITLE:${FOUNDER_ROLE}`,
		`EMAIL;TYPE=INTERNET:${CONTACT_EMAIL}`,
	];
	if (WHATSAPP_NUMBER) {
		lines.push(`TEL;TYPE=CELL:${formatPhone(WHATSAPP_NUMBER)}`);
	}
	lines.push(
		`URL:${CONNECT_URL}`,
		"X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/msomu/",
		"X-SOCIALPROFILE;TYPE=twitter:https://x.com/msomuin",
		`NOTE:${FOUNDER_PITCH}`,
		"END:VCARD",
	);
	return `${lines.join("\r\n")}\r\n`;
}

/** QR code (29x29 modules) for https://www.msomu.com/connect. */
export const CONNECT_QR_SIZE = 29;
export const CONNECT_QR_PATH =
	"M0 0h7v1h-7zM9 0h1v1h-1zM11 0h1v1h-1zM14 0h1v1h-1zM18 0h2v1h-2zM22 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM8 1h1v1h-1zM11 1h3v1h-3zM19 1h2v1h-2zM22 1h1v1h-1zM28 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM9 2h1v1h-1zM15 2h1v1h-1zM19 2h1v1h-1zM22 2h1v1h-1zM24 2h3v1h-3zM28 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM10 3h1v1h-1zM12 3h2v1h-2zM16 3h1v1h-1zM18 3h1v1h-1zM22 3h1v1h-1zM24 3h3v1h-3zM28 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h4v1h-4zM13 4h1v1h-1zM16 4h5v1h-5zM22 4h1v1h-1zM24 4h3v1h-3zM28 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM9 5h2v1h-2zM14 5h3v1h-3zM18 5h3v1h-3zM22 5h1v1h-1zM28 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h1v1h-1zM20 6h1v1h-1zM22 6h7v1h-7zM9 7h1v1h-1zM11 7h2v1h-2zM15 7h1v1h-1zM17 7h4v1h-4zM0 8h1v1h-1zM2 8h1v1h-1zM4 8h1v1h-1zM6 8h1v1h-1zM16 8h2v1h-2zM19 8h2v1h-2zM24 8h1v1h-1zM27 8h1v1h-1zM1 9h1v1h-1zM4 9h1v1h-1zM7 9h4v1h-4zM13 9h1v1h-1zM15 9h2v1h-2zM20 9h3v1h-3zM25 9h1v1h-1zM28 9h1v1h-1zM0 10h1v1h-1zM2 10h3v1h-3zM6 10h2v1h-2zM9 10h1v1h-1zM11 10h2v1h-2zM14 10h4v1h-4zM21 10h1v1h-1zM26 10h3v1h-3zM3 11h1v1h-1zM5 11h1v1h-1zM7 11h1v1h-1zM12 11h3v1h-3zM16 11h2v1h-2zM20 11h1v1h-1zM24 11h1v1h-1zM27 11h1v1h-1zM0 12h4v1h-4zM5 12h2v1h-2zM8 12h2v1h-2zM11 12h1v1h-1zM14 12h2v1h-2zM17 12h1v1h-1zM19 12h4v1h-4zM25 12h1v1h-1zM27 12h2v1h-2zM1 13h1v1h-1zM3 13h3v1h-3zM7 13h6v1h-6zM14 13h2v1h-2zM20 13h1v1h-1zM22 13h2v1h-2zM25 13h1v1h-1zM28 13h1v1h-1zM0 14h3v1h-3zM6 14h1v1h-1zM9 14h1v1h-1zM13 14h1v1h-1zM17 14h1v1h-1zM22 14h2v1h-2zM25 14h1v1h-1zM27 14h2v1h-2zM0 15h1v1h-1zM7 15h1v1h-1zM9 15h1v1h-1zM15 15h1v1h-1zM17 15h1v1h-1zM22 15h1v1h-1zM25 15h1v1h-1zM27 15h1v1h-1zM0 16h2v1h-2zM4 16h3v1h-3zM9 16h1v1h-1zM12 16h1v1h-1zM16 16h2v1h-2zM20 16h4v1h-4zM25 16h1v1h-1zM27 16h2v1h-2zM1 17h1v1h-1zM3 17h1v1h-1zM5 17h1v1h-1zM7 17h2v1h-2zM10 17h1v1h-1zM12 17h2v1h-2zM15 17h3v1h-3zM20 17h3v1h-3zM25 17h2v1h-2zM28 17h1v1h-1zM0 18h1v1h-1zM2 18h2v1h-2zM6 18h2v1h-2zM9 18h1v1h-1zM11 18h1v1h-1zM14 18h3v1h-3zM20 18h2v1h-2zM23 18h1v1h-1zM27 18h2v1h-2zM1 19h2v1h-2zM4 19h1v1h-1zM8 19h1v1h-1zM10 19h1v1h-1zM13 19h2v1h-2zM16 19h3v1h-3zM20 19h1v1h-1zM22 19h1v1h-1zM25 19h1v1h-1zM27 19h1v1h-1zM0 20h1v1h-1zM3 20h1v1h-1zM6 20h1v1h-1zM8 20h2v1h-2zM11 20h2v1h-2zM14 20h2v1h-2zM17 20h1v1h-1zM19 20h6v1h-6zM8 21h3v1h-3zM14 21h2v1h-2zM17 21h1v1h-1zM19 21h2v1h-2zM24 21h1v1h-1zM26 21h3v1h-3zM0 22h7v1h-7zM11 22h3v1h-3zM17 22h4v1h-4zM22 22h1v1h-1zM24 22h2v1h-2zM27 22h2v1h-2zM0 23h1v1h-1zM6 23h1v1h-1zM9 23h2v1h-2zM15 23h1v1h-1zM17 23h4v1h-4zM24 23h2v1h-2zM0 24h1v1h-1zM2 24h3v1h-3zM6 24h1v1h-1zM8 24h3v1h-3zM12 24h1v1h-1zM16 24h2v1h-2zM20 24h5v1h-5zM27 24h1v1h-1zM0 25h1v1h-1zM2 25h3v1h-3zM6 25h1v1h-1zM9 25h1v1h-1zM11 25h2v1h-2zM15 25h4v1h-4zM24 25h1v1h-1zM26 25h1v1h-1zM0 26h1v1h-1zM2 26h3v1h-3zM6 26h1v1h-1zM8 26h1v1h-1zM11 26h3v1h-3zM15 26h2v1h-2zM19 26h2v1h-2zM23 26h3v1h-3zM28 26h1v1h-1zM0 27h1v1h-1zM6 27h1v1h-1zM13 27h2v1h-2zM16 27h2v1h-2zM20 27h1v1h-1zM22 27h1v1h-1zM24 27h1v1h-1zM27 27h1v1h-1zM0 28h7v1h-7zM8 28h1v1h-1zM12 28h2v1h-2zM15 28h2v1h-2zM18 28h8v1h-8zM27 28h2v1h-2z";

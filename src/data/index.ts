export const SITE_TITLE = "somu nexus";
export const SITE_DESCRIPTION =
	"mobile engineering solutions that solve real problems.";
export const SITE_URL = "https://www.msomu.com";
export const PERSON_NAME = "Somasundaram Mahesh";
export const PERSON_ALTERNATE_NAMES = ["msomu", "somu"] as const;
export const PERSON_EMAIL = "msomasundaram93@gmail.com";
export const PERSON_JOB_TITLE = "Founding AI Engineer";
export const PERSON_DESCRIPTION =
	"Founding AI Engineer at AGI Inc. Founder of United by AI. Organiser at GDG Chennai. Previously crafted streaming experiences for millions at Disney+Hotstar.";
export const CONTACT_TYPE = "inquiries";
export const TOPMATE_URL =
	"https://topmate.io/msomu/2148374?utm_source=public_profile&utm_campaign=msomu";
export const YOUTUBE_URL = "https://youtube.com/@somasundaram.m";
export const WHATSAPP_CHANNEL_URL =
	"https://whatsapp.com/channel/0029VaGe5nY9sBIAggXBtg2E";
export const POSTAL_ADDRESS = {
	addressLocality: "Chennai",
	addressRegion: "Tamil Nadu",
	addressCountry: "IN",
} as const;

export interface MenuItem {
	label: string;
	url: string;
}

export type SocialPlatform =
	| "x"
	| "instagram"
	| "youtube"
	| "github"
	| "linkedin"
	| "whatsapp";

export interface SocialLink {
	id: SocialPlatform;
	label: string;
	url: string;
}

// Menu items
export const menuItems: MenuItem[] = [
	{
		label: "home",
		url: "/",
	},
	{
		label: "writings",
		url: "/writings",
	},
	{
		label: "projects",
		url: "/projects",
	},
	{
		label: "uses",
		url: "/uses",
	},
	{
		label: "talks",
		url: "/talks",
	},
	// {
	// 	label: "thoughts",
	// 	url: "/thoughts",
	// },
	// {
	// 	label: "ships",
	// 	url: "/ships",
	// },
];

// Social links
export const socialLinks: SocialLink[] = [
	{
		id: "x",
		label: "@x",
		url: "https://x.com/msomuin",
	},
	{
		id: "instagram",
		label: "instagram",
		url: "https://www.instagram.com/msomu",
	},
	{
		id: "youtube",
		label: "youtube",
		url: YOUTUBE_URL,
	},
	{
		id: "github",
		label: "github",
		url: "https://github.com/msomu",
	},
	{
		id: "linkedin",
		label: "linkedin",
		url: "https://www.linkedin.com/in/msomu/",
	},
];

export const connectLinks: SocialLink[] = [
	...socialLinks,
	{
		id: "whatsapp",
		label: "whatsapp channel",
		url: WHATSAPP_CHANNEL_URL,
	},
];

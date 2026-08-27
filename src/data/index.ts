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
export const POSTAL_ADDRESS = {
	addressLocality: "Chennai",
	addressRegion: "Tamil Nadu",
	addressCountry: "IN",
} as const;

export interface MenuItem {
	label: string;
	url: string;
}

export interface SocialLink {
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
		label: "@x",
		url: "https://x.com/msomuin",
	},
	{
		label: "instagram",
		url: "https://www.instagram.com/msomu",
	},
	{
		label: "github",
		url: "https://github.com/msomu",
	},
	{
		label: "linkedin",
		url: "https://www.linkedin.com/in/msomu/",
	},
];

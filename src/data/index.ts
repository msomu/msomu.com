export const SITE_TITLE = "somu nexus";
export const SITE_DESCRIPTION =
	"mobile engineering solutions that solve real problems.";

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

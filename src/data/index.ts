export const SITE_TITLE = "somu nexus";
export const SITE_DESCRIPTION = "mobile engineering solutions that solve real problems.";

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
		label: "apps",
		url: "/apps",
	},
	{
		label: "think in code",
		url: "/think-in-code",
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
		label: "email",
		url: "mailto:msomasundaram93@gmail.com",
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

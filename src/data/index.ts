export const SITE_TITLE = "Somu Nexus";
export const SITE_DESCRIPTION = "Mobile Engineering solutions that solve real problems.";

export interface MenuItem {
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
		label: "uses",
		url: "/uses",
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

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	theme: {
		fontFamily: {
			uncut: ["UncutSans", "sans-serif"],
		},
		extend: {
			typography: {
				DEFAULT: {
					css: {
						maxWidth: "none",
					},
				},
				lg: {
					css: {
						maxWidth: "none",
					},
				},
			},
		},
	},
};

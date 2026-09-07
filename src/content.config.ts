import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const article = z.object({
	title: z.string(),
	description: z.string(),
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
	heroImage: z.string().optional(),
});

// Writings are served flat at /{id} by src/pages/[...slug].astro.
const writing = defineCollection({
	loader: glob({ base: "./src/content/writing", pattern: "**/*.{md,mdx}" }),
	schema: article,
});

const whoami = defineCollection({
	loader: glob({ base: "./src/content/whoami", pattern: "**/*.{md,mdx}" }),
	schema: article,
});

// Stays nested at /think-in-code/{id}; the flat catch-all only owns writings.
const thinkInCode = defineCollection({
	loader: glob({
		base: "./src/content/thinkInCode",
		pattern: "**/*.{md,mdx}",
	}),
	schema: article,
});

const talks = defineCollection({
	loader: glob({ base: "./src/content/talks", pattern: "**/*.json" }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		venue: z.string(),
		slideUrl: z.string().optional(),
		videoUrl: z.string().optional(),
	}),
});

export const collections = { writing, whoami, thinkInCode, talks };

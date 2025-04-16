import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "@data/index";
import { getCollection } from "astro:content";

export async function GET(context) {
	const [posts, uses, thinkInCodeItems] = await Promise.all([
		getCollection("writing"),
		getCollection("use"),
		getCollection("thinkInCode"),
	]);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: [
			...posts.map((post) => ({
				...post.data,
				link: `/writings/${post.slug}/`,
			})),
			...uses.map((use) => ({
				...use.data,
				link: `/uses/${use.slug}/`,
			})),
			...thinkInCodeItems.map((item) => ({
				...item.data,
				link: `/think-in-code/${item.slug}/`,
			})),
		],
	});
}

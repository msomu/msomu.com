import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "@data/index";
import { writingPath } from "@utils/writing-routes";

export async function GET(context) {
	const [posts, thinkInCodeItems] = await Promise.all([
		getCollection("writing"),
		getCollection("thinkInCode"),
	]);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		trailingSlash: false,
		items: [
			...posts.map((post) => ({
				...post.data,
				link: writingPath(post.id),
			})),
			...thinkInCodeItems.map((item) => ({
				...item.data,
				link: `/think-in-code/${item.id}`,
			})),
		],
	});
}

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
	const thinkInCodeItems = await getCollection("thinkInCode");

	// Generate the sitemap
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${new URL("/think-in-code", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>

      ${thinkInCodeItems
				.map(
					(post) => `
        <url>
          <loc>${new URL("/think-in-code/" + post.slug, import.meta.env.SITE).href}</loc>
          <lastmod>${post.data.pubDate.toISOString()}</lastmod>
        <changefreq>daily</changefreq>
          <priority>1.0</priority>
        </url>
      `,
				)
				.join("")}
    </urlset>
  `;

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
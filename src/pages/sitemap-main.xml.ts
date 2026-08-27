import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	// Generate the sitemap
	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>${new URL("/", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>

      <url>
        <loc>${new URL("/writings", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>

      <url>
        <loc>${new URL("/uses", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>

      <url>
        <loc>${new URL("/think-in-code", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>

      <url>
        <loc>${new URL("/about", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>

      <url>
        <loc>${new URL("/contact", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>

      <url>
        <loc>${new URL("/privacy", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>

      <url>
        <loc>${new URL("/talks", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>

      <url>
        <loc>${new URL("/projects", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>

      <url>
        <loc>${new URL("/resources", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>

      <url>
        <loc>${new URL("/llms.txt", import.meta.env.SITE).href}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    </urlset>
  `;

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};

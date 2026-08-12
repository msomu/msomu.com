import type { APIRoute } from "astro";

// Content-Signal declares how this site's content may be used by automated
// consumers. It is a stated preference, not an access control — crawlers that
// honour it will comply, nothing here blocks the ones that do not.
// Format and semantics: https://contentsignals.org/
const robotsTxt = `
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

Sitemap: ${new URL("sitemap-index.xml", import.meta.env.SITE).href}
`.trim();

export const GET: APIRoute = () => {
	return new Response(robotsTxt, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
};

import type { APIRoute } from "astro";
import { vcard } from "../../data/connect.ts";

export const GET: APIRoute = () =>
	new Response(vcard(), {
		headers: {
			"Content-Type": "text/vcard; charset=utf-8",
			"Content-Disposition": 'attachment; filename="somasundaram-mahesh.vcf"',
		},
	});

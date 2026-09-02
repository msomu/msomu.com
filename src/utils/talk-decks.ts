import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SLUG = /^[A-Za-z0-9_-]+$/;

export function talksDir(cwd = process.cwd()): string {
	return join(cwd, "public", "talks");
}

export function listTalkSlugs(cwd = process.cwd()): string[] {
	const dir = talksDir(cwd);
	if (!existsSync(dir)) return [];
	return readdirSync(dir, { withFileTypes: true })
		.filter(
			(entry) =>
				entry.isDirectory() &&
				SLUG.test(entry.name) &&
				existsSync(join(dir, entry.name, "index.html")),
		)
		.map((entry) => entry.name);
}

export function readTalkHtml(slug: string, cwd = process.cwd()): string | null {
	if (!SLUG.test(slug)) return null;
	const file = join(talksDir(cwd), slug, "index.html");
	if (!existsSync(file)) return null;
	return readFileSync(file, "utf8");
}

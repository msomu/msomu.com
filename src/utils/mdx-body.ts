function playgroundToFences(body: string): string {
	return body.replace(/<KotlinPlayground\b[\s\S]*?\/>/g, (tag) => {
		const match = tag.match(/\bcode=\{`([\s\S]*?)`\}/);
		if (!match) return "";
		const code = match[1].replace(/^\n/, "").replace(/\n$/, "");
		return `\n\`\`\`kotlin\n${code}\n\`\`\`\n`;
	});
}

export function stripMdxNoise(body: string): string {
	return playgroundToFences(body)
		.split("\n")
		.filter((line) => !/^import\s+.+from\s+.+;?\s*$/.test(line.trim()))
		.join("\n")
		.replace(/^\s*<[A-Z][\s\S]*?\/>\s*$/gm, "")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

export const HTML_TYPE = "text/html";
export const MARKDOWN_TYPE = "text/markdown";

export type NegotiatedType = typeof HTML_TYPE | typeof MARKDOWN_TYPE;
export type NegotiationResult =
	| { kind: "type"; type: NegotiatedType }
	| { kind: "not_acceptable"; requested: string };

interface AcceptEntry {
	type: string;
	q: number;
	specificity: number;
}

interface Candidate {
	type: NegotiatedType;
	q: number;
	specificity: number;
}

const PRODUCED: NegotiatedType[] = [HTML_TYPE, MARKDOWN_TYPE];
const DEFAULT_TYPE: NegotiatedType = HTML_TYPE;

function specificity(type: string): number {
	if (type === "*/*") return 1;
	if (type.endsWith("/*")) return 2;
	return 3;
}

function parseQ(params: string[]): number {
	for (const param of params) {
		const [rawKey, rawValue] = param.split("=");
		if (rawKey?.trim().toLowerCase() !== "q") continue;
		const value = Number.parseFloat((rawValue ?? "").trim());
		if (Number.isNaN(value)) return 0;
		return Math.min(1, Math.max(0, value));
	}
	return 1;
}

export function parseAcceptHeader(header: string | null): AcceptEntry[] | null {
	if (header === null) return null;
	const trimmed = header.trim();
	if (trimmed.length === 0) return [];

	return trimmed.split(",").flatMap((part) => {
		const [rawType, ...params] = part.split(";");
		const type = rawType?.trim().toLowerCase();
		if (!type) return [];
		return [
			{
				type,
				q: parseQ(params),
				specificity: specificity(type),
			},
		];
	});
}

function matches(produced: string, accepted: string): boolean {
	if (accepted === "*/*") return true;
	if (accepted.endsWith("/*")) {
		return produced.startsWith(accepted.slice(0, -1));
	}
	return produced === accepted;
}

function bestMatch(
	produced: string,
	entries: AcceptEntry[],
): AcceptEntry | null {
	let best: AcceptEntry | null = null;
	for (const entry of entries) {
		if (!matches(produced, entry.type)) continue;
		if (!best) {
			best = entry;
			continue;
		}
		if (entry.specificity > best.specificity) {
			best = entry;
			continue;
		}
		if (entry.specificity === best.specificity && entry.q > best.q) {
			best = entry;
		}
	}
	return best;
}

export function negotiateAccept(
	header: string | null,
	produced: readonly NegotiatedType[] = PRODUCED,
	fallback: NegotiatedType = DEFAULT_TYPE,
): NegotiationResult {
	const entries = parseAcceptHeader(header);
	if (entries === null) {
		return { kind: "type", type: fallback };
	}

	const scored: Candidate[] = [];
	for (const type of produced) {
		const match = bestMatch(type, entries);
		if (!match || match.q <= 0) continue;
		scored.push({ type, q: match.q, specificity: match.specificity });
	}

	if (scored.length === 0) {
		return { kind: "not_acceptable", requested: header?.trim() || "(empty)" };
	}

	scored.sort((a, b) => {
		if (b.q !== a.q) return b.q - a.q;
		if (b.specificity !== a.specificity) return b.specificity - a.specificity;
		if (a.type === fallback) return -1;
		if (b.type === fallback) return 1;
		return 0;
	});

	return { kind: "type", type: scored[0].type };
}

export function prefersMarkdown(header: string | null): boolean {
	const result = negotiateAccept(header);
	return result.kind === "type" && result.type === MARKDOWN_TYPE;
}

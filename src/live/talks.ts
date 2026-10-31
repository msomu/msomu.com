import setGoalNotes from "./notes/set-goal-start-loop-sleep.json";

export interface SlideNote {
	title: string;
	notes: string;
}

export interface LiveTalk {
	/** SHA-256 hex of the presenter key. The key itself never lives in the repo. */
	keyHash: string;
	notes: SlideNote[];
}

/** Talks that can be driven live from a phone at /talks/{slug}/remote. */
export const liveTalks: Record<string, LiveTalk> = {
	"set-goal-start-loop-sleep": {
		keyHash: "12c7506b313b5f1984820e084dd8d1c93fe01e264eb582f7eaa6732972ac308b",
		notes: setGoalNotes,
	},
};

export async function sha256Hex(text: string): Promise<string> {
	const digest = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(text),
	);
	return [...new Uint8Array(digest)]
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

export async function isPresenter(
	talk: LiveTalk,
	key: unknown,
): Promise<boolean> {
	if (typeof key !== "string" || key.length < 8 || key.length > 200) {
		return false;
	}
	return (await sha256Hex(key)) === talk.keyHash;
}

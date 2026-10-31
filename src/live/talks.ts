import setGoalNotes from "./notes/set-goal-start-loop-sleep.json";

export interface SlideNote {
	title: string;
	notes: string;
}

export interface LiveTalk {
	notes: SlideNote[];
}

/** Talks that can be driven live from a phone at /talks/{slug}/remote. */
export const liveTalks: Record<string, LiveTalk> = {
	"set-goal-start-loop-sleep": {
		notes: setGoalNotes,
	},
};

/** A pairing code the laptop generates: random, so nobody else can join that room. */
export const PAIRING_CODE = /^[a-z0-9]{12,40}$/;

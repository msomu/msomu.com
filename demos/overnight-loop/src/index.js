// Every function below is a stub. The overnight agent's job is to make
// `node check.mjs` print PASS without touching tests/ or check.mjs.

/** "Salem Devfest 2026!" -> "salem-devfest-2026" */
export function slugify(title) {
	return undefined; // TODO: slugify
}

/** 123456.5 -> "₹1,23,456.50" (Indian digit grouping, always 2 decimals) */
export function formatINR(amount) {
	return undefined; // TODO: formatINR
}

/** "636001" -> true. Six digits, first digit 1-9. */
export function isValidPincode(pincode) {
	return undefined; // TODO: isValidPincode
}

/** "1h30m" -> 90, "45m" -> 45, "2h" -> 120. Throws on anything else. */
export function parseDuration(text) {
	return undefined; // TODO: parseDuration
}

/** chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]. Throws if size < 1. */
export function chunk(items, size) {
	return undefined; // TODO: chunk
}

/** "Was it a car or a cat I saw?" -> true. Ignores case, spaces, punctuation. */
export function isPalindrome(text) {
	return undefined; // TODO: isPalindrome
}

/** "set goal start loop" -> "setGoalStartLoop" */
export function camelCase(text) {
	return undefined; // TODO: camelCase
}

/** "  Set goal.   Start loop. Sleep. " -> 5 */
export function wordCount(text) {
	return undefined; // TODO: wordCount
}

/** "MCMXCIV" -> 1994. Throws on invalid numerals. */
export function romanToInt(roman) {
	return undefined; // TODO: romanToInt
}

/**
 * Build a talk schedule.
 * schedule("10:00", [{ title: "Keynote", minutes: 45 }]) ->
 *   [{ title: "Keynote", start: "10:00", end: "10:45" }]
 * Talks run back to back. Times are 24h "HH:MM".
 */
export function schedule(startTime, talks) {
	return undefined; // TODO: schedule
}

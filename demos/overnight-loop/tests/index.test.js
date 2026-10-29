import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	camelCase,
	chunk,
	formatINR,
	isPalindrome,
	isValidPincode,
	parseDuration,
	romanToInt,
	schedule,
	slugify,
	wordCount,
} from "../src/index.js";

describe("slugify", () => {
	it("lowercases and joins words with dashes", () => {
		assert.equal(slugify("Salem Devfest 2026!"), "salem-devfest-2026");
	});
	it("collapses repeated separators and trims the ends", () => {
		assert.equal(slugify("  Set Goal. Start Loop. Sleep.  "), "set-goal-start-loop-sleep");
	});
});

describe("formatINR", () => {
	it("uses Indian digit grouping", () => {
		assert.equal(formatINR(123456.5), "₹1,23,456.50");
	});
	it("handles crores", () => {
		assert.equal(formatINR(12345678), "₹1,23,45,678.00");
	});
	it("handles small amounts", () => {
		assert.equal(formatINR(999), "₹999.00");
	});
});

describe("isValidPincode", () => {
	it("accepts Salem's pincode", () => {
		assert.equal(isValidPincode("636001"), true);
	});
	it("rejects bad pincodes", () => {
		assert.equal(isValidPincode("036001"), false);
		assert.equal(isValidPincode("63600"), false);
		assert.equal(isValidPincode("6360011"), false);
		assert.equal(isValidPincode("63a001"), false);
	});
});

describe("parseDuration", () => {
	it("parses hours and minutes", () => {
		assert.equal(parseDuration("1h30m"), 90);
		assert.equal(parseDuration("45m"), 45);
		assert.equal(parseDuration("2h"), 120);
	});
	it("throws on garbage", () => {
		assert.throws(() => parseDuration("soon"));
		assert.throws(() => parseDuration(""));
	});
});

describe("chunk", () => {
	it("splits into groups", () => {
		assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
	});
	it("returns an empty list for an empty input", () => {
		assert.deepEqual(chunk([], 3), []);
	});
	it("throws when size is less than 1", () => {
		assert.throws(() => chunk([1], 0));
	});
});

describe("isPalindrome", () => {
	it("ignores case, spaces and punctuation", () => {
		assert.equal(isPalindrome("Was it a car or a cat I saw?"), true);
	});
	it("rejects non palindromes", () => {
		assert.equal(isPalindrome("Salem"), false);
	});
});

describe("camelCase", () => {
	it("joins words in camel case", () => {
		assert.equal(camelCase("set goal start loop"), "setGoalStartLoop");
	});
	it("handles dashes, underscores and caps", () => {
		assert.equal(camelCase("Start-LOOP_now"), "startLoopNow");
	});
});

describe("wordCount", () => {
	it("counts words with messy spacing", () => {
		assert.equal(wordCount("  Set goal.   Start loop. Sleep. "), 5);
	});
	it("returns 0 for blank text", () => {
		assert.equal(wordCount("   "), 0);
	});
});

describe("romanToInt", () => {
	it("converts numerals", () => {
		assert.equal(romanToInt("III"), 3);
		assert.equal(romanToInt("IX"), 9);
		assert.equal(romanToInt("MCMXCIV"), 1994);
		assert.equal(romanToInt("MMXXVI"), 2026);
	});
	it("throws on invalid numerals", () => {
		assert.throws(() => romanToInt("ABC"));
		assert.throws(() => romanToInt(""));
	});
});

describe("schedule", () => {
	it("runs talks back to back", () => {
		assert.deepEqual(
			schedule("10:00", [
				{ title: "Keynote", minutes: 45 },
				{ title: "Set Goal. Start Loop. Sleep.", minutes: 40 },
			]),
			[
				{ title: "Keynote", start: "10:00", end: "10:45" },
				{ title: "Set Goal. Start Loop. Sleep.", start: "10:45", end: "11:25" },
			],
		);
	});
	it("rolls over the hour and pads times", () => {
		assert.deepEqual(schedule("09:50", [{ title: "Lightning", minutes: 15 }]), [
			{ title: "Lightning", start: "09:50", end: "10:05" },
		]);
	});
});

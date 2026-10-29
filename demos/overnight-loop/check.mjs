// The finish line. Prints PASS or FAIL and exits 0 or 1.
// PASS means: every test passes, no TODO stubs left in src/,
// and the tests and this script match the hashes in LOCK.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const problems = [];

const lock = Object.fromEntries(
	readFileSync("LOCK", "utf8")
		.trim()
		.split("\n")
		.map((line) => line.split(/\s+/).reverse()),
);
for (const [file, expected] of Object.entries(lock)) {
	const actual = createHash("sha256").update(readFileSync(file)).digest("hex");
	if (actual !== expected) problems.push(`${file} was changed. The finish line is not yours to move.`);
}

const run = spawnSync(process.execPath, ["--test", "--test-reporter=tap", "tests/*.test.js"], { encoding: "utf8" });
const count = (name) => Number(run.stdout.match(new RegExp(`^# ${name} (\\d+)`, "m"))?.[1] ?? 0);
const passed = count("pass");
const total = count("tests");
if (total === 0 || passed !== total) problems.push(`${passed}/${total} tests passing`);

if (readFileSync("src/index.js", "utf8").includes("TODO")) problems.push("TODO stubs left in src/index.js");

if (problems.length === 0) {
	console.log(`PASS ${passed}/${total} tests passing`);
	process.exit(0);
}
console.log(`FAIL\n- ${problems.join("\n- ")}`);
process.exit(1);

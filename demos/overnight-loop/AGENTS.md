# Rules for the overnight agent

The goal is in GOAL.md. The finish line is `node check.mjs` printing PASS.

## Each iteration
1. Run `node check.mjs` and read what is still failing.
2. Pick one failing function. Make the smallest change that should fix it.
3. Run `node check.mjs` again.
4. If more tests pass than before, commit with a message like `Implement slugify (8/22 -> 10/22)`.
   If not, discard the change with `git checkout -- src/index.js`.
5. Append one row to decisions.tsv (tab separated):
   `time  function  decision  reason  evidence  result`
   evidence is the check output line, result is `kept` or `discarded`.
6. Go back to step 1.

## Never
- Never edit tests/, check.mjs or LOCK. Changing the finish line is not finishing.
- Never add dependencies. Plain Node 22 only.
- Never stop because it "looks done". Only PASS from check.mjs counts.

## Stop when
- `node check.mjs` prints PASS. Write a three line summary at the end of decisions.tsv as a comment row.
- Or you are truly stuck on the same failure after several different approaches: write STUCK.md with what you tried and why it failed, then stop.

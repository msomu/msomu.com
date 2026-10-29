#!/usr/bin/env bash
# The dumbest loop that works. Each pass is a fresh agent that reads
# GOAL.md + AGENTS.md, does one thing, commits, and exits.
# Stops when check.mjs prints PASS or the agent writes STUCK.md.
set -u
cd "$(dirname "$0")"
max_passes="${MAX_PASSES:-30}"
for ((i = 1; i <= max_passes; i++)); do
	if node check.mjs > /dev/null; then echo "PASS after $((i - 1)) passes"; exit 0; fi
	if [ -f STUCK.md ]; then echo "Agent is stuck, read STUCK.md"; exit 1; fi
	echo "=== pass $i ==="
	claude -p "Follow AGENTS.md. Do exactly one iteration, then exit." \
		--permission-mode acceptEdits --allowedTools "Bash(node:*) Bash(git:*)"
done
echo "Gave up after $max_passes passes"
exit 1

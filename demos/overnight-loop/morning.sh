#!/usr/bin/env bash
# The morning audit: did it finish, did it cheat, what did it decide?
cd "$(dirname "$0")"
base="${1:-overnight-start}"
echo "== Finish line"; node check.mjs
echo; echo "== Did the finish line move? (should be empty)"
git diff --stat "$base" -- tests check.mjs LOCK
echo; echo "== Commits overnight"; git log --oneline "$base"..HEAD -- .
echo; echo "== Decision log"; if command -v column >/dev/null; then column -t -s $'\t' decisions.tsv; else cat decisions.tsv; fi
[ -f STUCK.md ] && { echo; echo "== STUCK.md"; cat STUCK.md; }

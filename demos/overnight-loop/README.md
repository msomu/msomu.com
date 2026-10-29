# overnight-loop

The live receipt for the talk **Set Goal. Start Loop. Sleep.** (Salem Devfest).

Ten small functions in `src/index.js`, all stubbed. 22 tests in `tests/`. One finish line:

```bash
node check.mjs
```

It prints `PASS 22/22 tests passing` or `FAIL` with what's missing. It also fails if anyone
edits `tests/`, `check.mjs` or `LOCK`, so the agent can't win by moving the finish line.

The task is deterministic: same tests, same check, same PASS. The path the agent takes is not,
and that's the point of the decision log.

## Files

| File | What it is |
|---|---|
| `GOAL.md` | The four line overnight contract: goal, finish line, permissions, escape hatch |
| `AGENTS.md` | The loop rules: one change, one check, commit or discard, one log row |
| `check.mjs` + `LOCK` | The finish line and its tamper seal |
| `decisions.tsv` | The agent's decision log. You read this in the morning, not the transcript |
| `ralph.sh` | The `while` loop version: a fresh `claude -p` per pass until PASS |
| `morning.sh` | The audit: PASS?, did the locked files move?, commits, decision log |

## Tonight

Mark the starting point so the morning audit has something to diff against:

```bash
git tag overnight-start
```

Then pick one way to run it.

**1. Claude Code with `/goal`** (in auto mode so it doesn't stop for permission):

```text
/goal node check.mjs prints PASS. Follow GOAL.md and AGENTS.md.
```

**2. The Ralph loop**, a fresh agent per pass:

```bash
./ralph.sh
```

**3. In the cloud, laptop closed.** Start a session at claude.ai/code (or a Cursor cloud agent)
on this repo with:

```text
cd demos/overnight-loop. Read GOAL.md and AGENTS.md, then loop until node check.mjs prints PASS.
Push the branch and open a draft PR when done.
```

## Tomorrow morning

```bash
./morning.sh
```

## Reset for another run

```bash
git checkout overnight-start -- src/index.js decisions.tsv && rm -f STUCK.md
```

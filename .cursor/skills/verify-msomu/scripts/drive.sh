#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

usage() {
	echo "usage: $0 <feature-id> [output-dir]" >&2
	echo "feature ids: homepage | writings | connect | talks | agent-markdown | uses" >&2
	exit 1
}

[[ $# -ge 1 ]] || usage
FEATURE="$1"
OUT_DIR="${2:-$EVIDENCE_DIR/$(date -u +%Y%m%dT%H%M%SZ)-$FEATURE}"
mkdir -p "$OUT_DIR"

require_cmd curl
if ! server_responds; then
	echo "server not running at $BASE_URL; run scripts/launch.sh" >&2
	exit 1
fi

drive_homepage() {
	curl -fsS -D "$OUT_DIR/homepage.headers" -o "$OUT_DIR/homepage.html" "$BASE_URL/"
	grep -q 'building ai agents' "$OUT_DIR/homepage.html"
	grep -q 'id="recent-writings"' "$OUT_DIR/homepage.html"
	grep -q 'href="/writings"' "$OUT_DIR/homepage.html"
	grep -q 'id="social-links"' "$OUT_DIR/homepage.html"
	echo "homepage: ok"
}

drive_writings() {
	curl -fsS -D "$OUT_DIR/writings.headers" -o "$OUT_DIR/writings.html" "$BASE_URL/writings"
	grep -qi 'writings' "$OUT_DIR/writings.html"
	slug="$(grep -oE 'href="/[a-z0-9-]+"' "$OUT_DIR/writings.html" | sed 's/href="\///;s/"//' | grep -vE '^(writings|talks|projects|uses|connect|about|contact|privacy|resources|think-in-code)$' | head -1)"
	[[ -n "$slug" ]] || { echo "writings: no post slug found" >&2; exit 1; }
	curl -fsS -D "$OUT_DIR/writing-detail.headers" -o "$OUT_DIR/writing-detail.html" "$BASE_URL/$slug"
	grep -q 'id="blog-content"' "$OUT_DIR/writing-detail.html"
	redirect="$(curl -sS -o /dev/null -w '%{http_code} %{redirect_url}' --max-redirs 0 "$BASE_URL/writings/$slug")"
	printf '%s\n' "$redirect" >"$OUT_DIR/legacy-redirect.txt"
	[[ "$redirect" == "308 $BASE_URL/$slug" || "$redirect" == "308 /$slug" ]] || {
		echo "writings: expected 308 to /$slug, got: $redirect" >&2
		exit 1
	}
	echo "writings: ok ($slug, legacy 308)"
}

drive_connect() {
	curl -fsS -D "$OUT_DIR/connect.headers" -o "$OUT_DIR/connect.html" "$BASE_URL/connect"
	grep -qE '<h1[^>]*>[[:space:]]*Connect' "$OUT_DIR/connect.html"
	grep -q 'aria-label="Connect on @x"' "$OUT_DIR/connect.html"
	grep -q 'github.com/msomu' "$OUT_DIR/connect.html"
	grep -q 'whatsapp.com/channel' "$OUT_DIR/connect.html"
	curl -fsS -D "$OUT_DIR/connect-md.headers" -o "$OUT_DIR/connect.md" -H 'Accept: text/markdown' "$BASE_URL/connect"
	grep -qi 'content-type: text/markdown' "$OUT_DIR/connect-md.headers"
	grep -q '^# Connect' "$OUT_DIR/connect.md"
	echo "connect: ok"
}

drive_talks() {
	curl -fsS -D "$OUT_DIR/talks.headers" -o "$OUT_DIR/talks.html" "$BASE_URL/talks"
	grep -qi 'talks' "$OUT_DIR/talks.html"
	for path in /talks/receipt /talks/stop-building-ai-demos /talks/five-eras-of-ai-assisted-android /talks/i-gave-ai-a-computer-and-walked-away /talks/set-goal-start-loop-sleep; do
		safe="$(echo "$path" | tr '/.' '_')"
		curl -fsS -D "$OUT_DIR/${safe}.headers" -o "$OUT_DIR/${safe}.html" "$BASE_URL$path"
		grep -qi 'reveal' "$OUT_DIR/${safe}.html"
	done
	curl -fsS -D "$OUT_DIR/_talks_the-receipt-loop.headers" -o "$OUT_DIR/_talks_the-receipt-loop.html" "$BASE_URL/talks/the-receipt-loop"
	grep -q 'The Receipt Loop' "$OUT_DIR/_talks_the-receipt-loop.html"
	grep -q 'A claim becomes a receipt' "$OUT_DIR/_talks_the-receipt-loop.html"
	grep -q 'Their results, not our rate' "$OUT_DIR/_talks_the-receipt-loop.html"
	grep -q 'From This Room to the <span class="orange">Internet</span>' "$OUT_DIR/_talks_the-receipt-loop.html"
	grep -q 'Pi, at pi.dev' "$OUT_DIR/_talks_the-receipt-loop.html"
	grep -q 'It waits for my tap' "$OUT_DIR/_talks_the-receipt-loop.html"
	grep -q 'You are an issue triage automation for Linear.' "$OUT_DIR/_talks_the-receipt-loop.html"
	grep -q 'Daily Sync' "$OUT_DIR/_talks_the-receipt-loop.html"
	grep -q 'Naman &lt;&gt; Somu 1-on-1' "$OUT_DIR/_talks_the-receipt-loop.html"
	grep -q 'somu-agi' "$OUT_DIR/_talks_the-receipt-loop.html"
	grep -qi 'reveal' "$OUT_DIR/_talks_the-receipt-loop.html"
	if grep -q 'frame_1.png' "$OUT_DIR/_talks_the-receipt-loop.html"; then
		echo "talks: receipt loop still references tldraw frame images" >&2
		exit 1
	fi
	curl -fsS -D "$OUT_DIR/_talks_one-job-per-bot.headers" -o "$OUT_DIR/_talks_one-job-per-bot.html" "$BASE_URL/talks/one-job-per-bot"
	grep -q 'One Job Per Bot' "$OUT_DIR/_talks_one-job-per-bot.html"
	grep -q 'Grok Bots' "$OUT_DIR/_talks_one-job-per-bot.html"
	grep -q 'Edit Video' "$OUT_DIR/_talks_one-job-per-bot.html"
	grep -q 'Generate Video' "$OUT_DIR/_talks_one-job-per-bot.html"
	grep -q 'Which model for which job' "$OUT_DIR/_talks_one-job-per-bot.html"
	grep -q 'No single model does the whole job' "$OUT_DIR/_talks_one-job-per-bot.html"
	grep -q 'docs.x.ai/grok-bot' "$OUT_DIR/_talks_one-job-per-bot.html"
	grep -q 'help.descript.com' "$OUT_DIR/_talks_one-job-per-bot.html"
	grep -q 'Veo 3.1' "$OUT_DIR/_talks_one-job-per-bot.html"
	grep -qi 'reveal' "$OUT_DIR/_talks_one-job-per-bot.html"
	if grep -q '<img' "$OUT_DIR/_talks_one-job-per-bot.html"; then
		echo "talks: one job per bot includes an image" >&2
		exit 1
	fi
	curl -fsS -D "$OUT_DIR/_talks_phone-mcp-workshop.headers" -o "$OUT_DIR/_talks_phone-mcp-workshop.html" "$BASE_URL/talks/phone-mcp-workshop"
	grep -q 'Your phone, driven by any AI' "$OUT_DIR/_talks_phone-mcp-workshop.html"
	grep -q 'api.agi.tech/v1/mcp' "$OUT_DIR/_talks_phone-mcp-workshop.html"
	remote_slug=set-goal-start-loop-sleep
	curl -fsSL -o "$OUT_DIR/remote.html" "$BASE_URL/talks/$remote_slug/remote"
	grep -q 'msomu-remote-room' "$OUT_DIR/remote.html"
	curl -fsS -D "$OUT_DIR/remote-notes.headers" -o "$OUT_DIR/remote-notes.json" "$BASE_URL/api/live/$remote_slug/notes"
	grep -qi 'content-type: application/json' "$OUT_DIR/remote-notes.headers"
	[[ "$(curl -s -o /dev/null -w '%{http_code}' "$BASE_URL/api/live/$remote_slug/ws")" == 400 ]]
	[[ "$(curl -s -o /dev/null -w '%{http_code}' "$BASE_URL/api/live/$remote_slug/ws?room=abcdefghijkl")" == 426 ]]
	[[ "$(curl -s -o /dev/null -w '%{http_code}' "$BASE_URL/api/live/unknown-talk/notes")" == 404 ]]
	echo "talks: ok"
}

drive_agent_markdown() {
	curl -fsS -D "$OUT_DIR/homepage-md.headers" -o "$OUT_DIR/homepage.md" -H 'Accept: text/markdown' "$BASE_URL/"
	grep -qi 'Somasundaram\|somu\|msomu' "$OUT_DIR/homepage.md"
	grep -qi 'content-type: text/markdown' "$OUT_DIR/homepage-md.headers"
	grep -qi 'vary: accept' "$OUT_DIR/homepage-md.headers"
	if grep -q '<html' "$OUT_DIR/homepage.md"; then
		echo "agent-markdown: markdown response contains an html element" >&2
		exit 1
	fi
	curl -fsS -D "$OUT_DIR/llms.headers" -o "$OUT_DIR/llms.txt" "$BASE_URL/llms.txt"
	grep -q 'When to use this site' "$OUT_DIR/llms.txt"
	missing_status="$(curl -sS -o "$OUT_DIR/not-found.md" -w '%{http_code}' -H 'Accept: text/markdown' "$BASE_URL/some-path-that-does-not-exist")"
	[[ "$missing_status" == 404 ]]
	grep -q '^# Not found' "$OUT_DIR/not-found.md"
	grep -q 'llms.txt' "$OUT_DIR/not-found.md"
	grep -q 'sitemap' "$OUT_DIR/not-found.md"
	echo "agent-markdown: ok"
}

drive_uses() {
	curl -fsS -D "$OUT_DIR/uses.headers" -o "$OUT_DIR/uses.html" "$BASE_URL/uses"
	grep -q 'Tools I use' "$OUT_DIR/uses.html"
	for section in Devices Development Productivity Vehicles; do
		grep -q ">$section<" "$OUT_DIR/uses.html"
	done
	grep -q 'text-orange-500' "$OUT_DIR/uses.html"
	curl -fsS -D "$OUT_DIR/uses-md.headers" -o "$OUT_DIR/uses.md" "$BASE_URL/uses.md"
	grep -qi 'content-type: text/markdown' "$OUT_DIR/uses-md.headers"
	grep -q '^# Tools I use' "$OUT_DIR/uses.md"
	echo "uses: ok"
}

case "$FEATURE" in
homepage) drive_homepage ;;
writings) drive_writings ;;
connect) drive_connect ;;
talks) drive_talks ;;
agent-markdown) drive_agent_markdown ;;
uses) drive_uses ;;
*) usage ;;
esac

cat >"$OUT_DIR/manifest.json" <<EOF
{"feature":"$FEATURE","baseUrl":"$BASE_URL","capturedAt":"$(date -u +%Y-%m-%dT%H:%M:%SZ)"}
EOF

echo "evidence: $OUT_DIR"

#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

usage() {
	echo "usage: $0 <feature-id> [output-dir]" >&2
	echo "feature ids: homepage | writings | connect | talks | agent-markdown" >&2
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
	echo "homepage: ok"
}

drive_writings() {
	curl -fsS -D "$OUT_DIR/writings.headers" -o "$OUT_DIR/writings.html" "$BASE_URL/writings"
	grep -qi 'writings' "$OUT_DIR/writings.html"
	slug="$(grep -oE 'href="/[a-z0-9-]+"' "$OUT_DIR/writings.html" | sed 's/href="\///;s/"//' | grep -vE '^(writings|talks|projects|uses|connect|about|contact|privacy|resources)$' | head -1)"
	[[ -n "$slug" ]] || { echo "writings: no post slug found" >&2; exit 1; }
	curl -fsS -D "$OUT_DIR/writing-detail.headers" -o "$OUT_DIR/writing-detail.html" "$BASE_URL/$slug"
	grep -qi "$slug" "$OUT_DIR/writing-detail.html"
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
	grep -q 'aria-label="Connect on @x"' "$OUT_DIR/connect.html"
	grep -q 'github.com/msomu' "$OUT_DIR/connect.html"
	grep -q 'whatsapp.com/channel' "$OUT_DIR/connect.html"
	echo "connect: ok"
}

drive_talks() {
	for path in /talks /talks/receipt /talks/stop-building-ai-demos /talks/i-gave-ai-a-computer-and-walked-away; do
		safe="$(echo "$path" | tr '/.' '_')"
		curl -fsS -D "$OUT_DIR/${safe}.headers" -o "$OUT_DIR/${safe}.html" "$BASE_URL$path"
		grep -qi 'talks\|reveal' "$OUT_DIR/${safe}.html"
	done
	echo "talks: ok"
}

drive_agent_markdown() {
	curl -fsS -D "$OUT_DIR/homepage-md.headers" -o "$OUT_DIR/homepage.md" -H 'Accept: text/markdown' "$BASE_URL/"
	grep -qi 'Somasundaram\|somu\|msomu' "$OUT_DIR/homepage.md"
	grep -qi 'vary: accept' "$OUT_DIR/homepage-md.headers"
	curl -fsS -D "$OUT_DIR/llms.headers" -o "$OUT_DIR/llms.txt" "$BASE_URL/llms.txt"
	grep -q 'When to use this site' "$OUT_DIR/llms.txt"
	echo "agent-markdown: ok"
}

case "$FEATURE" in
homepage) drive_homepage ;;
writings) drive_writings ;;
connect) drive_connect ;;
talks) drive_talks ;;
agent-markdown) drive_agent_markdown ;;
*) usage ;;
esac

cat >"$OUT_DIR/manifest.json" <<EOF
{"feature":"$FEATURE","baseUrl":"$BASE_URL","capturedAt":"$(date -u +%Y-%m-%dT%H:%M:%SZ)"}
EOF

echo "evidence: $OUT_DIR"

#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

export PATH="$HOME/.bun/bin:$PATH"
require_cmd curl
require_cmd bun
require_cmd node

node_major="$(node -p 'process.versions.node.split(".")[0]')"
if (( node_major < 22 )); then
	echo "node >= 22 required; got $(node -v)" >&2
	exit 1
fi

if [[ ! -f "$REPO_ROOT/package.json" ]]; then
	echo "package.json not found at repo root $REPO_ROOT" >&2
	exit 1
fi

if [[ ! -d "$REPO_ROOT/node_modules" ]]; then
	echo "node_modules missing; run: cd $REPO_ROOT && bun install" >&2
	exit 1
fi

if ! server_responds; then
	echo "doctor: server not responding at $BASE_URL (run scripts/launch.sh first)" >&2
	exit 1
fi

status="$(curl -fsS -o /dev/null -w "%{http_code}" "$BASE_URL/")"
if [[ "$status" != "200" ]]; then
	echo "doctor: GET / returned HTTP $status" >&2
	exit 1
fi

body="$(curl -fsS "$BASE_URL/")"
for needle in 'building ai agents' 'id="recent-writings"' 'href="/writings"' 'href="/talks"'; do
	if ! grep -q "$needle" <<<"$body"; then
		echo "doctor: homepage missing expected marker: $needle" >&2
		exit 1
	fi
done

echo "doctor: ok (bun $(bun --version), node $(node -v), $BASE_URL healthy)"

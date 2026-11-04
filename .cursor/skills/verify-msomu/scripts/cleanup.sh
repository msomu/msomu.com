#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

require_cmd bun

# `bun dev` exits once Astro starts its background server, so the saved pid is
# not the server. Astro tracks one dev server per checkout and stops it by name.
if [[ -f "$PID_FILE" ]]; then
	(cd "$REPO_ROOT" && bun x astro dev stop) >/dev/null 2>&1
	if ! astro_dev_status | grep -q 'No dev server is running'; then
		echo "cleanup: dev server still running: $(astro_dev_status)" >&2
		exit 1
	fi
	echo "cleanup: stopped dev server for this checkout"
	rm -f "$PID_FILE"
else
	echo "cleanup: no pid file; nothing to stop"
fi

if [[ -d "$EVIDENCE_DIR" ]] && [[ -n "$(ls -A "$EVIDENCE_DIR" 2>/dev/null || true)" ]]; then
	echo "cleanup: evidence preserved at $EVIDENCE_DIR"
else
	echo "cleanup: no evidence directory yet"
fi

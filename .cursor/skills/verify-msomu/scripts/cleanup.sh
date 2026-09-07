#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

if [[ -f "$PID_FILE" ]]; then
	pid="$(read_pid)"
	if pid_alive "$pid"; then
		kill "$pid" 2>/dev/null || true
		for _ in $(seq 1 10); do
			pid_alive "$pid" || break
			sleep 0.5
		done
		if pid_alive "$pid"; then
			echo "cleanup: pid $pid still running after SIGTERM" >&2
			exit 1
		fi
		echo "cleanup: stopped dev server (pid $pid)"
	else
		echo "cleanup: stale pid file (pid $pid not running)"
	fi
	rm -f "$PID_FILE"
else
	echo "cleanup: no pid file; nothing to stop"
fi

if [[ -d "$EVIDENCE_DIR" ]] && [[ -n "$(ls -A "$EVIDENCE_DIR" 2>/dev/null || true)" ]]; then
	echo "cleanup: evidence preserved at $EVIDENCE_DIR"
else
	echo "cleanup: no evidence directory yet"
fi

#!/usr/bin/env bash
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_ROOT="$(git -C "$SKILL_DIR" rev-parse --show-toplevel)"
STATE_DIR="$SKILL_DIR/.verify-state"
EVIDENCE_DIR="$SKILL_DIR/evidence"
PID_FILE="$STATE_DIR/dev-server.pid"
LOG_FILE="$STATE_DIR/dev-server.log"
BASE_URL="${BASE_URL:-http://127.0.0.1:4321}"
DEV_HOST="${DEV_HOST:-127.0.0.1}"
DEV_PORT="${DEV_PORT:-4321}"

mkdir -p "$STATE_DIR" "$EVIDENCE_DIR"

require_cmd() {
	if ! command -v "$1" >/dev/null 2>&1; then
		echo "missing required command: $1" >&2
		exit 1
	fi
}

server_responds() {
	curl -fsS -o /dev/null -w "%{http_code}" "$BASE_URL/" 2>/dev/null | grep -q '^200$'
}

read_pid() {
	if [[ -f "$PID_FILE" ]]; then
		cat "$PID_FILE"
	fi
}

pid_alive() {
	local pid="${1:-}"
	[[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

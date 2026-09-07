#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=common.sh
source "$SCRIPT_DIR/common.sh"

require_cmd curl
export PATH="$HOME/.bun/bin:$PATH"
require_cmd bun

existing_pid="$(read_pid || true)"
if pid_alive "$existing_pid" && server_responds; then
	echo "dev server already running (pid $existing_pid) at $BASE_URL"
	exit 0
fi

if server_responds; then
	echo "port $DEV_PORT already serves HTTP 200 at $BASE_URL but is not tracked by this skill" >&2
	echo "stop the other process or set DEV_PORT to a free port before launching" >&2
	exit 1
fi

cd "$REPO_ROOT"
nohup bun dev --host "$DEV_HOST" --port "$DEV_PORT" >"$LOG_FILE" 2>&1 &
server_pid=$!
echo "$server_pid" >"$PID_FILE"

for _ in $(seq 1 60); do
	if server_responds; then
		echo "dev server ready at $BASE_URL (pid $server_pid)"
		exit 0
	fi
	if ! pid_alive "$server_pid"; then
		echo "dev server exited before becoming ready; see $LOG_FILE" >&2
		tail -n 40 "$LOG_FILE" >&2 || true
		exit 1
	fi
	sleep 1
done

echo "timed out waiting for $BASE_URL; see $LOG_FILE" >&2
tail -n 40 "$LOG_FILE" >&2 || true
exit 1

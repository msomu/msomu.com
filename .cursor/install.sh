#!/usr/bin/env bash
set -euo pipefail

if ! command -v bun >/dev/null 2>&1; then
	curl -fsSL https://bun.sh/install | bash
fi

export PATH="$HOME/.bun/bin:$PATH"
bun install --frozen-lockfile

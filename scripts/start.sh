#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PID_FILE="$ROOT/.dev-server.pid"
LOG_FILE="$ROOT/.dev-server.log"
PORT="${PORT:-5173}"

log() { echo "[start] $*"; }

check_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "ERROR: $1 is not installed" >&2
    exit 1
  fi
}

log "Validating environment..."
check_command node
check_command npm

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "ERROR: Node.js 18+ required (found $(node -v))" >&2
  exit 1
fi

for dir in src public scripts; do
  if [ ! -d "$ROOT/$dir" ]; then
    echo "ERROR: Missing directory $dir" >&2
    exit 1
  fi
done

for f in package.json vite.config.ts index.html; do
  if [ ! -f "$ROOT/$f" ]; then
    echo "ERROR: Missing file $f" >&2
    exit 1
  fi
done

if [ ! -d "$ROOT/node_modules" ]; then
  log "Installing dependencies..."
  npm install
fi

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  log "Dev server already running (PID $(cat "$PID_FILE"))"
  exit 0
fi

if lsof -i ":$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "ERROR: Port $PORT is already in use" >&2
  lsof -i ":$PORT" -sTCP:LISTEN || true
  exit 1
fi

log "Starting dev server on port $PORT..."
nohup npm run dev -- --host 0.0.0.0 --port "$PORT" >"$LOG_FILE" 2>&1 &
echo $! >"$PID_FILE"

for i in $(seq 1 30); do
  if curl -sf "http://localhost:$PORT" >/dev/null 2>&1; then
    log "Dev server healthy at http://localhost:$PORT"
    exit 0
  fi
  sleep 1
done

echo "ERROR: Dev server failed to start. Check $LOG_FILE" >&2
tail -20 "$LOG_FILE" >&2 || true
exit 1

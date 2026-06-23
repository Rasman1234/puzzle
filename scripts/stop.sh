#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$ROOT/.dev-server.pid"
PORT="${PORT:-5173}"

log() { echo "[stop] $*"; }

stopped=false

if [ -f "$PID_FILE" ]; then
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    log "Stopping dev server (PID $PID)..."
    kill "$PID" 2>/dev/null || true
    for i in $(seq 1 10); do
      kill -0 "$PID" 2>/dev/null || { stopped=true; break; }
      sleep 0.5
    done
    if [ "$stopped" = false ]; then
      log "Force killing PID $PID..."
      kill -9 "$PID" 2>/dev/null || true
    fi
  fi
  rm -f "$PID_FILE"
fi

# Also stop any vite on our port
if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -ti ":$PORT" -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
    log "Stopping processes on port $PORT..."
    echo "$PIDS" | xargs kill 2>/dev/null || true
  fi
fi

log "Stopped."

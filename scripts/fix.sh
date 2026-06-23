#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-5173}"

log() { echo "[fix] $*"; }

# Missing dependencies
if [ ! -d node_modules ]; then
  log "Installing dependencies..."
  npm install
fi

# Port conflict
if command -v lsof >/dev/null 2>&1; then
  PIDS=$(lsof -ti ":$PORT" -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
  STALE=true
  if [ -f "$ROOT/.dev-server.pid" ]; then
    SAVED_PID=$(cat "$ROOT/.dev-server.pid")
    for PID in $PIDS; do
      if [ "$PID" = "$SAVED_PID" ]; then
        STALE=false
      fi
    done
  fi
  if [ "$STALE" = true ]; then
    log "Freeing port $PORT..."
    echo "$PIDS" | xargs kill 2>/dev/null || true
    sleep 1
  fi
  fi
fi

# Rebuild
log "Running build..."
if npm run build; then
  log "Build succeeded"
else
  log "Build failed — check TypeScript errors above"
  exit 1
fi

# Run tests
log "Running tests..."
npm test

log "Fix complete. Run ./scripts/start.sh to launch dev server."

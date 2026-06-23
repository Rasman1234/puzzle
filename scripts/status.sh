#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-5173}"
PID_FILE="$ROOT/.dev-server.pid"

echo "=== Kids Puzzle Game Status ==="
echo ""

# Dev server
if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "✓ Dev Server Running (PID $(cat "$PID_FILE"))"
else
  echo "✗ Dev Server Stopped"
fi

# Port
if command -v lsof >/dev/null 2>&1 && lsof -i ":$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "✓ Port $PORT Open"
else
  echo "✗ Port $PORT Closed"
fi

# Node
if command -v node >/dev/null 2>&1; then
  echo "✓ Node.js $(node -v)"
else
  echo "✗ Node.js Not Found"
fi

# Dependencies
if [ -d "$ROOT/node_modules" ]; then
  echo "✓ Dependencies Installed"
else
  echo "✗ Dependencies Missing (run npm install)"
fi

# Build
if [ -d "$ROOT/dist" ]; then
  echo "✓ Production Build Exists"
else
  echo "○ No Production Build"
fi

echo ""
echo "=== System ==="
if command -v free >/dev/null 2>&1; then
  free -h | head -2
fi
if command -v df >/dev/null 2>&1; then
  df -h "$ROOT" | tail -1 | awk '{print "Disk: " $3 " used / " $2 " total (" $5 ")"}'
fi

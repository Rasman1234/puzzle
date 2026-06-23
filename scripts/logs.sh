#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG_FILE="$ROOT/.dev-server.log"
FOLLOW=false
SERVICE=""

while [ $# -gt 0 ]; do
  case "$1" in
    --follow|-f) FOLLOW=true; shift ;;
    *) SERVICE="$1"; shift ;;
  esac
done

case "$SERVICE" in
  ""|dev|frontend)
    if [ -f "$LOG_FILE" ]; then
      if [ "$FOLLOW" = true ]; then
        tail -f "$LOG_FILE"
      else
        tail -50 "$LOG_FILE"
      fi
    else
      echo "No dev server logs found. Start with ./scripts/start.sh"
    fi
    ;;
  build)
    if [ -f "$ROOT/dist/build.log" ]; then
      cat "$ROOT/dist/build.log"
    else
      echo "No build logs. Run npm run build"
    fi
    ;;
  *)
    echo "Usage: ./scripts/logs.sh [--follow] [dev|build]"
    exit 1
    ;;
esac

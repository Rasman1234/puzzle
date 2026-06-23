#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${PORT:-5173}"

SCORE=100
WARNINGS=0
ERRORS=0

pass() { echo "✓ $1"; }
warn() { echo "⚠ $1"; WARNINGS=$((WARNINGS + 1)); }
fail() { echo "✗ $1"; ERRORS=$((ERRORS + 1)); SCORE=$((SCORE - 15)); }

echo "=== Health Audit ==="
echo ""

# Node
if command -v node >/dev/null 2>&1; then
  pass "Node.js $(node -v)"
else
  fail "Node.js not installed"
fi

# Dependencies
if [ -d node_modules ]; then
  pass "node_modules present"
else
  fail "node_modules missing"
fi

# TypeScript build
if npm run build >/dev/null 2>&1; then
  pass "TypeScript build succeeds"
else
  fail "TypeScript build fails"
fi

# Tests
if npm test >/dev/null 2>&1; then
  pass "Unit tests pass"
else
  fail "Unit tests fail"
fi

# Dev server
if curl -sf "http://localhost:$PORT" >/dev/null 2>&1; then
  pass "Dev server responding on :$PORT"
else
  warn "Dev server not running on :$PORT"
fi

# Source files
for f in src/App.tsx src/components/PuzzleBoard.tsx src/lib/puzzleGenerator.ts; do
  if [ -f "$f" ]; then
    pass "$f exists"
  else
    fail "$f missing"
  fi
done

# Public assets
if [ -f public/favicon.svg ]; then
  pass "favicon.svg present"
else
  warn "favicon.svg missing"
fi

echo ""
echo "Health Score: $((SCORE < 0 ? 0 : SCORE))/100"
echo "Warnings: $WARNINGS"
echo "Errors: $ERRORS"

[ "$ERRORS" -eq 0 ]

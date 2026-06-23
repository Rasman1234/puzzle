# Kids Puzzle Game — Runbook

## Quick Start

```bash
./scripts/start.sh    # Start dev server (http://localhost:5173)
./scripts/stop.sh     # Stop dev server
./scripts/restart.sh  # Restart dev server
./scripts/status.sh   # Check service status
./scripts/health.sh   # Full health audit
./scripts/fix.sh      # Auto-fix common issues
```

## Manual Development

```bash
npm install
npm run dev
npm run build
npm test
```

## Troubleshooting

### Port 5173 in use

```bash
./scripts/stop.sh
# or
lsof -i :5173
```

### Build fails

```bash
npm run build
# Fix TypeScript errors, then:
./scripts/fix.sh
```

### Tests fail

```bash
npm test
```

### Dependencies missing

```bash
npm install
```

## Production Build

```bash
npm run build
npm run preview
```

Static files output to `dist/` — deploy to any static host.

## Common Failures

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| `node_modules` missing | Fresh clone | `npm install` |
| Port conflict | Stale process | `./scripts/stop.sh` |
| TypeScript errors | Code issue | `npm run build`, fix errors |
| Image won't load | File too large/small | Use JPG/PNG 200px–10MB |

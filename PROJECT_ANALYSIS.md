# Project Analysis

**Date:** 2025-06-23  
**Status:** Documentation-only repository — no application code yet  
**Audience:** Project owner and implementing agents

---

## 1. Current Architecture Assessment

### What exists today

The repository contains **11 guidance documents** in the project root. There is no `src/`, `public/`, `package.json`, or build tooling. The project is in a **specification-first** state.

### Documented architecture

The intended runtime flow is a linear, client-only pipeline:

```
ImageUploader → PuzzleGenerator → PuzzleBoard → PuzzlePiece
                                        ↓
                              CompletionDetector → VictoryModal
```

| Layer | Responsibility | Documented in |
|-------|----------------|---------------|
| Image upload | Accept user image, validate, preview | `ARCHITECTURE.md`, `README.md` |
| Puzzle generation | Slice image into grid, assign positions | `puzzle_generation.md`, `gameplay_rules.mdc` |
| Board & pieces | Render grid, hold piece state | `ARCHITECTURE.md`, `code_quality.mdc` |
| Drag & drop | Move/swap pieces via mouse and touch | `drag_drop.md` |
| Completion | Detect when all pieces match correct positions | `gameplay_rules.mdc`, `DEFINITION_OF_DONE.md` |
| Victory UX | Celebration, positive feedback | `child_ux.md` |

### Architectural strengths

- **Single-page, zero-backend** design matches the stated non-goals and keeps deployment trivial (static hosting).
- **CSS `background-position` slicing** (per `puzzle_generation.md`) avoids generating N image blobs — fast, low memory, simple.
- **dnd-kit** choice is appropriate for unified mouse + touch support; native HTML5 DnD is explicitly ruled out.
- **Flat component model** (`ImageUploader`, `PuzzleBoard`, `PuzzlePiece`) avoids over-abstraction.
- **Child-first UX rules** are consistent across `ui_rules.mdc`, `child_ux.md`, and `DEFINITION_OF_DONE.md`.

### Architectural gaps (in code, not in docs)

- No state management pattern is defined (local React state is implied; Redux/Zustand are forbidden unless requested).
- No routing decision — likely single view with phase-based UI (upload → play → victory), but not explicitly stated.
- No error-handling UX contract beyond "never expose errors to users" (`child_ux.md`).
- Score tracking is listed in `README.md` but has no scoring formula or display rules.
- Hint and ghost mode are specified at a high level only.

### Assessment summary

The architecture is **appropriately minimal** for a children's puzzle game. The documentation is coherent and internally consistent. The next step is implementation scaffolding that mirrors the documented component names without adding layers the docs forbid.

---

## 2. Missing Requirements

The following items are **referenced but underspecified** and should be clarified during implementation (defaults recommended below).

| Area | Gap | Recommended default |
|------|-----|---------------------|
| **Image upload** | Accepted formats, max file size, min dimensions | JPEG, PNG, WebP; max 10 MB; min 200×200 px |
| **Image aspect ratio** | Square vs. preserve aspect | Preserve aspect; letterbox or crop to square board (document choice in UI) |
| **Shuffle algorithm** | Must not start solved; how many moves minimum | Fisher–Yates shuffle of positions; re-shuffle if solved |
| **Piece interaction** | Swap vs. slide vs. free placement | Swap-on-drop (simplest for grid puzzles) |
| **Hint system** | Frequency, cooldown, visual treatment | One tap reveals one misplaced piece's correct slot; max 3 hints per game |
| **Ghost mode** | Toggle timing, interaction while active | Toggle before/during play; 20% opacity overlay per `gameplay_rules.mdc` |
| **Score tracking** | Formula, persistence | Moves + time; session-only (`sessionStorage` optional); no accounts |
| **Victory screen** | Actions after win (play again, new image) | "Play again" (re-shuffle) + "New puzzle" (return to upload) |
| **Accessibility** | Beyond large touch targets | `prefers-reduced-motion`, focus rings, `aria-live` for completion |
| **i18n** | Language | English only for MVP; icon-heavy UI to reduce text dependency |
| **Offline** | PWA / service worker | Not required for MVP |
| **Testing** | No test strategy in docs | Vitest + React Testing Library for core logic; manual child-UX pass |
| **Lifecycle scripts** | User rules require `scripts/*.sh` | Add when Vite project is scaffolded |

### Conflicts to resolve

| Topic | Conflict | Resolution |
|-------|----------|------------|
| Core workflow vs. README features | User query lists 7-step core flow; README adds hints, ghost, score | **MVP:** core 7 steps. **MVP+:** hints, ghost, score as fast-follow |
| `README_FOR_AI.md` vs. lifecycle rules | AI doc says fewer files; user rules require 7 lifecycle scripts | Lifecycle scripts live in `scripts/` — they are ops tooling, not app complexity |

---

## 3. Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| **6×6 grid on small phones** — pieces become tiny, violating touch-target rules | High | Scale board to viewport; cap playable grid by screen width; warn on 5×5/6×6 on narrow screens |
| **Large images** — memory pressure, slow slice | Medium | Downscale to max board resolution (e.g. 1200×1200) on load via canvas |
| **dnd-kit learning curve** — over-configuration | Medium | Start with sortable grid example pattern; single `DndContext` wrapper |
| **Shuffle equals solved** — instant win | Low | Loop shuffle until not solved |
| **Silent failures** — `child_ux.md` forbids technical errors | Medium | Friendly illustrations/messages ("Try another picture!"); log details to console only |
| **Score without spec** — scope creep | Low | Defer to post-MVP or define simple move counter only |
| **No persistence** — refresh loses progress | Low | Acceptable per architecture; optional `sessionStorage` later |
| **Cross-browser touch quirks** | Medium | Test iOS Safari and Android Chrome early per Definition of Done |
| **Accessibility vs. minimal text** | Medium | Use icons + `aria-label`; avoid relying on color alone |

---

## 4. Recommended Folder Structure

Keep AI guidance files in the **project root** (per owner intent). Application code in standard Vite layout:

```
puzzle/
├── README.md                    # (existing — project root)
├── README_FOR_AI.md             # (existing)
├── ARCHITECTURE.md              # (existing)
├── DEFINITION_OF_DONE.md        # (existing)
├── PROJECT_ANALYSIS.md          # (this file)
├── IMPLEMENTATION_REPORT.md     # per-action change log
├── *.mdc, *.md                  # other guidance (existing)
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── components/
│   │   ├── ImageUploader.tsx
│   │   ├── PuzzleBoard.tsx
│   │   ├── PuzzlePiece.tsx
│   │   ├── VictoryModal.tsx
│   │   ├── DifficultyPicker.tsx   # grid size 2–6
│   │   └── GameControls.tsx       # hint / ghost toggles (post-MVP)
│   ├── hooks/
│   │   └── usePuzzleGame.ts       # state: pieces, shuffle, completion
│   ├── lib/
│   │   ├── puzzleGenerator.ts     # slice + position model
│   │   ├── completionDetector.ts
│   │   └── shuffle.ts
│   └── types/
│       └── puzzle.ts
│
├── scripts/                     # lifecycle (when implementation starts)
│   ├── start.sh
│   ├── stop.sh
│   ├── restart.sh
│   ├── status.sh
│   ├── logs.sh
│   ├── health.sh
│   └── fix.sh
│
├── docs/
│   └── RUNBOOK.md                 # ops doc when scripts exist
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── eslint.config.js
```

**Principles:**

- **≤ 15 source files** for MVP (excluding config and scripts).
- No `services/`, `repositories/`, or `engines/` folders.
- `hooks/usePuzzleGame.ts` centralizes game state instead of a state library.
- `lib/` holds pure functions (testable without React).

---

## 5. Recommended Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| UI framework | **React 18+** | Per README and project rules |
| Language | **TypeScript (strict)** | Per `project_rules.mdc` |
| Build tool | **Vite** | Fast dev server, simple static output |
| Drag & drop | **@dnd-kit/core** + **@dnd-kit/sortable** | Per `drag_drop.md`; touch-first |
| Styling | **CSS Modules** or **plain CSS** | No Tailwind unless requested — fewer dependencies |
| Testing | **Vitest** + **@testing-library/react** | Fits Vite; test `puzzleGenerator`, `completionDetector`, shuffle |
| Linting | **ESLint** + **typescript-eslint** | Enforce strict mode and React hooks rules |
| Deployment | **Static host** (Netlify, GitHub Pages, etc.) | No backend |

### Explicitly excluded

Backend, database, Redux, Zustand, generic game engines, microservices, authentication — all forbidden by project docs and initialization instructions.

### Dependencies (MVP target)

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "@dnd-kit/utilities": "^3.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "vitest": "^1.x",
    "@testing-library/react": "^14.x"
  }
}
```

---

## 6. Development Roadmap

### Phase 0 — Analysis (current)

- [x] Read all project documents
- [x] Produce `PROJECT_ANALYSIS.md`
- [ ] Owner review and approval

### Phase 1 — Scaffold (≈ 0.5 day)

- Initialize Vite + React + TypeScript (strict)
- Add ESLint, folder structure, base styles (large touch targets, bright palette)
- Add lifecycle scripts (`scripts/*.sh`) and `docs/RUNBOOK.md`
- Empty component shells matching `ARCHITECTURE.md`

### Phase 2 — Core loop (≈ 1–2 days)

1. `ImageUploader` — file input, preview, validation
2. `DifficultyPicker` — 2×2 … 6×6 buttons (≥ 48px)
3. `puzzleGenerator` — CSS background-position pieces; `{ id, correctPosition, currentPosition }`
4. `PuzzleBoard` + `PuzzlePiece` — render grid
5. dnd-kit integration — swap pieces on drop
6. `completionDetector` — all `currentPosition === correctPosition`
7. `VictoryModal` — "🎉 Great Job!", animation, play again

### Phase 3 — Polish (≈ 1 day)

- Responsive layout (desktop, tablet, mobile)
- Image downscale on load
- Friendly error states (no technical messages)
- `prefers-reduced-motion` for victory animation
- Manual cross-device testing per Definition of Done

### Phase 4 — Enhancements (post-MVP)

- Hint system (one correct placement)
- Ghost mode (20% opacity reference image)
- Score tracking (moves + elapsed time)
- Optional `sessionStorage` resume

### Phase 5 — Hardening

- Unit tests for generator, shuffle, completion
- Lighthouse accessibility pass
- Fix script for common dev environment issues

---

## 7. MVP Scope

**Goal:** A child can open the page, upload an image, pick a size, and complete a puzzle without instructions.

### In scope

| Feature | Acceptance |
|---------|------------|
| Image upload | User selects image; preview shown |
| Grid size selection | 2×2, 3×3, 4×4, 5×5, 6×6 |
| Puzzle generation | Image sliced via CSS background-position |
| Shuffle | Pieces start in random non-solved order |
| Drag & drop | Mouse + touch via dnd-kit |
| Completion detection | Automatic when all pieces correct |
| Victory screen | Positive message, animation, play again |
| Responsive UI | Works on desktop, tablet, mobile |
| Child UX | Large buttons, minimal text, no error jargon |

### Out of scope (MVP)

- Hint system
- Ghost mode
- Score tracking
- Persistence / accounts
- Backend or API
- PWA / offline
- Multiple puzzles library
- Sound effects (unless trivial to add in victory modal)

### MVP success = Definition of Done

All criteria in `DEFINITION_OF_DONE.md` pass on target devices with zero TypeScript and console errors.

---

## 8. Future Scope

| Feature | Notes |
|---------|-------|
| **Hints** | Reveal one correct placement; limit per game to avoid trivializing |
| **Ghost mode** | 20% opacity reference overlay; toggle in controls |
| **Score** | Moves + time; local session display; optional best-score in `sessionStorage` |
| **Sound** | Optional celebratory sound on victory (muted by default) |
| **Themes** | Alternate color palettes; still icon-heavy |
| **Preset images** | Bundled starter images if upload is blocked (e.g. school devices) |
| **Print / share** | Export completed puzzle screenshot — low priority |
| **Difficulty presets** | "Easy" (2×2–3×3) vs "Hard" (4×4–6×6) labels for parents |
| **i18n** | Additional languages if text becomes necessary |

All future work must pass the same simplicity bar: *"Can this be done with fewer files?"* (`README_FOR_AI.md`).

---

## Appendix: Document Cross-Reference

| Requirement | Primary source |
|-------------|----------------|
| Simplicity | `README_FOR_AI.md`, `project_rules.mdc` |
| Component names | `ARCHITECTURE.md`, `code_quality.mdc` |
| Grid sizes & victory | `gameplay_rules.mdc` |
| Slicing strategy | `puzzle_generation.md` |
| DnD library | `drag_drop.md` |
| Child UX | `child_ux.md`, `ui_rules.mdc` |
| Done criteria | `DEFINITION_OF_DONE.md` |
| Scope & non-goals | `README.md` |

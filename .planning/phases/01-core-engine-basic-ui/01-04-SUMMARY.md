---
phase: 01-core-engine-basic-ui
plan: 04
subsystem: ui
tags: [react, vite, typescript, vitest, testing-library]

# Dependency graph
requires:
  - phase: 01-core-engine-basic-ui
    provides: evaluate/formatResult engine, useCalculator hook, types, BUTTON_CONFIG

provides:
  - DisplayPanel component showing formula bar (DISP-01) and result/error (DISP-02)
  - Button component with data-variant and disabled state
  - ButtonGrid rendering 20 buttons in 4-wide CSS grid from BUTTON_CONFIG
  - CalculatorShell layout container
  - App.tsx wired to useCalculator hook — functional calculator in browser

affects: [02-keyboard-input, 03-glassmorphism-styling]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Thin component / fat engine: components are pure render, all logic in hooks and engine"
    - "BUTTON_CONFIG as single source of truth for button layout"
    - "data-variant attribute on buttons for future CSS targeting in glassmorphism phase"

key-files:
  created:
    - src/components/DisplayPanel/DisplayPanel.tsx
    - src/components/ButtonGrid/Button.tsx
    - src/components/ButtonGrid/ButtonGrid.tsx
    - src/components/ButtonGrid/ButtonGrid.test.tsx
    - src/components/CalculatorShell/CalculatorShell.tsx
  modified:
    - src/App.tsx

key-decisions:
  - "No Tailwind classes added to components in this phase — glassmorphism styling is Phase 3 scope"
  - "CalculatorShell uses inline styles only: max-width 360px, margin auto, 1px border"
  - "ButtonGrid props accept openParenCount and dispatch — no internal state"

patterns-established:
  - "Component file structure: src/components/{ComponentName}/{ComponentName}.tsx"
  - "Smoke tests colocated with component: ButtonGrid.test.tsx beside ButtonGrid.tsx"
  - "aria-label on display regions for accessibility (expression, result/error)"

requirements-completed: [DISP-01, DISP-02, DISP-03, DISP-04, INPT-01]

# Metrics
duration: 12min
completed: 2026-04-09
---

# Phase 01 Plan 04: React Component Tree and Calculator UI Summary

**4-component React tree (DisplayPanel, Button, ButtonGrid, CalculatorShell) wired to useCalculator hook — functional 20-button calculator rendering in browser at localhost:5173**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-04-09T16:05:00Z
- **Completed:** 2026-04-09T16:17:00Z
- **Tasks:** 2 of 3 (Task 3 is human-verify checkpoint)
- **Files modified:** 6

## Accomplishments
- DisplayPanel renders formula bar (expression, DISP-01) and result/error region (DISP-02) with accessibility aria-labels
- ButtonGrid renders exactly 20 buttons from BUTTON_CONFIG in 4-wide CSS grid; ) button disabled at zero open parens (CORE-02)
- ButtonGrid smoke tests: 4 tests GREEN covering all buttons, exact count, paren-disable logic
- CalculatorShell provides minimal outer layout container (360px, centered)
- App.tsx wired to useCalculator — full dispatch/state loop connected to UI; production build succeeds

## Task Commits

Each task was committed atomically:

1. **Task 1: Build DisplayPanel and Button components** - `65e520d` (feat)
2. **Task 2: Build ButtonGrid + CalculatorShell, smoke tests, wire App.tsx** - `02e3731` (feat)
3. **Task 3: Verify functional calculator in browser** - awaiting human verification

## Files Created/Modified
- `src/components/DisplayPanel/DisplayPanel.tsx` - Formula bar + result/error display (DISP-01, DISP-02)
- `src/components/ButtonGrid/Button.tsx` - Native button with data-variant, disabled/opacity
- `src/components/ButtonGrid/ButtonGrid.tsx` - 4-wide grid of 20 buttons from BUTTON_CONFIG
- `src/components/ButtonGrid/ButtonGrid.test.tsx` - 4 smoke tests for INPT-01
- `src/components/CalculatorShell/CalculatorShell.tsx` - Layout shell, 360px max-width
- `src/App.tsx` - Root component wired to useCalculator hook

## Decisions Made
- No Tailwind utility classes used in components — inline styles only for this phase. Phase 3 (glassmorphism) will replace all styling.
- ButtonGrid has no internal state — receives `openParenCount` and `dispatch` as props for clean separation.
- `data-variant` attribute on each button provides CSS hooks for Phase 3 without extra complexity now.

## Deviations from Plan

### Pre-existing State Discrepancy

**[Rule 3 - Blocking] Plan 01-03 files existed but weren't committed at plan start**
- **Found during:** Pre-execution file check
- **Issue:** STATE.md indicated plan position was behind, but all 01-03 artifacts (types, constants, hook) were already committed (commits 16fe654 and f2c23ae). 01-03-SUMMARY.md was missing.
- **Fix:** Verified commits existed, proceeded directly with 01-04. No code changes needed.
- **Files modified:** None
- **Verification:** `git log` confirmed 01-03 commits; `npx vitest run` showed 44 tests passing before 01-04 started.

---

**Total deviations:** 1 (informational — pre-existing state, no code impact)
**Impact on plan:** None — 01-03 work was complete. 01-04 executed cleanly.

## Issues Encountered
- None during 01-04 execution.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Full test suite: 48 tests passing across 4 test files (engine, format, useCalculator, ButtonGrid)
- Production build: succeeds (846KB bundle — mathjs is large but expected; tree-shaking via named import in place)
- Awaiting Task 3 human verification of browser behavior (7 manual checks)
- After checkpoint approval: Phase 1 complete, ready for Phase 2 (keyboard input) or Phase 3 (glassmorphism styling)

---
*Phase: 01-core-engine-basic-ui*
*Completed: 2026-04-09*

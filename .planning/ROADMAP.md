# Roadmap: Fancy Scientific Calculator

## Overview

Five phases take this from nothing to a polished, working scientific calculator with a professional mode. Phase 1 builds the React/Vite scaffold and the arithmetic engine with a functional (unstyled) UI. Phases 2-4 run in parallel: Phase 2 adds trig functions and keyboard support, Phase 3 layers in the glassmorphism visual treatment, and Phase 4 builds the history panel with localStorage persistence. Phase 5 adds a professional calculator mode with extended scientific functions, and merges after Phase 2 (it needs trig in the engine).

## Phases

- [x] **Phase 1: Core Engine & Basic UI** - Arithmetic expression evaluation with a functional display and on-screen input (completed 2026-04-09)
- [ ] **Phase 2: Trigonometry & Keyboard** - Scientific trig functions with DEG/RAD toggling and full keyboard input
- [ ] **Phase 3: Glassmorphism** - Polished glassmorphism design (frosted glass panels, backdrop blur, dark gradient background)
- [ ] **Phase 4: History Panel** - Scrollable calculation history with localStorage persistence and entry reuse
- [ ] **Phase 5: Professional Mode** - Separate professional calculator mode with extended scientific functions (log, powers, constants, factorial)

## Parallel Execution Map

```
Phase 1: Core Engine (DONE)
    |
    +---> Phase 2: Trig & Keyboard     [Dev A]
    |         (engine + input)
    |
    +---> Phase 3: Glassmorphism        [Dev B]
    |         (visual styling)
    |
    +---> Phase 4: History Panel        [Dev C]
    |         (history + localStorage)
    |
    +---> Phase 5: Pro Mode             [Dev D]
              (mode toggle + pro grid)
              (merges after Phase 2)
```

**Phases 2, 3, 4** can all start immediately — they branch from Phase 1 with no cross-dependencies.
**Phase 5** depends on Phase 2 (needs trig functions in the engine for pro mode buttons).

## Phase Details

### Phase 1: Core Engine & Basic UI
**Goal**: Users can type arithmetic expressions and see correct results in a working (unstyled) interface
**Depends on**: Nothing (first phase)
**Requirements**: CORE-01, CORE-02, CORE-03, CORE-04, DISP-01, DISP-02, DISP-03, DISP-04, INPT-01
**Success Criteria** (what must be TRUE):
  1. User can type an expression using on-screen buttons and press = to see the correct result
  2. User can use parentheses and PEMDAS order of operations is respected (e.g., 2+3*4 = 14)
  3. User sees a clear error message for invalid expressions (e.g., unclosed parentheses, double operators)
  4. Floating-point results display cleanly without trailing noise (0.1+0.2 shows 0.3, not 0.30000000000000004)
  5. User can clear the full expression with AC and delete the last character with DEL/Backspace
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Vite scaffold, dependency install, Tailwind v4 + Vitest configuration
- [x] 01-02-PLAN.md — Math engine: evaluate.ts + format.ts with TDD unit tests (CORE-01–04)
- [x] 01-03-PLAN.md — Types, button config, useCalculator hook with TDD reducer tests (DISP-01–04, INPT-01)
- [x] 01-04-PLAN.md — React components (DisplayPanel, ButtonGrid, Button, CalculatorShell) wired to hook + visual checkpoint

### Phase 2: Trigonometry & Keyboard
**Goal**: Users can perform scientific trig calculations and drive the calculator entirely from the keyboard
**Depends on**: Phase 1
**Requirements**: TRIG-01, TRIG-02, TRIG-03, TRIG-04, INPT-02, INPT-03
**Success Criteria** (what must be TRUE):
  1. User can compute sin, cos, tan and their inverses (asin, acos, atan) using on-screen buttons
  2. User can toggle between DEG and RAD mode and a visible indicator confirms the current mode
  3. sin(90) returns 1 in DEG mode and sin(pi/2) returns 1 in RAD mode
  4. User can type and evaluate expressions entirely with the keyboard (digits, operators, Enter, Escape, Backspace)
  5. Keyboard shortcuts do not hijack browser defaults (Ctrl+R reloads the page, Ctrl+C copies, etc.)
**Plans**: TBD

### Phase 3: Glassmorphism
**Goal**: The calculator displays a beautiful glassmorphism interface with frosted glass panels, backdrop blur, and a dark gradient background
**Depends on**: Phase 1
**Requirements**: VISU-01, VISU-02, VISU-03, VISU-04, VISU-05
**Success Criteria** (what must be TRUE):
  1. The calculator displays frosted glass panels with backdrop blur on a dark gradient background
  2. Layout is usable on both desktop and mobile with touch targets at minimum 44x44px
  3. Safari renders the blur correctly (using -webkit-backdrop-filter prefix)
  4. Button variants (digit, operator, utility, equals) have visually distinct glassmorphism treatments
  5. The overall aesthetic feels premium — translucent panels, subtle shadows, smooth transitions
**Plans**: TBD

### Phase 4: History Panel
**Goal**: Users can see and reuse past calculations from a persistent history panel
**Depends on**: Phase 1
**Requirements**: HIST-01, HIST-02, HIST-03
**Success Criteria** (what must be TRUE):
  1. User can see a scrollable list of past calculations showing the expression and result
  2. User can click a history entry to load that expression back into the input for reuse
  3. History survives a page refresh and is restored from localStorage on next visit
  4. History panel integrates cleanly with the calculator layout (drawer, sidebar, or inline)
**Plans**: TBD

### Phase 5: Professional Mode
**Goal**: Users can toggle into a professional calculator mode with extended scientific functions (log, powers, constants, factorial, abs, percentage)
**Depends on**: Phase 2 (needs trig functions in the engine)
**Requirements**: MATH-01, MATH-02, MATH-03
**Success Criteria** (what must be TRUE):
  1. User can toggle between Standard and Professional mode via a visible control in the header
  2. Professional mode displays a 7-column grid with scientific functions on the left and standard buttons on the right
  3. User can compute log, ln, x^y, sqrt, factorial, abs, and percentage in professional mode
  4. User can insert pi and e as constants into expressions
  5. Trig functions (sin, cos, tan, inverses) and DEG/RAD toggle appear only in professional mode
  6. Standard mode remains a clean 4-column arithmetic calculator
**Plans**: TBD

## Progress

**Execution Order:** 1 → (2 + 3 + 4 in parallel) → 5 (after Phase 2)

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Engine & Basic UI | 4/4 | Complete | 2026-04-09 |
| 2. Trigonometry & Keyboard | 0/? | Not started | - |
| 3. Glassmorphism | 0/? | Not started | - |
| 4. History Panel | 0/? | Not started | - |
| 5. Professional Mode | 0/? | Not started | - |

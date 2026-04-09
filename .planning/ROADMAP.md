# Roadmap: Fancy Scientific Calculator

## Overview

Three phases take this from nothing to a polished, working scientific calculator. Phase 1 builds the React/Vite scaffold and the arithmetic engine with a functional (unstyled) UI. Phase 2 layers in trigonometric functions and full keyboard support, delivering the "scientific" in scientific calculator. Phase 3 adds the history panel and the glassmorphism visual treatment, turning a working tool into a delightful one.

## Phases

- [x] **Phase 1: Core Engine & Basic UI** - Arithmetic expression evaluation with a functional display and on-screen input (completed 2026-04-09)
- [ ] **Phase 2: Trigonometry & Keyboard** - Scientific trig functions with DEG/RAD toggling and full keyboard input
- [ ] **Phase 3: History & Glassmorphism** - Scrollable calculation history, localStorage persistence, and polished glassmorphism design

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
- [ ] 01-01-PLAN.md — Vite scaffold, dependency install, Tailwind v4 + Vitest configuration
- [ ] 01-02-PLAN.md — Math engine: evaluate.ts + format.ts with TDD unit tests (CORE-01–04)
- [ ] 01-03-PLAN.md — Types, button config, useCalculator hook with TDD reducer tests (DISP-01–04, INPT-01)
- [ ] 01-04-PLAN.md — React components (DisplayPanel, ButtonGrid, Button, CalculatorShell) wired to hook + visual checkpoint

### Phase 2: Trigonometry & Keyboard
**Goal**: Users can perform scientific trig calculations and drive the calculator entirely from the keyboard
**Depends on**: Phase 1
**Requirements**: TRIG-01, TRIG-02, TRIG-03, TRIG-04, INPT-02, INPT-03
**Success Criteria** (what must be TRUE):
  1. User can compute sin, cos, tan and their inverses (asin, acos, atan) using on-screen buttons
  2. User can toggle between DEG and RAD mode and a visible indicator confirms the current mode
  3. sin(90) returns 1 in DEG mode and sin(π/2) returns 1 in RAD mode
  4. User can type and evaluate expressions entirely with the keyboard (digits, operators, Enter, Escape, Backspace)
  5. Keyboard shortcuts do not hijack browser defaults (Ctrl+R reloads the page, Ctrl+C copies, etc.)
**Plans**: TBD

### Phase 3: History & Glassmorphism
**Goal**: Users experience a beautiful glassmorphism interface with a persistent calculation history they can re-use
**Depends on**: Phase 2
**Requirements**: HIST-01, HIST-02, HIST-03, VISU-01, VISU-02, VISU-03, VISU-04, VISU-05
**Success Criteria** (what must be TRUE):
  1. User can see a scrollable list of past calculations showing the expression and result
  2. User can click a history entry to load that expression back into the input for reuse
  3. History survives a page refresh and is restored from localStorage on next visit
  4. The calculator displays frosted glass panels with backdrop blur on a dark gradient background
  5. Layout is usable on both desktop and mobile with touch targets at minimum 44x44px and Safari renders the blur correctly
**Plans**: TBD

## Progress

**Execution Order:** 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Engine & Basic UI | 4/4 | Complete   | 2026-04-09 |
| 2. Trigonometry & Keyboard | 0/? | Not started | - |
| 3. History & Glassmorphism | 0/? | Not started | - |

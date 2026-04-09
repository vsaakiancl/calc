---
phase: 01-core-engine-basic-ui
plan: 03
subsystem: ui
tags: [react, typescript, vitest, useReducer, testing-library]

# Dependency graph
requires:
  - phase: 01-core-engine-basic-ui plan 01
    provides: Vite + React + TypeScript + Vitest scaffold
  - phase: 01-core-engine-basic-ui plan 02
    provides: evaluate(), toUserMessage(), formatResult() engine functions
provides:
  - CalculatorState, Action, ButtonConfig, ButtonVariant TypeScript types (src/types/calculator.ts)
  - BUTTON_CONFIG array — 20-button layout source of truth (src/constants/buttons.ts)
  - useCalculator hook exposing { state, dispatch } via useReducer (src/hooks/useCalculator.ts)
  - Full reducer test coverage for APPEND_TOKEN, EQUALS, CLEAR, BACKSPACE (src/hooks/useCalculator.test.ts)
affects:
  - 01-04 (UI components will import useCalculator and BUTTON_CONFIG)
  - All future phases that render calculator buttons or read state

# Tech tracking
tech-stack:
  added: []
  patterns:
    - useReducer for calculator state machine (single-direction state transitions)
    - ButtonConfig as data source for grid rendering (action embedded in config object)
    - openParenCount tracked atomically with expression changes

key-files:
  created:
    - src/types/calculator.ts
    - src/constants/buttons.ts
    - src/hooks/useCalculator.ts
    - src/hooks/useCalculator.test.ts
  modified: []

key-decisions:
  - "openParenCount adjusted atomically inside APPEND_TOKEN and BACKSPACE reducers — no derived state"
  - "BUTTON_CONFIG embeds Action objects directly enabling zero-logic dispatch in button components"
  - "MAX_EXPRESSION_LENGTH = 200 caps silently (returns current state) — no error shown"

patterns-established:
  - "Reducer pattern: each case returns spread-with-overrides; CLEAR returns {...initialState} for complete reset"
  - "Button data pattern: ButtonConfig.action is a complete Action union member, ButtonGrid just dispatches it"

requirements-completed: [DISP-01, DISP-02, DISP-03, DISP-04, INPT-01]

# Metrics
duration: 8min
completed: 2026-04-09
---

# Phase 01 Plan 03: Calculator State Machine Summary

**useReducer-based calculator state machine with typed actions, 20-button BUTTON_CONFIG, and 21 passing TDD tests covering all four reducer transitions**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-04-09T16:03:59Z
- **Completed:** 2026-04-09T16:05:23Z
- **Tasks:** 2
- **Files modified:** 4 created

## Accomplishments

- Created TypeScript contracts: CalculatorState, Action union, ButtonConfig, ButtonVariant types
- Implemented 20-button BUTTON_CONFIG with correct 4-wide grid layout; ')' correctly flags `disabledWhen: 'noOpenParens'`
- Implemented useCalculator hook with reducer handling all four actions (APPEND_TOKEN, EQUALS, CLEAR, BACKSPACE)
- TDD: wrote 21 failing tests first, then implemented hook to GREEN; full 44-test suite passes

## Task Commits

Each task was committed atomically:

1. **Task 1: Create types + button config, write failing reducer tests** - `16fe654` (test)
2. **Task 2: Implement useCalculator hook to GREEN** - `f2c23ae` (feat)

_Note: TDD tasks have two commits (test RED → feat GREEN)_

## Files Created/Modified

- `src/types/calculator.ts` - CalculatorState, Action, ButtonConfig, ButtonVariant TypeScript types
- `src/constants/buttons.ts` - BUTTON_CONFIG array with 20 buttons, 4-wide layout, actions embedded
- `src/hooks/useCalculator.ts` - useReducer hook with all four reducer cases
- `src/hooks/useCalculator.test.ts` - 21 unit tests covering all reducer transitions via renderHook + act

## Decisions Made

- openParenCount is adjusted atomically inside the reducer (not derived from expression string at render time) — avoids parsing overhead on every render
- ButtonConfig objects embed their Action directly so ButtonGrid components call `dispatch(button.action)` with no conditional logic
- Expression cap of 200 chars returns silently without setting an error — avoids confusing users mid-type

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- useCalculator hook and BUTTON_CONFIG are ready for Plan 04 (UI components)
- ButtonGrid can iterate BUTTON_CONFIG and dispatch each button's embedded action
- Display components can read state.expression, state.displayValue, state.error directly
- No blockers

---
*Phase: 01-core-engine-basic-ui*
*Completed: 2026-04-09*

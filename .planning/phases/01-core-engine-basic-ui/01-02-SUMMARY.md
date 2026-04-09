---
phase: 01-core-engine-basic-ui
plan: "02"
subsystem: engine
tags: [mathjs, vitest, tdd, floating-point, evaluate, format]

requires: []
provides:
  - "evaluate(expression: string): number — pure function wrapping mathjs with PEMDAS, unary minus, error throwing"
  - "toUserMessage(e: unknown): string — maps mathjs errors to user-visible strings"
  - "formatResult(n: number): string — strips IEEE 754 floating-point noise via toPrecision(12)"
affects:
  - "useCalculator hook (03)"
  - "any component calling evaluate or formatResult"

tech-stack:
  added: [mathjs]
  patterns:
    - "Named mathjs import { evaluate as mathEvaluate } to avoid 180KB full-bundle cost"
    - "toPrecision(12) + parseFloat to strip IEEE 754 noise"
    - "Error message .toLowerCase() pattern for user-facing error mapping"

key-files:
  created:
    - src/engine/evaluate.ts
    - src/engine/evaluate.test.ts
    - src/engine/format.ts
    - src/engine/format.test.ts
  modified: []

key-decisions:
  - "Named import { evaluate as mathEvaluate } from mathjs instead of import * as math — saves ~180KB bundle"
  - "toPrecision(12) precision level: enough to eliminate IEEE 754 noise while keeping irrational number readability"
  - "Infinity check post-evaluate (1/0 returns Infinity in mathjs) — convert to throw"

patterns-established:
  - "Engine functions are pure: no side effects, throw on error, return typed value on success"
  - "toUserMessage() is the single mapping point between engine errors and UI strings"
  - "TDD RED-GREEN cycle: test file committed before implementation files"

requirements-completed: [CORE-01, CORE-02, CORE-03, CORE-04]

duration: 15min
completed: 2026-04-09
---

# Phase 1 Plan 02: Math Engine Summary

**mathjs-backed evaluate() and formatResult() functions with full TDD coverage — PEMDAS, unary minus, division-by-zero, and IEEE 754 noise all handled**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-09T17:55:00Z
- **Completed:** 2026-04-09T17:58:30Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- `evaluate()` correctly handles PEMDAS, parentheses, unary minus at start and mid-expression
- `evaluate()` throws on empty input, syntax errors, division by zero (Infinity), non-numeric identifiers
- `toUserMessage()` maps all mathjs error patterns to user-visible strings with safe fallback
- `formatResult()` eliminates IEEE 754 floating-point noise (0.1 + 0.2 = "0.3", not "0.30000000000000004")
- 23 unit tests passing across two test files

## Task Commits

Each task was committed atomically following TDD RED-GREEN sequence:

1. **Task 1 RED: evaluate.test.ts** - `071c069` (test)
2. **Task 2 RED: format.test.ts** - `ff3f03e` (test)
3. **Task 2 GREEN: evaluate.ts + format.ts** - `924cd93` (feat)

_Note: TDD tasks have multiple commits (test RED → feat GREEN)_

## Files Created/Modified

- `src/engine/evaluate.ts` — Pure evaluate() + toUserMessage(); named mathjs import
- `src/engine/evaluate.test.ts` — 17 test cases covering CORE-01, CORE-02, CORE-03
- `src/engine/format.ts` — formatResult() using toPrecision(12) for IEEE 754 cleanup
- `src/engine/format.test.ts` — 6 test cases covering CORE-04 including 0.1+0.2, compound expressions

## Decisions Made

- Used named import `{ evaluate as mathEvaluate } from 'mathjs'` — avoids pulling the 180KB full bundle
- `toPrecision(12)` chosen: removes IEEE noise while keeping 12 significant figures (readable for irrationals like 1/3)
- Post-evaluate Infinity check: mathjs returns `Infinity` for `1/0` rather than throwing, so we explicitly convert it to an Error

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. The resumption context showed evaluate.ts and format.ts were already present as untracked files from the prior session; they just needed committing.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Engine is the highest-risk layer (floating-point, error handling, unary minus) — all verified GREEN
- `evaluate()` and `formatResult()` ready to be imported by `useCalculator` hook in plan 03
- The `toUserMessage()` function is the canonical error-to-UI-string mapper; future plans should use it, not roll their own

---
*Phase: 01-core-engine-basic-ui*
*Completed: 2026-04-09*

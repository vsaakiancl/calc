# Phase 1: Core Engine & Basic UI - Context

**Gathered:** 2026-04-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the React/Vite scaffold, integrate math.js for expression evaluation, and create a functional (unstyled) calculator with on-screen button input. Users can type arithmetic expressions and see correct results. No styling polish (Phase 3), no trig (Phase 2), no keyboard input (Phase 2).

</domain>

<decisions>
## Implementation Decisions

### Button Layout
- Classic 4-wide grid: digits on left 3 columns, operators on the right column
- Top row: AC, DEL, (, ) — four buttons across
- Digits 0-9 in standard calculator arrangement (7-8-9 top, 1-2-3 bottom, 0 bottom-left)
- Operators (+, -, *, /) stacked in the right column
- = button is same size as other buttons, placed in bottom-right
- Decimal point (.) next to 0

### Claude's Discretion
- Display behavior (formula bar updates, result display on = press)
- Error handling approach (inline vs toast, auto-recovery)
- Decimal formatting (max places, scientific notation threshold)
- Exact row arrangement and spacing
- Loading skeleton and initial state

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

No external specs — requirements are fully captured in decisions above and in:
- `.planning/REQUIREMENTS.md` — CORE-01 through CORE-04, DISP-01 through DISP-04, INPT-01
- `.planning/research/STACK.md` — React 19 + Vite 8 + math.js 15 + Tailwind CSS v4
- `.planning/research/ARCHITECTURE.md` — useReducer state management, evaluator isolation, button config as data
- `.planning/research/PITFALLS.md` — Floating-point precision, eval() avoidance, unary minus handling

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None yet — Phase 1 establishes the patterns (useReducer, evaluator module, button config array)

### Integration Points
- Vite scaffold will be created from `npm create vite@latest -- --template react-ts`
- math.js installed as expression evaluator
- Tailwind CSS v4 installed for future styling (Phase 3 applies glassmorphism)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. Research recommends:
- Isolate evaluator in `src/lib/evaluate.ts` for testability
- Use declarative button config array (`src/config/buttons.ts`) instead of hardcoded JSX
- useReducer for calculator state (expression, result, error are interdependent)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-core-engine-basic-ui*
*Context gathered: 2026-04-09*

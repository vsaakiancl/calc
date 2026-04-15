# Phase 4: Add Professional Version of Calculator - Context

**Gathered:** 2026-04-15
**Status:** Ready for planning

<domain>
## Phase Boundary

Add a separate "Professional" calculator mode alongside the existing standard mode. Users toggle between standard (4-column arithmetic) and professional (7-column with scientific functions). The pro mode adds logarithms, powers/roots, constants, factorial, absolute value, percentage, and relocates trig functions from the standard grid into pro-only. Shares the same engine and display.

</domain>

<decisions>
## Implementation Decisions

### Mode Architecture
- Two distinct modes: Standard and Professional
- Toggle via a segmented control / toggle button in the calculator header (always visible)
- Both modes share the same useCalculator hook, display panel, and math engine
- Standard mode: existing 4-column grid with arithmetic only (no trig buttons)
- Professional mode: 7-column grid — 3 scientific columns on the left, 4 standard columns on the right

### Professional Grid Layout
- 7-column layout in pro mode with clear visual separation between scientific and standard sections
- Left 3 columns: scientific functions
- Right 4 columns: standard calculator buttons (same as standard mode)
- Row arrangement (left side):
  - Row 0: sin, cos, tan
  - Row 1: log, ln, x^y
  - Row 2: sqrt, pi, e
  - Row 3: x!, |x|, %
  - Row 4: 2nd, DEG, (extra paren or empty)

### Function Scope
- Trig: sin, cos, tan + inverses (asin, acos, atan) via 2nd key — PRO MODE ONLY
- Logarithms: log (base 10), ln (natural) — covers MATH-01
- Powers & roots: x^y, sqrt, cbrt (cube root via 2nd) — covers MATH-02
- Constants: pi, e inserted as tokens — covers MATH-03
- Extras: x! (factorial), |x| (absolute value), % (percentage)
- DEG/RAD toggle with visible indicator — pro mode only

### Trig Placement
- Trig functions (sin, cos, tan, inverses, DEG/RAD) are ONLY available in professional mode
- Standard mode stays clean with arithmetic only (digits, operators, parens, AC, DEL)
- Phase 2 builds trig into the engine; Phase 4 surfaces it in the pro UI only

### Claude's Discretion
- 2nd key behavior (toggle vs hold, which functions swap)
- Exact button sizing and spacing in 7-column layout
- Animation/transition when switching modes
- How constants (pi, e) are displayed in the expression (symbol vs value)
- Mobile responsiveness of the wider pro grid

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` — MATH-01 (log/ln), MATH-02 (powers/roots), MATH-03 (pi/e) define the v2 functions now pulled into this phase
- `.planning/REQUIREMENTS.md` — TRIG-01 through TRIG-04 define trig behavior (built in Phase 2, surfaced in Phase 4 pro mode)

### Architecture & Patterns
- `.planning/research/ARCHITECTURE.md` — useReducer state management, evaluator isolation, button config as data
- `.planning/research/STACK.md` — React 19 + Vite 8 + math.js 15 (math.js natively supports log, ln, pow, sqrt, factorial, pi, e)

### Prior Phase Context
- `.planning/phases/01-core-engine-basic-ui/01-CONTEXT.md` — Button layout decisions, ButtonConfig pattern, Claude's discretion areas

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/types/calculator.ts`: ButtonConfig type with label, action, variant, disabledWhen — extensible for new variants and function buttons
- `src/constants/buttons.ts`: Declarative BUTTON_CONFIG array — pro mode needs a second config array or conditional extension
- `src/hooks/useCalculator.ts`: useReducer with APPEND_TOKEN, EQUALS, CLEAR, BACKSPACE actions — new function actions (TOGGLE_MODE, TOGGLE_2ND, TOGGLE_ANGLE_UNIT) need to be added
- `src/engine/evaluate.ts`: Wraps math.js which already supports log, ln, pow, sqrt, factorial, pi, e natively
- `src/engine/format.ts`: formatResult with toPrecision(12) — works for all new function outputs

### Established Patterns
- ButtonConfig as data: buttons are declarative config, not hardcoded JSX — pro buttons should follow the same pattern
- data-variant on buttons: Phase 1 added variant attributes for CSS hooks — new variants (e.g., 'scientific', 'constant', 'shift') can be added
- Action union type: New action types extend the existing discriminated union in calculator.ts

### Integration Points
- CalculatorShell component: needs to render either 4-col or 7-col ButtonGrid based on mode
- ButtonGrid: needs to accept variable column count or a mode prop
- Display panel: shared between modes, no changes expected
- State: CalculatorState needs `mode: 'standard' | 'professional'` and `angleUnit: 'deg' | 'rad'` fields

</code_context>

<specifics>
## Specific Ideas

- Pro mode layout matches the ASCII mockup: 3 scientific columns | 4 standard columns in a 7-wide grid
- Visual separation between scientific and standard sections (divider line or spacing gap)
- 2nd key toggles inverse functions (sin -> asin, cos -> acos, tan -> atan, sqrt -> cbrt)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-add-professianal-version-of-calculator*
*Context gathered: 2026-04-15*

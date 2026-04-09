# Phase 1: Core Engine & Basic UI - Research

**Researched:** 2026-04-09
**Domain:** React calculator — expression evaluation, state machine, on-screen button grid
**Confidence:** HIGH (all stack versions npm-verified; architecture patterns from official docs; pitfalls from official sources)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Button Layout:** Classic 4-wide grid — digits on left 3 columns, operators on right column
- **Top row:** AC, DEL, (, ) — four buttons across
- **Digit arrangement:** 7-8-9 top, 4-5-6 middle, 1-2-3 lower, 0 bottom-left (standard calculator)
- **Operators:** +, -, *, / stacked in right column
- **= button:** Same size as other buttons, placed bottom-right
- **Decimal point:** Next to 0

### Claude's Discretion
- Display behavior (formula bar updates, result display on = press)
- Error handling approach (inline vs toast, auto-recovery)
- Decimal formatting (max places, scientific notation threshold)
- Exact row arrangement and spacing
- Loading skeleton and initial state

### Deferred Ideas (OUT OF SCOPE)
- None from Phase 1 discussion — discussion stayed within phase scope
- Trig functions (Phase 2)
- Keyboard input (Phase 2)
- History panel (Phase 3)
- Glassmorphism styling polish (Phase 3)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CORE-01 | User can type and evaluate arithmetic expressions (+, -, *, /) | math.js `evaluate()` handles all four operators with correct precedence; useReducer APPEND_TOKEN pattern builds expression string |
| CORE-02 | User can use parentheses and expressions respect PEMDAS order of operations | math.js enforces PEMDAS natively; paren balance tracked in state as `openParenCount`; `)` button disabled at zero |
| CORE-03 | User sees a clear error message for invalid expressions | try/catch around `evaluate()` maps exceptions to user-friendly strings; `error: string | null` in state shape; Infinity/NaN caught post-evaluation |
| CORE-04 | Floating-point results display cleanly (no 0.30000000000000004) | `parseFloat(result.toPrecision(12))` or `math.format(result, { precision: 12 })` in `engine/format.ts` before any display |
| DISP-01 | User can see the full expression being typed in a formula bar | `expression: string` in state; DisplayPanel renders it directly; scrollable single-line element |
| DISP-02 | User can see the computed result clearly separated from the input | `displayValue: string` set on EQUALS action; rendered in separate element below formula bar |
| DISP-03 | User can clear the entire expression with AC button | CLEAR action resets expression, displayValue, error, openParenCount to initial state |
| DISP-04 | User can delete the last character with DEL/backspace button | BACKSPACE action slices last character; decrements openParenCount if last char was `(`, increments if `)` |
| INPT-01 | User can input expressions using on-screen buttons | ButtonGrid maps BUTTON_CONFIG array to `<button>` elements; each dispatches APPEND_TOKEN |
</phase_requirements>

---

## Summary

Phase 1 is a greenfield Vite scaffold wired to math.js with a useReducer state machine and an on-screen button grid. The critical architectural decision — already made by upstream research — is to isolate all evaluation logic in a pure `engine/` module, drive the button grid from a declarative config array, and use a single `useReducer` so that expression, displayValue, error, and openParenCount update atomically.

The highest-risk areas for this phase are (1) floating-point display noise on the result formatter (`0.1 + 0.2`), (2) invalid expressions crashing React instead of surfacing a clean error state, and (3) parenthesis tracking going out of sync with the expression string. All three must be addressed in Wave 1 before any UI is wired.

Phase 1 deliberately excludes keyboard input, trig, history, and glassmorphism styling. The component shell is created here but left functionally unstyled. Tailwind CSS v4 is installed now so Phase 3 can apply utility classes without a restructure.

**Primary recommendation:** Build engine/ first (evaluate, format), unit-test it before touching React, then wire the useReducer hook, then render the button grid from config. This order surfaces math correctness issues before any UI is involved.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.5 | UI component tree, state, event handling | Current stable; `npm create vite@latest --template react-ts` scaffolds this |
| Vite | 8.0.8 | Dev server, HMR, production bundler | Current stable; Rolldown-backed; Babel-free via plugin-react v6 |
| TypeScript | 5.x (via Vite scaffold) | Type safety for state shapes, engine contracts | Catches deg/rad coercions and reducer action typos at compile time |
| math.js | 15.2.0 | Safe expression evaluation | No eval(); handles PEMDAS, unary minus, parentheses; throws meaningful errors |
| Tailwind CSS | 4.2.x | Utility-first styling (no config file) | CSS-first config; `@import "tailwindcss"` in index.css; native Vite plugin |
| clsx | ^2.x | Conditional class composition | Button variant states (active/disabled) need conditional class strings |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Vitest | 4.1.4 | Unit tests for engine and reducer | From day one — install before writing evaluate.ts; zero extra config with Vite |
| @testing-library/react | ^16.x | Component integration tests | For smoke-testing ButtonGrid renders and DisplayPanel output |
| jsdom | ^26.x | DOM environment for Vitest | Needed for @testing-library/react in Vitest |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| math.js | Custom parser | Only if bundle size is critical; requires significant engineering for precedence, unary minus, error messages — not worth it |
| math.js | eval() / new Function() | Never — security hole, no degree mode, silent precision bugs |
| useReducer | multiple useState | Multiple useState calls produce intermediate renders and sync bugs on EQUALS; useReducer is correct |
| Vitest | Jest | Jest needs separate babel/ts config; Vitest reuses Vite pipeline — zero extra config |

**Installation:**

```bash
# Scaffold
npm create vite@latest calc-app -- --template react-ts
cd calc-app

# Runtime
npm install mathjs clsx

# Tailwind v4
npm install tailwindcss @tailwindcss/vite

# Dev / test
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

**Tailwind v4 Vite config:**
```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'
// add tailwindcss() to the plugins array
```

```css
/* src/index.css */
@import "tailwindcss";
```

**Version verification:**
- mathjs: `npm view mathjs version` → 15.2.0 (verified 2026-04-09)
- vitest: `npm view vitest version` → 4.1.4 (verified 2026-04-09)
- vite: `npm view vite version` → 8.0.8 (verified 2026-04-09)
- react: `npm view react version` → 19.2.5 (verified 2026-04-09)

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── DisplayPanel/
│   │   └── DisplayPanel.tsx        # expression + result display; read-only
│   ├── ButtonGrid/
│   │   ├── ButtonGrid.tsx          # maps BUTTON_CONFIG to <button> rows
│   │   └── Button.tsx              # single pressable key; accepts label, onClick, variant
│   └── CalculatorShell/
│       └── CalculatorShell.tsx     # outer layout container (styled in Phase 3)
├── hooks/
│   └── useCalculator.ts            # useReducer; owns all state transitions
├── engine/
│   ├── evaluate.ts                 # wraps math.js evaluate(); throws on error
│   └── format.ts                   # formatResult(n): strips float noise
├── constants/
│   └── buttons.ts                  # BUTTON_CONFIG array — layout source of truth
├── types/
│   └── calculator.ts               # CalculatorState, Action, ButtonConfig types
├── App.tsx                         # wires hook to components; thin shell
└── main.tsx
```

### Pattern 1: Thin Component / Fat Engine

**What:** All math logic lives in pure functions in `engine/`. Components only render and dispatch. The hook bridges the two.

**When to use:** Always. Math logic is pure and deterministic. Mixing it into components makes testing require mounting and makes keyboard input require duplicating logic.

**Example:**
```typescript
// Source: ARCHITECTURE.md (project research)
// engine/evaluate.ts
import { evaluate as mathEvaluate } from 'mathjs';

export function evaluate(expression: string): number {
  const result = mathEvaluate(expression);
  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Invalid result');
  }
  return result;
}

// engine/format.ts
export function formatResult(n: number): string {
  return parseFloat(n.toPrecision(12)).toString();
}
```

### Pattern 2: useReducer for Calculator State

**What:** Single `useReducer` with a unified state object. All fields update atomically.

**When to use:** When multiple fields must change together — EQUALS action must update expression, displayValue, error, and openParenCount atomically.

**Example:**
```typescript
// Source: ARCHITECTURE.md (project research)
type CalculatorState = {
  expression: string;
  displayValue: string;
  error: string | null;
  openParenCount: number;
};

type Action =
  | { type: 'APPEND_TOKEN'; payload: string }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'BACKSPACE' };

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
    case 'CLEAR':
      return { expression: '', displayValue: '', error: null, openParenCount: 0 };
    case 'BACKSPACE': {
      const newExpr = state.expression.slice(0, -1);
      const lastChar = state.expression.slice(-1);
      const parenDelta = lastChar === '(' ? -1 : lastChar === ')' ? 1 : 0;
      return { ...state, expression: newExpr, error: null, openParenCount: state.openParenCount + parenDelta };
    }
    case 'APPEND_TOKEN': {
      const parenDelta = action.payload === '(' ? 1 : action.payload === ')' ? -1 : 0;
      return { ...state, expression: state.expression + action.payload, error: null, openParenCount: state.openParenCount + parenDelta };
    }
    case 'EQUALS': {
      try {
        const result = evaluate(state.expression);
        return { ...state, displayValue: formatResult(result), error: null };
      } catch (e) {
        return { ...state, displayValue: '', error: toUserMessage(e) };
      }
    }
    default:
      return state;
  }
}
```

### Pattern 3: Button Config as Data

**What:** The button grid is driven by a config array. Each entry has `{ label, action, variant, disabled? }`.

**When to use:** Any calculator with more than ~10 buttons. Avoids hardcoded JSX and makes layout changes a one-line config edit.

**Example:**
```typescript
// Source: ARCHITECTURE.md (project research)
// constants/buttons.ts
export const BUTTON_CONFIG = [
  // Row 0: AC, DEL, (, )
  { label: 'AC',  action: { type: 'CLEAR' as const },                            variant: 'utility' },
  { label: 'DEL', action: { type: 'BACKSPACE' as const },                         variant: 'utility' },
  { label: '(',   action: { type: 'APPEND_TOKEN' as const, payload: '(' },        variant: 'paren'   },
  { label: ')',   action: { type: 'APPEND_TOKEN' as const, payload: ')' },        variant: 'paren', disabledWhen: 'noOpenParens' },
  // Row 1: 7, 8, 9, /
  { label: '7',   action: { type: 'APPEND_TOKEN' as const, payload: '7' },        variant: 'digit'   },
  { label: '8',   action: { type: 'APPEND_TOKEN' as const, payload: '8' },        variant: 'digit'   },
  { label: '9',   action: { type: 'APPEND_TOKEN' as const, payload: '9' },        variant: 'digit'   },
  { label: '/',   action: { type: 'APPEND_TOKEN' as const, payload: '/' },        variant: 'operator'},
  // ... continues through rows
  { label: '=',   action: { type: 'EQUALS' as const },                            variant: 'equals'  },
] as const;
```

### Pattern 4: Error Handling Contract

**What:** `evaluate()` throws on any invalid expression. The reducer catches and stores a user-friendly error string. The display component renders the error state distinctly (e.g., red text "Syntax Error").

**When to use:** Always — errors are part of the display contract, not a post-MVP enhancement.

**Example:**
```typescript
// engine/evaluate.ts — maps mathjs error types to user messages
function toUserMessage(e: unknown): string {
  if (e instanceof Error) {
    if (e.message.includes('Unexpected end')) return 'Incomplete expression';
    if (e.message.includes('Unexpected operator')) return 'Syntax error';
    if (e.message.includes('division by zero') || e.message.includes('Infinity')) return 'Division by zero';
  }
  return 'Error';
}
```

### Anti-Patterns to Avoid

- **eval() for expression evaluation:** Security hole; use math.js `evaluate()` exclusively
- **Calculation logic in components:** Put it in `engine/` and call via hook; never in button onClick handlers
- **Multiple useState for related state:** Use single useReducer; EQUALS needs atomic update of expression + result + error
- **Hardcoded button JSX:** Use BUTTON_CONFIG array; reordering becomes a one-line edit
- **toFixed(n) for display:** Always pads with zeros — use `toPrecision(12)` wrapped in `parseFloat()`

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Expression evaluation with PEMDAS | Custom recursive descent parser | math.js `evaluate()` | Unary minus, operator precedence, parentheses all have documented edge cases; math.js has 2.5M weekly downloads handling these |
| Floating-point formatting | Custom rounding logic | `parseFloat(n.toPrecision(12))` or `math.format(result, { precision: 12 })` | Covers trailing noise, scientific notation threshold, negative zero |
| Expression security | Input sanitization | math.js (no native eval internally since v4) | Any custom sanitization has gaps; math.js is a sandboxed evaluator |

**Key insight:** A calculator looks simple but has a large surface of numeric edge cases. math.js exists specifically for this problem and has been battle-tested. The cost of integrating it is one install command and one import.

---

## Common Pitfalls

### Pitfall 1: Floating-Point Display Noise (CORE-04)

**What goes wrong:** `0.1 + 0.2` displays as `0.30000000000000004`. Users lose trust immediately.

**Why it happens:** Raw JS IEEE 754 arithmetic; no formatting applied to the result before rendering.

**How to avoid:** Pipe all `evaluate()` results through `formatResult()` in `engine/format.ts` before storing in `displayValue`. Use `parseFloat(n.toPrecision(12))` — strips trailing noise without forcing decimal places. Never use `toFixed(n)` unconditionally.

**Warning signs:** `0.1 + 0.2` test case shows more than 1 decimal digit; format utility not yet written; results stored as raw number strings.

### Pitfall 2: Invalid Expressions Crashing React (CORE-03)

**What goes wrong:** `2*/3` or `(2 + 3` throws from math.js; without try/catch the exception propagates and unmounts the React tree.

**Why it happens:** Happy-path development. math.js throws `Error` on malformed input — this is correct behavior, but callers must handle it.

**How to avoid:** Wrap `mathEvaluate()` in try/catch inside `engine/evaluate.ts`. Map error messages to user-friendly strings. The reducer EQUALS case catches the exception and sets `error` state. DisplayPanel renders error text when `error !== null`. Also check for `Infinity` and `NaN` after evaluation (these are valid JS values, not exceptions).

**Warning signs:** No try/catch around evaluate(); `1/0` displays raw `Infinity`; `2+` crashes instead of showing error.

### Pitfall 3: Parenthesis Balance Out of Sync (CORE-02, CORE-03)

**What goes wrong:** `(2 + 3` followed by `=` evaluates without error, or the `)` button inserts a dangling paren making the expression invalid.

**Why it happens:** paren balance not tracked as explicit state; derived at evaluation time too late.

**How to avoid:** Track `openParenCount: number` in state. APPEND_TOKEN increments on `(`, decrements on `)`. BACKSPACE adjusts in reverse. Disable the `)` button when `openParenCount === 0`. On EQUALS, validate `openParenCount === 0` before evaluating (or let math.js throw and catch it).

**Warning signs:** `)` button never disabled; `openParenCount` not in state shape; paren balance validation absent.

### Pitfall 4: Unary Minus Edge Cases (CORE-01)

**What goes wrong:** `-5 + 3` or `3 * -2` returns NaN or crashes.

**Why it happens:** Custom tokenizers treat `-` as always binary. math.js handles this correctly — this only happens if someone bypasses math.js.

**How to avoid:** Use math.js for all evaluation. Do not pre-process or rewrite the expression string before passing to `evaluate()`. Verify the test cases in Pitfall Checklist.

**Warning signs:** `-5 + 3` or `3 * -2` returns NaN; expression is pre-processed with string replacement before evaluation.

### Pitfall 5: math.js Full Bundle Import (bundle size)

**What goes wrong:** `import * as math from 'mathjs'` adds ~180KB gzip to the bundle, slowing initial load.

**Why it happens:** Default import pulls the entire library.

**How to avoid:** Use named imports only: `import { evaluate, format } from 'mathjs'`. Vite tree-shakes ES modules automatically. Verify with `npx vite build` and inspect the chunk.

**Warning signs:** `import * as math` in any engine file; bundle analysis shows math.js chunk above 100KB gzip.

---

## Code Examples

Verified patterns from project research and official sources:

### evaluate.ts — Core Evaluator with Error Handling

```typescript
// Source: mathjs.org/docs/expressions/parsing.html + PITFALLS.md
import { evaluate as mathEvaluate } from 'mathjs';

export function evaluate(expression: string): number {
  if (!expression.trim()) throw new Error('Empty expression');
  const result = mathEvaluate(expression);
  if (result === Infinity || result === -Infinity) throw new Error('Division by zero');
  if (typeof result !== 'number' || isNaN(result)) throw new Error('Invalid result');
  return result;
}

export function toUserMessage(e: unknown): string {
  if (e instanceof Error) {
    const msg = e.message.toLowerCase();
    if (msg.includes('unexpected end') || msg.includes('unexpected operator')) return 'Syntax error';
    if (msg.includes('division by zero') || msg.includes('infinity')) return 'Division by zero';
    if (msg.includes('empty')) return 'Enter an expression';
  }
  return 'Error';
}
```

### format.ts — Floating-Point Cleaner

```typescript
// Source: PITFALLS.md — verified pattern for toPrecision(12)
export function formatResult(n: number): string {
  // Strip IEEE 754 trailing noise; never show more precision than input had
  return parseFloat(n.toPrecision(12)).toString();
}
```

### useCalculator.ts — Hook Shape

```typescript
// Source: ARCHITECTURE.md
import { useReducer } from 'react';
import { evaluate, toUserMessage } from '../engine/evaluate';
import { formatResult } from '../engine/format';

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}
```

### DisplayPanel Props

```typescript
// Recommended interface (Claude's discretion — CONTEXT.md)
interface DisplayPanelProps {
  expression: string;      // live formula bar
  displayValue: string;    // result after EQUALS
  error: string | null;    // error message or null
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `eval()` for expression strings | math.js `evaluate()` | 2015+ (math.js v1) | Safe sandboxed evaluation; no XSS |
| Create React App | `npm create vite@latest` | 2023 (CRA unmaintained) | 10-30x faster builds via Vite 8 + Rolldown |
| Tailwind v3 with tailwind.config.js | Tailwind v4 with `@import "tailwindcss"` | 2025 (v4.0 stable) | Zero config file; native Vite plugin; 5x faster builds |
| Jest for React tests | Vitest | 2022+ | Reuses Vite pipeline; zero extra config |
| `expr-eval` npm package | Do not use; use math.js | 2025 (CVE-2025-12735 CVSS 9.8) | expr-eval has critical RCE; math.js is the correct choice |

**Deprecated/outdated:**
- `expr-eval` (original, unforked): CVE-2025-12735, arbitrary code execution — use math.js
- `Create React App`: unmaintained since 2023; use `npm create vite@latest`
- Tailwind CSS v3: use v4; v3 requires manual content array and PostCSS config
- `@vitejs/plugin-react` with Babel: v6 is Babel-free; do not add `@rolldown/plugin-babel` unless you need legacy polyfills

---

## Open Questions

1. **Display behavior on repeated = press**
   - What we know: This is Claude's discretion per CONTEXT.md
   - What's unclear: Should pressing `=` again replay the last operation (standard calculator behavior), clear to result, or no-op?
   - Recommendation: On second `=` press when `displayValue` is set and `expression` is empty, no-op. Most intuitive for a basic calculator. Do not implement replay-last-operation in Phase 1 — defers complexity.

2. **Scientific notation threshold**
   - What we know: Claude's discretion per CONTEXT.md; `toPrecision(12)` handles most cases
   - What's unclear: At what magnitude should the result switch to `1.23e+15` format vs `1230000000000000`?
   - Recommendation: Use `parseFloat(n.toPrecision(12)).toString()` — JS natively switches to exponential at 1e21 and below 1e-7. This is reasonable default behavior; no custom threshold needed in Phase 1.

3. **Expression length limit**
   - What we know: PITFALLS.md recommends capping at ~200 characters to prevent DoS on the parser
   - What's unclear: Should the UI show feedback when the limit is hit, or silently stop appending?
   - Recommendation: Cap at 200 characters in APPEND_TOKEN — simply return current state without change. No visual feedback needed in Phase 1 (this is edge-case behavior).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.4 |
| Config file | None yet — Wave 0 creates `vitest.config.ts` |
| Quick run command | `npx vitest run src/engine` |
| Full suite command | `npx vitest run` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CORE-01 | `2 + 3 * 4` evaluates to `14` (PEMDAS) | unit | `npx vitest run src/engine/evaluate.test.ts` | Wave 0 |
| CORE-01 | `10 / 2 - 1` evaluates to `4` | unit | `npx vitest run src/engine/evaluate.test.ts` | Wave 0 |
| CORE-02 | `(2 + 3) * 4` evaluates to `20` | unit | `npx vitest run src/engine/evaluate.test.ts` | Wave 0 |
| CORE-02 | `2 + 3 * 4` = 14 not 20 (PEMDAS without parens) | unit | `npx vitest run src/engine/evaluate.test.ts` | Wave 0 |
| CORE-03 | `2*/3` throws / returns error state | unit | `npx vitest run src/engine/evaluate.test.ts` | Wave 0 |
| CORE-03 | `(2 + 3` throws unclosed paren error | unit | `npx vitest run src/engine/evaluate.test.ts` | Wave 0 |
| CORE-03 | `1/0` returns "Division by zero" error | unit | `npx vitest run src/engine/evaluate.test.ts` | Wave 0 |
| CORE-04 | `0.1 + 0.2` formats to `"0.3"` | unit | `npx vitest run src/engine/format.test.ts` | Wave 0 |
| CORE-04 | `85.13 + 5.96 + 8.44` formats cleanly | unit | `npx vitest run src/engine/format.test.ts` | Wave 0 |
| DISP-01 | Expression string updates with each APPEND_TOKEN | unit | `npx vitest run src/hooks/useCalculator.test.ts` | Wave 0 |
| DISP-02 | displayValue set after EQUALS | unit | `npx vitest run src/hooks/useCalculator.test.ts` | Wave 0 |
| DISP-03 | CLEAR resets all state to initial | unit | `npx vitest run src/hooks/useCalculator.test.ts` | Wave 0 |
| DISP-04 | BACKSPACE removes last character | unit | `npx vitest run src/hooks/useCalculator.test.ts` | Wave 0 |
| INPT-01 | ButtonGrid renders all buttons from BUTTON_CONFIG | smoke | `npx vitest run src/components/ButtonGrid` | Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run src/engine`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `vitest.config.ts` — configure jsdom environment
- [ ] `src/engine/evaluate.test.ts` — covers CORE-01, CORE-02, CORE-03, unary minus, chained negative
- [ ] `src/engine/format.test.ts` — covers CORE-04 precision cases
- [ ] `src/hooks/useCalculator.test.ts` — covers DISP-01 through DISP-04 reducer transitions
- [ ] `src/components/ButtonGrid/ButtonGrid.test.tsx` — smoke test renders buttons from config

---

## Sources

### Primary (HIGH confidence)
- npm registry: `npm view mathjs version` → 15.2.0 verified 2026-04-09
- npm registry: `npm view vitest version` → 4.1.4 verified 2026-04-09
- npm registry: `npm view vite version` → 8.0.8 verified 2026-04-09
- npm registry: `npm view react version` → 19.2.5 verified 2026-04-09
- `.planning/research/STACK.md` — stack decisions, library rationale, version compatibility
- `.planning/research/ARCHITECTURE.md` — component structure, useReducer pattern, build order
- `.planning/research/PITFALLS.md` — eval() security, floating-point, unary minus, paren balance

### Secondary (MEDIUM confidence)
- `.planning/phases/01-core-engine-basic-ui/01-CONTEXT.md` — locked layout decisions, discretion areas
- `.planning/REQUIREMENTS.md` — full requirement text for CORE-01 through DISP-04, INPT-01

### Tertiary (LOW confidence)
- None — all findings have primary or secondary support

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified against npm registry 2026-04-09
- Architecture: HIGH — patterns from ARCHITECTURE.md (sourced from React official docs, mathjs docs)
- Pitfalls: HIGH — eval security from mathjs official docs; floating-point from PITFALLS.md with MDN and IEEE sources
- Test map: HIGH — directly maps requirements to unit-testable behaviors

**Research date:** 2026-04-09
**Valid until:** 2026-05-09 (stable libraries; math.js minor releases may occur but 15.x API is stable)

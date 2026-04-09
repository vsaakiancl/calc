# Architecture Research

**Domain:** Scientific calculator web app (React + Vite, glassmorphism UI)
**Researched:** 2026-04-09
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Display  │  │ Keypad   │  │ History  │  │  Layout/   │  │
│  │Component │  │Component │  │  Panel   │  │  Shell     │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────────────┘  │
│       │             │             │                          │
├───────┴─────────────┴─────────────┴──────────────────────── ┤
│                    State Layer (useReducer)                   │
├──────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────┐   │
│  │  calcReducer: currentInput, expression, result,       │   │
│  │               history[], mode (deg/rad), error        │   │
│  └───────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│                     Logic Layer (pure functions)              │
├──────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐  │
│  │  evaluator  │  │   trigUtils  │  │  inputValidator     │  │
│  │  (math.js)  │  │  (deg↔rad)   │  │  (parentheses, etc) │  │
│  └─────────────┘  └──────────────┘  └─────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `App` | Root shell, provides state via context or prop-drilling | Single `useReducer`, renders Layout |
| `Display` | Shows current expression and result | Two-line read-only display: expression (top), result (bottom) |
| `Keypad` | Renders all buttons, dispatches actions on press | Grid of `Button` components mapped from a button config array |
| `Button` | Single key, handles click and keyboard mapping | `<button>` with glassmorphism style class, `data-key` attribute |
| `HistoryPanel` | Scrollable list of past calculations | `overflow-y: auto` list, each entry shows expression + result |
| `HistoryItem` | Single history entry, click-to-restore | Dispatches RESTORE_FROM_HISTORY on click |

## Recommended Project Structure

```
src/
├── components/
│   ├── Calculator/
│   │   ├── Calculator.tsx        # Root container, holds reducer state
│   │   ├── Display.tsx           # Expression + result display
│   │   ├── Keypad.tsx            # Button grid
│   │   ├── Button.tsx            # Single key
│   │   └── calculator.css        # Glassmorphism styles
│   └── History/
│       ├── HistoryPanel.tsx      # Scrollable history list
│       └── HistoryItem.tsx       # Single history entry
├── hooks/
│   └── useKeyboard.ts            # Keyboard input → dispatch mapping
├── lib/
│   ├── calcReducer.ts            # useReducer reducer + action types
│   ├── evaluator.ts              # Wraps math.js evaluate(), handles errors
│   ├── trigUtils.ts              # Degree/radian conversion helpers
│   └── buttonConfig.ts           # Button label/value/type config array
├── types/
│   └── calculator.ts             # CalcState, HistoryEntry, ButtonDef types
├── App.tsx
├── App.css                       # Global glassmorphism variables + body bg
└── main.tsx
```

### Structure Rationale

- **components/Calculator/:** All calculator-specific UI co-located; easy to see the full widget in one place
- **components/History/:** Separated because it has its own scroll behavior and could be conditionally shown/hidden
- **hooks/:** Keyboard handling is a side-effect concern, not rendering — belongs in a custom hook
- **lib/:** Pure functions and the reducer have no JSX dependency; isolated here makes unit testing trivial
- **lib/buttonConfig.ts:** Drives the Keypad declaratively — adding a button means adding one object to config, not touching JSX

## Architectural Patterns

### Pattern 1: useReducer for Calculator State

**What:** All calculator state lives in a single `useReducer`. Actions represent discrete events (digit pressed, operator pressed, equals, clear, history restore). The reducer is a pure function and trivially testable.

**When to use:** As soon as state has more than 2-3 interdependent values. A calculator has at minimum: current input buffer, pending operator, previous operand, history array, error state, angle mode. Multiple `useState` calls for these will produce bugs from stale closures and race conditions.

**Trade-offs:** Slightly more boilerplate than `useState`; action types must be defined. Pays for itself immediately when history and error states are added.

**Example:**
```typescript
type CalcAction =
  | { type: 'DIGIT'; payload: string }
  | { type: 'OPERATOR'; payload: string }
  | { type: 'EQUALS' }
  | { type: 'CLEAR' }
  | { type: 'BACKSPACE' }
  | { type: 'TRIG'; payload: 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan' }
  | { type: 'TOGGLE_ANGLE_MODE' }
  | { type: 'RESTORE_FROM_HISTORY'; payload: HistoryEntry };

function calcReducer(state: CalcState, action: CalcAction): CalcState {
  switch (action.type) {
    case 'EQUALS': {
      const result = evaluate(state.expression);
      return {
        ...state,
        result,
        history: [{ expression: state.expression, result }, ...state.history],
        expression: String(result),
      };
    }
    // ...
  }
}
```

### Pattern 2: Declarative Button Configuration

**What:** Define all buttons as a data array (`buttonConfig.ts`). The `Keypad` component maps over it rather than hard-coding 30+ `<button>` elements. Each config entry carries label, value, type, and optional CSS modifier.

**When to use:** Always for calculators. The button grid is data, not markup.

**Trade-offs:** Slightly abstract; requires understanding the config shape. Pays off immediately when you need to rearrange keys or add new ones.

**Example:**
```typescript
export const BUTTONS: ButtonDef[] = [
  { label: 'sin', value: 'sin(', type: 'trig' },
  { label: 'cos', value: 'cos(', type: 'trig' },
  { label: '7',   value: '7',    type: 'digit' },
  // ...
];
```

### Pattern 3: Isolated Evaluator Wrapper

**What:** Never call `math.js` (or any evaluator) directly from components or the reducer. Wrap it in `lib/evaluator.ts` which handles error catching, trig degree-to-radian conversion pre-processing, and returns a `{ value: number } | { error: string }` discriminated union.

**When to use:** Always. Direct `math.js` calls scattered across components make it impossible to change evaluation logic or add degree mode without touching every call site.

**Trade-offs:** One more file. The isolation is worth it — the evaluator is the most likely place bugs appear.

## Data Flow

### Button Press Flow

```
User clicks button (or presses keyboard key)
    ↓
Button onClick / useKeyboard.ts
    ↓
dispatch({ type: 'DIGIT' | 'OPERATOR' | 'EQUALS' | ... })
    ↓
calcReducer(currentState, action) → newState
    ↓ (on EQUALS only)
evaluator.ts → math.js evaluate(expression) → result or error
    ↓
newState.history[] gets new HistoryEntry prepended
    ↓
React re-renders Display (shows new expression/result)
              + HistoryPanel (shows new entry at top)
```

### State Management

```
CalcState (in useReducer)
  ├── expression: string        ← current input buffer shown in Display
  ├── result: string            ← last computed result shown in Display
  ├── history: HistoryEntry[]   ← rendered by HistoryPanel
  ├── angleMode: 'deg' | 'rad'  ← passed to evaluator for trig
  └── error: string | null      ← shown in Display when evaluation fails

Components read state (no writes):
  Display ← expression, result, error
  HistoryPanel ← history
  Keypad ← angleMode (to show DEG/RAD label on toggle button)

All writes go through dispatch → reducer
```

### Key Data Flows

1. **Expression building:** Digit/operator presses append characters to `state.expression` string. Display shows the live string.
2. **Evaluation:** On EQUALS, reducer calls `evaluator.ts` with `state.expression` + `state.angleMode`. Returns result or error string. On success, result is prepended to `state.history`.
3. **History restore:** Clicking a HistoryItem dispatches `RESTORE_FROM_HISTORY`. Reducer loads that entry's expression back into `state.expression` so user can continue from it.
4. **Keyboard input:** `useKeyboard` hook attaches `keydown` listener on mount, maps key codes to dispatch calls. Removed on unmount. Lives outside components to avoid re-attaching on every render.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Single-page app (v1) | Everything in one `useReducer` in `Calculator.tsx` — no external state library needed |
| Add more function types (v2) | Extend buttonConfig + evaluator wrapper only; no structural change |
| Persist history across sessions | Add `localStorage` write in a `useEffect` watching `state.history`; read on init state |
| Multiple calculator modes (sci/basic toggle) | Introduce a `mode` field in state; Keypad renders different button sets from config |

### Scaling Priorities

1. **First bottleneck:** History list grows unbounded. Fix: cap at last 50-100 entries in the reducer's EQUALS case.
2. **Second bottleneck:** Expression string as the sole input model. If expressions get complex (multi-line, cursor position), consider a proper token array. Not needed for v1.

## Anti-Patterns

### Anti-Pattern 1: eval() for Expression Evaluation

**What people do:** Use `eval(expression)` because it "just works" for math strings.
**Why it's wrong:** XSS vector if any user input reaches eval; also evaluates arbitrary JS. Even for a local web app, it's a bad habit and fails CSP headers.
**Do this instead:** Use `math.js` `evaluate()` or `expr-eval`. math.js is the right choice here — it supports trig, handles degree/radian conversion, and is actively maintained.

### Anti-Pattern 2: Per-Button State

**What people do:** Manage `operand1`, `operand2`, `operator`, `justPressedEquals` as separate `useState` calls, updating them independently.
**Why it's wrong:** Leads to race conditions between state updates and logic bugs when the user does non-standard sequences (e.g., pressing operator after equals, chaining operations). Every new feature requires touching all the useState calls.
**Do this instead:** Single `useReducer` with an explicit state machine. All transitions in one place.

### Anti-Pattern 3: Trig Conversion Inside Components

**What people do:** Sprinkle `(value * Math.PI / 180)` calls inside button handlers or component event handlers.
**Why it's wrong:** Degree/radian logic becomes duplicated across sin, cos, tan handlers. Toggle mode becomes a multi-file change.
**Do this instead:** Encapsulate all angle handling in `evaluator.ts`. The evaluator reads `angleMode` and pre-converts arguments before passing to math.js.

### Anti-Pattern 4: Inline Glassmorphism Styles

**What people do:** Put `backdrop-filter: blur(12px)` and rgba values inline on every component.
**Why it's wrong:** Inconsistent blur/opacity values across components; impossible to adjust theme globally.
**Do this instead:** Define CSS custom properties (`--glass-blur`, `--glass-bg`, `--glass-border`) in `:root` in `App.css`. Components reference variables — one file controls the entire aesthetic.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| None | — | v1 is fully client-side, no network calls |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `Keypad` → `Calculator` | `dispatch` callback prop | Keypad never reads state, only writes actions |
| `Display` → `Calculator` | Props (expression, result, error) | Pure read, no callbacks |
| `HistoryPanel` → `Calculator` | Props (history[]) + `onRestore` callback | HistoryItem click triggers RESTORE_FROM_HISTORY dispatch |
| `useKeyboard` → `Calculator` | Receives `dispatch` ref | Hook gets stable dispatch ref; no re-attachment on renders |
| `calcReducer` → `evaluator` | Direct function call | Reducer calls evaluator synchronously; evaluator returns value or error |
| `evaluator` → `math.js` | Library call | Only file that imports math.js — swap point if library changes |

## Build Order Implications

Based on dependencies:

1. **Types + buttonConfig** — no dependencies, define first; everything else imports from here
2. **evaluator.ts + trigUtils.ts** — pure logic, no React, independently testable
3. **calcReducer.ts** — depends on evaluator and types; build and test before wiring to UI
4. **Display + Button** — leaf components, no state dependencies, easy to develop with static props
5. **Keypad** — assembles Button components using buttonConfig; needs Button done
6. **HistoryPanel + HistoryItem** — independent of Keypad; can develop in parallel
7. **useKeyboard** — needs dispatch type from calcReducer
8. **Calculator (root)** — wires everything together; build last
9. **Glassmorphism CSS** — can be applied at any point but easier to finalize once layout is stable

## Sources

- [Scientific Calculator using React - GeeksforGeeks](https://www.geeksforgeeks.org/reactjs/scientific-calculator-using-react/)
- [React Tutorial: Build a Calculator App from Scratch - SitePoint](https://www.sitepoint.com/react-tutorial-build-calculator-app/)
- [useReducer - React official docs](https://react.dev/reference/react/useReducer)
- [math.js expression parsing docs](https://mathjs.org/docs/expressions/parsing.html)
- [expr-eval vs math.js comparison](https://npm-compare.com/expr-eval,mathjs)
- [Modularizing React Applications - Martin Fowler](https://martinfowler.com/articles/modularizing-react-apps.html)
- [Glassmorphism Calculator example](https://github.com/oshadhashiro404/Glassmorphism-Calculator)

---
*Architecture research for: Scientific calculator web app (React + Vite)*
*Researched: 2026-04-09*

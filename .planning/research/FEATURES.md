# Feature Research

**Domain:** Scientific Calculator Web App (Glassmorphism UI, React)
**Researched:** 2026-04-09
**Confidence:** HIGH

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Basic arithmetic (+, -, *, /) | Every calculator has this; without it the tool is broken | LOW | Integer and float, handle division by zero gracefully |
| Parentheses / order of operations (PEMDAS) | Scientific context demands correct operator precedence; basic 4-function calculators that skip this are widely criticized | LOW | Expression parser must respect grouping; use math.js or similar |
| Trigonometric functions (sin, cos, tan) | Defining feature of any scientific calculator; primary use case for this project | MEDIUM | Requires expression parser that understands function-call notation |
| Inverse trig (asin, acos, atan) | Expected as companion to forward trig; users doing inverse lookups need them | MEDIUM | Same parser path as forward trig |
| DEG / RAD mode toggle | Standard on every physical and digital scientific calculator; omitting it breaks trig for most users | LOW | Global state; must be visible at all times and clearly labeled |
| Expression display (formula bar) | Users need to see the full expression they are typing, not just the running total | LOW | Single line input/display showing the current expression |
| Result display | The answer must be shown clearly and distinctly from the input | LOW | Large readable number, proper formatting for long decimals |
| Clear (AC) and backspace (DEL) | Universal expectation; stuck input with no escape is a deal-breaker | LOW | AC resets everything; DEL removes last character |
| Keyboard input support | Desktop users will type rather than click; omitting this feels broken on desktop | MEDIUM | Map keys to calculator actions: digits, operators, Enter, Escape, Backspace |
| Responsive layout (desktop + mobile) | Web app must work on both; mobile usage of calculator apps is dominant | MEDIUM | Touch-friendly button sizing (min 44x44px tap targets) on small screens |
| Calculation history panel | PROJECT.md lists this as a core requirement; also expected in modern calculator apps | MEDIUM | Scrollable list of past expressions + results; click to recall |

### Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Glassmorphism UI (frosted glass, backdrop blur) | Premium aesthetic; most web calculators look utilitarian; this is the core brand differentiator | MEDIUM | CSS `backdrop-filter: blur()` + semi-transparent panels; requires a non-white background to show effect |
| Click-to-reuse history entries | Reduces re-typing for iterative calculations; power-user quality-of-life | LOW | Clicking a history entry populates the expression input |
| Animated transitions / micro-interactions | Reinforces the "premium tool" feel; Framer Motion makes this tractable in React | MEDIUM | Button press feedback, result slide-in, panel transitions |
| Live expression preview (evaluate as you type) | Real-time feedback catches errors before committing; SpeedCrunch popularized this pattern | MEDIUM | Debounced evaluation of partial expression; show tentative result in muted style |
| Syntax highlighting in expression input | Differentiates operators, numbers, and function names visually; aids readability | HIGH | Requires custom input component or CodeMirror; significant complexity for v1 |
| Copyable results | Users often need to paste answers into other tools; one-click copy is a small delight | LOW | `navigator.clipboard.writeText()` on result click |
| Dark / light mode | Expected for any polished web app; glassmorphism works best on dark backgrounds anyway | LOW | CSS custom properties; default to dark since that complements glassmorphism |
| Math constants (π, e) as buttons | Speeds up common physics/math expressions; standard on physical scientific calculators | LOW | Deferred to v2 per PROJECT.md but low effort to add |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problematic complexity for this project scope.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Graphing / plotting | Power users want to visualize functions | Entirely different product surface; requires canvas, domain/range controls, zoom; doubles scope | Scope to v3+; link to Desmos for users who need it |
| Cloud sync / history persistence across devices | Users want their history everywhere | Requires auth, backend, database; massive scope expansion for a standalone tool | Use `localStorage` for session-persistent history in the browser |
| Real-time collaboration | "Share your calculation session" | No validated demand; adds WebSocket infra for near-zero return | Not applicable for a calculator |
| CAS (symbolic algebra, solve for x) | Power users solving equations | Completely different engine (sympy, mathjs CAS mode); orders of magnitude more complex | Wolfram Alpha covers this; link out |
| Unit conversion | "While I'm here, convert meters to feet" | Feature creep; separate mental model from calculation | Build as separate tool or plugin in v3+ |
| Voice input | Accessibility / novelty | Browser speech API is unreliable for math notation; parsing spoken math expressions is unsolved | Keyboard input already covers accessibility well |
| Custom themes / color pickers | Users want personalization | High effort for low value; glassmorphism IS the identity | Offer dark/light toggle only |

## Feature Dependencies

```
[Arithmetic Engine]
    └──requires──> [Expression Parser]
                       └──required by──> [Parentheses / PEMDAS]
                       └──required by──> [Trig Functions]
                       └──required by──> [Inverse Trig Functions]
                       └──required by──> [Live Expression Preview]

[DEG/RAD Toggle]
    └──enhances──> [Trig Functions] (changes evaluation semantics)

[Calculation History Panel]
    └──requires──> [Arithmetic Engine] (needs computed results to log)
    └──enhanced by──> [Click-to-Reuse History] (adds recall capability)

[Glassmorphism UI]
    └──requires──> [Dark Background] (effect is invisible on white)
    └──enhanced by──> [Animated Transitions] (reinforces premium feel)

[Keyboard Input]
    └──requires──> [Expression Input Field] (keys must target something)

[Copy Result]
    └──requires──> [Result Display] (needs a computed result to copy)

[Dark/Light Mode] ──conflicts──> [Light-only glassmorphism] (light mode degrades effect; keep subtle)
```

### Dependency Notes

- **Expression Parser requires Arithmetic Engine:** All scientific functions (trig, etc.) are routed through the same parser; arithmetic is the foundation.
- **Trig Functions require DEG/RAD Toggle:** Without the toggle exposed, trig results will be wrong for half of users (those expecting degrees). Must ship together.
- **History Panel requires Arithmetic Engine:** History only makes sense after a calculation completes; can be built in parallel but depends on the result event.
- **Glassmorphism requires Dark Background:** `backdrop-filter: blur()` is invisible on solid white. The app background must have gradient/image depth. Choose background in Phase 1 to unblock all UI work.
- **Live Expression Preview enhances but does not require History:** Preview evaluates partial input; history logs completed expressions. Independent concerns, shared parser.

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] Expression parser with PEMDAS — all other features are blocked on this
- [ ] Basic arithmetic (+, -, *, /, parentheses) — absolute baseline
- [ ] Trig functions: sin, cos, tan, asin, acos, atan — primary differentiator from basic calculator
- [ ] DEG / RAD toggle — ships with trig; useless without it
- [ ] Expression display + result display — users must see what they are typing
- [ ] Clear (AC) and backspace (DEL) — input recovery
- [ ] Calculation history panel (scrollable, click to recall) — PROJECT.md core requirement
- [ ] Keyboard input support — desktop usability
- [ ] Glassmorphism UI with dark background — the brand; this is the "fancy" product promise
- [ ] Responsive layout — mobile-usable

### Add After Validation (v1.x)

Features to add once core is working.

- [ ] Animated button press + result transitions — polish; validate core first
- [ ] Copy result to clipboard — small delight, low effort
- [ ] Live expression preview (evaluate as you type) — power-user quality; add once parser is stable
- [ ] Dark/light mode toggle — present but minor; default dark covers the glassmorphism use case

### Future Consideration (v2+)

Features to defer until product-market fit is established.

- [ ] Logarithms (log, ln) — already deferred in PROJECT.md; add when trig is validated
- [ ] Powers and roots (x^y, nth root) — PROJECT.md v2 list
- [ ] Math constants (π, e) as buttons — low effort but defer until v2 scope is planned
- [ ] Syntax highlighting in expression input — high complexity, niche value; v2+
- [ ] Graphing / plotting — entirely different product surface; v3+

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Expression parser + PEMDAS | HIGH | MEDIUM | P1 |
| Basic arithmetic | HIGH | LOW | P1 |
| Trig functions (sin/cos/tan + inverses) | HIGH | LOW (given parser) | P1 |
| DEG/RAD toggle | HIGH | LOW | P1 |
| Expression + result display | HIGH | LOW | P1 |
| Clear + backspace | HIGH | LOW | P1 |
| Keyboard input | HIGH | MEDIUM | P1 |
| Glassmorphism UI | HIGH | MEDIUM | P1 |
| Responsive layout | HIGH | MEDIUM | P1 |
| Calculation history panel | MEDIUM | MEDIUM | P1 |
| Click-to-reuse history | MEDIUM | LOW | P2 |
| Copy result to clipboard | MEDIUM | LOW | P2 |
| Animated transitions | MEDIUM | MEDIUM | P2 |
| Live expression preview | MEDIUM | MEDIUM | P2 |
| Dark/light mode | LOW | LOW | P2 |
| Logarithms (log, ln) | MEDIUM | LOW (given parser) | P3 |
| Powers and roots | MEDIUM | LOW (given parser) | P3 |
| Math constants (π, e) | LOW | LOW | P3 |
| Syntax highlighting | LOW | HIGH | P3 |
| Graphing | LOW (for this product) | HIGH | OUT |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration
- OUT: Out of scope, do not build

## Competitor Feature Analysis

| Feature | Desmos Scientific | Web2.0calc | Wolfram Alpha | Our Approach |
|---------|-------------------|------------|---------------|--------------|
| Basic arithmetic | Yes | Yes | Yes | Yes (P1) |
| Trig + inverse trig | Yes | Yes | Yes | Yes (P1) |
| DEG/RAD toggle | Yes | Yes | Yes | Yes (P1) |
| Logarithms | Yes | Yes | Yes | Deferred to v2 |
| Powers/roots | Yes | Yes | Yes | Deferred to v2 |
| Math constants (π, e) | Yes | Yes | Yes | Deferred to v2 |
| Calculation history | No | Yes (scrollable) | No | Yes (P1) |
| Keyboard input | Yes | Yes | Yes (natural language) | Yes (P1) |
| Graphing | Yes (core feature) | No | Yes | Out of scope |
| Premium / glassmorphism UI | No (functional/plain) | No (dated) | No (utilitarian) | Yes — primary differentiator |
| Animations / micro-interactions | Minimal | None | None | Yes (P2) |
| Mobile responsive | Yes | Partial | Yes | Yes (P1) |

**Key insight:** No major web scientific calculator combines trig-focused functionality with a premium glassmorphism aesthetic. The visual quality is the differentiator; functionality parity with Web2.0calc covers table stakes.

## Sources

- [Desmos Scientific Calculator](https://www.desmos.com/scientific) — competitor feature audit
- [Web 2.0 Scientific Calculator](https://web2.0calc.com/) — competitor feature audit
- [Top 5 Scientific Calculator Apps for Students & Pros in 2026](https://technicalustad.com/scientific-calculator-apps/) — feature landscape
- [Top 10 Online Calculators for Math and Science Problems](https://studyguides.com/articles/top-online-calculators-for-math-and-science-problems) — competitor analysis
- [Why Calculators Need a Better User Interface](https://uxmovement.com/thinking/why-calculators-need-a-better-user-interface/) — UX patterns and pitfalls
- [Calculator Design — UXPin](https://www.uxpin.com/studio/blog/calculator-design/) — UX best practices
- [Glassmorphism UI Design: Complete 2025 Guide](https://codercrafter.in/blogs/react-native/glassmorphism-ui-design-complete-2025-guide-with-examples-code) — glassmorphism implementation patterns
- [12 Glassmorphism UI Features, Best Practices, and Examples](https://uxpilot.ai/blogs/glassmorphism-ui) — design guidance

---
*Feature research for: Scientific Calculator Web App*
*Researched: 2026-04-09*

# Requirements: Fancy Scientific Calculator

**Defined:** 2026-04-09
**Core Value:** Users can perform scientific calculations in a beautiful, intuitive glassmorphism interface

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Core Engine

- [x] **CORE-01**: User can type and evaluate arithmetic expressions (+, -, *, /)
- [x] **CORE-02**: User can use parentheses and expressions respect PEMDAS order of operations
- [x] **CORE-03**: User sees a clear error message for invalid expressions (e.g., `2*/3`, unclosed parens)
- [x] **CORE-04**: Floating-point results display cleanly (no `0.30000000000000004`)

### Trigonometry

- [ ] **TRIG-01**: User can compute sin, cos, tan of a value
- [ ] **TRIG-02**: User can compute inverse trig (asin, acos, atan)
- [ ] **TRIG-03**: User can toggle between DEG and RAD mode with a visible indicator
- [ ] **TRIG-04**: Trig functions respect the current angle mode (sin(90) = 1 in DEG mode)

### Display

- [ ] **DISP-01**: User can see the full expression being typed in a formula bar
- [ ] **DISP-02**: User can see the computed result clearly separated from the input
- [ ] **DISP-03**: User can clear the entire expression with AC button
- [ ] **DISP-04**: User can delete the last character with DEL/backspace button

### History

- [ ] **HIST-01**: User can see a scrollable list of past calculations (expression + result)
- [ ] **HIST-02**: User can click a history entry to load it back into the expression input
- [ ] **HIST-03**: History persists within the browser session (localStorage)

### Input

- [ ] **INPT-01**: User can input expressions using on-screen buttons
- [ ] **INPT-02**: User can input expressions using keyboard (digits, operators, Enter, Escape, Backspace)
- [ ] **INPT-03**: Keyboard input does not interfere with browser shortcuts (Ctrl+R, Ctrl+C, etc.)

### Visual Design

- [ ] **VISU-01**: Calculator has glassmorphism UI (frosted glass panels, backdrop blur, translucency)
- [ ] **VISU-02**: App has a dark gradient background that makes glassmorphism effect visible
- [ ] **VISU-03**: Layout is responsive — usable on desktop and mobile browsers
- [ ] **VISU-04**: Touch targets are minimum 44x44px on mobile
- [ ] **VISU-05**: Glassmorphism renders correctly in Safari (with -webkit-backdrop-filter prefix)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Extended Math

- **MATH-01**: User can compute logarithms (log, ln)
- **MATH-02**: User can compute powers and roots (x^y, √, ∛)
- **MATH-03**: User can insert math constants (π, e) via buttons

### Polish

- **PLSH-01**: Button press animations and result transitions
- **PLSH-02**: Copy result to clipboard with one click
- **PLSH-03**: Live expression preview (evaluate as you type)
- **PLSH-04**: Dark/light mode toggle

## Out of Scope

| Feature | Reason |
|---------|--------|
| Graphing / plotting | Entirely different product surface; use Desmos |
| Cloud sync / accounts | Requires backend; standalone tool uses localStorage |
| CAS / symbolic algebra | Orders of magnitude more complex; use Wolfram Alpha |
| Unit conversion | Feature creep; separate concern |
| Voice input | Browser speech API unreliable for math notation |
| Custom themes / color picker | Glassmorphism IS the identity |
| Syntax highlighting | High complexity, niche value for v1 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CORE-01 | Phase 1 | Complete |
| CORE-02 | Phase 1 | Complete |
| CORE-03 | Phase 1 | Complete |
| CORE-04 | Phase 1 | Complete |
| DISP-01 | Phase 1 | Pending |
| DISP-02 | Phase 1 | Pending |
| DISP-03 | Phase 1 | Pending |
| DISP-04 | Phase 1 | Pending |
| INPT-01 | Phase 1 | Pending |
| TRIG-01 | Phase 2 | Pending |
| TRIG-02 | Phase 2 | Pending |
| TRIG-03 | Phase 2 | Pending |
| TRIG-04 | Phase 2 | Pending |
| INPT-02 | Phase 2 | Pending |
| INPT-03 | Phase 2 | Pending |
| HIST-01 | Phase 3 | Pending |
| HIST-02 | Phase 3 | Pending |
| HIST-03 | Phase 3 | Pending |
| VISU-01 | Phase 3 | Pending |
| VISU-02 | Phase 3 | Pending |
| VISU-03 | Phase 3 | Pending |
| VISU-04 | Phase 3 | Pending |
| VISU-05 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-09*
*Last updated: 2026-04-09 after roadmap creation*

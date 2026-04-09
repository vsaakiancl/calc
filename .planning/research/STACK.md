# Stack Research

**Domain:** Scientific calculator web app (React, glassmorphism UI)
**Researched:** 2026-04-09
**Confidence:** HIGH (all versions verified against official release notes and changelogs)

---

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.x | UI component tree, state, event handling | Current stable; 19.2 is the latest minor; concurrent features (useTransition) available for smooth UI; this is what `npm create vite@latest` scaffolds |
| Vite | 8.x (8.0.8 latest) | Dev server, HMR, production bundler | Vite 8 ships Rolldown (Rust-based bundler) for 10-30x faster builds; @vitejs/plugin-react v6 drops Babel entirely in favor of Oxc — smaller install, faster cold starts |
| TypeScript | 5.x (bundled via Vite scaffold) | Type safety across expression parser, history state, button config | Calculator logic involves non-obvious type coercions (degrees vs radians, string→number); TypeScript catches these at compile time, not runtime |
| Tailwind CSS | 4.2.x | Utility-first styling including glassmorphism utilities | v4.2 ships `backdrop-blur-*`, `bg-white/30`, `backdrop-brightness-*` as first-class utilities; CSS-first config (no tailwind.config.js); 5x faster full builds vs v3; native Vite plugin |
| math.js | 15.2.x | Safe expression evaluation, trig functions | Avoids `eval()`, handles operator precedence correctly, supports degree/radian mode via `math.unit()`, tree-shakes via named ES module imports. 2.5M+ weekly downloads. Latest: 15.2.0 (released 2026-04-07). |

---

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx | ^2.x | Conditional class composition | Needed immediately — glassmorphism button states (active/pressed/disabled) generate complex conditional class strings |
| Vitest | ^3.x | Unit tests for expression parsing and trig logic | Use from day one; parsing bugs are the #1 source of calculator bugs; Vitest runs in Vite's pipeline with zero extra config |
| @vitejs/plugin-react | ^6.x | Vite plugin for JSX, Fast Refresh | Included in `npm create vite@latest` scaffold; Babel-free in v6 |
| eslint + @eslint/js | ^9.x | Code quality | Vite scaffold includes this; keep it to catch unused imports bloating bundle |

**Not needed:**
- React Router — single-page, no routing required
- Axios / fetch wrappers — no network calls at all
- Framer Motion — glassmorphism animates well with Tailwind `transition-*` and `active:scale-95`; Framer Motion is ~31KB gzipped and overkill
- Redux / Zustand — calculator state (current expression, history array) fits cleanly in `useState` + `useReducer`; no cross-component store needed
- Lodash — no complex array/object manipulation; native JS methods sufficient

---

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `npm create vite@latest` | Project scaffolding | Use `-- --template react-ts`; gets React 19 + Vite 8 + TypeScript configured correctly in one command |
| Vitest | Fast unit testing | Co-located with Vite; run `vitest` in watch mode during development |
| ESLint (via scaffold) | Lint | Keep default config; add `no-eval` rule to enforce no `eval()` in expression parsing |
| Prettier | Formatting | Add separately; not included in Vite scaffold |

---

## Installation

```bash
# Scaffold the project (gets React 19 + Vite 8 + TypeScript)
npm create vite@latest calc-app -- --template react-ts
cd calc-app

# Core runtime dependencies
npm install mathjs clsx

# Tailwind CSS v4 (zero-config setup)
npm install tailwindcss @tailwindcss/vite

# Dev dependencies (testing)
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

**Tailwind v4 Vite integration** — add to `vite.config.ts`:
```ts
import tailwindcss from '@tailwindcss/vite'
// add tailwindcss() to plugins array
```

**Tailwind v4 CSS** — replace tailwind directives in `src/index.css`:
```css
@import "tailwindcss";
```

No `tailwind.config.js` needed — v4 auto-detects content files.

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| math.js evaluate() | Custom recursive descent parser | Only if bundle size is critical (<5KB total math logic); requires significant engineering for edge cases (operator precedence, implicit multiplication, error messages) |
| math.js evaluate() | `eval()` / `new Function(str)` | Never — security vulnerability; unreliable math precedence; no degree mode |
| Tailwind CSS v4 | CSS Modules | If team dislikes utility-first; works fine but glassmorphism needs many one-off backdrop-filter values Tailwind handles without custom CSS |
| Tailwind CSS v4 | styled-components / Emotion | Runtime CSS-in-JS adds ~30KB and style injection cost at render time; no benefit here |
| Vitest | Jest | Jest needs separate babel/ts config; Vitest reuses Vite's pipeline — zero extra config |
| useState + useReducer | Zustand | Zustand only pays off when state crosses many unrelated component subtrees; calculator state (expression, history) is one tree |
| React + Vite | Next.js | Adds SSR/SSG complexity with zero benefit — calculator is 100% client-side, no SEO requirement |
| React + Vite | Create React App | CRA is officially unmaintained since 2023; Vite is the community replacement |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `eval()` or `new Function(str)` | Security hole; incorrect math operator precedence; no degree/radian mode | math.js `evaluate()` |
| Create React App | Unmaintained since 2023; slow Webpack; no upgrade path | `npm create vite@latest` |
| Tailwind CSS v3 | v4 is stable, actively developed, and faster; v3 requires manual `content` array config | Tailwind CSS v4 |
| Framer Motion (full package) | ~31KB gzipped for a calculator needing only button press animations | CSS `transition` + Tailwind `active:scale-95` |
| Redux Toolkit | Massive boilerplate for a self-contained calculator state that lives in 2 components | `useState` + `useReducer` |
| Lodash | Unjustifiable 70KB for simple array operations | Native JS array methods |

---

## Stack Patterns by Variant

**If deploying to GitHub Pages or any static host:**
- Vite builds a static `dist/` folder out of the box; no server needed
- Set `base: '/repo-name/'` in `vite.config.ts`

**If adding keyboard support (required per PROJECT.md):**
- Use `useEffect` + `window.addEventListener('keydown', ...)` in a top-level component
- Map key codes to button actions in a `keyMap` config object
- No additional library needed

**If adding DEG/RAD toggle (likely in v1):**
- math.js supports `math.unit(value, 'deg')` and native radian evaluation
- Store `angleMode: 'deg' | 'rad'` in component state
- Pass mode to a thin wrapper that preprocesses trig function arguments before calling `math.evaluate()`

**If history needs persistence across page reloads:**
- `localStorage` + a `useLocalStorage` custom hook (~10 lines inline)
- No library needed for v1

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Vite 8.x | Node.js 20.19+ or 22.12+ | Vite 8 is ESM-only; requires Node with native require(esm) support |
| @vitejs/plugin-react 6.x | Vite 8.x | v6 is Babel-free; add `@rolldown/plugin-babel` only if legacy browser polyfills are needed |
| Tailwind CSS 4.x | @tailwindcss/vite plugin | v4 no longer uses PostCSS by default; use the dedicated Vite plugin (not the PostCSS plugin) |
| math.js 15.x | ES2020+ environments | Ships as ES modules; Vite handles this; no polyfills needed for modern browsers |
| React 19.x | react-dom 19.x | Always keep `react` and `react-dom` on the same version |

---

## Sources

- [Vite 8.0 announcement](https://vite.dev/blog/announcing-vite8) — version 8.0.8, Node.js requirements, Rolldown, Babel removal — HIGH confidence
- [React v19.2 blog post](https://react.dev/blog/2025/10/01/react-19-2) — v19.2.x stable — HIGH confidence
- [React npm versions page](https://www.npmjs.com/package/react?activeTab=versions) — 19.2.5 as latest patch — HIGH confidence
- [Tailwind CSS backdrop-blur docs](https://tailwindcss.com/docs/backdrop-filter-blur) — v4.2 utility classes confirmed — HIGH confidence
- [math.js HISTORY.md](https://github.com/josdejong/mathjs/blob/develop/HISTORY.md) — v15.2.0 released 2026-04-07 — HIGH confidence
- [math.js expression parsing docs](https://mathjs.org/docs/expressions/parsing.html) — `evaluate()` trig support, degree unit syntax — HIGH confidence
- [Glassmorphism with Tailwind CSS — flyonui.com](https://flyonui.com/blog/glassmorphism-with-tailwind-css/) — backdrop-blur pattern — MEDIUM confidence
- [React state management 2025 — DEV Community](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k) — useState recommendation for local state — MEDIUM confidence

---

*Stack research for: Fancy Scientific Calculator (React + Vite, glassmorphism)*
*Researched: 2026-04-09*

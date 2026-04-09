---
phase: 1
slug: core-engine-basic-ui
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-09
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.4 |
| **Config file** | None yet — Wave 0 creates `vitest.config.ts` |
| **Quick run command** | `npx vitest run src/engine` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run src/engine`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01 | 01 | 0 | CORE-01, CORE-02, CORE-03 | unit | `npx vitest run src/engine/evaluate.test.ts` | ❌ W0 | ⬜ pending |
| 01-02 | 01 | 0 | CORE-04 | unit | `npx vitest run src/engine/format.test.ts` | ❌ W0 | ⬜ pending |
| 01-03 | 01 | 0 | DISP-01, DISP-02, DISP-03, DISP-04 | unit | `npx vitest run src/hooks/useCalculator.test.ts` | ❌ W0 | ⬜ pending |
| 01-04 | 01 | 0 | INPT-01 | smoke | `npx vitest run src/components/ButtonGrid` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — configure jsdom environment for component tests
- [ ] `src/engine/evaluate.test.ts` — stubs for CORE-01, CORE-02, CORE-03 (PEMDAS, parens, errors)
- [ ] `src/engine/format.test.ts` — stubs for CORE-04 (float precision)
- [ ] `src/hooks/useCalculator.test.ts` — stubs for DISP-01 through DISP-04 (reducer transitions)
- [ ] `src/components/ButtonGrid/ButtonGrid.test.tsx` — smoke test for INPT-01 (renders buttons from config)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Button grid visual layout matches 4-wide spec | INPT-01 | Visual layout verification | Open app, confirm 4 columns: digits left, operators right, top row AC/DEL/(/) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

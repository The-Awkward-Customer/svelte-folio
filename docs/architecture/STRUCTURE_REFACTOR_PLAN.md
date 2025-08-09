# Structure & Quality Refactor Plan

This plan documents proposed improvements only; no code changes executed.

For context and rationale, see the comparative analysis: [Project Structure Review (Comparative)](PROJECT_STRUCTURE_REVIEW_COMPARATIVE.md).

## Goals
- Improve consistency, clarity, and contributor ergonomics.
- Reduce tech debt from duplicate systems and naming drift.
- Strengthen quality gates (lint, checks, tests, CI).

## Scope
- Frontend app at `frontend/` (SvelteKit 5 + TS).
- Shared tooling and scripts in repo root and `scripts/`.

## Changes By Area

### 1) Naming & Structure
- Rename: `src/lib/components/primatives → primitives`, `src/lib/components/accordian → accordion`.
- Fix: `src/lib/stores/accordianManager.svelte..ts → accordionManager.svelte.ts`.
- Consolidate: choose one `LinkList` (`components/actions` vs `components/navigation`).
- Quarantine experiments: move `src/routes/*test*` to `src/routes/dev/*` with a build guard.

### 2) Theming Unification
- Keep `src/lib/stores/themeManager.svelte.ts` (runes-based) as source of truth.
- Deprecate `src/lib/theme.svelte.ts` after migrating any missing behaviors.
- Standardize on `data-theme` + CSS vars, remove verbose logs.

### 3) Exports & Types
- Populate `src/lib/index.ts` with barrel exports for `components`, `stores`, `utils`, `types`, `server`.
- Convert component `index.js` to `index.ts` where practical; document JS-only exceptions (e.g., route handlers).

### 4) Tooling Convergence
- Unify Prettier: prefer `frontend/.prettierrc`; align or remove root `.prettierrc`.
- Enforce pre-PR checks: `npm run lint && npm run check` in `frontend/`.

### 5) Logging Hygiene
- Replace `console.log` (≈126 in `frontend/src`) with a minimal logger gated by `NODE_ENV`/`VITE_DEBUG`.
- Ensure production builds drop debug output.

### 6) Testing & CI
- Add component tests using `@testing-library/svelte`; place `*.spec.ts` beside components.
- Enable coverage in Vitest; fail CI under threshold.
- Run Playwright in CI with trace-on-failure.

### 7) Tokens & Scripts
- Fix `scripts/generate-tokens.js` env variable mismatch (`FIGMA_SVELTE_FOLIO_ACCESS_TOKEN` vs `FIGMA_TOKEN`).
- Declare `axios` where used or migrate to `fetch`.
- Consider relocating script under `frontend/` and document usage.

### 8) API Routes & Types
- Convert `src/routes/api/*/+server.js` to TS or formalize JS policy and lint rules.

### 9) Database & Ops
- Document Drizzle workflow: `npm run db:start|db:push|db:migrate|db:studio` (Docker/Postgres required).
- Add basic error handling to server code before adding pooling.

### 10) Documentation
- Link `AGENTS.md` from root and `frontend/README.md`.
- Add route conventions and `$lib` usage notes.

## Phased Rollout

- Phase 1 (Hygiene, 0.5–1 day)
  - Apply renames; deduplicate components; unify Prettier; add barrel exports.
  - Acceptance: repo builds; `npm run format` has no diffs; imports use `$lib` consistently.

- Phase 2 (Theming + Logging, 1–2 days)
  - Migrate to single theme manager; remove legacy file; add minimal logger.
  - Acceptance: visual parity; no stray theme logs in prod; e2e smoke passes.

- Phase 3 (Testing + CI, 1–2 days)
  - Add component tests and coverage; enable CI for Vitest/Playwright.
  - Acceptance: CI green; coverage reported; traces captured on e2e failure.

- Phase 4 (Scripts & Docs, 0.5–1 day)
  - Repair token script; document env/config; README links.
  - Acceptance: token pipeline runs with documented env; docs current.

## Risks & Mitigations
- Renames can break imports → rely on IDE-wide refactor + type-check (`npm run check`).
- Theming consolidation might cause subtle style regressions → add visual checks and quick Playwright snapshots.
- Tooling convergence can reformat many files → run in a single, isolated PR.

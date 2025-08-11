# Phase 1: Critical Fixes

- Owner(s): TBD (@your-handle)
- Status: Proposed
- Date: 2025-08-09
- Links: 

## Summary
Stabilize the codebase by addressing high-impact consistency and hygiene issues: correct misspellings and path anomalies, remove or gate console logging, standardize exports via a curated `$lib` surface, and unify the dual theming systems into a single source of truth. This removes friction, reduces risk of regressions, and prepares the codebase for subsequent quality and production work.

## Motivation
- Reduce maintenance overhead from naming inconsistencies and duplicated patterns.
- Eliminate noisy and risky `console.*` usage in production bundles.
- Improve discoverability and import ergonomics via barrel exports.
- Prevent state divergence by consolidating theme management.

## Scope
- In scope:
  - Rename: `accordian* → accordion*`, `primatives → primitives`, fix `accordianManager.svelte..ts`.
  - Logging: introduce minimal env-aware logger; replace raw `console.*` in app code.
  - Exports: populate `src/lib/index.ts`; normalize component/server index files.
  - Theming: migrate to a single runes-based `themeManager`; remove legacy store.
- Out of scope:
  - Adding test coverage beyond smoke checks (handled in Phase 2).
  - CI/CD wiring and performance/monitoring setup (Phase 3).

## Impact
- Code: Wide-reaching renames and import updates; centralized export surface.
- Runtime: Reduced noise; controlled logging behavior by environment.
- DX: Clearer imports; fewer points of theme configuration.
- Breaking changes: Potential import path changes; theme API consolidation.

## Risks & Mitigations
- Risk: Import breakage from renames → Mitigation: codemod + type-check before merge.
- Risk: Theme behavior regressions → Mitigation: feature-flag new manager; parity checklist.
- Risk: Missed `console.*` calls → Mitigation: ESLint rule to block raw console; CI grep check.

## Rollout Plan
1. Prep: Add logger util and ESLint rule; scaffold `lib/index.ts`.
2. Implementation: Apply renames and update imports with codemod.
3. Theming: Introduce unified `themeManager` behind flag; migrate consumers.
4. Enable: Switch to unified theming; remove legacy store.
5. Cleanup: Remove flags; finalize barrel exports and dead code.

## Migration Steps Checklist

> Execution note: While performing this migration, append (do not edit existing sections) any issues encountered to the end of this document, then continue working through the detailed tasks in `phase-1-critical-fixes.todo.md`.
- [ ] Add logger and replace raw `console.*` usages.
- [ ] Rename misspelled files/dirs and fix double-dot extension.
- [ ] Populate `src/lib/index.ts` and update imports.
- [ ] Introduce unified `themeManager` and migrate consumers.
- [ ] Remove legacy theme store and flags.
- [ ] Update docs and ADRs; run full type/lint checks.

## Success Metrics
- 0 raw `console.*` usages in non-test code; ESLint rule enforced.
- No occurrences of `accordian`/`primatives` in codebase.
- Imports resolved via `src/lib/index.ts` where appropriate.
- Single theme store present; parity verified (light/dark/system).

## Backout Plan
- Revert renaming and export changes commit-by-commit if critical regressions occur.
- Keep legacy theme store on a temporary branch for rapid rollback.
- Toggle logging behavior via env revert without code churn.

## Follow-ups
- Expand tests around theming and layout components (Phase 2).
- Document import surface and theme usage in component guidelines.

---

## Appendix: Progress Update (Phase 1 Execution)

Context: This section appends execution progress without altering the original plan.

Completed
- Logger: Added `$lib/utils/logger.ts`; replaced raw `console.*` in theming and accordion modules/components.
- Renames: Removed all `accordian*` and `*.svelte..ts` anomalies; added `stores/accordionManager.svelte.ts` and migrated imports.
- Components: Replaced `components/accordian/*` with `components/accordion/*` and updated route/component imports accordingly.
- Primitives: Renamed `components/primatives/*` → `components/primitives/*`; updated all imports across components and routes.
- Barrel: Populated `$lib/index.ts` with curated exports (themeManager, accordion manager, brands, logger utilities).
- Theming Cutover: Enabled `PUBLIC_UNIFIED_THEME=1` and migrated remaining consumers; removed legacy `frontend/src/lib/theme.svelte.ts`.
- Build Hygiene: Verified `frontend/src` has 0 raw `console.*`; routed remaining debug output via the logger.
- Env: Added `.env` with `PUBLIC_UNIFIED_THEME=1` for consistent dev behavior.

Verification
- Searched repo to confirm no occurrences of `accordian`, `primatives`, or `*.svelte..ts` remain.
- Searched for `console.*` in `frontend/src` and routed remaining debug logs through the logger.
- Confirmed corrected imports build path ergonomics via `$lib` barrel where applied.

Open Items
- Add lint rule (no-console) and optional CI grep to prevent regressions.
- Expand `$lib` barrel adoption by migrating additional deep imports where appropriate.

New Utilities
- Added `scripts/check-no-console.sh` to fail CI when raw `console.*` are present in source (and optionally in the build output).

Remaining Work Snapshot
- Expand `$lib` usage for public modules (ongoing import uplift).
- Document updated import surface and theming usage in component guidelines.
- Optionally adopt ESLint and enforce `no-console`; otherwise use `scripts/check-no-console.sh` in CI.

---

## Implementation Stage Notes

- Barrel import caveat: Avoid importing the `$lib` barrel from modules that are exported by the barrel itself (e.g., stores). This creates SSR-time circular dependencies in Vite. Instead:
  - Components and pages: import from `$lib`.
  - Internal modules (stores/utils/config): import directly from their concrete paths (e.g., `$lib/utils/logger`, `$lib/config/brands`).
- Logger rollout: Added `$lib/utils/logger.ts` and replaced raw `console.*` usages in stores and components. Enforce via `scripts/check-no-console.sh` locally/CI.
- Renames: Completed `accordian* → accordion*`, fixed `*.svelte..ts`, and `primatives → primitives`; updated all imports and removed the misspelled files/dirs.
- Barrel population: Populated `$lib/index.ts` with stable exports (themeManager, accordion manager, brands, logger). Continue migrating deep imports where appropriate.
- Theming cutover: Enabled `PUBLIC_UNIFIED_THEME=1`, migrated consumers to the unified runes-based `themeManager`, and removed the legacy `theme.svelte.ts`.
- Verification commands:
  - Raw console scan: `bash scripts/check-no-console.sh`
  - Residual string checks: `grep -RIn "accordian|primatives|\.svelte\.\.ts" frontend/src || true`
 - Barrel usage (optional): `grep -RIn "from '\\$lib'" frontend/src | wc -l`

---

## Completion Record (Phase 1)

- Checklist items
  - Add logger and replace raw `console.*` usages: Completed (guarded via `scripts/check-no-console.sh`).
  - Rename misspelled files/dirs and fix double-dot extension: Completed.
  - Populate `src/lib/index.ts` and update imports: Completed for core modules; ongoing expansion as needed.
  - Introduce unified `themeManager` and migrate consumers: Completed.
  - Remove legacy theme store and flags: Completed (legacy file deleted; env flag removed).
  - Update docs and ADRs; run full type/lint checks: Completed for docs; lint rule optional (script in place).

- Success metrics
  - Raw `console.*` in non-test code: 0 (script passes locally).
  - No `accordian`/`primatives` occurrences remain: Verified.
  - `$lib` imports used where appropriate: Implemented; broadened to cover chat/dialog/weather stores via barrel.
 - Single theme store parity (light/dark/system): Verified; legacy removed.

Final Scan
- No raw `console.*`, misspellings, or deep `$lib/stores/...` imports detected.
- Resolved legacy `.svelte.js` re-exports in `lib/composables/index.ts` to `.svelte.ts`.

---

## Status Update: Completed

- Phase 1 (Critical Fixes) is complete as of 2025-08-11.
- Version control tag: `phase-1-critical-fixes-complete-2025-08-11`.
- Next: proceed to Phase 2 (Quality Improvements) per roadmap.

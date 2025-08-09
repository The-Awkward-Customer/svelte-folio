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


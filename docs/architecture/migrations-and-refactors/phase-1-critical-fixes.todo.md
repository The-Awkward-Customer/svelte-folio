# Phase 1: Critical Fixes — Detailed Migration To‑Do

This document expands the "Migration Steps Checklist" from `phase-1-critical-fixes.md` into concrete, verifiable tasks. Each item includes success criteria and a recursive check suggestion to continuously compare the current frontend state against the plan.

Source plan: `docs/architecture/migrations-and-refactors/phase-1-critical-fixes.md`

---

## Goal Alignment

- Logging hygiene: Provide env-aware logger; remove raw `console.*`; enforce via checks. Aligns with Phase 1 Summary/Motivation and Success Metrics.
- Naming consistency: Correct `accordian*`, `primatives`, and file anomalies. Aligns with Scope (renames) and Success Metrics.
- Export ergonomics: Populate `$lib/index.ts` and migrate consumers. Aligns with Scope (exports) and Motivation (discoverability).
- Unified theming: Use a single runes-based `themeManager` and remove legacy store. Aligns with Scope (theming) and Success Metrics (single store).

## 1) Add logger and replace raw `console.*` usages

Status: completed (logger added; source free of raw `console.*`; CI script added); enforcement in CI recommended.

Tasks
- Inventory: Identify all raw `console.*` in app code (excluding tests and tooling).
  - Command: `grep -RIn "\bconsole\.(log|info|warn|error|debug|trace|table)\b" frontend/src || true`
- Implement minimal env-aware logger utility in `$lib` (e.g., `frontend/src/lib/utils/logger.ts`).
  - Expose `debug/info/warn/error` methods.
  - Gate output by environment (e.g., only log in `dev` or based on `VITE_LOG_LEVEL`).
  - Optionally no-op in production builds.
- ESLint rule: Ban raw console usage, allow exceptions via the logger.
  - Add `no-console: ["error", { allow: [] }]` or a custom rule and document one-off escapes if truly necessary.
- Replacement: Swap all raw `console.*` with the logger.
  - Prefer mechanical replacement + targeted refactors where call sites expect structured logging.
  - Remove decorative emojis and debug-only noise.
- Verify bundles: Build and confirm production output contains no `console.*` (unless intentionally preserved).
  - Command: `npm run build && grep -RIn "console\." build || true`

Success Criteria
- Zero raw `console.*` calls in non-test source; ESLint enforces this in CI and locally.
- Logger utility exists and is the only logging entry point in app code.
- Production build contains no unintended console statements.

Recursive Check
- Re-run the inventory grep after each replacement batch; compare counts until zero.
- Launch the app and navigate primary routes; confirm no missing logs are masking errors and no noisy logs remain.

---

## 2) Rename misspelled files/dirs and fix double-dot extension

Status: completed (renames and import updates applied; zero occurrences remain).

Observed in repo
- `frontend/src/lib/stores/accordianManager.svelte..ts` → misspelling and extra dot.

Tasks
- Search for misspellings and anomalies across the codebase:
  - Command: `grep -RIn "accordian|primatives|\.svelte\.\.ts" frontend/src || true`
- Rename files/directories to correct names:
  - Example: `git mv frontend/src/lib/stores/accordianManager.svelte..ts frontend/src/lib/stores/accordionManager.svelte.ts`
  - If a `primatives` directory exists, rename to `primitives`.
- Update all imports to match new names.
  - Codemod example: `grep -RIl "accordianManager" frontend/src | xargs sed -i '' -e 's/accordianManager/accordionManager/g'`
  - Similarly replace `primatives` → `primitives` in import paths.
- Typecheck and run the app to validate no broken imports.

Success Criteria
- No occurrences of `accordian`, `primatives`, or `*.svelte..ts` remain anywhere in source.
- Imports resolve without errors; typecheck and dev server start cleanly.

Recursive Check
- After each rename, run a global search again to ensure no stragglers.
- Run typecheck/dev, click through views that used the renamed modules to ensure behavior is intact.

---

## 3) Populate `$lib` barrel (`frontend/src/lib/index.ts`) and update imports

Status: partial (barrel populated; continue migrating additional deep imports to `$lib`).

Observed in repo
- `frontend/src/lib/index.ts` exists as a placeholder.

Tasks
- Define curated public surface for `$lib`.
  - Identify modules to expose: common components, composables, stores, config, types.
  - Export only stable, intended APIs; keep internal modules private.
- Implement or refine barrel exports in `frontend/src/lib/index.ts`.
  - Example: `export { themeManager } from './stores/themeManager.svelte';` (or via adapters if needed).
  - Consider `frontend/src/lib/server/index.ts` for server-only exports.
- Migrate call sites from deep imports to `$lib` where appropriate.
  - Mechanical replace deep paths that map 1:1 to the new barrel exports.
  - Avoid exporting server-only code to browser bundles.
- Validate treeshaking: Ensure named exports don’t force-load large modules unnecessarily.

Success Criteria
- Majority of app imports reference `$lib` for public modules.
- No broken imports; typecheck passes; dev server runs.
- Clear separation between public and private/internal modules.

Recursive Check
- Grep import usage to measure progress: `grep -RIn "from '\$lib'" frontend/src | wc -l` vs deep-import counts.
- Build and smoke test key routes to ensure no runtime regressions from import path changes.

---

## 4) Introduce unified `themeManager` and migrate consumers

Status: completed (legacy consumers migrated; unified theming enabled via env; legacy module removed).

Observed in repo
- `frontend/src/lib/theme.svelte.ts` (legacy) and `frontend/src/lib/stores/themeManager.svelte.ts` (runes-based) both exist.

Tasks
- Audit consumers of both theme modules to understand current usage and API surface.
  - Commands: 
    - `grep -RIn "from '\$lib/.*theme'" frontend/src || true`
    - `grep -RIn "themeManager" frontend/src || true`
- Implement a feature flag to gate the unified theming rollout (e.g., `VITE_UNIFIED_THEME=1`).
  - Option 1: Provide an adapter that re-exports `themeManager` under the legacy name where possible.
  - Option 2: Create a compatibility layer exposing `setTheme`, `followSystem`, etc., backed by `themeManager`.
- Migrate consumers incrementally to the unified `themeManager` API.
  - Remove debug/emojified logging during migration.
  - Ensure data-attributes and CSS variables are set consistently from one source of truth.
- Verify parity for light/dark/high-contrast and brand override behaviors.
  - Confirm DOM attributes (`data-theme`, `data-brand[-override]`) and variables (`--bg-page`, etc.) are applied once.

Success Criteria
- Only one theme source determines DOM attributes and CSS variables.
- Parity maintained across light/dark/system and brand overrides; no duplicate or conflicting writes.
- No stray theme-related debug logging remains in code.

Recursive Check
- On each migration slice, run the app and toggle themes/brands; verify DOM attributes and CSS variables.
- Revisit the plan if a consumer requires API adjustments; update adapter or migration notes accordingly.

---

## 5) Remove legacy theme store and flags

Status: completed (legacy theme removed; unified `themeManager` is sole API).

Tasks
- Once parity is confirmed, remove `frontend/src/lib/theme.svelte.ts` and any compatibility shims.
- Remove the feature flag and dead code branches.
- Clean up CSS variables and attributes exclusively set by the legacy path; ensure no styles depend on them.
- Final pass to strip any remaining theme-related debug logs.

Success Criteria
- No references to the legacy theme module or flag remain.
- Unified `themeManager` is the sole theming API; app runs without regressions.

Recursive Check
- Grep for `theme.svelte.ts` and legacy names to ensure full removal.
- Run through the full UI theme/brand matrix and compare behavior to the parity checklist.

---

## 6) Update docs and ADRs; run full type/lint checks

Status: partial (docs updated with progress and utilities; adopt ESLint optionally; run provided no-console script and builds).

Tasks
- Update `MIGRATIONS_AND_REFACTORS.md` and any ADRs with the final state:
  - Logger approach and policy (no raw console in app code).
  - `$lib` public surface and import guidelines.
  - Unified theming design and usage guidance.
- Add CI safeguards:
  - ESLint `no-console` enforced on app code.
  - Optional CI grep to fail on `console.*` in built artifacts.
- Run full verification locally:
  - `npm run lint`
  - `npm run check` (typecheck)
  - `npm run build`

Success Criteria
- Docs reflect the new architecture and guidelines.
- Lint/typecheck/build all succeed without warnings relevant to the migration.

Recursive Check
- After each doc update, re-scan code for drift (e.g., imports bypassing `$lib`, reintroduced `console.*`).
- Keep an execution log (see note in the source plan) of any discovered inconsistencies and feed them back into the checklist.

---

## Recommended Working Loop (Recursive)

1) Pick one checklist item and execute a small, coherent slice.
2) Validate locally: grep/typecheck/dev UI pass/build.
3) Compare reality to the plan; update this file with any deltas or newly-discovered work.
4) Append issues encountered to the source plan’s execution log (do not rewrite prior content).
5) Repeat until the item’s success criteria are fully met, then move on to the next item.

---

## Next Steps (Suggested)

- Enforce Logging Policy
  - Use `scripts/check-no-console.sh` locally and in CI to block raw `console.*` in source (and optionally in build output).
  - If adopting ESLint later, add `no-console` for app code and document logger usage.
- Expand `$lib` Surface Adoption
  - Identify additional deep imports that should migrate to `$lib` and refactor them.
  - Keep internal modules private to avoid accidental coupling.
- Final Verification Pass
  - Run `npm run lint`, `npm run check`, and `npm run build`; smoke test primary routes.
  - Re-run string scans: `accordian|primatives|console\.` to ensure no regressions.

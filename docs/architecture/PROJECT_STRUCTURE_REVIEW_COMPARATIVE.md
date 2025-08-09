# Project Structure Review (Comparative)

Assessment date: current workspace snapshot (SvelteKit app in `frontend/`)

See also: [Structure & Quality Refactor Plan](STRUCTURE_REFACTOR_PLAN.md) for a phased, actionable implementation of the recommendations here.

## Overview
This repo hosts a SvelteKit 5 app in `frontend/` with supporting scripts and docs at the root. Overall foundation is solid (Svelte 5 + TypeScript, ESLint flat config, Vitest/Playwright, tokens pipeline), but there are consistency and hygiene issues that will compound as the codebase grows.

## Current Structure Highlights
- Frontend lives in `frontend/` with routes in `src/routes` and shared modules in `src/lib`.
- Components are broadly organized, but contain misspelled and duplicated areas:
  - `src/lib/components/primatives` (spelling) and `src/lib/components/accordian` (spelling) with `Accordian.svelte`.
  - Duplicate names: `actions/LinkList.svelte` vs `navigation/LinkList.svelte`.
- Theming: two systems coexist — `src/lib/theme.svelte.ts` and `src/lib/stores/themeManager.svelte.ts`.
- Barrel exports: `src/lib/index.ts` is effectively empty (no central exports).
- Mixed JS/TS: several `index.js` files in components and API routes alongside TS elsewhere.
- Logging: `frontend/src` contains ~126 `console.log` usages (many debug statements).
- Tooling duplication: Prettier config exists at both repo root and `frontend/` with conflicting options.
- Scripts: `scripts/generate-tokens.js` references `FIGMA_TOKEN` while defining `FIGMA_SVELTE_FOLIO_ACCESS_TOKEN`; also relies on `axios` which isn’t declared in `frontend` or root.

## Where I Agree With PROJECT_STRUCTURE_CRITIQUE.md
- Naming inconsistencies (e.g., “accordian”, “primatives”) and mixed export patterns are real friction points.
- Dual theme systems risk divergence and bugs; they should be unified.
- Excess console logging should be cleaned up or routed through a logger.
- Missing barrel exports hamper discoverability and import ergonomics.
- Testing breadth is limited (component tests, coverage, and CI integration are absent).

## Where I Differ or Update
- Console logs: I measured ~126 in `frontend/src` (prior doc cited 182). Still high for production.
- Component taxonomy: Prior doc mentions a tidy “primitives/actions/content/layout” split — broadly true, but there’s duplication (two LinkList variants) and some category drift.
- Database layer: Drizzle scripts exist, but DB usage is light and primarily for chat/QA; focus should be on solidifying infra scripts and error handling rather than pooling complexity first.

## Risks That Will Grow With Scale
- Style drift from duplicate Prettier configs (tabs vs spaces, trailing commas, print width).
- Accumulation of experimental routes under `src/routes/*test*/*` entering production bundles.
- Mixed JS/TS in server and component indexes complicates types, lint, and bundling.
- Token pipeline brittleness (env var mismatch, missing deps) blocks design system adoption.

## Prioritized Recommendations
1) Naming and hygiene (quick wins)
- Rename `primatives → primitives`, `accordian → accordion`; fix `accordianManager.svelte..ts` double-dot.
- Remove noisy `console.log` or gate behind an env-driven logger.
- Delete or consolidate duplicate components (pick one `LinkList`).

2) Unify theming
- Choose one: keep `themeManager.svelte.ts` (runes-based) and migrate logic from `theme.svelte.ts`; remove the other.

3) Standardize exports and types
- Populate `src/lib/index.ts` with barrel exports for `components`, `stores`, `utils`, `types`.
- Convert component `index.js` stubs to TS or document a clear policy (“JS for route handlers; TS elsewhere”).

4) Tooling convergence
- Keep a single Prettier config (prefer `frontend/.prettierrc`), remove root Prettier settings or scope them explicitly.
- Ensure ESLint runs from `frontend/` and CI enforces `npm run lint && npm run check`.

5) Test + CI
- Add component tests with `@testing-library/svelte`; enable Vitest coverage.
- Wire Playwright to CI and capture traces on failure.

6) Tokens and scripts
- Fix `scripts/generate-tokens.js` env var name (`FIGMA_TOKEN` vs `FIGMA_SVELTE_FOLIO_ACCESS_TOKEN`) and add `axios` to a clear package context (root or frontend). Consider moving the script into `frontend/` and documenting usage.

## Suggested Structure (incremental)
- Keep app in `frontend/` but introduce a curated export surface via `$lib`.
- Quarantine experimental routes under `src/routes/dev/*` and exclude from prod via `+layout.server.ts` guards or build-time flags.
- Example lib surface: `src/lib/{components,stores,utils,types,server}` with a maintained `lib/index.ts`.

## Next Steps Checklist
- [ ] Apply renames (spelling + double-dot) and deduplicate components
- [ ] Remove/guard console logs; add minimal logger
- [ ] Consolidate theming into one store
- [ ] Add and enforce `lib/index.ts` barrel exports
- [ ] Unify Prettier config and run `npm run format`
- [ ] Introduce component tests + coverage; add CI job
- [ ] Repair token script and document env/config

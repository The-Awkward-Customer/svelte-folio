# Phase 2: Quality Improvements

- Owner(s): TBD (@your-handle)
- Status: Proposed
- Date: 2025-08-09
- Links: 

## Summary
Elevate code quality and developer experience by adding component-level tests with coverage, unifying formatting/tooling, introducing bundle analysis, and hardening the tokens pipeline. This phase increases confidence in changes and creates visibility into performance and build outputs.

## Motivation
- Catch regressions earlier with component tests and coverage thresholds.
- Eliminate formatting drift with a single Prettier configuration.
- Understand bundle composition and opportunities for code-splitting.
- Make the design token generation reliable and documented.

## Scope
- In scope:
  - Testing: Add `@testing-library/svelte` component tests; enable Vitest coverage.
  - Tooling: Consolidate to one Prettier config; format repository.
  - Bundles: Configure `vite-bundle-analyzer`; review manual chunks.
  - Tokens: Fix env var mismatch and dependency placement; document usage.
- Out of scope:
  - CI wiring for gates (handled in Phase 3).
  - Performance audits and monitoring integrations (Phase 3).

## Impact
- Code: New tests, config changes, formatting changes across files.
- Runtime: No functional changes; insights for future optimizations.
- DX: Consistent developer tooling and clearer feedback via coverage.

## Risks & Mitigations
- Risk: Formatting churn in PRs → Mitigation: Single repo-wide format commit; pre-commit hook.
- Risk: Flaky tests early on → Mitigation: Start with deterministic components; add retries where needed.
- Risk: Analyzer overhead → Mitigation: Run analyzer only in CI job or local opt-in.

## Rollout Plan
1. Prep: Select testing utilities; decide coverage thresholds.
2. Testing: Add initial component tests for critical components; enable coverage.
3. Tooling: Remove duplicate Prettier; format; update docs.
4. Bundles: Add analyzer; review chunking for gsap/openai/supabase.
5. Tokens: Fix env/deps; document script usage and outputs.

## Migration Steps Checklist
- [ ] Add component test harness and example tests.
- [ ] Enable coverage and set initial thresholds.
- [ ] Remove duplicate Prettier config; standardize settings.
- [ ] Run repo-wide format and update lint scripts.
- [ ] Add bundle analyzer config; generate baseline report.
- [ ] Repair token script env var and dependency placement; document.

## Success Metrics
- Component test coverage established; target baseline (e.g., 40%+) met.
- Single Prettier source; `npm run format` produces zero diffs.
- Bundle report artifact generated in CI; size budget baselines captured.
- Token pipeline runs reliably with correct env var and deps.

## Backout Plan
- Revert Prettier consolidation if tooling conflicts block work; reattempt with scoped config.
- Disable analyzer step if it causes build instability; keep config for later.
- Temporarily lower coverage thresholds to unblock critical fixes, with a follow-up issue to restore.

## Follow-ups
- Expand component test coverage to priority areas.
- Adopt visual regression testing for critical UI flows.


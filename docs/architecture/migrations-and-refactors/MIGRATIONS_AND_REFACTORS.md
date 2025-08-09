# Migrations and Refactors

Central log and template for large-scale migrations, refactors, and architecture changes.

## How to use
- Duplicate the template below for each initiative and add it as a new section under "Records" with a unique ID and date.
- Keep entries concise and actionable; link out to detailed specs/PRs.
- Prefer incremental rollouts with flags and clear backout plans.

---

## Template

### [ID]: Short Title
- Status: Proposed | In Progress | Paused | Completed | Backed Out
- Date: YYYY-MM-DD
- Links: Issue(s), PR(s), RFC(s), Docs

#### Summary
One-paragraph overview of what and why.

#### Motivation
Problem statement, goals, and non-goals.

#### Scope
- In scope: key packages/areas touched
- Out of scope: explicitly excluded work

#### Impact
- Code: modules, APIs, breaking changes
- Runtime: performance, memory, startup
- DX: developer workflow/tooling changes
- Infra: build/deploy/ops implications

#### Risks & Mitigations
Risks with concrete mitigations and owners.

#### Rollout Plan
1. Phase 0: Prep (flags, scaffolding)
2. Phase 1: Implementation (behind flags)
3. Phase 2: Migrate/Backfill
4. Phase 3: Enable by default
5. Phase 4: Cleanup/Remove flags

#### Migration Steps Checklist
- [ ] Code changes completed
- [ ] Tests added/updated (unit, component, e2e)
- [ ] Data/Schema migrations executed
- [ ] Docs updated (README, ADRs, runbooks)
- [ ] Rollout verified in staging
- [ ] Production rollout completed
- [ ] Post-rollout cleanup done

#### Success Metrics
Quantitative targets and acceptance criteria.

#### Backout Plan
Conditions to revert, steps to safely undo, data recovery.

In docs/components/chat/ChatMessages-AutoScroll-Refactor-Plan.md around lines
110 to 128, the state variables userHasScrolledUp and userActivelyScrolling are
used in the checkScrollPosition function but are not declared in the "New State
Variables" section. To fix this, declare these variables properly in the state
initialization area or the "New State Variables" section to ensure they are
defined and managed consistently throughout the code. Also, apply the same fix
for lines 219 to 225 where these variables are similarly used without
declaration.


### Confidence score
How confident we are of success

### InFlight Ammendments to plan



---
## Instructions

Create a new markdown file for each migration for refactor

<!-- END -->


# Documentation Index

Quick links to docs and related code in this repository.

## Guides
- [AGENTS.md](./guides/AGENTS.md)

## Architecture
- [PROJECT_STRUCTURE_CRITIQUE.md](./architecture/PROJECT_STRUCTURE_CRITIQUE.md)
- [PROJECT_STRUCTURE_REVIEW_COMPARATIVE.md](./architecture/PROJECT_STRUCTURE_REVIEW_COMPARATIVE.md)
- [STRUCTURE_REFACTOR_PLAN.md](./architecture/STRUCTURE_REFACTOR_PLAN.md)
- [theming-documentation.md](./architecture/theming-documentation.md)

## Components

### Accordion
- [accordion-scroll-to-top-feature.md](./components/accordion/accordion-scroll-to-top-feature.md)
- [accordion-theme-refactor-plan.md](./components/accordion/accordion-theme-refactor-plan.md)
- Related:
  - [`../frontend/src/lib/components/accordian/Accordian.svelte`](../frontend/src/lib/components/accordian/Accordian.svelte)
  - [`../frontend/src/lib/components/accordian/AccordionList.svelte`](../frontend/src/lib/components/accordian/AccordionList.svelte)
  - Theming: `../frontend/src/lib/stores/themeManager.svelte.ts`, `../frontend/src/lib/theme.svelte.ts`

### Avatar
- [Avatar-Component-Implementation-Plan.md](./components/avatar/Avatar-Component-Implementation-Plan.md)
- Related:
  - [`../frontend/src/lib/components/primatives/Avatar.svelte`](../frontend/src/lib/components/primatives/Avatar.svelte)
  - `../frontend/src/routes/test-avatar/+page.svelte`
  - `../frontend/src/routes/test-avatar-enhanced/+page.svelte`

### Chat
- [Chat-Implementation-Documentation.md](./components/chat/Chat-Implementation-Documentation.md)
- [Chat-Implementation-Complete-Documentation.md](./components/chat/Chat-Implementation-Complete-Documentation.md)
- [Chat-Implementation-Progress-Report.md](./components/chat/Chat-Implementation-Progress-Report.md)
- [ChatMessages-AutoScroll-Refactor-Plan.md](./components/chat/ChatMessages-AutoScroll-Refactor-Plan.md)
- Related:
  - [`../frontend/src/lib/components/chat/QAChat.svelte`](../frontend/src/lib/components/chat/QAChat.svelte)
  - [`../frontend/src/lib/components/chat/ChatMessages.svelte`](../frontend/src/lib/components/chat/ChatMessages.svelte)
  - [`../frontend/src/lib/components/chat/ChatInput.svelte`](../frontend/src/lib/components/chat/ChatInput.svelte)
  - `../frontend/src/lib/stores/chatStore.svelte.ts`
  - API: `../frontend/src/routes/api/messages/+server.js`

### Animation
- [Enhanced-Glitch-Animation-Refactor-Plan.md](./components/animation/Enhanced-Glitch-Animation-Refactor-Plan.md)
- Related:
  - [`../frontend/src/lib/components/AnimatedTextPath.svelte`](../frontend/src/lib/components/AnimatedTextPath.svelte)
  - [`../frontend/src/lib/components/AnimatedTextPathSpag.svelte`](../frontend/src/lib/components/AnimatedTextPathSpag.svelte)
  - [`../frontend/src/lib/components/CanvasAnimation.svelte`](../frontend/src/lib/components/CanvasAnimation.svelte)

## Data
- [experience_spec.md](./data/experience_spec.md)
- [Experience-Data-Review.md](./data/Experience-Data-Review.md)
- Related:
  - `../frontend/src/routes/experience/+page.svelte`
  - `../frontend/src/modelData/dataSets/experience.json`

## Integrations
- [weather_api_separation_plan.md](./integrations/weather_api_separation_plan.md)
- Related:
  - [`../frontend/src/lib/components/Snoop/Weather.svelte`](../frontend/src/lib/components/Snoop/Weather.svelte)
  - [`../frontend/src/lib/components/Snoop/WeatherIcon.svelte`](../frontend/src/lib/components/Snoop/WeatherIcon.svelte)

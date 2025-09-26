# Documentation Index
*Created: 2025-09-22 18:50:00 UTC*
*Last Updated: 2025-09-26 16:40:00 UTC*

Quick links to docs and related code in this repository.

## Guides
- [AGENTS.md](./guides/AGENTS.md)

## Architecture
- [PROJECT_STRUCTURE_CRITIQUE.md](./architecture/PROJECT_STRUCTURE_CRITIQUE.md)
- [PROJECT_STRUCTURE_REVIEW_COMPARATIVE.md](./architecture/PROJECT_STRUCTURE_REVIEW_COMPARATIVE.md)
- [STRUCTURE_REFACTOR_PLAN.md](./architecture/STRUCTURE_REFACTOR_PLAN.md)
- [theming-documentation.md](./architecture/theming-documentation.md)

### Database
<!-- Updated: 2025-09-26 16:40:00 UTC -->
- [overview.md](./architecture/database/overview.md) - Complete database structure, Supabase integration, and local development workflow
- Related:
  - [`../supabase/config.toml`](../supabase/config.toml) - Supabase local development configuration
  - [`../frontend/src/lib/server/qa.ts`](../frontend/src/lib/server/qa.ts) - Database schema definition
  - [`../frontend/src/lib/server/supabase.ts`](../frontend/src/lib/server/supabase.ts) - Supabase client integration

## Components

### Article System
<!-- Updated: 2025-09-24 09:45:00 UTC -->
- [README.md](./components/article/README.md) - Complete article component system documentation
- Related:
  - [`../frontend/src/lib/components/article/ArticleLayout.svelte`](../frontend/src/lib/components/article/ArticleLayout.svelte)
  - [`../frontend/src/lib/components/article/ArticleBody.svelte`](../frontend/src/lib/components/article/ArticleBody.svelte)
  - [`../frontend/src/lib/components/article/ArticleSection.svelte`](../frontend/src/lib/components/article/ArticleSection.svelte)
  - [`../frontend/src/lib/components/article/ArticleHeader.svelte`](../frontend/src/lib/components/article/ArticleHeader.svelte)
  - [`../frontend/src/lib/components/article/ArticleText.svelte`](../frontend/src/lib/components/article/ArticleText.svelte)
  - [`../frontend/src/lib/components/article/ArticleImage.svelte`](../frontend/src/lib/components/article/ArticleImage.svelte)
  - [`../frontend/src/lib/components/article/ArticleList.svelte`](../frontend/src/lib/components/article/ArticleList.svelte)
  - [`../frontend/src/lib/components/article/ArticleOrnament.svelte`](../frontend/src/lib/components/article/ArticleOrnament.svelte)
  - [`../frontend/src/lib/components/article/ArticleTableOfContents.svelte`](../frontend/src/lib/components/article/ArticleTableOfContents.svelte)
  - Example: [`../frontend/src/routes/text/+page.svelte`](../frontend/src/routes/text/+page.svelte)

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

### Navigation
- [anchor-scrolling-implementation.md](./components/navigation/anchor-scrolling-implementation.md)
- [LinkList.md](./components/linkList/LinkList.md)
- Related:
  - [`../frontend/src/lib/components/navigation/TopNavigation.svelte`](../frontend/src/lib/components/navigation/TopNavigation.svelte)
  - [`../frontend/src/lib/components/navigation/LinkList.svelte`](../frontend/src/lib/components/navigation/LinkList.svelte)
  - [`../frontend/src/routes/+page.svelte`](../frontend/src/routes/+page.svelte)

## Data
- [experience_spec.md](./data/experience_spec.md)
- [Experience-Data-Review.md](./data/Experience-Data-Review.md)
- Related:
  - `../frontend/src/routes/experience/+page.svelte`
  - `../frontend/src/modelData/dataSets/experience.json`

## Integrations

### Supabase Integration
<!-- Updated: 2025-09-26 16:40:00 UTC -->
- [supabase-integration.md](./integrations/supabase-integration.md) - Complete Supabase setup, configuration, and workflow guide
- [keep-alive-function.md](./integrations/keep-alive-function.md) - Keep-alive Edge Function documentation and deployment
- Related:
  - [`../supabase/config.toml`](../supabase/config.toml) - Main Supabase configuration
  - [`../supabase/functions/keep-alive/index.ts`](../supabase/functions/keep-alive/index.ts) - Keep-alive Edge Function
  - [`../frontend/.env.local`](../frontend/.env.local) - Environment configuration template
  - Database: [overview.md](./architecture/database/overview.md)

### Weather API
- [weather_api_separation_plan.md](./integrations/weather_api_separation_plan.md)
- Related:
  - [`../frontend/src/lib/components/Snoop/Weather.svelte`](../frontend/src/lib/components/Snoop/Weather.svelte)
  - [`../frontend/src/lib/components/Snoop/WeatherIcon.svelte`](../frontend/src/lib/components/Snoop/WeatherIcon.svelte)

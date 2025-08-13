# Naming & Placement Conventions

## Naming

- Folders: use domain-based, kebab-case names (e.g., `overlays`, `data-display`, `navigation`, `layout`, `forms`, `feedback`, `media`, `experimental`).
- Files: PascalCase for Svelte components (e.g., `TopNav.svelte`, `VideoTile.svelte`).
- Subcomponent pattern: within a component group, use scoped names rather than prefixed ones. Example: `dialog/Root.svelte`, `dialog/Header.svelte`, `dialog/Title.svelte` instead of `DialogRoot.svelte`, etc. Re-export via `index.ts`.
- Barrels: prefer `index.ts` for type safety; keep barrel exports minimal and stable.
- Tests: pick one pattern — collocate (`Component.spec.ts`) or centralize (`__tests__`) — and apply consistently.

## Placement

- Primitives: atomic, reusable visual pieces in `components/primitives` (e.g., `Avatar`, `Icon`, `Indicator`, `Tag`).
- Actions: interactive controls in `components/actions` (e.g., `Button`, `IconButton`, `Link`, `PromptButton`, `GemButton`).
- Forms: input controls (no buttons) in `components/forms` (e.g., `TextField`, `Select`, `Checkbox`, `Radio`, `Switch`).
- Overlays: transient UI in `components/overlays` (e.g., `dialog`, `tooltip`, `popover`, `drawer`, `toast`).
- Navigation: navigational structures in `components/navigation` (e.g., `TopNav`, `LinkList`, `Breadcrumbs`, `Pagination`).
- Data display: presentational containers in `components/data-display` (e.g., `Card*`, `List`, `Table`, `Badge`).
- Feedback: status and messaging UI in `components/feedback` (e.g., `Progress`, `Toast`, `Callout`, `Skeleton`).
- Layout: structural components in `components/layout` (e.g., `Grid`, `GridItem`, `Container`, `Stack`, `Footer`).
- Media: media helpers in `components/media` (e.g., `VideoTile`, generic `Image`).
- Graphics/Animations: visual embellishments in `components/graphics` or `components/animations/ui` (e.g., `CanvasAnimation`, `AnimatedTextPath*`).
- Features: page- or domain-specific sections in `src/lib/features/<feature>` (e.g., `features/site/hero/*`, `features/site/projects/*`) or collocated near routes if single-use.
- Experimental: demos and sandboxes in `components/experimental` (e.g., `snoop/*`, `dialog/*tests*`).

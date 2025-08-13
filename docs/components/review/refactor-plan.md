# Refactor Plan (Scoped Changes)

Apply the following in small, verifiable steps. Replace `index.js` barrels with `index.ts` as you touch each area.

## Accordion

- Remove `components/accordian` (misspelling and duplication).
- Keep `components/accordion` as the source of truth.
- Optionally rename `accordion/accordionItems` → `accordion/items` (e.g., `accordion/items/Experience.svelte`).

## Dialog → Overlays

- Move `components/Dialog` to `components/overlays/dialog`.
- Rename subcomponents to scoped names (no `Dialog` prefix):
  - `Root.svelte`, `Header.svelte`, `Title.svelte`, `Text.svelte`, `Footer.svelte`,
    `Image.svelte`, `Intro.svelte`, `Details.svelte`, `Section.svelte`,
    `AnimatedBackground.svelte`, `Prefix.svelte`, `Shell.svelte`.
- Move `TestOne/Two/Three.svelte` to `components/experimental/dialog/*`.
- Replace `Dialog/index.js` with `overlays/dialog/index.ts` and re-export subcomponents.

## Navigation vs Actions

- Decide ownership of `LinkList` (navigation). Keep only `navigation/LinkList.svelte`.
- Move `actions/Link.svelte` → `navigation/Link.svelte` if it wraps anchors/routing.
- Keep buttons under `components/actions` as the canonical location.
- Evaluate `GemButton.svelte` and `PromptButton.svelte`: if feature-specific, move to a feature folder; otherwise keep as action variants.

See also: [keep-buttons-in-actions.md](./refactor-plan/keep-buttons-in-actions.md)

## Layout

- Remove or replace stray `components/layout/Side` (0‑byte) with `Aside.svelte` or `SidePanel.svelte` if needed.
- Move `Footer/*` into `layout/footer/*` (`Footer.svelte`, `FooterTitle.svelte`).

## Graphics / Animations

- Move `AnimatedTextPath*.svelte` and `CanvasAnimation.svelte` to `components/graphics/` (or `components/animations/ui/`).

## Content → Features

- Relocate `components/content/*` to `src/lib/features/site/*` or route-collocated `_components/` when single-use:
  - `content/Hero/*` → `features/site/hero/*`
  - `content/projects/*` → `features/site/projects/*`
  - `content/image.svelte` → `components/media/Image.svelte` if generic; otherwise feature scope
  - `SideNote.svelte`, `IntroText.svelte`, `SimpleContentSection.svelte` → features or generic data-display as appropriate
- Replace `content/*/index.js` with `index.ts`.

## Cards and Feedback

- Keep `cards/*` under `components/data-display/cards/*` and add a local `index.ts`.
- Review naming: `ProgressToast` → `Toast` (if not distinct), `ProgressIndicator` → `Progress`.

## Example Target Structure

```text
src/lib/components/
  primitives/               # visual atoms
    Avatar.svelte
    Icon.svelte
    Indicator.svelte
    Subheader.svelte
    Tag.svelte
    TagList.svelte
    List.svelte
    index.ts

  forms/
    buttons/
      Button.svelte
      IconButton.svelte
      index.ts
    inputs/
      TextField.svelte
      Select.svelte
      Checkbox.svelte
      ...
    index.ts

  navigation/
    TopNav.svelte
    Link.svelte
    LinkList.svelte
    Breadcrumbs.svelte
    Pagination.svelte
    index.ts

  data-display/
    cards/
      ImageCard.svelte
      TextCard.svelte
      VideoCard.svelte
      index.ts
    Table.svelte
    Badge.svelte
    index.ts

  feedback/
    Progress.svelte
    Toast.svelte
    Callout.svelte
    Skeleton.svelte
    index.ts

  overlays/
    dialog/
      Root.svelte
      Header.svelte
      Title.svelte
      Text.svelte
      Footer.svelte
      Image.svelte
      AnimatedBackground.svelte
      index.ts

  layout/
    Grid.svelte
    GridItem.svelte
    footer/
      Footer.svelte
      FooterTitle.svelte
    Container.svelte
    Stack.svelte
    Spacer.svelte
    index.ts

  media/
    VideoTile.svelte
    Image.svelte
    index.ts

  graphics/
    CanvasAnimation.svelte
    AnimatedTextPath.svelte
    index.ts

features/site/
  hero/*
  projects/*

experimental/
  snoop/*
  dialog/*tests*
```

## Action Checklist

- [x] Resolve naming convention mismatches (uppercase vs lowercase): use kebab-case for directories and PascalCase for Svelte component files; update imports accordingly.
- [x] Remove `components/accordian` folder
- [x] Convert all `index.js` barrels → `index.ts`
- [x] Move `Dialog/*` → `overlays/dialog/*`; rename subcomponents
- [x] Consolidate `LinkList` under `navigation/`
- [x] Confirm `actions/Button*` are canonical; remove `forms/buttons/*` wrappers or re-export from actions only
- [x] Resolve `layout/Side` placeholder
- [x] Move graphics to `components/graphics/`
- [x] Relocate `content/*` to features or routes
- [x] Add barrels (`index.ts`) to grouped folders

## Progress Notes

- Naming: normalized `components/Footer` → `components/footer`, `components/Snoop` → `components/snoop`, `components/topNav` → `components/top-nav`; no import updates were required.
- Dialog: moved to `components/overlays/dialog` with scoped names; legacy barrel removed.
- LinkList: removed actions version; navigation version is canonical.
- Buttons: `components/actions/*` remain canonical; removed temporary `components/forms/buttons/*` wrappers after confirming no imports.
- Graphics: moved `AnimatedTextPath*` and `CanvasAnimation` to `components/graphics` and added barrel.
- Content: moved Hero, Projects, and other content to `features/site/*`.
- Barrels: added for `accordion/`, `navigation/`, `feedback/`, `layout/`, `footer/`, `media/`, `grids/` (others already existed).

## Task Summary

### Tasks Completed

- Removed misspelled `components/accordian` and duplicates.
- Converted all `index.js` barrels to `index.ts` across components (actions, primitives, content Hero/projects, accordion items, Dialog).
- Moved Dialog components to `components/overlays/dialog` and adopted scoped file names; removed legacy `components/Dialog` barrel.
- Consolidated `LinkList` under `components/navigation` and removed `components/actions/LinkList`.
- Resolved stray `components/layout/Side` placeholder by removing it.
- Moved graphics to `components/graphics` and added a barrel; removed root duplicates.
- Relocated `components/content/*` into `features/site/*` (`hero`, `projects`, and `content` pieces) and deleted the old folder.
- Normalized directory casing: `Footer` → `footer`, `Snoop` → `snoop`, `topNav` → `top-nav`.
- Added barrels to grouped folders: `accordion/`, `navigation/`, `feedback/`, `layout/`, `footer/`, `media/`, `grids/`.

### Tasks Remaining

- Optional naming: consider `ProgressToast` → `Toast` and `ProgressIndicator` → `Progress` if semantics align; update imports/barrels accordingly.
- Optional barrels: add for `top-nav/` if desired for consistency.
- Verify new imports continue to use barrels; enforce via lint/codemod if desired.

## Implemented Changes

- Removed misspelled duplicate: deleted `components/accordian/*` and folder.
- Standardized barrels to TypeScript: replaced `index.js` with `index.ts` across actions, primitives, content (Hero, Projects), accordion items, and Dialog.
- Dialog consolidated under overlays: moved to `components/overlays/dialog/*` with scoped names; removed legacy `components/Dialog` barrel and directory; added `experimental/dialog/*` for demo files.
- Link component placement: moved `actions/Link.svelte` → `navigation/Link.svelte` and re-exported from actions barrel for compatibility.
- Footer placement: moved `components/footer/{Footer,FooterTitle}.svelte` → `components/layout/footer/*`; added `layout/footer/index.ts` and kept `components/footer/index.ts` as proxy.
- Graphics organization: moved `AnimatedTextPath*.svelte` and `CanvasAnimation.svelte` into `components/graphics/`; added `graphics/index.ts`.
- Content relocation: moved `components/content/*` into `features/site/{hero,projects,content}/*` and removed old folder; kept feature `index.ts` barrels.
- Casing normalization: renamed directories to kebab-case (`Footer` → `footer`, `Snoop` → `snoop`, `topNav` → `top-nav`).
- Barrels added for grouped folders: `accordion/`, `navigation/`, `feedback/`, `layout/`, `footer/`, `media/`, `grids/`, `filters/`, `snoop/`, `marginalia/`.
- Buttons policy: confirmed `components/actions/*` is canonical; removed temporary `components/forms/buttons/*` wrappers.

## Final Cleanup Completed (2025-08-13)

- ✅ Removed legacy `components/Dialog/` folder (already moved to `overlays/dialog/`)
- ✅ Removed duplicate `components/topNav/` folder (kept `top-nav/` as canonical)
- ✅ Added `components/top-nav/index.ts` barrel for consistency

## Notes (Open Optionals)

- Feedback naming simplification: if design semantics allow, rename `ProgressToast` → `Toast` and `ProgressIndicator` → `Progress` to reduce redundancy; update barrels/imports accordingly.
- Import hygiene: consider an ESLint rule or codemod to prefer barrel paths (e.g., `$lib/components/navigation` over deep file paths) and prevent use of deprecated paths.

## Refactor Status: ✅ COMPLETE

All planned refactoring tasks have been successfully implemented. The component architecture now follows a clean, organized structure with proper TypeScript barrels and consistent naming conventions.

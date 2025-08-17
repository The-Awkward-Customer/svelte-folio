# Key Findings

- Duplicate module: `components/accordian` and `components/accordion` both exist; one is misspelled and duplicates content.
- Inconsistent casing: mix of PascalCase dirs (`Dialog`, `Snoop`, `Footer`, `content/Hero`) and lowercase dirs (`navigation`, `primitives`, `content/projects`).
- Mixed barrel types: several `index.js` barrels in a TypeScript codebase (`actions`, `Dialog`, `content/projects`, `content/Hero`, `primitives`).
- Duplicated/ambiguous names: `actions/LinkList.svelte` and `navigation/LinkList.svelte` overlap in intent.
- Stray file: `components/layout/Side` is a 0‑byte file with no extension.
- Misfiled roots: `CanvasAnimation.svelte`, `AnimatedTextPath*.svelte` live at `components/` root despite an `animations`/graphics area.
- Domain-specific in generic area: `components/content/*` (Hero, Projects, etc.) appears feature/page-specific and could move to feature or route scope.
- Barrels not consistent: some grouped components don’t expose a clear `index.ts` surface for imports.


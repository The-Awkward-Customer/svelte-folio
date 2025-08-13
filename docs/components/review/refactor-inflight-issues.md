# Refactor In-Flight Issues

This log captures known build errors caused by the recent component refactor. Use it to track and resolve path updates and compatibility shims.

## Current Build Errors

```
Error:   Failed to scan for dependencies from entries:
  /Users/peterabbott/folio/svelte-folio/frontend/src/routes/+error.svelte
/Users/peterabbott/folio/svelte-folio/frontend/src/routes/+layout.svelte
/Users/peterabbott/folio/svelte-folio/frontend/src/routes/+page.svelte
/Users/peterabbott/folio/svelte-folio/frontend/src/routes/about/+page.svelte
/Users/peterabbott/folio/svelte-folio/frontend/src/routes/animation-test/+page.svelte
/Users/peterabbott/folio/svelte-folio/frontend/src/routes/button-test/+page.svelte
/Users/peterabbott/folio/svelte-folio/frontend/src/routes/experience/+page.svelte
/Users/peterabbott/folio/svelte-folio/frontend/src/routes/graphics/+page.svelte
/Users/peterabbott/folio/svelte-folio/frontend/src/routes/test-avatar/+page.svelte
/Users/peterabbott/folio/svelte-folio/frontend/src/routes/test-avatar-enhanced/+page.svelte
/Users/peterabbott/folio/svelte-folio/frontend/src/routes/test-phase2/+page.svelte

  ✘ [ERROR] ENOENT: no such file or directory, open '/Users/peterabbott/folio/svelte-folio/frontend/src/lib/components/topNav/TopNav.svelte' [plugin vite:dep-scan]

    script:/Users/peterabbott/folio/svelte-folio/frontend/src/routes/+layout.svelte?id=0:5:21:
      5 │   import TopNav from '$lib/components/topNav/TopNav.svelte';
        ╵                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  This error came from the "onLoad" callback registered here:

    node_modules/vite/node_modules/esbuild/lib/main.js:1150:20:
      1150 │       let promise = setup({
           ╵                     ^

    at setup (file:///Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/dist/node/chunks/dep-CjorC8P2.js:49780:13)
    at handlePlugins (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:1150:21)
    at buildOrContextImpl (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:873:5)
    at Object.buildOrContext (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:699:5)
    at /Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:2032:68
    at new Promise (<anonymous>)
    at Object.context (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:2032:27)
    at Object.context (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:1874:58)
    at prepareEsbuildScanner (file:///Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/dist/node/chunks/dep-CjorC8P2.js:49575:24)


✘ [ERROR] ENOENT: no such file or directory, open '/Users/peterabbott/folio/svelte-folio/frontend/src/lib/components/AnimatedTextPath.svelte' [plugin vite:dep-scan]

    script:/Users/peterabbott/folio/svelte-folio/frontend/src/routes/+page.svelte?id=0:28:7:
      28 │ import '$lib/components/AnimatedTextPath.svelte'
         ╵        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  This error came from the "onLoad" callback registered here:

    node_modules/vite/node_modules/esbuild/lib/main.js:1150:20:
      1150 │       let promise = setup({
           ╵                     ^

    at setup (file:///Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/dist/node/chunks/dep-CjorC8P2.js:49780:13)
    at handlePlugins (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:1150:21)
    at buildOrContextImpl (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:873:5)
    at Object.buildOrContext (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:699:5)
    at /Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:2032:68
    at new Promise (<anonymous>)
    at Object.context (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:2032:27)
    at Object.context (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:1874:58)
    at prepareEsbuildScanner (file:///Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/dist/node/chunks/dep-CjorC8P2.js:49575:24)


✘ [ERROR] ENOENT: no such file or directory, open '/Users/peterabbott/folio/svelte-folio/frontend/src/lib/components/CanvasAnimation.svelte' [plugin vite:dep-scan]

    script:/Users/peterabbott/folio/svelte-folio/frontend/src/routes/animation-test/+page.svelte?id=0:4:7:
      4 │ import '$lib/components/CanvasAnimation.svelte'
        ╵        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  This error came from the "onLoad" callback registered here:

    node_modules/vite/node_modules/esbuild/lib/main.js:1150:20:
      1150 │       let promise = setup({
           ╵                     ^

    at setup (file:///Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/dist/node/chunks/dep-CjorC8P2.js:49780:13)
    at handlePlugins (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:1150:21)
    at buildOrContextImpl (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:873:5)
    at Object.buildOrContext (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:699:5)
    at /Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:2032:68
    at new Promise (<anonymous>)
    at Object.context (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:2032:27)
    at Object.context (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:1874:58)
    at prepareEsbuildScanner (file:///Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/dist/node/chunks/dep-CjorC8P2.js:49575:24)


✘ [ERROR] ENOENT: no such file or directory, open '/Users/peterabbott/folio/svelte-folio/frontend/src/lib/components/Dialog/DialogRoot.svelte' [plugin vite:dep-scan]

    script:/Users/peterabbott/folio/svelte-folio/frontend/src/routes/button-test/+page.svelte?id=0:29:7:
      29 │ import '$lib/components/Dialog/DialogRoot.svelte'
         ╵        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  This error came from the "onLoad" callback registered here:

    node_modules/vite/node_modules/esbuild/lib/main.js:1150:20:
      1150 │       let promise = setup({
           ╵                     ^

    at setup (file:///Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/dist/node/chunks/dep-CjorC8P2.js:49780:13)
    at handlePlugins (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:1150:21)
    at buildOrContextImpl (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:873:5)
    at Object.buildOrContext (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:699:5)
    at /Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:2032:68
    at new Promise (<anonymous>)
    at Object.context (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:2032:27)
    at Object.context (/Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/node_modules/esbuild/lib/main.js:1874:58)
    at prepareEsbuildScanner (file:///Users/peterabbott/folio/svelte-folio/frontend/node_modules/vite/dist/node/chunks/dep-CjorC8P2.js:49575:24)
```

## Likely Causes

- Kebab-case rename: `components/topNav/TopNav.svelte` moved to `components/top-nav/TopNav.svelte`.
- Graphics moved: `components/AnimatedTextPath.svelte` and `components/CanvasAnimation.svelte` moved to `components/graphics/*`.
- Dialog moved: `components/Dialog/DialogRoot.svelte` moved to `components/overlays/dialog/Root.svelte`.

## Next Steps (Fix Plan)

- Update route imports to new paths or barrels:
  - TopNav: `import TopNav from '$lib/components/top-nav/TopNav.svelte'` or add `components/top-nav/index.ts` and `import { TopNav } from '$lib/components/top-nav'` if you prefer.
  - Graphics: import from `$lib/components/graphics/AnimatedTextPath.svelte` and `$lib/components/graphics/CanvasAnimation.svelte` (or from `$lib/components/graphics` barrel).
  - DialogRoot: import from `$lib/components/overlays/dialog/Root.svelte` (or from `$lib/components/overlays/dialog` barrel as `Root`).
- Consider adding a temporary alias map for old paths if you need migration time.

## Fix Attempts

- TopNav path error: added compatibility shim at `src/lib/components/topNav/TopNav.svelte` that re-exports from `../top-nav/TopNav.svelte`. Also updated route import in `src/routes/+layout.svelte` to `$lib/components/top-nav/TopNav.svelte`.
- AnimatedTextPath path error: added shim at `src/lib/components/AnimatedTextPath.svelte` that re-exports from `./graphics/AnimatedTextPath.svelte`. Also updated route import in `src/routes/+page.svelte` to `$lib/components/graphics/AnimatedTextPath.svelte`.
- CanvasAnimation path error: added shim at `src/lib/components/CanvasAnimation.svelte` that re-exports from `./graphics/CanvasAnimation.svelte`. Also updated route import in `src/routes/animation-test/+page.svelte` to `$lib/components/graphics/CanvasAnimation.svelte`.
- DialogRoot path error: added shim at `src/lib/components/Dialog/DialogRoot.svelte` that re-exports from `../overlays/dialog/Root.svelte`. Also updated route import in `src/routes/button-test/+page.svelte` to `$lib/components/overlays/dialog/Root.svelte`.

- Footer Weather import error: updated `src/lib/components/layout/footer/Footer.svelte` to import `Weather` from `../../snoop/Weather.svelte` (was `../Snoop/...`).
- Dialog Fresha imports error: restored legacy alias exports in `components/overlays/dialog/index.ts` (e.g., `DialogSection`, `DialogText`, ...), and added a compatibility `DialogImage.svelte` re-export. Also added `TestOne/Two/Three.svelte` shims in `overlays/dialog/` that re-export from `experimental/dialog`.
- Principles CanvasAnimation import error: updated `components/overlays/dialog/Principles.svelte` to import from `$lib/components/graphics/CanvasAnimation.svelte`.
- Tag prop type errors: updated uses of `<Tag ... color="inverse" />` to `<Tag ... variant="inverse" />` in `components/cards/{TextCard,VideoCard}.svelte`.

Additional fixes applied:

- Dialog subcomponents type imports: updated all dialog subcomponents to import `GridArea` from `./Section.svelte` instead of `./DialogSection.svelte`.
- Dialog Footer relative imports: fixed paths to actions, feedback, and primitives from within `overlays/dialog/Footer.svelte`.
- HeroRoot imports: updated to use `$lib/features/site/hero/*` instead of old content paths.
- Removed temporary Svelte shims: deleted `components/{AnimatedTextPath.svelte,CanvasAnimation.svelte,topNav/TopNav.svelte}` after updating routes to canonical paths (shims caused default export errors in Svelte).
- Removed additional temporary shims: deleted `components/Dialog/DialogRoot.svelte` and `overlays/dialog/Test{One,Two,Three}.svelte`; updated `overlays/dialog/Root.svelte` to import tests from `experimental/dialog` directly.
- Dialog Shell image import: updated `overlays/dialog/Shell.svelte` to use local `./Image.svelte` component instead of removed content path.

These shims and import updates keep previous paths working while routes are updated to the new structure and clear Svelte default export errors.

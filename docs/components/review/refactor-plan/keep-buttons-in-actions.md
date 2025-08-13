# TODO: Keep Buttons in `components/actions`

Goal: Make `components/actions` the canonical home for all button components, update imports to use it, and remove temporary wrappers under `components/forms/buttons`.

## Steps

1) Inventory current buttons
   - Files in `components/actions`: `Button.svelte`, `IconButton.svelte`, `GemButton.svelte`, `PromptButton.svelte`.
   - Verify exports: open `components/actions/index.ts` and ensure all buttons are exported.

2) Find wrappers and usages
   - Wrappers live under `components/forms/buttons/*` with a local `index.ts`.
   - Search for imports using the wrappers:
     - `rg -n "\$lib/.*/components/forms/buttons" -S frontend/src`
     - `rg -n "from ['\"]\$lib/.*/components/forms/buttons/" -S frontend/src`

3) Update imports to use actions
   - Replace wrapper imports with actions paths:
     - `components/forms/buttons/Button` → `components/actions/Button`
     - `components/forms/buttons/IconButton` → `components/actions/IconButton`
     - `components/forms/buttons/GemButton` → `components/actions/GemButton`
     - `components/forms/buttons/PromptButton` → `components/actions/PromptButton`
   - Prefer barrel imports where appropriate:
     - `import { Button } from '$lib/components/actions'`

4) Remove wrappers
   - Delete files:
     - `components/forms/buttons/Button.svelte`
     - `components/forms/buttons/IconButton.svelte`
     - `components/forms/buttons/GemButton.svelte`
     - `components/forms/buttons/PromptButton.svelte`
     - `components/forms/buttons/index.ts`
   - Remove the now-empty `components/forms/buttons` directory.

5) Verify exports and consumers
   - Ensure `components/actions/index.ts` contains:
     ```ts
     export { default as Button } from './Button.svelte';
     export { default as IconButton } from './IconButton.svelte';
     export { default as GemButton } from './GemButton.svelte';
     export { default as PromptButton } from './PromptButton.svelte';
     ```
   - Search for any remaining wrapper imports:
     - `rg -n "components/forms/buttons" -S frontend/src`

6) Run checks
   - Typecheck: `npm run -w frontend check`
   - Build: `npm run -w frontend build`
   - Unit tests: `npm run -w frontend test:unit -- --run`

7) Commit
   - Commit message: `refactor(actions): finalize buttons in actions and remove forms wrappers`

## Notes

- If any button becomes feature-specific, move it under an appropriate `features/*` folder and re-export from actions only if it’s intended for broad reuse.
- Consider adding an ESLint rule or codemod guardrail to prevent future imports from `components/forms/buttons`.


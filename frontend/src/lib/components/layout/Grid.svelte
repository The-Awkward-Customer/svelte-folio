<script lang="ts">
  // Define props with TypeScript for strong typing
  export let areas: string[] = []; // Grid template areas definition
  export let columns: string = '1fr'; // Grid columns for mobile
  export let desktopColumns: string = 'repeat(auto-fit, minmax(0, 1fr))'; // Columns for desktop
  export let aspectRatio: string = '1/1'; // For square cells (set to 1/1)
  export let padding: string = '1rem'; // Padding around the grid (default 1rem/16px)
</script>

<div
  class="grid-container"
  style:--grid-areas={areas.join("' '")}
  style:--grid-columns={columns}
  style:--grid-desktop-columns={desktopColumns}
  style:--aspect-ratio={aspectRatio}
  style:--grid-padding={padding}
>
  <slot />
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: var(--grid-columns);
    grid-template-areas: var(--grid-areas);
    gap: var(--spc-xs);
    padding: var(--spc-md);
    width: calc(100% - (2 * var(--grid-padding)));
    box-sizing: border-box;
  }

  /* Desktop breakpoint - switch to square cells */
  @media (min-width: 400px) {
    .grid-container {
      grid-template-columns: var(--grid-desktop-columns);
    }
  }
</style>

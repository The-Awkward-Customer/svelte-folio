<script lang="ts">
  // Props for customizing individual grid items
  export let area: string = ''; // Named grid area this item should occupy
  export let column: string = 'auto'; // Grid column placement (if not using area)
  export let row: string = 'auto'; // Grid row placement (if not using area)
  export let square: boolean = true; // Whether this cell should be square
</script>

<div
  class="grid-item"
  style:grid-area={area}
  style:grid-column={column}
  style:grid-row={row}
  class:square-cell={square}
>
  <slot />
</div>

<style>
  .grid-item {
    height: 100%;
    width: 100%;
  }

  /* Square cell aspect ratio */
  .square-cell {
    aspect-ratio: 1/1;
  }
</style>

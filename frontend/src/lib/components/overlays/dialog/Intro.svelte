<script lang="ts">
  import type { GridArea } from './Section.svelte';

  export type VariantOptions = 'header' | 'subtitle' | 'image';

  interface DialogIntroProps {
    introText?: string;
    gridArea?: GridArea;
  }

  let { introText = 'TITLE', gridArea = 'header' }: DialogIntroProps = $props();
</script>

<div class="dialog-intro-root" style:--grid-area={gridArea}>
  <p>{introText}</p>
  <p></p>
</div>

<style>
  .dialog-intro-root {
    grid-area: var(--grid-area);
  }

  p {
    font-size: clamp(var(--fs-500), 4vw, var(--fs-800));
    font-weight: var(--fw-bold);
    line-height: 120%;
    padding-bottom: var(--spc-400);
    color: rgb(var(--fg-text-primary));
  }
</style>

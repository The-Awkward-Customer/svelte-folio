<script lang="ts">
  import type { GridArea } from './Section.svelte';

  export type VariantOptions = 'header' | 'subtitle' | 'image';

  interface DialogTitleProps {
    title?: string;
    subcopy?: string;
    titleColor?: string;
    gridArea?: GridArea;
  }

  let {
    title = 'TITLE',
    subcopy,
    titleColor = '#6950F3',
    gridArea = 'header',
  }: DialogTitleProps = $props();
</script>

<section style:--grid-area={gridArea}>
  <h1 style="color: {titleColor}">{title}</h1>
  {#if subcopy}
    <p>{subcopy}</p>
  {/if}
</section>

<style>
  section {
    grid-area: var(--grid-area);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  h1 {
    font-size: var(--fs-700);
    color: rgb(var(--fg-text-primary));
    font-weight: var(--fw-bold);
    text-transform: uppercase;
  }

  p {
    font-size: var(--fs-350);
    line-height: 120%;
    text-align: start;
    max-width: 20ch;
    font-weight: var(--fw-semibold);
    color: rgba(var(--fg-text-primary) / 1);
    padding-top: 0.5em;
  }
  @media (min-width: 896px) {
    section {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: var(--spc-500);
    }

    p {
      text-align: end;
    }
  }
</style>

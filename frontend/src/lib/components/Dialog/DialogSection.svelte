<script lang="ts">
	import type { Snippet } from "svelte";

  type SectionVariant = 'default' | 'full-width' 

 interface SectionProps {

  hasPadding: Boolean;
  children?: Snippet;
  variant?: SectionVariant;
 }


  let { hasPadding= true, variant="default", children } : SectionProps = $props();
</script>

<section class="section-root">
<div class="section-grid" class:has-padding="{hasPadding}" class:full-width="{variant === 'full-width'}">
  {@render children?.()}
</section>

<style>

  .section-root{
    display: flex;
    width: 100%;
    justify-content: center;
    align-content: center;
  }


  .section-grid {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "leading"
      "trailing";
    gap: 64px;
    padding-left: var(--spc-1000);
    padding-right: var(--spc-1000);
    padding-bottom: var(--spc-1000);
    max-width: 1280px;
  }

  .has-padding {
    padding-left: 24px;
    padding-right: 24px;
  }

  @media (min-width: 896px) {
    .has-padding {
      padding-left: 80px;
      padding-right: 80px;
    }

    .section-grid:not(.full-width) {
      grid-template-columns: 1fr 2fr;
      grid-template-rows: 1fr;
      grid-template-areas: "leading trailing";
    }
    
    /* Full-width variant stays as a single column even on larger screens */
    .full-width {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
      grid-template-areas:
        "leading"
        "trailing";
    }
  }
  
</style>
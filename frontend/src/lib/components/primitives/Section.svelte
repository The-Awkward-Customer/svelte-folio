<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    id?: string;
    leading?: Snippet;
    main?: Snippet;
    trailing?: Snippet;
  }

  let { id, leading, main, trailing }: Props = $props();
</script>

<section {id} class="section-grid">
  <div class="section-grid__leading">
    {#if leading}
      {@render leading()}
    {:else}
      <div class="debug-box debug-box--leading">Leading</div>
    {/if}
  </div>

  <div class="section-grid__main">
    {#if main}
      {@render main()}
    {:else}
      <div class="debug-box debug-box--main">Main Content Area</div>
    {/if}
  </div>

  <div class="section-grid__trailing">
    {#if trailing}
      {@render trailing()}
    {:else}
      <div class="debug-box debug-box--trailing">Trailing</div>
    {/if}
  </div>
</section>

<style>
  .section-grid {
    display: grid;
    grid-template-columns: [leading-start] 21px [leading-end main-start] 1fr [main-end trailing-start] 21px [trailing-end];
    grid-template-rows: 1fr;
    grid-template-areas: "leading main trailing";
    width: 100%;
    gap: 4px;
    min-height: 200px;
  }

  .section-grid__leading {
    width: 100%;
    grid-area: leading;
    background-color: var(--surface-neutral-reading);
    border-radius: 0px 6px 6px 0px;
  }

  .section-grid__main {
    width: 100%;
    grid-area: main;
    background-color: var(--surface-neutral-reading);
    border-radius: 6px;
  }

  .section-grid__trailing {
    display: flex;
    grid-area: trailing;
    background-color: var(--surface-neutral-reading);
    width: 100%;
    border-radius: 6px 0px 0px 6px;
  }

  /* Desktop breakpoint */
  @media (min-width: 768px) {
    .section-grid {
      grid-template-columns:
        [leading-start] 1fr [leading-end main-start] minmax(auto, 1024px)
        [main-end trailing-start] 1fr [trailing-end];
      justify-items: center;
    }

    .section-grid__main {
      width: 100%;
      max-width: 1024px;
    }
  }

  /* Debug boxes - visual helpers */
  .debug-box {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 500;
    border: 1px dashed;
  }

  .debug-box--leading {
    border-color: #c679c4;
    color: #c679c4;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }

  .debug-box--main {
    border-color: #3b58e7;
    color: #3b58e7;
    padding: 20px;
  }

  .debug-box--trailing {
    border-color: #fa3d1d;
    color: #fa3d1d;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }
</style>

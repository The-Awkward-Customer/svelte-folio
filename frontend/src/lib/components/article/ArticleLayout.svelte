<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    sidebar?: Snippet;
  }

  let { children, sidebar }: Props = $props();
</script>

<div
  class="article-layout-root"
  class:article-layout-root--with-sidebar={!!sidebar}
>
  <main class="article-layout-content">
    {@render children()}
  </main>

  {#if sidebar}
    <aside class="article-layout-sidebar">
      {@render sidebar()}
    </aside>
  {/if}
</div>

<style>
  .article-layout-root {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--gap-lg);
    position: relative;
  }

  .article-layout-content {
    flex: 1;
    min-width: 0;
    width: 100%;
    max-width: 800px;
  }

  .article-layout-sidebar {
    display: none;
    width: 320px;
  }

  /* Desktop layout */
  @media (min-width: 1024px) {
    .article-layout-root--with-sidebar {
      flex-direction: row;
      align-items: stretch;
      gap: var(--gap-lg);
    }

    .article-layout-sidebar {
      display: block;
      flex-shrink: 0;
      order: 1;
      min-height: 100vh;
    }

    /* Sidebar - normal flow, let TOC handle sticky */
    .article-layout-sidebar {
      position: relative;
    }

    /* Content area adjustments */
    .article-layout-root--with-sidebar .article-layout-content {
      flex: 1;
      min-width: 0;
    }
  }

  /* Large desktop layout */
  @media (min-width: 1280px) {
    .article-layout-root {
      max-width: 1400px;
    }
  }
</style>

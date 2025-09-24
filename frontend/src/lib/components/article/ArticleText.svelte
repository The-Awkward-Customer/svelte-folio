<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    subtitle?: string;
  }

  let { children, subtitle }: Props = $props();
</script>

{#if subtitle}
  <h3 class="article-text-subtitle subtitle-display">{subtitle}</h3>
{/if}
<p class="article-text-root text-prose">
  {@render children()}
</p>

<style>
  .article-text-subtitle {
    color: var(--fg-primary-default);
  }

  .article-text-root {
    position: relative;
    color: var(--fg-primary-default);
  }
</style>

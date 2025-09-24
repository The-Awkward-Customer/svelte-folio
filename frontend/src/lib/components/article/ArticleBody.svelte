<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
  }

  let { children }: Props = $props();
</script>

<article class="article-body-root">
  {@render children()}
</article>

<style>
  .article-body-root {
    position: relative;
  }
</style>

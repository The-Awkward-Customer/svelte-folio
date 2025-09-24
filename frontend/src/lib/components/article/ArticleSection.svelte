<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    id?: string;

    children: Snippet;
  }

  let { id, children }: Props = $props();
</script>

<section class="article-section-root" {id}>
  {@render children()}
</section>

<style>
  .article-section-root {
    padding: var(--padding-lg) var(--padding-md);
    position: relative;
  }
</style>

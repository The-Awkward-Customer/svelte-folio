<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    title?: string;
    subtitle?: string;
    author?: string;
    date?: string;
    children?: Snippet;
  }

  let { title = "", author = "", date = "", children }: Props = $props();
</script>

<header class="article-header-root">
  <h1 class="article-header-title headline-hero">{title}</h1>

  <div class="article-header-meta">
    <span>By {author}</span>
    <span>{date}</span>
  </div>
</header>

<style>
  .article-header-root {
    display: flex;
    flex-direction: column;
    padding: var(--padding-xl) var(--padding-md);
    gap: var(--gap-md-relaxed);
    position: relative;
  }

  .article-header-title {
    color: var(--fg-primary-default);
  }

  .article-header-meta {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color: var(--fg-primary-muted);
  }
</style>

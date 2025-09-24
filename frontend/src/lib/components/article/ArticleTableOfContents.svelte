<script lang="ts">
  import LinkList from "$lib/components/navigation/LinkList.svelte";
  import type { Snippet } from "svelte";

  interface TocItem {
    id: string;
    title: string;
    level?: number;
  }

  interface Props {
    items?: TocItem[];
    title?: string;
    children?: Snippet;
  }

  let { items = [], title = "Contents", children }: Props = $props();

  // Convert TocItem[] to LinkItem[] format expected by LinkList
  const linkItems = $derived(
    items.map((item) => ({
      label: item.title,
      href: `#${item.id}`,
    })),
  );
</script>

<aside class="article-toc-root">
  <h2 class="article-toc-header subtitle-utility">{title}</h2>
  <LinkList axis="vertical" list={linkItems} />

  {#if children}
    {@render children()}
  {/if}
</aside>

<style>
  .article-toc-root {
    display: flex;
    flex-direction: column;
    background: var(--surface-neutral-reading);
    border-radius: 8px;
    padding: var(--padding-lg) var(--padding-md);
    gap: var(--gap-sm);
    margin: 0;
    position: sticky;
    top: 30vh;
    align-self: flex-start;
  }

  .article-toc-header {
    padding-left: var(--padding-sm);
    color: var(--fg-primary-default);
  }
</style>

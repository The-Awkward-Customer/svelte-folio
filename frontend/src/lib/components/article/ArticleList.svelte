<script lang="ts">
  interface Props {
    type?: "ordered" | "unordered";
    items: string[];
    compact?: boolean;
  }

  let { type = "unordered", items, compact = false }: Props = $props();
</script>

{#if type === "ordered"}
  <ol
    class="article-list-root article-list-root--ordered"
    class:article-list-root--compact={compact}
  >
    {#each items as item}
      <li class="text-list-small">{item}</li>
    {/each}
  </ol>
{:else}
  <ul
    class="article-list-root text-list-small article-list-root--unordered"
    class:article-list-root--compact={compact}
  >
    {#each items as item}
      <li class="text-list-small">{item}</li>
    {/each}
  </ul>
{/if}

<style>
  .article-list-root {
    margin: 1.5rem 0;
    padding-left: 2rem;
    line-height: 1.6;
    position: relative;
  }

  .article-list-root--compact {
    margin: 1rem 0;
    line-height: 1.4;
  }

  .article-list-root li {
    margin: 0.75rem 0;
    color: var(--fg-primary-default);
  }

  .article-list-root--compact li {
    margin: 0.5rem 0;
  }

  /* Custom bullet styles for unordered lists */
  ul.article-list-root {
    list-style: none;
    padding-left: 1.5rem;
  }

  ul.article-list-root li::before {
    content: "•";
    color: var(--fg-primary-muted);
    position: absolute;
    left: 0;
    margin-left: 0.5rem;
  }

  /* Custom numbering styles for ordered lists */
  ol.article-list-root {
    counter-reset: list-counter;
    list-style: none;
    padding-left: 2rem;
  }

  ol.article-list-root li {
    counter-increment: list-counter;
    position: relative;
  }

  ol.article-list-root li::before {
    content: counter(list-counter) ".";
    color: var(--fg-primary-muted);
    font-weight: bold;
    position: absolute;
    left: -2rem;
    width: 1.5rem;
    text-align: right;
  }
</style>

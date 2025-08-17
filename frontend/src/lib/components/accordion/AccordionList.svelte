<!-- Docs: ../../../../docs/components/accordion/accordion-theme-refactor-plan.md, components/accordion/accordion-scroll-to-top-feature.md -->
<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  interface AccordionListProps {
    children?: any;
  }

  let { children }: AccordionListProps = $props();

  // Create a context to provide index to child accordions
  const accordionContext = writable<{ getIndex: (id: string) => number }>({
    getIndex: () => -1,
  });

  // Track registered accordions and their order
  const accordions = new Map<string, number>();
  let nextIndex = 1;

  // Provide methods for accordions to register and get their index
  accordionContext.set({
    getIndex: (id: string) => {
      if (!accordions.has(id)) {
        accordions.set(id, nextIndex++);
      }
      return accordions.get(id)!;
    },
  });

  setContext('accordionList', accordionContext);
</script>

<ol class="accordion-list">
  {#if children}
    {@render children?.()}
  {/if}
</ol>

<style>
  .accordion-list {
    list-style: none;
    padding-left: var(--padding-page-default);
    padding-right: var(--padding-page-default);
  }
</style>

<script lang="ts">
  import '../app.css';

  import { Footer } from '$lib/components/layout';
  import { TopNav } from '$lib/components/top-nav';
  import { CharacterGridBackground } from '$lib/components/experiments';

  import { onMount } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  import { themeManager } from '$lib';

  onMount(() => {
    // Unified theme manager initializes itself in the constructor
  });

  // Clear theme overrides when navigating between pages
  beforeNavigate(({ from, to }) => {
    // Clear any active theme overrides when navigating
    if (from && to && from.url.pathname !== to.url.pathname) {
      themeManager.clearAllOverrides();
    }
  });

  let { children } = $props();
</script>

<TopNav></TopNav>

<main role="presentation">
  <CharacterGridBackground />
  {@render children()}
</main>

<Footer />

<style>
  main {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: flex-start;
    width: 100%;
  }
</style>

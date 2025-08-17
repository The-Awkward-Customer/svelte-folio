<script lang="ts">
  import '../app.css';

  import { Footer } from '$lib/components/layout';
  import { TopNav } from '$lib/components/top-nav';
  import { DotGridBackground } from '$lib/components/experiments';

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
  
  let dotGridRef: any;
  
  function handleMouseMove(event: MouseEvent) {
    if (dotGridRef) {
      // Use viewport coordinates directly since canvas is positioned fixed
      const x = event.clientX;
      const y = event.clientY;
      dotGridRef.updateMousePosition(x, y);
    }
  }
  
  function handleMouseLeave() {
    if (dotGridRef) {
      dotGridRef.setMouseLeave();
    }
  }
</script>

<TopNav></TopNav>

<main 
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseLeave}
  role="presentation"
>
  <DotGridBackground bind:this={dotGridRef} />
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

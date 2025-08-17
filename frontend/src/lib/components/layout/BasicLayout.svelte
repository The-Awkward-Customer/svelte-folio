<script lang="ts">
  // Import Svelte's built-in stores - similar to React context but simpler
  import { page } from '$app/stores';
  // Similar to React's useEffect hook, but used differently in Svelte
  import { onMount } from 'svelte';
  //import global css
  import '../../../app.css';
  // $: is Svelte's reactive declaration - any time $page.url.pathname changes,
  // currentPath will be updated automatically (similar to React's useMemo)
  // The $ prefix before page means "subscribe to this store" (Svelte-specific)
  $: currentPath = $page.url.pathname;

  // Regular variable declaration - in Svelte, these are reactive by default
  // Unlike React's useState, you directly assign to variables to update them
  let width = 0;

  interface $$Slots {
    'top-bar': {};
    'side-nav': {};
    main: {};
  }

  // Similar to React's useEffect with an empty dependency array
  // This runs once when the component mounts
  onMount(() => {
    // Set initial width
    width = window.innerWidth;

    // Define resize handler
    const handleResize = () => {
      // In Svelte, this direct assignment is enough to trigger reactivity
      // No need for setState like in React
      width = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);

    // Return a cleanup function (like in React's useEffect)
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  // More reactive declarations - these automatically update when width changes
  // Similar to React's useMemo but with cleaner syntax
  $: isMobile = width < 865;
  $: isDesktop = width >= 869;
</script>

<!-- In Svelte, this is just HTML with some extras - no need to return JSX -->
<div class="basic-layout-root">
  {#if isMobile || !isDesktop}
    <div class="basic-layout-top-bar">
      <slot name="top-bar">
        <p>Default Top Bar Content</p>
      </slot>
    </div>
  {/if}

  <div class="basic-layout-main">
    {#if isDesktop}
      <div class="basic-layout-side-nav">
        <slot name="side-nav">
          <p>Default Side Nav Content</p>
        </slot>
      </div>
    {/if}
    <slot name="main">
      <p>Default Main Content</p>
    </slot>
  </div>
</div>

<!-- In Svelte, styles are scoped to the component by default -->
<!-- No need for CSS-in-JS libraries or styled-components -->
<style>
  .basic-layout-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    max-width: 568px;
    margin: 0 auto;
    position: relative;
  }

  @media (max-width: 898px) {
    .basic-layout-root {
      padding-top: var(--spc-500);
    }

    .basic-layout-side-nav {
      display: none;
    }
  }

  @media (min-width: 896px) {
    .basic-layout-top-bar {
      display: none;
    }
  }

  .basic-layout-top-bar {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 568px;
    height: 88px;
    z-index: 10;
  }

  .basic-layout-side-nav {
    position: absolute;
    left: -180px;
    top: 0;
    height: 100%;
    width: 180px;
  }

  .basic-layout-main {
    position: relative;
    flex: 1;
    height: 100%;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }
</style>

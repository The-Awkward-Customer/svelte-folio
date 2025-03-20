<script lang="ts">
  import { setContext } from 'svelte';
  import { writable } from 'svelte/store';

  // Props interface
  interface MobileNavigationProps {
    class_?: string;
    style?: string;
    scrollLock?: boolean;
    zIndexBase?: number;
  }

  const { 
    class_ = '',
    style = '',
    scrollLock = true,
    zIndexBase = 50 
  } = $props();

  // State
  const isOpen = writable(false);
  
  // Context key
  const MOBILE_NAV_CONTEXT = 'mobile-nav';

  // Methods for controlling the menu
  function open() {
    $isOpen = true;
    if (scrollLock) {
      document.body.style.overflow = 'hidden';
    }
    dispatch('open');
  }

  function close() {
    $isOpen = false;
    if (scrollLock) {
      document.body.style.overflow = '';
    }
    dispatch('close');
  }

  function toggle() {
    if ($isOpen) {
      close();
    } else {
      open();
    }
    dispatch('toggle');
  }

  // Create and set context for child components
  setContext(MOBILE_NAV_CONTEXT, {
    isOpen,
    open,
    close,
    toggle,
    zIndexBase
  });

  // Event dispatcher
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Cleanup on component destruction
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    if (scrollLock && $isOpen) {
      document.body.style.overflow = '';
    }
  });
</script>

<nav
  class="mobile-navigation {class_}"
  style="{style}"
  role="navigation"
  aria-label="Mobile navigation"
>
  <slot />
</nav>

<style>
  .mobile-navigation {
    position: relative;
    width: 100%;
  }
</style> 
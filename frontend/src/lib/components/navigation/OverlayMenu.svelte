<script lang="ts">
  import Button from '$lib/components/actions/Button.svelte';
  import LinkList from '$lib/components/actions/LinkList.svelte';
  
  // Use Svelte's writable store instead of state
  import { writable } from 'svelte/store';
  
  // Define the routes configuration
  const routes = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' }
  ];
  
  // State to track whether the menu is open or closed
  const isOpen = writable(false);
  
  // Toggle function
  function toggleMenu() {
    $isOpen = !$isOpen;
  }
  
  // Close menu function
  function closeMenu() {
    $isOpen = false;
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  }
  
  // Export the open function to allow parent components to control the menu
  export function openMenu() {
    $isOpen = true;
  }
</script>

<Button on:click={toggleMenu} ariaLabel="Toggle navigation menu">
  Menu
</Button>

{#if $isOpen}
  <div class="overlay-container">
    <button 
      class="overlay" 
      on:click={closeMenu}
      aria-label="Close navigation menu"
      on:keydown={handleKeydown}
    ></button>
    <section 
      class="menu-content" 
      role="navigation"
    >
      <div class="menu-header">
        <Button 
          variant="primary" 
          on:click={closeMenu} 
          ariaLabel="Close menu"
        >
          Close
        </Button>
      </div>
      <LinkList {routes} vertical={true} on:click={closeMenu} />
    </section>
  </div>
{/if}

<style>
  .overlay-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    z-index: var(--z-index-overlay, 1000);
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    padding: 0;
    cursor: pointer;
  }

  .menu-content {
    position: relative;
    z-index: 1;
    background-color: rgb(var(--color-bg-primary));
    padding: var(--spc-400);
    border-radius: var(--bdr-radius-md, 5px) var(--bdr-radius-md, 5px) 0 0;
    width: 100%;
    transform: translateY(0);
    transition: transform 0.3s ease-out;
    box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
  }

  /* Add animation for opening */
  .menu-content {
    animation: slideUp 0.3s ease-out;
  }

  .menu-header {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    padding: var(--spc-400);
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
</style>

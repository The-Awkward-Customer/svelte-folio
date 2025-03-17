<!-- LinkList component -->

<!-- renders a list of anchors base on routes passed throught a prop, accepts a prop to define vertical or horizontal layout -->
 <!-- anchors are wrapped in a root div with a class of link-list-root -->
  <!-- anchors have states: default, hover, active, disabled -->
   <!-- catches the current page and sets the corresponding anchor to the active state -->
 <!-- accepts a prop to display a bottom border -->

<script lang="ts">
  // Props
  export let routes: Array<{ path: string; label: string; disabled?: boolean }> = [];
  export let vertical: boolean = false;
  export let showBorder: boolean = false;
  export let ariaLabel = 'Navigation';

  // Get current page path
  import { page } from '$app/stores';
  $: currentPath = $page.url.pathname;

  // Keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    const links = Array.from(document.querySelectorAll('.link-list-root a:not(.disabled)'));
    const currentIndex = links.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case vertical ? 'ArrowDown' : 'ArrowRight':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % links.length;
        (links[nextIndex] as HTMLElement).focus();
        break;
      case vertical ? 'ArrowUp' : 'ArrowLeft':
        event.preventDefault();
        const prevIndex = currentIndex <= 0 ? links.length - 1 : currentIndex - 1;
        (links[prevIndex] as HTMLElement).focus();
        break;
      case 'Home':
        event.preventDefault();
        (links[0] as HTMLElement).focus();
        break;
      case 'End':
        event.preventDefault();
        (links[links.length - 1] as HTMLElement).focus();
        break;
    }
  }
</script>

<nav 
  class="link-list-root" 
  class:vertical 
  class:with-border={showBorder}
  aria-label={ariaLabel}
>
  <ul role="menubar" class:vertical on:keydown={handleKeydown}>
    {#each routes as { path, label, disabled }}
      <li role="none">
        <a
          href={path}
          role="menuitem"
          class:active={currentPath === path}
          class:disabled
          aria-disabled={disabled}
          aria-current={currentPath === path ? 'page' : undefined}
          tabindex={disabled ? -1 : 0}
        >
          <span>{label}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  .link-list-root {
    display: block;
  }

  ul {
    display: flex;
    gap: 1rem;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .vertical ul {
    flex-direction: column;
  }

  .with-border {
    border-bottom: 1px solid var(--border-color, #e2e8f0);
  }

  a {
    text-decoration: none;
    color: var(--text-color, #4a5568);
    transition: all 0.2s ease;
    padding: 0.5rem;
    border-radius: 0.25rem;
    display: inline-block;
    /* High contrast outline for focus state */
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  /* Ensure focus is visible for keyboard users */
  a:focus-visible {
    outline: 2px solid var(--focus-ring-color, #4299e1);
    outline-offset: 2px;
  }

  a:hover:not(.disabled) {
    color: var(--hover-color, #2d3748);
    background-color: var(--hover-bg-color, rgba(0, 0, 0, 0.05));
  }

  a.active {
    color: var(--active-color, #2b6cb0);
    font-weight: 500;
  }

  a.disabled {
    color: var(--disabled-color, #a0aec0);
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Ensure sufficient color contrast */
  @media (prefers-contrast: more) {
    a {
      color: var(--high-contrast-text, #000);
    }
    
    a.active {
      color: var(--high-contrast-active, #000);
      text-decoration: underline;
      font-weight: 700;
    }

    a.disabled {
      color: var(--high-contrast-disabled, #666);
    }
  }
</style>
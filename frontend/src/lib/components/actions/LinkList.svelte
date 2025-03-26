<!-- LinkList component -->

<!-- renders a list of anchors base on routes passed throught a prop, accepts a prop to define vertical or horizontal layout -->
 <!-- anchors are wrapped in a root div with a class of link-list-root -->
  <!-- anchors have states: default, hover, active, disabled -->
   <!-- catches the current page and sets the corresponding anchor to the active state -->

<script lang="ts">
  // Props
  export let routes: Array<{ path: string; label: string; disabled?: boolean }> = [];
  export let vertical: boolean = false;
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
    box-sizing: border-box;
    display: block;
  }

  ul {
    display: flex;
    list-style: none;
    padding: 0;
  }

  .vertical ul {
    flex-direction: column;
    align-items: flex-start;
  }

  a {
    text-decoration: none;
    color: rgb(var(--color-txt-secondary));
    transition: all 0.2s ease;
    height: 32px;
    border-radius: var(--bdr-radius-sm);
    display: inline-block;
    /* High contrast outline for focus state */
    outline: 2px solid transparent;
    outline-offset: 2px;
    font-family: var(--font-family-alt);
    font-size: var(--fs-275);
    text-transform: var(--text-transform-uppercase);
  }

  /* Ensure focus is visible for keyboard users */
  a:focus-visible {
    outline: 2px solid var(--color-bdr-primary);
    outline-offset: 2px;
  }

  a:hover:not(.disabled) {
    color: rgb(var(--color-txt-primary));
  }

  a.active {
    color: rgb(var(--color-txt-primary));
    font-weight: 500;
  }

  a.disabled {
    color: rgb(var(--color-txt-muted));
    cursor: not-allowed;
    pointer-events: none;
  }

  /* Ensure sufficient color contrast */
  @media (prefers-contrast: more) {
    a {
      color: rgb(var(--high-contrast-text, #000));
    }
    
    a.active {
      color: rgb(var(--high-contrast-active, #000));
      text-decoration: underline;
      font-weight: 700;
    }

    a.disabled {
      color: rgb(var(--high-contrast-disabled, #666)  );
    }
  }
</style>
<!-- Docs: ../../../../docs/components/chat/Chat-Implementation-Documentation.md, components/chat/Chat-Implementation-Complete-Documentation.md, components/chat/Chat-Implementation-Progress-Report.md, components/chat/ChatMessages-AutoScroll-Refactor-Plan.md -->
<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { ChatDialogProps, ChatDialogEvents } from '$lib/types/chat.js';

  export let isOpen: ChatDialogProps['isOpen'] = false;

  const dispatch = createEventDispatcher<ChatDialogEvents>();

  let savedScrollY = 0;
  let dialogElement: HTMLDialogElement;

  // Simplified keyboard detection
  function handleViewportChange() {
    if (typeof window !== 'undefined' && window.visualViewport) {
      const keyboardHeight = Math.max(
        0,
        window.innerHeight - window.visualViewport.height
      );
      document.documentElement.style.setProperty(
        '--keyboard-height',
        `${keyboardHeight}px`
      );
    }
  }

  // Consolidated event handlers
  function handleDialogClick(event: MouseEvent) {
    // Only close if clicking directly on the dialog element (backdrop)
    // not on any child elements (content)
    if (event.target === dialogElement) {
      dispatch('close');
    }
  }
  
  function handleContentClick(event: MouseEvent) {
    // Stop propagation to prevent dialog click handler from firing
    event.stopPropagation();
  }

  function handleDialogKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      dispatch('close');
    }
  }

  // Simplified dialog state management
  $: if (dialogElement) {
    if (isOpen && !dialogElement.open) {
      dialogElement.showModal();
    } else if (!isOpen && dialogElement.open) {
      dialogElement.close();
    }
  }

  // Simplified scroll lock
  $: if (typeof document !== 'undefined') {
    if (isOpen) {
      savedScrollY = window.scrollY;
      document.body.style.cssText = `
				overflow: hidden;
				position: fixed;
				width: 100%;
				top: -${savedScrollY}px;
			`;
    } else {
      document.body.style.cssText = '';
      if (savedScrollY) {
        window.scrollTo(0, savedScrollY);
      }
    }
  }

  // Minimal setup/cleanup
  onMount(() => {
    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      handleViewportChange();
    }
  });

  onDestroy(() => {
    if (typeof window !== 'undefined' && window.visualViewport) {
      window.visualViewport.removeEventListener('resize', handleViewportChange);
      document.documentElement.style.removeProperty('--keyboard-height');
    }
  });
</script>

<dialog
  bind:this={dialogElement}
  class="chat-dialog"
  aria-labelledby="chat-title"
  on:click={handleDialogClick}
  on:keydown={handleDialogKeydown}
>
  {#if isOpen}
    <div
      class="dialog-content"
      role="none"
      on:click={handleContentClick}
      transition:slide={{ duration: 300, axis: 'y' }}
    >
      <slot />
    </div>
  {/if}
</dialog>

<style>
  /* Mobile-first base styles */
  .chat-dialog {
    border: none;
    background: transparent;
    max-width: none;
    max-height: none;
    width: 100%;
    height: 100%;
    padding: 0;
    animation: fadeIn 0.4s ease-in-out;
  }

  .chat-dialog::backdrop {
    background: var(--bg-page-20);
    backdrop-filter: blur(4px);
    animation: backdropFadeIn 0.5s ease-in-out;
  }

  .chat-dialog[open] {
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  /* Unified dialog content - consistent across all screen sizes */
  .dialog-content {
    background: var(--bg-page);
    width: 100vw;
    max-width: 100%;
    /* Reduced height for better mobile performance */
    height: 70vh;
    max-height: calc(
      100dvh - var(--keyboard-height, 0px) - env(safe-area-inset-bottom)
    );
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
    padding-inline: env(safe-area-inset-left) env(safe-area-inset-right);
    /* Top inline shadow */
    box-shadow: inset 0 1px 0 0 var(--fg-text-primary);
  }

  /* Enhanced Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes backdropFadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(4px);
    }
  }

  /* Desktop and larger screens - maintain consistent behavior */
  @media (min-width: 769px) {
    .dialog-content {
      /* Keep desktop height at 80vh */
      height: 80vh;
      padding-bottom: 0;
      padding-inline: 0;
    }
  }
</style>

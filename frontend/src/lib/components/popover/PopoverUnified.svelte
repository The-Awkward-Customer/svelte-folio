<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { popoverManager } from '$lib/stores/popoverStore.svelte.js';
  import type { Snippet } from 'svelte';

  interface PopoverProps {
    // Core props
    id: string;
    trigger: Snippet;
    content: Snippet;
    
    // Behavior props
    position?: 'top' | 'bottom' | 'left' | 'right';
    disabled?: boolean;
    closeOnOutsideClick?: boolean;
    closeOnEscape?: boolean;
    
    // Mobile props
    mobileSheet?: boolean;
    
    // Styling props
    offset?: number;
    class?: string;
    triggerClass?: string;
    
    // Callbacks
    onOpen?: () => void;
    onClose?: () => void;
  }

  let {
    id,
    trigger,
    content,
    position = 'bottom',
    disabled = false,
    closeOnOutsideClick = true,
    closeOnEscape = true,
    mobileSheet = true,
    offset = 8,
    class: className = '',
    triggerClass = '',
    onOpen,
    onClose
  }: PopoverProps = $props();

  // State
  let triggerElement = $state<HTMLElement>();
  let contentElement = $state<HTMLElement>();
  let isOpen = $derived(popoverManager.openPopoversList.includes(id));
  let isMobile = $state(false);
  let actualPosition = $state(position);
  let contentPosition = $state({ top: 0, left: 0 });
  let previousIsOpen = $state(false);

  // Focus trap cleanup
  let cleanupFocusTrap: (() => void) | null = null;

  // Check if mobile
  function checkMobile() {
    if (typeof window !== 'undefined') {
      isMobile = window.innerWidth < 768;
    }
  }

  // Calculate desktop positioning
  function calculatePosition() {
    if (!triggerElement || !contentElement || isMobile) return;
    
    const triggerRect = triggerElement.getBoundingClientRect();
    const contentRect = contentElement.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    type PositionKey = 'top' | 'bottom' | 'left' | 'right';
    
    // Calculate positions for each side
    const positions: Record<PositionKey, { top: number; left: number }> = {
      top: {
        top: triggerRect.top - contentRect.height - offset,
        left: triggerRect.left + (triggerRect.width - contentRect.width) / 2
      },
      bottom: {
        top: triggerRect.bottom + offset,
        left: triggerRect.left + (triggerRect.width - contentRect.width) / 2
      },
      left: {
        top: triggerRect.top + (triggerRect.height - contentRect.height) / 2,
        left: triggerRect.left - contentRect.width - offset
      },
      right: {
        top: triggerRect.top + (triggerRect.height - contentRect.height) / 2,
        left: triggerRect.right + offset
      }
    };

    // Check if position fits in viewport
    function fitsInViewport(pos: { top: number; left: number }, side: PositionKey): boolean {
      switch (side) {
        case 'top':
          return pos.top >= 0;
        case 'bottom':
          return pos.top + contentRect.height <= viewport.height;
        case 'left':
          return pos.left >= 0;
        case 'right':
          return pos.left + contentRect.width <= viewport.width;
        default:
          return true;
      }
    }

    // Try preferred position first
    let selectedPosition: PositionKey = position;
    let selectedCoords = positions[position];

    // If doesn't fit, try opposite
    if (!fitsInViewport(selectedCoords, position)) {
      const opposites: Record<PositionKey, PositionKey> = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      };
      
      const opposite = opposites[position];
      const oppositeCoords = positions[opposite];
      
      if (fitsInViewport(oppositeCoords, opposite)) {
        selectedPosition = opposite;
        selectedCoords = oppositeCoords;
      }
    }

    // Constrain to viewport
    const padding = 8;
    selectedCoords = {
      top: Math.min(
        Math.max(padding, selectedCoords.top),
        viewport.height - contentRect.height - padding
      ),
      left: Math.min(
        Math.max(padding, selectedCoords.left),
        viewport.width - contentRect.width - padding
      )
    };

    actualPosition = selectedPosition;
    contentPosition = selectedCoords;
  }

  // Update positioning
  async function updatePosition() {
    if (!isMobile && isOpen) {
      await tick();
      calculatePosition();
    }
  }

  // Handle trigger click
  function handleTriggerClick(event: MouseEvent) {
    if (disabled) return;
    event.stopPropagation();
    
    if (triggerElement) {
      popoverManager.toggle(id, triggerElement);
    }
  }

  // Handle trigger keyboard
  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      if (triggerElement) {
        popoverManager.toggle(id, triggerElement);
      }
    }
  }

  // Handle backdrop click
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      popoverManager.close(id);
    }
  }

  // Handle global events
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && closeOnEscape && isOpen) {
      popoverManager.close(id);
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (!closeOnOutsideClick || !isOpen) return;
    
    const target = event.target as Node;
    if (
      triggerElement?.contains(target) ||
      contentElement?.contains(target)
    ) {
      return;
    }
    
    popoverManager.close(id);
  }

  function handleResize() {
    checkMobile();
    updatePosition();
  }

  function handleScroll() {
    if (!isMobile && isOpen) {
      updatePosition();
    }
  }

  // Focus management
  function trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable?.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable?.focus();
          }
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown);
    firstFocusable?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }

  // Handle callbacks when state changes
  $effect(() => {
    if (isOpen !== previousIsOpen) {
      if (isOpen && onOpen) {
        onOpen();
      } else if (!isOpen && onClose) {
        onClose();
      }
      previousIsOpen = isOpen;
    }
  });

  // Handle opening/closing effects
  $effect(() => {
    if (isOpen) {
      checkMobile();
      updatePosition();
      
      // Set up focus trap
      if (contentElement) {
        cleanupFocusTrap = trapFocus(contentElement);
      }
    } else {
      // Clean up focus trap
      if (cleanupFocusTrap) {
        cleanupFocusTrap();
        cleanupFocusTrap = null;
      }
    }
  });

  onMount(() => {
    checkMobile();
    
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('click', handleClickOutside);
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
    }
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    }
    
    if (cleanupFocusTrap) {
      cleanupFocusTrap();
    }
    
    popoverManager.close(id);
  });
</script>

<!-- Trigger -->
<div
  bind:this={triggerElement}
  class="popover-trigger {triggerClass}"
  role="button"
  tabindex="0"
  aria-expanded={isOpen}
  aria-controls="popover-{id}"
  aria-haspopup="dialog"
  onclick={handleTriggerClick}
  onkeydown={handleTriggerKeyDown}
  data-popover-trigger={id}
>
  {@render trigger()}
</div>

<!-- Mobile Content -->
{#if isOpen && isMobile && mobileSheet}
  <!-- Mobile backdrop -->
  <div
    class="popover-backdrop-mobile"
    onclick={handleBackdropClick}
    role="presentation"
  ></div>

  <!-- Mobile sheet -->
  <div
    bind:this={contentElement}
    id="popover-{id}"
    class="popover-content-mobile {className}"
    role="dialog"
    aria-modal="true"
    aria-labelledby="popover-{id}-title"
    data-popover-content={id}
  >
    {@render content()}
  </div>
{/if}

<!-- Desktop Content -->
{#if isOpen && !isMobile}
  <!-- Desktop backdrop -->
  <div
    class="popover-backdrop-desktop"
    onclick={handleBackdropClick}
    role="presentation"
  ></div>

  <!-- Desktop popover -->
  <div
    bind:this={contentElement}
    id="popover-{id}"
    class="popover-content-desktop position-{actualPosition} {className}"
    role="dialog"
    aria-modal="true"
    aria-labelledby="popover-{id}-title"
    style:top="{contentPosition.top}px"
    style:left="{contentPosition.left}px"
    data-popover-content={id}
  >
    {@render content()}
  </div>
{/if}

<style>
  .popover-trigger {
    display: inline-block;
    cursor: pointer;
  }

  /* Mobile styles */
  .popover-backdrop-mobile {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }

  .popover-content-mobile {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 85vh;
    background: var(--bg-page);
    border-radius: var(--border-radius-card) var(--border-radius-card) 0 0;
    padding: var(--spacing-grouped);
    padding-bottom: calc(var(--spacing-grouped) + env(safe-area-inset-bottom));
    z-index: 1000;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  }

  /* Drag handle indicator */
  .popover-content-mobile::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 4px;
    background: var(--fg-text-muted);
    border-radius: 2px;
    opacity: 0.5;
  }

  /* Desktop styles */
  .popover-backdrop-desktop {
    position: fixed;
    inset: 0;
    z-index: 998;
    /* Invisible backdrop for click detection */
  }

  .popover-content-desktop {
    position: fixed;
    min-width: 200px;
    max-width: 320px;
    background: var(--bg-page);
    border: 1px solid var(--fg-text-muted-60);
    border-radius: var(--border-radius-card);
    padding: var(--spacing-related-relaxed);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.12),
      0 2px 6px rgba(0, 0, 0, 0.08);
    z-index: 999;
    animation: popIn 0.2s ease;
  }

  /* Position variants */
  .popover-content-desktop.position-bottom {
    transform-origin: top center;
  }

  .popover-content-desktop.position-top {
    transform-origin: bottom center;
  }

  .popover-content-desktop.position-right {
    transform-origin: left center;
  }

  .popover-content-desktop.position-left {
    transform-origin: right center;
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }

  @keyframes popIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .popover-backdrop-mobile,
    .popover-content-mobile,
    .popover-content-desktop {
      animation: none;
    }
  }
</style>
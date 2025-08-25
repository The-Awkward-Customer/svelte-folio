<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import type { Snippet } from 'svelte';

  interface PopoverProps {
    // Core props
    id: string;
    trigger: Snippet;
    content: Snippet;
    
    // Behavior props
    position?: 'top' | 'bottom' | 'left' | 'right';
    disabled?: boolean;
    
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
    mobileSheet = true,
    offset = 8,
    class: className = '',
    triggerClass = '',
    onOpen,
    onClose
  }: PopoverProps = $props();

  // Timing constants for predictable UX
  const HOVER_OPEN_DELAY = 200;  // Delay before opening on hover
  const HOVER_CLOSE_DELAY = 300; // Delay before closing (longer for forgiveness)
  const SCROLL_CLOSE_THRESHOLD = 10; // Pixels scrolled before closing

  // State
  let triggerElement = $state<HTMLElement>();
  let contentElement = $state<HTMLElement>();
  let popoverWrapper = $state<HTMLElement>();
  let isOpen = $state(false);
  let isMobile = $state(false);
  let actualPosition = $state(position);
  
  // Interaction state
  let openTimer: ReturnType<typeof setTimeout> | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  let isMouseOverTrigger = false;
  let isMouseOverContent = false;
  let isFocusWithin = false;
  let lastScrollY = 0;
  let hasScrolledWhileOpen = false;
  
  // MediaQuery for mobile detection
  let mediaQuery: MediaQueryList | null = null;

  // Initialize media query
  function initMediaQuery() {
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia('(max-width: 767px)');
      isMobile = mediaQuery.matches;
      mediaQuery.addEventListener('change', handleMediaChange);
    }
  }

  function handleMediaChange(e: MediaQueryListEvent) {
    isMobile = e.matches;
    // Close popover on viewport change to prevent positioning issues
    if (isOpen) {
      closePopover();
    }
  }

  // Clear all timers utility
  function clearTimers() {
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
    }
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  // Open popover with proper state management
  function openPopover() {
    if (disabled || isOpen) return;
    
    clearTimers();
    isOpen = true;
    hasScrolledWhileOpen = false;
    lastScrollY = window.scrollY;
    onOpen?.();
  }

  // Close popover with proper cleanup
  function closePopover() {
    if (!isOpen) return;
    
    clearTimers();
    isOpen = false;
    isMouseOverTrigger = false;
    isMouseOverContent = false;
    onClose?.();
  }

  // Schedule opening with delay
  function scheduleOpen() {
    if (disabled || isOpen || isMobile) return;
    
    clearTimers();
    openTimer = setTimeout(() => {
      openTimer = null;
      // Double-check conditions before opening
      if ((isMouseOverTrigger || isMouseOverContent || isFocusWithin) && !disabled && !isMobile) {
        openPopover();
      }
    }, HOVER_OPEN_DELAY);
  }

  // Schedule closing with delay
  function scheduleClose() {
    if (!isOpen || isMobile) return;
    
    clearTimers();
    closeTimer = setTimeout(() => {
      closeTimer = null;
      // Double-check conditions before closing
      if (!isMouseOverTrigger && !isMouseOverContent && !isFocusWithin) {
        closePopover();
      }
    }, HOVER_CLOSE_DELAY);
  }

  // Re-evaluate whether popover should be open
  function evaluateState() {
    if (disabled || isMobile) return;
    
    const shouldBeOpen = isMouseOverTrigger || isMouseOverContent || isFocusWithin;
    
    if (shouldBeOpen && !isOpen) {
      scheduleOpen();
    } else if (!shouldBeOpen && isOpen) {
      scheduleClose();
    } else {
      // Cancel any pending state changes if conditions have changed
      clearTimers();
    }
  }

  // Position wrapper at trigger location
  function positionWrapper() {
    if (!triggerElement || !popoverWrapper || isMobile) return;
    
    const triggerRect = triggerElement.getBoundingClientRect();
    
    Object.assign(popoverWrapper.style, {
      position: 'fixed',
      top: `${Math.round(triggerRect.top)}px`,
      left: `${Math.round(triggerRect.left)}px`,
      width: `${triggerRect.width}px`,
      height: `${triggerRect.height}px`,
      pointerEvents: 'none',
      zIndex: '999'
    });
  }

  // Calculate content position with proper measurement
  function calculateContentPosition() {
    if (!triggerElement || !contentElement || isMobile) return;
    
    const triggerRect = triggerElement.getBoundingClientRect();
    
    // Reset for measurement
    Object.assign(contentElement.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      visibility: 'hidden',
      pointerEvents: 'none'
    });
    
    // Force layout
    void contentElement.offsetHeight;
    
    const contentWidth = contentElement.offsetWidth;
    const contentHeight = contentElement.offsetHeight;
    
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    type PositionKey = 'top' | 'bottom' | 'left' | 'right';
    
    const positions: Record<PositionKey, { top: number; left: number }> = {
      top: {
        top: -contentHeight - offset,
        left: (triggerRect.width - contentWidth) / 2
      },
      bottom: {
        top: triggerRect.height + offset,
        left: (triggerRect.width - contentWidth) / 2
      },
      left: {
        top: (triggerRect.height - contentHeight) / 2,
        left: -contentWidth - offset
      },
      right: {
        top: (triggerRect.height - contentHeight) / 2,
        left: triggerRect.width + offset
      }
    };

    // Check viewport fit
    function fitsInViewport(side: PositionKey): boolean {
      const pos = positions[side];
      const absoluteTop = triggerRect.top + pos.top;
      const absoluteLeft = triggerRect.left + pos.left;
      
      return (
        absoluteTop >= 8 && // Small padding from viewport edge
        absoluteLeft >= 8 &&
        absoluteTop + contentHeight <= viewport.height - 8 &&
        absoluteLeft + contentWidth <= viewport.width - 8
      );
    }

    // Find best position
    let selectedPosition: PositionKey = position;
    
    if (!fitsInViewport(position)) {
      const opposites: Record<PositionKey, PositionKey> = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      };
      
      const opposite = opposites[position];
      if (fitsInViewport(opposite)) {
        selectedPosition = opposite;
      } else {
        // Try remaining positions
        const fallbackOrder: PositionKey[] = 
          position === 'top' || position === 'bottom' 
            ? ['left', 'right'] 
            : ['bottom', 'top'];
        
        for (const pos of fallbackOrder) {
          if (fitsInViewport(pos)) {
            selectedPosition = pos;
            break;
          }
        }
      }
    }

    actualPosition = selectedPosition;
    
    // Apply position
    const finalPos = positions[selectedPosition];
    Object.assign(contentElement.style, {
      position: 'absolute',
      top: `${Math.round(finalPos.top)}px`,
      left: `${Math.round(finalPos.left)}px`,
      visibility: 'visible',
      pointerEvents: 'auto'
    });
  }

  // Trigger event handlers
  function handleTriggerClick(event: MouseEvent) {
    if (disabled) return;
    
    if (isMobile) {
      event.stopPropagation();
      if (isOpen) {
        closePopover();
      } else {
        openPopover();
      }
    }
    // On desktop, click doesn't toggle - only hover/focus do
  }
  
  function handleTriggerMouseEnter() {
    if (disabled || isMobile) return;
    isMouseOverTrigger = true;
    evaluateState();
  }
  
  function handleTriggerMouseLeave() {
    if (disabled || isMobile) return;
    isMouseOverTrigger = false;
    evaluateState();
  }
  
  function handleTriggerFocus() {
    if (disabled || isMobile) return;
    isFocusWithin = true;
    // Focus should open immediately for accessibility
    clearTimers();
    openPopover();
  }
  
  function handleTriggerBlur() {
    if (disabled || isMobile) return;
    
    // Simply close the popover when trigger loses focus
    // This prevents the double-tab issue and simplifies focus management
    isFocusWithin = false;
    evaluateState();
  }
  
  function handleTriggerKeyDown(event: KeyboardEvent) {
    if (disabled) return;
    
    // Enter/Space on mobile toggles
    if (isMobile && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      if (isOpen) {
        closePopover();
      } else {
        openPopover();
      }
    }
    
    // Escape always closes
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closePopover();
      triggerElement?.focus();
    }
  }

  // Content event handlers
  function handleContentMouseEnter() {
    if (isMobile) return;
    isMouseOverContent = true;
    clearTimers(); // Cancel any pending close
  }
  
  function handleContentMouseLeave() {
    if (isMobile) return;
    isMouseOverContent = false;
    evaluateState();
  }
  

  // Scroll handler with threshold
  function handleScroll() {
    if (!isOpen) return;
    
    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
    
    // Only close if scrolled beyond threshold
    if (scrollDelta > SCROLL_CLOSE_THRESHOLD) {
      hasScrolledWhileOpen = true;
      closePopover();
    }
  }

  // Mobile backdrop handler
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closePopover();
    }
  }

  // Update position when open
  $effect(() => {
    if (isOpen && !isMobile) {
      // Use double rAF to ensure layout is complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          positionWrapper();
          calculateContentPosition();
        });
      });
    }
  });

  // Lifecycle
  onMount(() => {
    initMediaQuery();
    window.addEventListener('scroll', handleScroll, true);
  });

  onDestroy(() => {
    mediaQuery?.removeEventListener('change', handleMediaChange);
    window.removeEventListener('scroll', handleScroll, true);
    clearTimers();
  });
</script>

<!-- Trigger -->
<div
  bind:this={triggerElement}
  class="popover-trigger {triggerClass}"
  role="button"
  tabindex={disabled ? -1 : 0}
  aria-expanded={isOpen}
  aria-controls="popover-{id}"
  aria-haspopup="dialog"
  onclick={handleTriggerClick}
  onmouseenter={handleTriggerMouseEnter}
  onmouseleave={handleTriggerMouseLeave}
  onfocus={handleTriggerFocus}
  onblur={handleTriggerBlur}
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

<!-- Desktop Content with Fixed Wrapper -->
{#if isOpen && !isMobile}
  <!-- Fixed wrapper that stays with trigger -->
  <div
    bind:this={popoverWrapper}
    class="popover-wrapper"
  >
    <!-- Popover content positioned relative to wrapper -->
    <div
      bind:this={contentElement}
      id="popover-{id}"
      class="popover-content-desktop position-{actualPosition} {className}"
      role="tooltip"
      aria-labelledby="popover-{id}-title"
      onmouseenter={handleContentMouseEnter}
      onmouseleave={handleContentMouseLeave}
      data-popover-content={id}
    >
      {@render content()}
    </div>
  </div>
{/if}

<style>
  .popover-trigger {
    display: inline-block;
    cursor: pointer;
  }
  
  .popover-trigger:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* Fixed wrapper stays locked to trigger */
  .popover-wrapper {
    position: fixed;
    pointer-events: none;
    z-index: 999;
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

  /* Desktop popover positioned absolutely within wrapper */
  .popover-content-desktop {
    position: absolute;
    min-width: 200px;
    max-width: 320px;
    background: var(--bg-page);
    border: 1px solid var(--fg-text-muted-60);
    border-radius: var(--border-radius-card);
    padding: var(--spacing-related-relaxed);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.12),
      0 2px 6px rgba(0, 0, 0, 0.08);
    pointer-events: auto;
    animation: popIn 0.15s ease;
    will-change: transform, opacity;
  }

  /* Position-specific transform origins for smooth animation */
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
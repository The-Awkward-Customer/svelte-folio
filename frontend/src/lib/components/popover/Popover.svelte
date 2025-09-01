<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    positionWrapper,
    calculatePosition,
    applyPosition,
    type Position,
  } from "$lib/utils/popper";
  import Icon from "../primitives/Icon.svelte";

  interface PopoverProps {
    // Core props
    id: string;
    title: string;
    text: string;

    // Behavior props
    position?: Position;
    disabled?: boolean;

    // Mobile props
    mobileSheet?: boolean;

    // Styling props
    offset?: number;
    class?: string;

    // Callbacks
    onOpen?: () => void;
    onClose?: () => void;
  }

  let {
    id,
    title,
    text,
    position = "bottom",
    disabled = false,
    mobileSheet = true,
    offset = 8,
    class: className = "",
    onOpen,
    onClose,
  }: PopoverProps = $props();

  // Timing constants for predictable UX
  const HOVER_OPEN_DELAY = 200; // Delay before opening on hover
  const HOVER_CLOSE_DELAY = 300; // Delay before closing (longer for forgiveness)
  const SCROLL_CLOSE_THRESHOLD = 10; // Pixels scrolled before closing

  // State
  let triggerElement = $state<HTMLElement>();
  let contentElement = $state<HTMLElement>();
  let popoverWrapper = $state<HTMLElement>();
  let isOpen = $state(false);
  // Initialize isMobile based on window width if available
  let isMobile = $state(
    typeof window !== "undefined" ? window.innerWidth <= 767 : false,
  );
  let actualPosition = $state(position);

  // Interaction state
  let openTimer: ReturnType<typeof setTimeout> | null = null;
  let closeTimer: ReturnType<typeof setTimeout> | null = null;
  let isMouseOverTrigger = false;
  let isMouseOverContent = false;
  let isFocusWithin = false;
  let lastScrollY = 0;
  let isPointerDown = false; // Track if focus is from mouse/touch

  // MediaQuery for mobile detection
  let mediaQuery: MediaQueryList | null = null;

  // Initialize media query
  function initMediaQuery() {
    if (typeof window !== "undefined") {
      mediaQuery = window.matchMedia("(max-width: 767px)");
      isMobile = mediaQuery.matches;
      mediaQuery.addEventListener("change", handleMediaChange);
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
    lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
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
      if (
        (isMouseOverTrigger || isMouseOverContent || isFocusWithin) &&
        !disabled &&
        !isMobile
      ) {
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

    const shouldBeOpen =
      isMouseOverTrigger || isMouseOverContent || isFocusWithin;

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
  function positionPopoverWrapper() {
    if (!triggerElement || !popoverWrapper || isMobile) return;
    positionWrapper(triggerElement, popoverWrapper);
  }

  // Calculate content position with proper measurement
  function calculateContentPosition() {
    if (!triggerElement || !contentElement || isMobile) return;

    const result = calculatePosition(triggerElement, contentElement, {
      position,
      offset,
    });

    actualPosition = result.position;
    applyPosition(contentElement, result);
  }

  // Trigger event handlers
  function handleTriggerPointerDown() {
    // Mark that pointer is being used (not keyboard)
    isPointerDown = true;
  }

  function handleTriggerClick(event: MouseEvent) {
    if (disabled) return;

    // Prevent any click behavior on desktop
    if (!isMobile) {
      event.preventDefault();
      return;
    }

    event.stopPropagation();
    if (isOpen) {
      closePopover();
    } else {
      openPopover();
    }
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

    // Only open on keyboard focus, not mouse focus
    if (isPointerDown) {
      isPointerDown = false;
      return;
    }

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
    if (isMobile && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      if (isOpen) {
        closePopover();
      } else {
        openPopover();
      }
    }

    // Escape always closes
    if (event.key === "Escape" && isOpen) {
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
    if (!isOpen || typeof window === "undefined") return;

    const currentScrollY = window.scrollY;
    const scrollDelta = Math.abs(currentScrollY - lastScrollY);

    // Only close if scrolled beyond threshold
    if (scrollDelta > SCROLL_CLOSE_THRESHOLD) {
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
          positionPopoverWrapper();
          calculateContentPosition();
        });
      });
    }
  });

  // Lifecycle
  onMount(() => {
    initMediaQuery();
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll, true);
    }
  });

  onDestroy(() => {
    mediaQuery?.removeEventListener("change", handleMediaChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", handleScroll, true);
    }
    clearTimers();
  });
</script>

{#snippet triggerSnippet(props: { class?: string })}
  <button
    bind:this={triggerElement}
    class="popover-trigger {props?.class || ''}"
    type="button"
    {disabled}
    aria-expanded={isOpen}
    aria-controls="popover-{id}"
    aria-haspopup="dialog"
    onpointerdown={handleTriggerPointerDown}
    onclick={handleTriggerClick}
    onmouseenter={handleTriggerMouseEnter}
    onmouseleave={handleTriggerMouseLeave}
    onfocus={handleTriggerFocus}
    onblur={handleTriggerBlur}
    onkeydown={handleTriggerKeyDown}
    data-popover-trigger={id}
    {...props}
  >
    <Icon name="placeholder" />
  </button>
{/snippet}

<!-- Trigger -->
{@render triggerSnippet({})}

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
    <div class="popover-content">
      <h3 class="popover-title">{title}</h3>
      <p class="popover-text">{text}</p>
    </div>
  </div>
{/if}

<!-- Desktop Content with Fixed Wrapper -->
{#if isOpen && !isMobile}
  <!-- Fixed wrapper that stays with trigger -->
  <div bind:this={popoverWrapper} class="popover-wrapper">
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
      <div class="popover-content">
        <h3 class="popover-title">{title}</h3>
        <p class="popover-text">{text}</p>
      </div>
    </div>
  </div>
{/if}

<style>
  .popover-trigger {
    display: inline-block;
    cursor: pointer;
    width: var(--size-touch-safe);
    height: var(--size-touch-safe);
    border-radius: var(--border-radius-sm);
    background-color: var(--surface-neutral-mask);
    border: none;
    box-shadow: inset 0px 0px 0px 1px var(--border-neutral);
  }

  .popover-trigger:hover {
    box-shadow: inset 0px 0px 0px 1px var(--border-hover);
  }

  .popover-trigger:focus-visible {
    outline: 2px solid var(--focus-ring-color);
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
    background: var(--surface-neutral-reading);
    border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
    padding-left: var(--padding-left-medium);
    padding-right: var(--padding-right-medium);
    padding-top: var(--padding-top-medium);
    padding-bottom: calc(
      var(--padding-bottom-medium) + env(safe-area-inset-bottom)
    );
    z-index: 1000;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    animation: slideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  }

  /* Desktop popover positioned absolutely within wrapper */
  .popover-content-desktop {
    position: absolute;
    display: flex;
    flex-direction: column;
    width: max-content;
    background: var(--surface-neutral-mask);
    border: 1px solid var(--border-neutral);
    border-radius: var(--border-radius-sm);
    padding: var(--padding-small-relaxed);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.12),
      0 2px 6px rgba(0, 0, 0, 0.08);
    pointer-events: auto;
    animation: popIn 0.15s ease-in-out;
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
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
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

  /* Content styling */
  .popover-title {
    font-size: var(--fs-275);
    font-weight: var(--fw-medium);
    color: var(--text-primary-muted);
    padding-bottom: var(--padding-bottom-small);
  }

  .popover-text {
    font-size: var(--fs-275);
    font-weight: var(--fw-medium);
    line-height: var(--lh-normal);
    color: var(--text-primary-default);
    max-width: var(--width-prose-sm);
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

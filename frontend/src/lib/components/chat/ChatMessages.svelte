<!-- Docs: ../../../../docs/components/chat/Chat-Implementation-Documentation.md, components/chat/Chat-Implementation-Complete-Documentation.md, components/chat/Chat-Implementation-Progress-Report.md, components/chat/ChatMessages-AutoScroll-Refactor-Plan.md -->
<!-- Message display area - simplified to use enhanced ChatMessage component -->

<script lang="ts">
  import ChatMessage from './ChatMessage.svelte';
  import type { ChatMessagesProps } from '$lib/types/chat.js';

  // Props with proper typing
  export let messages: ChatMessagesProps['messages'] = [];
  export let isLoading: ChatMessagesProps['isLoading'] = false;
  export let error: ChatMessagesProps['error'] = null;
  export let onPromptSelected: ((prompt: string) => void) | undefined =
    undefined;

  let messagesContainer: HTMLElement;
  let userHasScrolledUp = false;

  // Scroll lock mechanism to prevent auto-scroll interference
  let scrollLockActive = false;
  let scrollLockTimeout: ReturnType<typeof setTimeout>;

  // Enhanced scroll tracking
  let lastScrollTop = 0;
  let scrollDirection: 'up' | 'down' | 'none' = 'none';

  // Message tracking for precise change detection
  let previousMessageCount = 0;
  let lastMessageId = '';

  // Set scroll lock to prevent auto-scroll during manual scrolling
  function setScrollLock() {
    scrollLockActive = true;
    clearTimeout(scrollLockTimeout);

    scrollLockTimeout = setTimeout(() => {
      scrollLockActive = false;
    }, 300); // Reduced to 300ms for better responsiveness
  }

  // Enhanced scroll position checking with direction tracking
  function checkScrollPosition() {
    if (!messagesContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainer;

    // Detect scroll direction
    scrollDirection =
      scrollTop > lastScrollTop
        ? 'down'
        : scrollTop < lastScrollTop
          ? 'up'
          : 'none';

    // Update user scroll state
    const threshold = 100; // pixels from bottom
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    userHasScrolledUp = distanceFromBottom > threshold;
    lastScrollTop = scrollTop;
  }

  // Handle scroll events with immediate position checking
  function handleScroll() {
    if (!messagesContainer) return;

    // Immediate position check (no setTimeout delay)
    checkScrollPosition();

    // Set scroll lock to prevent auto-scroll interference
    setScrollLock();
  }

  // Smooth scroll to bottom using requestAnimationFrame
  function smoothScrollToBottom() {
    if (!messagesContainer) return;

    // Use multiple animation frames to ensure reliable scrolling
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      });
    });
  }

  // Handle new message arrival with user intent awareness
  function handleNewMessage() {
    if (!messagesContainer) return;

    // Always scroll for new messages (ignore scroll lock for new messages)
    // Clear any existing scroll lock to ensure new messages always scroll
    scrollLockActive = false;
    clearTimeout(scrollLockTimeout);

    smoothScrollToBottom();
  }

  // Handle loading state changes
  function handleLoadingStateChange() {
    if (!messagesContainer || scrollLockActive) return;

    // Only auto-scroll for loading if user is near bottom
    if (!userHasScrolledUp) {
      smoothScrollToBottom();
    }
  }

  // Track new messages by count and ID for precise detection
  $: if (messages.length > previousMessageCount) {
    const newMessage = messages[messages.length - 1];
    if (newMessage?.id !== lastMessageId) {
      handleNewMessage();
      lastMessageId = newMessage.id;
    }
    previousMessageCount = messages.length;
  }

  // Handle loading state changes separately
  $: if (messagesContainer && isLoading !== undefined) {
    handleLoadingStateChange();
  }
</script>

<div
  class="messages-container"
  bind:this={messagesContainer}
  on:scroll={handleScroll}
>
  <!-- Welcome message when no messages and not loading -->
  {#if messages.length === 0 && !isLoading}
    <ChatMessage displayType="welcome" {onPromptSelected} />
  {/if}

  <!-- Regular messages -->
  {#each messages as message (message.id)}
    <ChatMessage {message} />
  {/each}

  <!-- Loading state -->
  {#if isLoading}
    <ChatMessage displayType="loading" />
  {/if}

  <!-- Error state -->
  {#if error}
    <ChatMessage displayType="error" {error} />
  {/if}
</div>

<style>
  .messages-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    flex: 1;
    overflow-y: auto;
    padding: 0;
    height: 100%;
    min-height: 0; /* Ensures flex item can shrink below content size */
    /* Ensure stable height within fixed dialog container */
    max-height: 100%;
    width: 100%;
    max-width: 800px;
    /* Remove scroll-behavior: smooth to prevent interference with manual scrolling */
  }
</style>

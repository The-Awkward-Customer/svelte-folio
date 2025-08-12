<!-- Docs: ../../../../docs/components/chat/Chat-Implementation-Documentation.md, components/chat/Chat-Implementation-Complete-Documentation.md, components/chat/Chat-Implementation-Progress-Report.md, components/chat/ChatMessages-AutoScroll-Refactor-Plan.md -->
<!-- Main chat operator  -->

<script lang="ts">
  import ChatDialog from './ChatDialog.svelte';
  import ChatMessages from './ChatMessages.svelte';
  import ChatInput from './ChatInput.svelte';
  import Button from '$lib/components/actions/Button.svelte';
  import IconButton from '$lib/components/actions/IconButton.svelte';
  import Tag from '../primitives/Tag.svelte';
  import type {
    ChatMessage,
    ChatApiResponse,
    ChatApiError,
    QAChatProps,
  } from '$lib/types/chat.js';
  import { isChatApiResponse, isChatApiError } from '$lib/types/chat.js';
  import { chatStore } from '$lib';

  // Props with proper typing - now just for compatibility
  export let isOpen: QAChatProps['isOpen'] = false;

  // Direct store property access - no need for reactive statements
  // These are already reactive because they're $state in the store

  // Functions
  function closeChat(): void {
    chatStore.closeChat();
  }

  function createUserMessage(content: string): ChatMessage {
    return {
      id: crypto.randomUUID(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };
  }

  function createAssistantMessage(content: string): ChatMessage {
    return {
      id: crypto.randomUUID(),
      type: 'assistant',
      content,
      timestamp: new Date(),
    };
  }

  async function handleSendMessage(question: string): Promise<void> {
    if (!question.trim() || chatStore.isLoading) {
      return;
    }

    const userMessage = createUserMessage(question);

    // Add user message immediately and set loading state
    chatStore.addMessage(userMessage);
    chatStore.setLoading(true);
    chatStore.setError(null);

    try {
      const response = await fetch('/api/chat-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      const result: unknown = await response.json();

      if (!response.ok) {
        if (isChatApiError(result)) {
          throw new Error(`${result.error}: ${result.details || ''}`);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!isChatApiResponse(result)) {
        throw new Error('Invalid response format from server');
      }

      const assistantMessage = createAssistantMessage(result.response);

      chatStore.addMessage(assistantMessage);
      chatStore.setLoading(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to get response';
      console.error('Chat error:', err);

      chatStore.setError(errorMessage);
      chatStore.setLoading(false);
    }
  }

  function clearMessages(): void {
    chatStore.clearMessages();
  }
</script>

<ChatDialog bind:isOpen={chatStore.isOpen} on:close={closeChat}>
  <div class="chat-container">
    <div class="chat-header">
      <Tag label="Beta" />
      <div class="chat-actions">
        {#if chatStore.messages.length > 0}
          <Button
            as="button"
            variant="inverse"
            label="Clear"
            handleClick={clearMessages}
          />
        {/if}
        <IconButton
          name="close"
          variant="inverse"
          alt="Close chat"
          size={24}
          handleClick={closeChat}
        />
      </div>
    </div>

    <ChatMessages
      messages={chatStore.messages}
      isLoading={chatStore.isLoading}
      error={chatStore.error}
      onPromptSelected={handleSendMessage}
    />

    <ChatInput
      on:send={(e) => handleSendMessage(e.detail)}
      disabled={chatStore.isLoading}
    />
  </div>
</ChatDialog>

<style>
  .chat-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    /* Ensure container takes full height in dialog */
    height: 100%;
    min-height: 0; /* Allow flex shrinking */
  }

  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    width: 100%;
    /* Prevent header from shrinking */
    flex-shrink: 0;
    /* Account for safe areas on mobile */
    padding-left: max(1.5rem, env(safe-area-inset-left));
    padding-right: max(1.5rem, env(safe-area-inset-right));
  }

  .chat-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: rgb(var(--fg-text-primary));
  }

  .chat-actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  /* Action components will handle their own styling */

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .chat-container {
      max-width: 100%;
      /* Full height on mobile for better keyboard handling */
      height: 100%;
    }

    .chat-header {
      padding: 1rem;
      /* Ensure safe area handling */
      padding-left: max(1rem, env(safe-area-inset-left));
      padding-right: max(1rem, env(safe-area-inset-right));
    }

    .chat-actions {
      gap: 0.25rem;
    }
  }

  /* Support for older browsers without env() */
  @supports not (padding: env(safe-area-inset-left)) {
    .chat-header {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }

    @media (max-width: 768px) {
      .chat-header {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
  }
</style>

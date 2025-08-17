// Chat Components Barrel Export
// This file provides a centralized export for all chat-related components

export { default as ChatDialog } from './ChatDialog.svelte';
export { default as ChatInput } from './ChatInput.svelte';
export { default as ChatMessage } from './ChatMessage.svelte';
export { default as ChatMessages } from './ChatMessages.svelte';
export { default as QAChat } from './QAChat.svelte';

// Re-export types that might be used with these components
export type {
  ChatMessage as ChatMessageType,
  ChatApiResponse,
  ChatApiError,
  ChatState,
  SendMessageEvent,
  CloseEvent,
  // Component Props
  ChatDialogProps,
  ChatMessageProps,
  ChatMessagesProps,
  ChatInputProps,
  QAChatProps,
  // Event Types
  ChatInputEvents,
  ChatDialogEvents,
  QAChatEvents,
  // Utility Types
  MessageType,
  MessageDisplayType,
  QASearchResult,
  ChatError,
  ChatConfig,
} from '$lib/types/chat.js';

// Re-export utility functions
export {
  isChatMessage,
  isChatApiResponse,
  isChatApiError,
} from '$lib/types/chat.js';

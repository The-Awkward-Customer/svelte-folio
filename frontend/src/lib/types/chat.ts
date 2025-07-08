// Chat-related types and interfaces

/**
 * Represents the type of message in a chat conversation
 */
export type MessageType = 'user' | 'assistant';

/**
 * Represents a single chat message
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** Type of message (user or assistant) */
  type: MessageType;
  /** The actual message content */
  content: string;
  /** When the message was created */
  timestamp: Date;
}

/**
 * Represents a search result from the QA system
 */
export interface QASearchResult {
  /** The question that was matched */
  question: string;
  /** The answer to the question */
  answer: string;
  /** Similarity score (0-1) */
  similarity: number;
  /** Optional category classification */
  category?: string;
  /** Optional tags for the QA pair */
  tags?: string[];
}

/**
 * Response structure from the chat API
 */
export interface ChatApiResponse {
  /** The original question asked */
  question: string;
  /** Similar Q&A pairs found in the search */
  similarQAs: Array<{
    question: string;
    answer: string;
    similarity: number;
  }>;
  /** The generated response */
  response: string;
  /** Debug information about the response generation */
  debug: {
    embeddingLength: number;
    searchResults: number;
    responseLength: number;
  };
}

/**
 * Error response structure from the chat API
 */
export interface ChatApiError {
  /** Error message */
  error: string;
  /** Optional additional error details */
  details?: string;
}

/**
 * Overall state of the chat component
 */
export interface ChatState {
  /** Array of chat messages */
  messages: ChatMessage[];
  /** Whether the chat is currently loading */
  isLoading: boolean;
  /** Current error message, if any */
  error: string | null;
}

// Event types for Svelte components
/**
 * Event structure for sending messages
 */
export interface SendMessageEvent {
  detail: string;
}

/**
 * Event structure for closing dialogs
 */
export interface CloseEvent {
  detail?: void;
}

// Component Props interfaces
/**
 * Props for ChatDialog component
 */
export interface ChatDialogProps {
	/** Whether the dialog is open */
	isOpen: boolean;
}

/**
 * Message display types for different chat states
 */
export type MessageDisplayType = 'user' | 'assistant' | 'loading' | 'error' | 'welcome';

/**
 * Props for ChatMessage component - enhanced to handle all message states
 */
export interface ChatMessageProps {
	/** The message to display (optional for non-message states) */
	message?: ChatMessage;
	/** The type of display state */
	displayType?: MessageDisplayType;
	/** Error message for error state */
	error?: string;
	/** Loading state indicator */
	isLoading?: boolean;
	/** Callback for when a prompt is selected */
	onPromptSelected?: (prompt: string) => void;
}

/**
 * Props for ChatMessages component
 */
export interface ChatMessagesProps {
  /** Array of messages to display */
  messages: ChatMessage[];
  /** Whether messages are currently loading */
  isLoading?: boolean;
  /** Current error message, if any */
  error?: string | null;
  /** Callback for when a prompt is selected */
  onPromptSelected?: (prompt: string) => void;
}

/**
 * Props for ChatInput component
 */
export interface ChatInputProps {
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Placeholder text for the input */
  placeholder?: string;
}

/**
 * Props for QAChat component
 */
export interface QAChatProps {
  /** Whether the chat is open */
  isOpen: boolean;
}

// Event dispatcher types for better type safety
/**
 * Events dispatched by ChatInput component
 */
export interface ChatInputEvents {
  send: string;
}

/**
 * Events dispatched by ChatDialog component
 */
export interface ChatDialogEvents {
  close: void;
}

/**
 * Events dispatched by QAChat component
 */
export interface QAChatEvents {
  close: void;
}

/**
 * Events dispatched by ChatMessage component
 */
export interface ChatMessageEvents {
  promptSelected: string;
}

// Utility types
/**
 * Union type for different error types in chat
 */
export type ChatError = Error | ChatApiError;

/**
 * Configuration for chat functionality
 */
export interface ChatConfig {
  /** API endpoint for chat requests */
  apiEndpoint: string;
  /** Maximum number of retry attempts */
  maxRetries: number;
  /** Delay between retry attempts (ms) */
  retryDelay: number;
}

// Type Guards
/**
 * Type guard to check if a value is a valid ChatMessage
 */
export function isChatMessage(value: unknown): value is ChatMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'type' in value &&
    'content' in value &&
    'timestamp' in value &&
    typeof (value as any).id === 'string' &&
    ['user', 'assistant'].includes((value as any).type) &&
    typeof (value as any).content === 'string' &&
    (value as any).timestamp instanceof Date
  );
}

/**
 * Type guard to check if a value is a valid ChatApiResponse
 */
export function isChatApiResponse(value: unknown): value is ChatApiResponse {
  return (
    typeof value === 'object' &&
    value !== null &&
    'response' in value &&
    'question' in value &&
    'similarQAs' in value &&
    'debug' in value &&
    typeof (value as any).response === 'string' &&
    typeof (value as any).question === 'string' &&
    Array.isArray((value as any).similarQAs) &&
    typeof (value as any).debug === 'object'
  );
}

/**
 * Type guard to check if a value is a ChatApiError
 */
export function isChatApiError(value: unknown): value is ChatApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as any).error === 'string'
  );
}
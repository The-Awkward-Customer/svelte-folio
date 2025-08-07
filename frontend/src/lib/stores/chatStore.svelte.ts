import type { ChatMessage, ChatState } from '$lib/types/chat.js';

interface ChatStoreState {
	messages: ChatMessage[];
	isLoading: boolean;
	error: string | null;
	isOpen: boolean;
	hasBeenOpened: boolean;
}

class ChatStoreManager {
	// Make state properties directly accessible and reactive
	messages = $state<ChatMessage[]>([]);
	isLoading = $state(false);
	error = $state<string | null>(null);
	isOpen = $state(false);
	hasBeenOpened = $state(false);
	
	// Derived state for indicator visibility
	get shouldShowIndicator() {
		return !this.hasBeenOpened || (!this.isOpen && this.messages.length === 0);
	}
	
	get hasMessages() {
		return this.messages.length > 0;
	}

	// Get complete chat state for compatibility
	get chatState(): ChatState {
		return {
			messages: this.messages,
			isLoading: this.isLoading,
			error: this.error
		};
	}

	// Actions
	openChat() {
		this.isOpen = true;
		this.hasBeenOpened = true;
	}

	closeChat() {
		this.isOpen = false;
	}

	addMessage(message: ChatMessage) {
		this.messages = [...this.messages, message];
	}

	clearMessages() {
		this.messages = [];
		this.error = null;
	}

	setLoading(loading: boolean) {
		this.isLoading = loading;
	}

	setError(error: string | null) {
		this.error = error;
	}

	updateChatState(updates: Partial<ChatState>) {
		if (updates.messages !== undefined) {
			this.messages = updates.messages;
		}
		if (updates.isLoading !== undefined) {
			this.isLoading = updates.isLoading;
		}
		if (updates.error !== undefined) {
			this.error = updates.error;
		}
	}

	// Reset state (useful for testing or user logout)
	reset() {
		this.messages = [];
		this.isLoading = false;
		this.error = null;
		this.isOpen = false;
		this.hasBeenOpened = false;
	}
}

// Export singleton instance
export const chatStore = new ChatStoreManager();
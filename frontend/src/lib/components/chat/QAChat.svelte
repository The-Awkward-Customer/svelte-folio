<!-- Main chat operator  -->

<script lang="ts">
	import ChatDialog from './ChatDialog.svelte';
	import ChatMessages from './ChatMessages.svelte';
	import ChatInput from './ChatInput.svelte';
	import Button from '$lib/components/actions/Button.svelte';
	import IconButton from '$lib/components/actions/IconButton.svelte';
	import type {
		ChatMessage,
		ChatApiResponse,
		ChatApiError,
		ChatState,
		QAChatProps
	} from '$lib/types/chat.js';
	import { isChatApiResponse, isChatApiError } from '$lib/types/chat.js';

	// Props with proper typing
	export let isOpen: QAChatProps['isOpen'] = false;

	// State - using proper types
	let chatState: ChatState = {
		messages: [],
		isLoading: false,
		error: null
	};

	// Reactive declarations for easier access
	$: ({ messages, isLoading, error } = chatState);

	// Functions
	function closeChat(): void {
		isOpen = false;
	}

	function createUserMessage(content: string): ChatMessage {
		return {
			id: crypto.randomUUID(),
			type: 'user',
			content: content.trim(),
			timestamp: new Date()
		};
	}

	function createAssistantMessage(content: string): ChatMessage {
		return {
			id: crypto.randomUUID(),
			type: 'assistant',
			content,
			timestamp: new Date()
		};
	}

	function updateChatState(updates: Partial<ChatState>): void {
		chatState = { ...chatState, ...updates };
	}

	async function handleSendMessage(question: string): Promise<void> {
		if (!question.trim() || chatState.isLoading) {
			return;
		}

		const userMessage = createUserMessage(question);

		// Add user message immediately and set loading state
		updateChatState({
			messages: [...chatState.messages, userMessage],
			isLoading: true,
			error: null
		});

		try {
			const response = await fetch('/api/chat-test', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ question: question.trim() })
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

			updateChatState({
				messages: [...chatState.messages, assistantMessage],
				isLoading: false
			});
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
			console.error('Chat error:', err);

			updateChatState({
				error: errorMessage,
				isLoading: false
			});
		}
	}

	function clearMessages(): void {
		updateChatState({
			messages: [],
			error: null
		});
	}
</script>

<ChatDialog bind:isOpen on:close={closeChat}>
	<div class="chat-container">
		<div class="chat-header">
			<h2>Ask me anything</h2>
			<div class="chat-actions">
				{#if messages.length > 0}
					<Button as="button" variant="primary" label="Clear" handleClick={clearMessages} />
				{/if}
				<IconButton
					name="close"
					variant="primary"
					alt="Close chat"
					size={24}
					handleClick={closeChat}
				/>
			</div>
		</div>

		<ChatMessages {messages} {isLoading} {error} />

		<ChatInput on:send={(e) => handleSendMessage(e.detail)} disabled={isLoading} />
	</div>
</ChatDialog>

<style>
	.chat-container {
		display: flex;
		flex-direction: column;
		height: 80vh;
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
	}

	.chat-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background: rgba(var(--bg-primary) / 1);
	}

	.chat-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: rgb(var(--fg-text-inverse));
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
			height: 90vh;
			max-width: 100%;
		}

		.chat-header {
			padding: 1rem;
		}

		.chat-header h2 {
			font-size: 1.125rem;
		}
	}
</style>

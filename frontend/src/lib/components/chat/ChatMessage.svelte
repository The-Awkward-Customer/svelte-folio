<!-- Enhanced message component with comprehensive snippet architecture -->

<script lang="ts">
	import type { ChatMessage, ChatMessageProps, MessageDisplayType } from '$lib/types/chat.js';

	// Enhanced props to handle all message display states
	export let message: ChatMessageProps['message'] = undefined;
	export let displayType: ChatMessageProps['displayType'] = undefined;
	export let error: ChatMessageProps['error'] = undefined;
	export let isLoading: ChatMessageProps['isLoading'] = false;

	// Determine display type from props
	$: actualDisplayType = (() => {
		if (displayType) return displayType;
		if (isLoading) return 'loading';
		if (error) return 'error';
		if (!message) return 'welcome';
		return message.type;
	})() as MessageDisplayType;

	// Format timestamp
	function formatTime(date: Date): string {
		return date.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<!-- User Message Snippet -->
{#snippet UserMessage(msg: ChatMessage)}
	<div class="message user-message">
		<div class="message-avatar user-avatar">👤</div>
		<div class="message-content user-content">
			<div class="message-bubble user-bubble">
				<p>{msg.content}</p>
			</div>
			<div class="message-meta user-meta">
				<span class="message-time">{formatTime(msg.timestamp)}</span>
			</div>
		</div>
	</div>
{/snippet}

<!-- Assistant Message Snippet -->
{#snippet AssistantMessage(msg: ChatMessage)}
	<div class="message assistant-message">
		<div class="message-avatar assistant-avatar">🤖</div>
		<div class="message-content assistant-content">
			<div class="message-bubble assistant-bubble">
				<p>{msg.content}</p>
			</div>
			<div class="message-meta assistant-meta">
				<span class="message-time">{formatTime(msg.timestamp)}</span>
			</div>
		</div>
	</div>
{/snippet}

<!-- Loading Message Snippet -->
{#snippet LoadingMessage()}
	<div class="message loading-message">
		<div class="message-avatar loading-avatar">🤖</div>
		<div class="message-content loading-content">
			<div class="typing-indicator">
				<span></span>
				<span></span>
				<span></span>
			</div>
			<p class="loading-text">Thinking...</p>
		</div>
	</div>
{/snippet}

<!-- Error Message Snippet -->
{#snippet ErrorMessage(errorText: string)}
	<div class="message error-message">
		<div class="error-content">
			<span class="error-icon">⚠️</span>
			<div>
				<p class="error-title">Something went wrong</p>
				<p class="error-details">{errorText}</p>
			</div>
		</div>
	</div>
{/snippet}

<!-- Welcome Message Snippet -->
{#snippet WelcomeMessage()}
	<div class="message welcome-message">
		<div class="welcome-content">
			<h3>Hello</h3>
			<p>
				I'm here to help answer questions about my background, skills, and experience. Feel free to
				ask me anything!
			</p>

			<div class="suggested-questions">
				<p class="suggest-label">Try asking:</p>
				<ul>
					<li>"What technologies do you use?"</li>
					<li>"Tell me about your experience"</li>
					<li>"How can I contact you?"</li>
				</ul>
			</div>
		</div>
	</div>
{/snippet}

<!-- Main template with comprehensive conditional rendering -->
{#if actualDisplayType === 'user' && message}
	{@render UserMessage(message)}
{:else if actualDisplayType === 'assistant' && message}
	{@render AssistantMessage(message)}
{:else if actualDisplayType === 'loading'}
	{@render LoadingMessage()}
{:else if actualDisplayType === 'error' && error}
	{@render ErrorMessage(error)}
{:else if actualDisplayType === 'welcome'}
	{@render WelcomeMessage()}
{/if}

<style>
	/* Base message styles */
	.message {
		display: flex;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		align-items: flex-start;
	}

	/* User message specific styles */
	.user-message {
		flex-direction: row-reverse;
	}

	.user-content {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	/* Message avatar styles */
	.message-avatar {
		width: 32px;
		height: 32px;
		border-radius: var(--bdr-radius-small);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.user-avatar {
		background: rgb(var(--bg-primary));
		color: rgb(var(--fg-primary));
	}

	.assistant-avatar {
		background: var(--assistant-color, #f3e5f5);
		color: var(--assistant-text, #7b1fa2);
	}

	.loading-avatar {
		background: var(--primary-color, #007bff);
		border-radius: 50%;
	}

	/* Message content styles */
	.message-content {
		flex: 1;
		max-width: calc(100% - 50px);
	}

	/* Message bubble styles */
	.message-bubble {
		background: rgb(var(--bg-primary));
		border-radius: 18px;
		padding: 0.75rem 1rem;
		max-width: 100%;
		word-wrap: break-word;
		position: relative;
	}

	.user-bubble {
		background: rgb(var(--bg-primary));
		color: rgb(var(--fg-text-inverse));
		border-radius: var(--bdr-radius-small) var(--bdr-radius-small) 0px var(--bdr-radius-small);
	}

	.assistant-bubble {
		background: rgb(var(--bg-inverse));
		color: rgb(var(--fg-text-primary));
		border-color: rgb(var(--fg-text-primary));
		border-style: solid;
		border-width: 1px;
		border-radius: var(--bdr-radius-small) var(--bdr-radius-small) 0px var(--bdr-radius-small);
	}

	.message-bubble p {
		margin: 0;
		line-height: 1.5;
		font-size: 0.9375rem;
	}

	/* Message meta styles */
	.message-meta {
		margin-top: 0.25rem;
		padding: 0 0.25rem;
	}

	.message-time {
		font-size: 0.75rem;
		color: var(--text-muted, #888);
		opacity: 0.7;
	}

	.user-meta .message-time {
		color: var(--user-meta, #666);
	}

	/* Loading message styles - ensure consistent height */
	.loading-message {
		align-items: flex-start;
		/* Ensure loading message takes up similar space to regular messages */
		min-height: 60px;
	}

	.loading-content {
		flex: 1;
		max-width: calc(100% - 50px);
		/* Add padding to match message bubble spacing */
		padding: 0.75rem 0;
	}

	.typing-indicator {
		display: flex;
		gap: 4px;
		margin-bottom: 0.5rem;
		/* Add some padding to increase visual weight */
		padding: 0.5rem 0;
	}

	.typing-indicator span {
		width: 8px;
		height: 8px;
		background: var(--text-secondary, #666);
		border-radius: 50%;
		animation: typing 1.4s infinite ease-in-out;
	}

	.typing-indicator span:nth-child(1) {
		animation-delay: -0.32s;
	}
	.typing-indicator span:nth-child(2) {
		animation-delay: -0.16s;
	}
	.typing-indicator span:nth-child(3) {
		animation-delay: 0s;
	}

	@keyframes typing {
		0%,
		80%,
		100% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.loading-text {
		margin: 0;
		font-size: 0.875rem;
		color: var(--text-secondary, #666);
		font-style: italic;
	}

	/* Error message styles */
	.error-message {
		padding: 1rem 1.5rem;
	}

	.error-content {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		background: var(--error-bg, #fef2f2);
		border: 1px solid var(--error-border, #fecaca);
		border-radius: 8px;
		padding: 1rem;
	}

	.error-icon {
		flex-shrink: 0;
		font-size: 1.25rem;
	}

	.error-title {
		margin: 0 0 0.25rem 0;
		font-weight: 600;
		color: var(--error-text, #dc2626);
		font-size: 0.875rem;
	}

	.error-details {
		margin: 0;
		color: var(--error-text-secondary, #7f1d1d);
		font-size: 0.8125rem;
	}

	/* Welcome message styles */
	.welcome-message {
		padding: 2rem 1.5rem;
		text-align: center;
		color: rgb(var(--fg-text-primary));
		display: block;
	}

	.welcome-content h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.25rem;
	}

	.welcome-content p {
		margin: 0 0 1.5rem 0;
		line-height: 1.5;
	}

	.suggested-questions {
		background: rgb(var(--bg-primary));
		border-radius: 8px;
		padding: 1rem;
		text-align: left;
		max-width: 400px;
		margin: 0 auto;
	}

	.suggest-label {
		margin: 0 0 0.5rem 0;
		font-weight: 600;
		font-size: 0.875rem;
		color: rgb(var(--fg-text-inverse));
	}

	.suggested-questions ul {
		margin: 0;
		padding-left: 1rem;
		list-style: none;
	}

	.suggested-questions li {
		margin: 0.25rem 0;
		color: rgb(var(--fg-text-inverse));
		font-size: 0.875rem;
		position: relative;
	}

	.suggested-questions li::before {
		content: '•';
		position: absolute;
		left: -1em;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.message {
			padding: 0.75rem 1rem;
			gap: 0.5rem;
		}

		.message-avatar {
			width: 28px;
			height: 28px;
			font-size: 0.8125rem;
		}

		.message-content {
			max-width: calc(100% - 40px);
		}

		.message-bubble {
			padding: 0.625rem 0.875rem;
		}

		.message-bubble p {
			font-size: 0.875rem;
		}

		.welcome-message {
			padding: 1.5rem 1rem;
		}

		.suggested-questions {
			max-width: 100%;
		}

		.loading-message,
		.error-message {
			padding: 1rem;
		}
	}
</style>

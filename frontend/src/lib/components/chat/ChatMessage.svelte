<!-- Enhanced message component with comprehensive snippet architecture -->

<script lang="ts">
	import type { ChatMessage, ChatMessageProps, MessageDisplayType } from '$lib/types/chat.js';
	import Button from '$lib/components/actions/Button.svelte';
	import { Avatar } from '$lib/components/primatives';

	import Ani_me_glitched from '$lib/assets/Ani_me_glitched.png';
	let Avatar_Image = Ani_me_glitched;

	// Enhanced props to handle all message display states
	export let message: ChatMessageProps['message'] = undefined;
	export let displayType: ChatMessageProps['displayType'] = undefined;
	export let error: ChatMessageProps['error'] = undefined;
	export let isLoading: ChatMessageProps['isLoading'] = false;
	export let onPromptSelected: ((prompt: string) => void) | undefined = undefined;

	// Predefined prompts
	const suggestedPrompts = [
		'What technologies do you use?',
		'Tell me about your experience',
		'How can I contact you?'
	];

	// Handle prompt button clicks
	function handlePromptClick(prompt: string) {
		onPromptSelected?.(prompt);
	}

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
		<div class="message-avatar assistant-avatar">
			<Avatar size="xs" alt="Assistant avatar" />
		</div>
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
		<div class="message-avatar loading-avatar">
			<Avatar size="xs" alt="Assistant avatar" content={Avatar_Image} isLoading={true} />
		</div>
		<div class="message-content loading-content">
			<div class="message-bubble loading-bubble">
				<p class="loading-text">Thinking...</p>
			</div>
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
	<div class="message assistant-message">
		<div class="message-avatar assistant-avatar">
			<Avatar size="xs" alt="Assistant avatar" />
		</div>
		<div class="message-content assistant-content">
			<div class="message-bubble assistant-bubble">
				<p>
					Hello! I'm here to help answer questions about my background, skills, and experience. Feel
					free to ask me anything!
				</p>
			</div>
			<div class="prompt-buttons">
				{#each suggestedPrompts as prompt}
					<Button
						as="button"
						variant="inverse"
						fullWidth={false}
						label={prompt}
						handleClick={() => handlePromptClick(prompt)}
					/>
				{/each}
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
		justify-content: flex-start;
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
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	/* Message content styles */
	.message-content {
		flex: 1;
		max-width: calc(100% - 50px);
	}

	/* Message bubble styles */
	.message-bubble {
		background: var(--bg-primary);
		border-radius: 18px;
		padding: 0.75rem 1rem;
		max-width: 100%;
		word-wrap: break-word;
		position: relative;
	}

	.user-bubble {
		background: var(--bg-primary);
		color: var(--fg-text-inverse);
		border-radius: var(--bdr-radius-small) var(--bdr-radius-small) 0px var(--bdr-radius-small);
	}

	.assistant-bubble {
		background: var(--bg-inverse);
		color: var(--fg-text-primary);
		border-color: var(--fg-text-primary);
		border-style: solid;
		border-width: 1px;
		border-radius: var(--bdr-radius-small) var(--bdr-radius-small) 0px var(--bdr-radius-small);
	}

	.message-bubble p {
		margin: 0;
		line-height: 130%;
		font-size: 1.2rem;
	}

	/* Message meta styles */
	.message-meta {
		margin-top: 0.25rem;
		padding: 0 0.25rem;
	}

	.message-time {
		font-size: 0.75rem;
		color: var(--fg-text-primary);
		opacity: 0.7;
	}

	.user-meta .message-time {
		color: var(--fg-text-primary);
	}

	/* Loading message styles */
	.loading-message {
		align-items: flex-start;
	}

	.loading-bubble {
		background: var(--bg-page);
		color: var(--fg-text-primary);
		border-radius: 18px;
		padding: 0.75rem 1rem;
		width: 100%;
		word-wrap: break-word;
		position: relative;
		box-sizing: border-box;
	}

	.loading-text {
		margin: 0;
		line-height: 130%;
		font-family: var(--font-family-alt);
		font-size: var(--fs-200);
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
	.prompt-buttons {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 1rem;
		max-width: 100%;
	}

	/* Responsive button layout */
	@media (min-width: 480px) {
		.prompt-buttons {
			gap: 0.75rem;
		}
	}
</style>

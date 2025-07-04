<!-- Input form component -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import IconButton from '$lib/components/actions/IconButton.svelte';
	import type { ChatInputProps, ChatInputEvents } from '$lib/types/chat.js';

	// Props with proper typing
	export let disabled: ChatInputProps['disabled'] = false;
	export let placeholder: ChatInputProps['placeholder'] = 'Ask me anything...';

	// State
	let inputValue: string = '';
	let textareaElement: HTMLTextAreaElement;

	// Event dispatcher with proper typing
	const dispatch = createEventDispatcher<ChatInputEvents>();

	// Handle form submission
	function handleSubmit(event: Event) {
		event.preventDefault();
		sendMessage();
	}

	// Send message
	function sendMessage() {
		const message = inputValue.trim();
		if (message && !disabled) {
			dispatch('send', message);
			inputValue = '';
			resetTextareaHeight();
		}
	}

	// Handle keyboard shortcuts
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			if (event.shiftKey) {
				// Shift+Enter = new line (default behavior)
				return;
			} else {
				// Enter = send message
				event.preventDefault();
				sendMessage();
			}
		}
	}

	// Auto-resize textarea
	function handleInput() {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
			textareaElement.style.height = textareaElement.scrollHeight + 'px';
		}
	}

	// Reset textarea height
	function resetTextareaHeight() {
		if (textareaElement) {
			textareaElement.style.height = 'auto';
		}
	}
</script>

<div class="input-container">
	<form on:submit={handleSubmit} class="input-form">
		<div class="input-wrapper">
			<textarea
				bind:this={textareaElement}
				bind:value={inputValue}
				{placeholder}
				{disabled}
				rows="1"
				on:keydown={handleKeydown}
				on:input={handleInput}
				class="message-input"
			></textarea>

			{#if disabled}
				<div class="loading-button" title="Sending...">
					<span class="loading-icon">⏳</span>
				</div>
			{:else}
				<IconButton
					name="plus"
					variant="primary"
					type="submit"
					disabled={disabled || !inputValue.trim()}
					alt="Send message (Enter)"
					size={24}
					handleClick={sendMessage}
				/>
			{/if}
		</div>

		<div class="input-hint">
			<span class="hint-text"> Press Enter to send, Shift+Enter for new line </span>
		</div>
	</form>
</div>

<style>
	.input-container {
		background: rgba(var(--bg-inverse) / 1);
		padding: 1rem 1.5rem;
	}

	.input-form {
		width: 100%;
	}

	.input-wrapper {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		background: rgb(var(--bg-primary));
		border: 1px solid var(--input-border, #e9ecef);
		border-radius: var(--bdr-radius-small);
		padding: 0.75rem 1rem;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.input-wrapper:focus-within {
		/* border-color: var(--primary-color, #007bff);
		box-shadow: inset 0 0 3px var(--primary-color-alpha, rgba(0, 123, 255, 1)); */
	}

	.message-input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		resize: none;
		font-size: 0.9375rem;
		line-height: 1.5;
		color: rgba(var(--fg-text-inverse) / 1);
		min-height: 24px;
		max-height: 120px;
		overflow-y: auto;
		font-family: var(--font-family-main);
	}

	.message-input::placeholder {
		color: rgba(var(--fg-text-inverse) / 0.6);
	}

	.message-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.loading-button {
		background: var(--primary-color, #007bff);
		color: white;
		border: none;
		border-radius: var(--bdr-radius-small);
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: not-allowed;
		flex-shrink: 0;
		opacity: 0.6;
	}

	.loading-icon {
		font-size: 1rem;
		line-height: 1;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.input-hint {
		margin-top: 0.5rem;
		text-align: center;
	}

	.hint-text {
		font-size: 0.75rem;
		color: var(--text-muted, #999);
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.input-container {
			padding: 1rem;
		}

		.input-wrapper {
			padding: 0.625rem 0.875rem;
		}

		.loading-button {
			width: 36px;
			height: 36px;
		}

		.loading-icon {
			font-size: 0.875rem;
		}

		.hint-text {
			font-size: 0.6875rem;
		}
	}
</style>

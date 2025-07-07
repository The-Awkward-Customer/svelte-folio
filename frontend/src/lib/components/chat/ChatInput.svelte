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
	let inputContainer: HTMLDivElement;

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

	// Handle focus - scroll input into view on mobile
	function handleFocus() {
		if (inputContainer && 'scrollIntoView' in inputContainer) {
			// Delay to allow for keyboard animation
			setTimeout(() => {
				inputContainer.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest',
					inline: 'nearest'
				});
			}, 300);
		}
	}

	// Handle blur - optional cleanup
	function handleBlur() {
		// Optional: Reset any keyboard-specific adjustments
		// Currently no specific actions needed on blur
	}
</script>

<div class="input-container" bind:this={inputContainer}>
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
				on:focus={handleFocus}
				on:blur={handleBlur}
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
		flex-shrink: 0; /* Prevent input from shrinking */
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
		/* Prevent zoom on input focus (iOS) - minimum 16px font size */
		font-size: max(16px, 0.9375rem);
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

	/* Responsive adjustments with iOS-specific fixes */
	@media (max-width: 768px) {
		.input-container {
			padding: 1rem;
			/* Account for safe areas on mobile */
			padding-left: max(1rem, env(safe-area-inset-left));
			padding-right: max(1rem, env(safe-area-inset-right));
			/* Critical: Add bottom padding to lift above browser chrome */
			padding-bottom: max(1rem, env(safe-area-inset-bottom), var(--keyboard-height, 0px));
			/* Ensure input container is always visible */
			position: relative;
			z-index: 10;
		}

		.input-wrapper {
			padding: 0.625rem 0.875rem;
			/* Ensure minimum touch target */
			min-height: 44px;
		}

		.message-input {
			/* Maintain 16px minimum to prevent zoom */
			font-size: max(16px, 0.875rem);
		}

		.loading-button {
			width: 36px;
			height: 36px;
			/* Ensure minimum touch target */
			min-width: 44px;
			min-height: 44px;
		}

		.loading-icon {
			font-size: 0.875rem;
		}

		.hint-text {
			font-size: 0.6875rem;
		}
	}

	/* Support for older browsers without env() */
	@supports not (padding: env(safe-area-inset-left)) {
		@media (max-width: 768px) {
			.input-container {
				padding-left: 1rem;
				padding-right: 1rem;
				padding-bottom: 1.5rem; /* Extra padding for iOS Safari */
			}
		}
	}
</style>

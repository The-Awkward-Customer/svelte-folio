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

			<IconButton
				name="arrow_up"
				variant="inverse"
				type="submit"
				disabled={!inputValue.trim()}
				isLoading={disabled}
				alt="Send message (Enter)"
				size={24}
				handleClick={sendMessage}
			/>
		</div>

		<div class="input-hint">
			<span class="hint-text"> Press Enter to send, Shift+Enter for new line </span>
		</div>
	</form>
</div>

<style>
	.input-container {
		padding: 1rem 0;
		width: 100%;
		max-width: 800px; /* Limit width for better readability */
	}

	.input-form {
		width: 100%;
	}

	.input-wrapper {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		background: var(--bg-primary);
		border: 1px solid #e9ecef;
		border-radius: var(--bdr-radius-pill);
		padding: var(--space-base) var(--space-2xl);
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.input-wrapper:focus-within {
		outline: 2px solid var(--focus-ring-color, var(--bg-primary));
		outline-offset: 2px;
	}

	.message-input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		resize: none;
		/* Prevent zoom on input focus (iOS) - minimum 16px font size */
		font-size: var(--fs-350);
		line-height: 1.5;
		color: var(--fg-text-inverse);
		min-height: 24px;
		max-height: 120px;
		overflow-y: auto;
		font-family: var(--font-family-main);
	}

	.message-input::placeholder {
		color: var(--fg-text-inverse-60);
	}

	.message-input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.input-hint {
		padding-top: var(--space-md);
		text-align: center;
	}

	.hint-text {
		font-family: var(--font-family-alt);
		font-size: var(--fs-300);
		color: var(--fg-text-primary-60);
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

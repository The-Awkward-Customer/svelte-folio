<!-- Message display area -->

<script lang="ts">
	import ChatMessage from './ChatMessage.svelte';
	import type { ChatMessagesProps } from '$lib/types/chat.js';

	// Props with proper typing
	export let messages: ChatMessagesProps['messages'] = [];
	export let isLoading: ChatMessagesProps['isLoading'] = false;
	export let error: ChatMessagesProps['error'] = null;

	let messagesContainer: HTMLElement;
	let userHasScrolledUp = false;

	// Scroll lock mechanism to prevent auto-scroll interference
	let scrollLockActive = false;
	let scrollLockTimeout: ReturnType<typeof setTimeout>;

	// Enhanced scroll tracking
	let lastScrollTop = 0;
	let scrollDirection: 'up' | 'down' | 'none' = 'none';

	// Message tracking for precise change detection
	let previousMessageCount = 0;
	let lastMessageId = '';

	// Set scroll lock to prevent auto-scroll during manual scrolling
	function setScrollLock() {
		scrollLockActive = true;
		clearTimeout(scrollLockTimeout);

		scrollLockTimeout = setTimeout(() => {
			scrollLockActive = false;
		}, 1000); // 1 second protection
	}

	// Enhanced scroll position checking with direction tracking
	function checkScrollPosition() {
		if (!messagesContainer) return;

		const { scrollTop, scrollHeight, clientHeight } = messagesContainer;

		// Detect scroll direction
		scrollDirection =
			scrollTop > lastScrollTop ? 'down' : scrollTop < lastScrollTop ? 'up' : 'none';

		// Update user scroll state
		const threshold = 100; // pixels from bottom
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

		userHasScrolledUp = distanceFromBottom > threshold;
		lastScrollTop = scrollTop;
	}

	// Handle scroll events with immediate position checking
	function handleScroll() {
		if (!messagesContainer) return;

		// Immediate position check (no setTimeout delay)
		checkScrollPosition();

		// Set scroll lock to prevent auto-scroll interference
		setScrollLock();
	}

	// Smooth scroll to bottom using requestAnimationFrame
	function smoothScrollToBottom() {
		if (!messagesContainer) return;

		requestAnimationFrame(() => {
			if (messagesContainer) {
				messagesContainer.scrollTop = messagesContainer.scrollHeight;
			}
		});
	}

	// Handle new message arrival with user intent awareness
	function handleNewMessage() {
		if (!messagesContainer || scrollLockActive) return;

		// Always scroll for new messages (as per user requirement)
		smoothScrollToBottom();
	}

	// Handle loading state changes
	function handleLoadingStateChange() {
		if (!messagesContainer || scrollLockActive) return;

		// Only auto-scroll for loading if user is near bottom
		if (!userHasScrolledUp) {
			smoothScrollToBottom();
		}
	}

	// Track new messages by count and ID for precise detection
	$: if (messages.length > previousMessageCount) {
		const newMessage = messages[messages.length - 1];
		if (newMessage?.id !== lastMessageId) {
			handleNewMessage();
			lastMessageId = newMessage.id;
		}
		previousMessageCount = messages.length;
	}

	// Handle loading state changes separately
	$: if (messagesContainer && isLoading !== undefined) {
		handleLoadingStateChange();
	}
</script>

<div class="messages-container" bind:this={messagesContainer} on:scroll={handleScroll}>
	{#if messages.length === 0 && !isLoading}
		<div class="welcome-message">
			<div class="welcome-content">
				<h3>Hello</h3>
				<p>
					I'm here to help answer questions about my background, skills, and experience. Feel free
					to ask me anything!
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
	{/if}

	{#each messages as message (message.id)}
		<ChatMessage {message} />
	{/each}

	{#if isLoading}
		<div class="loading-message">
			<div class="loading-avatar">🤖</div>
			<div class="loading-content">
				<div class="typing-indicator">
					<span></span>
					<span></span>
					<span></span>
				</div>
				<p class="loading-text">Thinking...</p>
			</div>
		</div>
	{/if}

	{#if error}
		<div class="error-message">
			<div class="error-content">
				<span class="error-icon">⚠️</span>
				<div>
					<p class="error-title">Something went wrong</p>
					<p class="error-details">{error}</p>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.messages-container {
		flex: 1;
		overflow-y: auto;
		padding: 0;
		min-height: 0; /* Ensures flex item can shrink below content size */
		/* Remove scroll-behavior: smooth to prevent interference with manual scrolling */
	}

	.welcome-message {
		padding: 2rem 1.5rem;
		text-align: center;
		color: rgb(var(--fg-text-primary));
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

	.loading-message {
		display: flex;
		gap: 0.75rem;
		padding: 1rem 1.5rem;
		align-items: flex-start;
	}

	.loading-avatar {
		width: 32px;
		height: 32px;
		background: var(--primary-color, #007bff);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.875rem;
		flex-shrink: 0;
	}

	.loading-content {
		flex: 1;
		max-width: calc(100% - 50px);
	}

	.typing-indicator {
		display: flex;
		gap: 4px;
		margin-bottom: 0.5rem;
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

	/* Responsive adjustments */
	@media (max-width: 768px) {
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

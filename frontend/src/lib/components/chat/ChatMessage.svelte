<!-- Individual message component -->

<script lang="ts">
	import type { ChatMessageProps } from '$lib/types/chat.js';

	// Props with proper typing
	export let message: ChatMessageProps['message'];

	// Format timestamp
	function formatTime(date: Date): string {
		return date.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="message {message.type}">
	<div class="message-avatar">
		{#if message.type === 'user'}
			👤
		{:else}
			🤖
		{/if}
	</div>

	<div class="message-content">
		<div class="message-bubble">
			<p>{message.content}</p>
		</div>
		<div class="message-meta">
			<span class="message-time">{formatTime(message.timestamp)}</span>
		</div>
	</div>
</div>

<style>
	.message {
		display: flex;
		gap: 0.75rem;
		padding: 0.75rem 1.5rem;
		align-items: flex-start;
	}

	.message.user {
		flex-direction: row-reverse;
	}

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

	.message.user .message-avatar {
		background: rgb(var(--bg-primary));
		color: rgb(var(--fg-primary));
	}

	.message.assistant .message-avatar {
		background: var(--assistant-color, #f3e5f5);
		color: var(--assistant-text, #7b1fa2);
	}

	.message-content {
		flex: 1;
		max-width: calc(100% - 50px);
	}

	.message.user .message-content {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	.message-bubble {
		background: rgb(var(--bg-primary));
		border-radius: 18px;
		padding: 0.75rem 1rem;
		max-width: 100%;
		word-wrap: break-word;
		position: relative;
	}

	.message.user .message-bubble {
		background: rgb(var(--bg-primary));
		color: rgb(var(--fg-text-inverse));
		border-radius: var(--bdr-radius-small) var(--bdr-radius-small) 0px var(--bdr-radius-small);
	}

	.message.assistant .message-bubble {
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

	.message-meta {
		margin-top: 0.25rem;
		padding: 0 0.25rem;
	}

	.message-time {
		font-size: 0.75rem;
		color: var(--text-muted, #888);
		opacity: 0.7;
	}

	.message.user .message-time {
		color: var(--user-meta, #666);
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
	}
</style>

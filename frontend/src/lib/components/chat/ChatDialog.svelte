<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { ChatDialogProps, ChatDialogEvents } from '$lib/types/chat.js';

	// Props with proper typing
	export let isOpen: ChatDialogProps['isOpen'] = false;

	// Event dispatcher with proper typing
	const dispatch = createEventDispatcher<ChatDialogEvents>();

	// Handle backdrop click
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			dispatch('close');
		}
	}

	// Handle escape key
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			dispatch('close');
		}
	}

	// Prevent background scrolling when dialog is open
	$: if (typeof document !== 'undefined') {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	}
</script>

<!-- Custom dialog wrapper -->\

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div
		class="dialog-backdrop"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="chat-title"
	>
		<div class="dialog-content">
			<slot />
		</div>
	</div>
{/if}

<style>
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
		animation: fadeIn 0.2s ease-out;
	}

	.dialog-content {
		background: rgb(var(--bg-inverse));
		border-radius: var(--bdr-radius-small);
		width: 600px;
		max-width: 600px;
		max-height: 80vh;
		overflow: hidden;
		animation: slideIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(-20px) scale(0.95);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* Mobile responsive */
	@media (max-width: 768px) {
		.dialog-backdrop {
			padding: 0.5rem;
			align-items: flex-end;
		}

		.dialog-content {
			width: 95vw;
			max-width: 100%;
			max-height: 90vh;
			border-radius: 12px 12px 0 0;
			animation: slideUp 0.3s ease-out;
		}
	}

	@keyframes slideUp {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}
</style>

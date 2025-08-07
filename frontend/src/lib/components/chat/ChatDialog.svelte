<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import type { ChatDialogProps, ChatDialogEvents } from '$lib/types/chat.js';

	export let isOpen: ChatDialogProps['isOpen'] = false;

	const dispatch = createEventDispatcher<ChatDialogEvents>();

	let savedScrollY = 0;
	let dialogElement: HTMLDialogElement;
	let isAnimating = false;

	// Simplified keyboard detection
	function handleViewportChange() {
		if (typeof window !== 'undefined' && window.visualViewport) {
			const keyboardHeight = Math.max(0, window.innerHeight - window.visualViewport.height);
			document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
		}
	}

	// Consolidated event handlers
	function handleDialogClick(event: MouseEvent) {
		if (event.target === dialogElement) {
			dispatch('close');
		}
	}

	function handleDialogKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			dispatch('close');
		}
	}

	// Enhanced dialog state management with animation timing
	$: if (dialogElement) {
		if (isOpen && !dialogElement.open) {
			dialogElement.showModal();
			// Trigger animation after dialog is mounted
			setTimeout(() => {
				isAnimating = true;
			}, 6);
		} else if (!isOpen && dialogElement.open) {
			isAnimating = false;
			// Wait for animation to complete before closing
			setTimeout(() => {
				if (!isOpen) {
					dialogElement.close();
				}
			}, 6);
		}
	}

	// Simplified scroll lock
	$: if (typeof document !== 'undefined') {
		if (isOpen) {
			savedScrollY = window.scrollY;
			document.body.style.cssText = `
				overflow: hidden;
				position: fixed;
				width: 100%;
				top: -${savedScrollY}px;
			`;
		} else {
			document.body.style.cssText = '';
			if (savedScrollY) {
				window.scrollTo(0, savedScrollY);
			}
		}
	}

	// Minimal setup/cleanup
	onMount(() => {
		if (typeof window !== 'undefined' && window.visualViewport) {
			window.visualViewport.addEventListener('resize', handleViewportChange);
			handleViewportChange();
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined' && window.visualViewport) {
			window.visualViewport.removeEventListener('resize', handleViewportChange);
			document.documentElement.style.removeProperty('--keyboard-height');
		}
	});
</script>

<dialog
	bind:this={dialogElement}
	class="chat-dialog"
	class:animating={isAnimating}
	aria-labelledby="chat-title"
	on:click={handleDialogClick}
	on:keydown={handleDialogKeydown}
>
	<div class="dialog-content" role="none">
		<slot />
	</div>
</dialog>

<style>
	/* Mobile-first base styles */
	.chat-dialog {
		border: none;
		background: transparent;
		max-width: none;
		max-height: none;
		width: 100%;
		height: 100%;
		padding: 0;
		animation: fadeIn 0.4s ease-in-out;
	}

	.chat-dialog::backdrop {
		background: var(--bg-page-20);
		backdrop-filter: blur(4px);
		animation: backdropFadeIn 0.5s ease-in-out;
	}

	.chat-dialog[open] {
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	/* Unified dialog content - consistent across all screen sizes */
	.dialog-content {
		background: var(--bg-page);
		width: 100vw;
		max-width: 100%;
		/* Fixed height for consistency - prevents shrinking during loading */
		height: 80vh;
		max-height: calc(100dvh - var(--keyboard-height, 0px) - env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding-bottom: max(1rem, env(safe-area-inset-bottom));
		padding-inline: env(safe-area-inset-left) env(safe-area-inset-right);
		/* Top inline shadow */
		box-shadow: inset 0 1px 0 0 var(--fg-text-primary);

		/* Enhanced initial position - start below viewport */
		transform: translateY(100%);
		opacity: 0;
		/* Enhanced smooth transition with staggered timing */
		transition:
			transform 0.3s ease-in-out,
			opacity 0.4s ease-in-out;
	}

	/* Enhanced slide in when dialog opens and animating */
	.chat-dialog.animating .dialog-content {
		transform: translateY(0);
		opacity: 1;
	}

	/* Enhanced Animations */
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes backdropFadeIn {
		from {
			opacity: 0;
			backdrop-filter: blur(0px);
		}
		to {
			opacity: 1;
			backdrop-filter: blur(4px);
		}
	}

	/* Desktop and larger screens - maintain consistent behavior */
	@media (min-width: 769px) {
		.dialog-content {
			/* Keep consistent height and transition behavior */
			height: 80vh;
			padding-bottom: 0;
			padding-inline: 0;
		}
	}
</style>

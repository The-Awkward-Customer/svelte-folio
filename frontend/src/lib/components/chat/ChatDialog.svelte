<script lang="ts">
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';
	import type { ChatDialogProps, ChatDialogEvents } from '$lib/types/chat.js';

	// Props with proper typing
	export let isOpen: ChatDialogProps['isOpen'] = false;

	// Event dispatcher with proper typing
	const dispatch = createEventDispatcher<ChatDialogEvents>();

	// State for mobile keyboard handling
	let keyboardHeight = 0;
	let savedScrollY = 0;

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

	// Enhanced scroll prevention with position fixed
	$: if (typeof document !== 'undefined') {
		if (isOpen) {
			// Save current scroll position
			savedScrollY = window.scrollY;

			// Prevent background scrolling with position fixed
			document.body.style.overflow = 'hidden';
			document.body.style.position = 'fixed';
			document.body.style.width = '100%';
			document.body.style.top = `-${savedScrollY}px`;
		} else {
			// Restore scrolling and position
			document.body.style.overflow = '';
			document.body.style.position = '';
			document.body.style.width = '';
			document.body.style.top = '';

			// Restore scroll position
			if (savedScrollY) {
				window.scrollTo(0, savedScrollY);
			}
		}
	}

	// Enhanced Visual Viewport API for keyboard detection with iOS fallbacks
	function handleViewportChange() {
		if (typeof window !== 'undefined') {
			let newKeyboardHeight = 0;

			if (window.visualViewport) {
				// Standard Visual Viewport API
				newKeyboardHeight = window.innerHeight - window.visualViewport.height;
			} else {
				// Fallback for iOS Safari issues - detect significant height changes
				const currentHeight = window.innerHeight;
				const initialHeight = window.screen.height;
				// Account for browser chrome (typically 44px bottom + 44px top on iOS)
				const chromeHeight = 88;
				newKeyboardHeight = Math.max(0, initialHeight - currentHeight - chromeHeight);
			}

			keyboardHeight = Math.max(0, newKeyboardHeight);

			// Update CSS custom property for keyboard height
			document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);

			// Also set a flag for keyboard presence
			document.documentElement.style.setProperty('--keyboard-open', keyboardHeight > 0 ? '1' : '0');
		}
	}

	// Additional resize listener for iOS Safari
	function handleWindowResize() {
		// Debounce to avoid excessive calls
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(handleViewportChange, 100);
	}

	let resizeTimeout: ReturnType<typeof setTimeout>;

	// Setup viewport monitoring
	onMount(() => {
		if (typeof window !== 'undefined') {
			// Visual Viewport API (modern browsers)
			if (window.visualViewport) {
				window.visualViewport.addEventListener('resize', handleViewportChange);
			}

			// Window resize fallback for iOS Safari
			window.addEventListener('resize', handleWindowResize);

			// Initial check
			handleViewportChange();
		}
	});

	// Cleanup viewport monitoring
	onDestroy(() => {
		if (typeof window !== 'undefined') {
			if (window.visualViewport) {
				window.visualViewport.removeEventListener('resize', handleViewportChange);
			}
			window.removeEventListener('resize', handleWindowResize);
			clearTimeout(resizeTimeout);
			document.documentElement.style.removeProperty('--keyboard-height');
			document.documentElement.style.removeProperty('--keyboard-open');
		}
	});
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
		display: flex;
		flex-direction: column;
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

	/* Mobile responsive with keyboard handling */
	@media (max-width: 768px) {
		.dialog-backdrop {
			padding: 0;
			align-items: flex-end;
			/* Account for safe areas at top and bottom */
			padding-top: env(safe-area-inset-top, 0px);
			padding-bottom: max(
				env(keyboard-inset-height, 0px),
				var(--keyboard-height, 0px),
				env(safe-area-inset-bottom, 0px),
				0px
			);
		}

		.dialog-content {
			width: 100vw;
			max-width: 100%;
			/* Maximum available height minus safe areas for mobile devices */
			max-height: min(
				calc(100vh - env(safe-area-inset-top, 20px) - env(safe-area-inset-bottom, 20px)),
				calc(100dvh - env(safe-area-inset-top, 20px) - env(safe-area-inset-bottom, 20px)),
				calc(
					100vh - env(keyboard-inset-height, 0px) - var(--keyboard-height, 0px) -
						env(safe-area-inset-top, 20px) - env(safe-area-inset-bottom, 20px)
				),
				calc(100vh - env(safe-area-inset-top, 20px) - env(safe-area-inset-bottom, 20px) - 44px)
					/* Account for iOS chrome */
			);
			min-height: 60vh;
			border-radius: 12px 12px 0 0;
			animation: slideUp 0.3s ease-out;

			/* Ensure content is scrollable when keyboard appears */
			display: flex;
			flex-direction: column;

			/* Account for notches and home indicators */
			padding-bottom: max(1rem, env(safe-area-inset-bottom));
			padding-left: env(safe-area-inset-left);
			padding-right: env(safe-area-inset-right);
		}
	}

	/* Support for older browsers without env() */
	@supports not (padding: env(safe-area-inset-bottom)) {
		@media (max-width: 768px) {
			.dialog-backdrop {
				padding-bottom: 44px; /* iOS Safari bottom toolbar */
			}

			.dialog-content {
				padding-bottom: 1rem;
				/* Maximum available height minus safe areas fallback */
				max-height: calc(100vh - 40px); /* 20px top + 20px bottom safe area fallback */
				min-height: 60vh;
				display: flex;
				flex-direction: column;
			}
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

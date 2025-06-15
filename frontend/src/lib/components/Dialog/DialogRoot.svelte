<!-- DialogRoot.svelte -->
<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import { dialogManager } from '$lib/stores/dialogManager';
	import { browser } from '$app/environment'; // Import browser

	import FreshaDialog from './FreshaDialog.svelte';
	import ShellDialog from './ShellDialog.svelte';

	// Reactive statement to check if this dialog should be active
	$: isActive = $dialogManager.activeDialogId !== null;

	// Function to close the dialog via the store
	function handleClose() {
		dialogManager.closeDialog();
	}

	const FOCUSABLE_SELECTOR =
		'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), details, [tabindex]:not([tabindex="-1"])';

	let dialogRootElement: HTMLDivElement; // Reference to the dialog container

	// Function to handle keydown events
	function handleKeydown(event: KeyboardEvent) {
		if (!isActive) return;

		if (event.key === 'Escape') {
			handleClose();
			return; // Important: return after handling escape
		}

		if (event.key === 'Tab') {
			if (!dialogRootElement) return;

			const focusableElements = Array.from(
				dialogRootElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
			);

			if (focusableElements.length === 0) {
				event.preventDefault(); // No focusable elements, prevent tabbing out
				return;
			}

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			// Access document only in the browser
			let currentlyFocusedElement: HTMLElement | null = null;
			if (browser) {
				currentlyFocusedElement = document.activeElement as HTMLElement;
			}

			if (event.shiftKey) {
				// Shift + Tab
				if (
					!currentlyFocusedElement ||
					currentlyFocusedElement === firstElement ||
					!dialogRootElement.contains(currentlyFocusedElement)
				) {
					event.preventDefault();
					lastElement.focus();
				}
			} else {
				// Tab
				if (
					!currentlyFocusedElement ||
					currentlyFocusedElement === lastElement ||
					!dialogRootElement.contains(currentlyFocusedElement)
				) {
					event.preventDefault();
					firstElement.focus();
				}
			}
			// Allow natural tab flow within the dialog if not first/last element
		}
	}

	// Add event listener on mount
	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	// Remove event listener on destroy
	onDestroy(() => {
		if (browser) {
			// Add browser check
			window.removeEventListener('keydown', handleKeydown);
			// Ensure body scroll is restored if component is destroyed while dialog is open
			if (document.body.classList.contains('dialog-open')) {
				document.body.classList.remove('dialog-open');
			}
		}
	});

	// Freeze body scroll and manage focus when dialog is active
	$: {
		if (browser) {
			// Replace typeof check with browser check
			document.body.classList.toggle('dialog-open', isActive);

			if (isActive) {
				// Wait for DOM update, then set focus
				tick().then(() => {
					const closeButton = dialogRootElement?.querySelector<HTMLElement>('#dialog-close-button');
					closeButton?.focus();
					// Fallback if button not found (though it should be)
					if (!closeButton) {
						const firstFocusable =
							dialogRootElement?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
						firstFocusable?.focus();
					}
				});
			}
		}
	}
</script>

{#if isActive}
	<!-- Backdrop: Full screen, closes dialog on click -->
	<button class="dialog-backdrop" on:click={handleClose} aria-label="Close dialog"></button>

	<!-- Content Area: Centered on top of backdrop -->
	<div class="dialog-root" bind:this={dialogRootElement}>
		{#if $dialogManager.activeDialogId === 'freshaDialog'}
			<FreshaDialog />
		{:else if $dialogManager.activeDialogId === 'shellDialog'}
			<ShellDialog />
		{/if}
	</div>
{/if}

<style>
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--bg-overlay);
		z-index: 999;
		border: none;
		padding: 0;
		cursor: default;
	}

	.dialog-root {
		position: fixed; /* Position independently */
		top: 50%; /* Center vertically */
		left: 50%; /* Center horizontally */
		transform: translate(-50%, -50%); /* Adjust for element size */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		background-color: rgb(var(--color-bg-primary));
		border-radius: var(--bdr-radius-medium);
		width: calc(100vw - 4rem);
		height: calc(100vh - 4rem);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		z-index: 1000; /* Above backdrop */
		overflow-y: auto; /* Enable vertical scrolling for content */
	}

	/* Add more specific styling as needed */

	/* Global style to prevent body scroll when dialog is open */
	:global(body.dialog-open) {
		overflow: hidden;
	}

	@media (max-width: 896px) {
		.dialog-root {
			width: calc(100vw - 2rem);
			height: calc(100vh - 2rem);
		}
	}
</style>

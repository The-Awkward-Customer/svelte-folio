<!-- DialogRoot.svelte -->
<script>
	import { dialogManager } from '$lib/stores/dialogManager';
    import DialogHeader from '$lib/components/modals/DialogHeader.svelte';
    import DialogContent from '$lib/components/modals/DialogContent.svelte';
    import DialogDetails from '$lib/components/modals/DialogDetails.svelte';
    import DialogAnimatedBackground from '$lib/components/modals/DialogAnimatedBackground.svelte';
    import DialogSection from '$lib/components/modals/DialogSection.svelte';
	// Define the ID for this specific dialog instance
	const DIALOG_ID = 'mainPageDialog';

    $: console.log("dialogRoot store check: ", $dialogManager, 'Is active: ', $dialogManager.activeDialogId === DIALOG_ID);

	// Reactive statement to check if this dialog should be active
	$: isActive = $dialogManager.activeDialogId === DIALOG_ID;

	// Function to close the dialog via the store
	function handleClose() {
		dialogManager.closeDialog();
	}
</script>

{#if isActive}
	<!-- Backdrop: Full screen, closes dialog on click -->
	<button class="dialog-backdrop" on:click={handleClose} aria-label="Close dialog"></button>

	<!-- Content Area: Centered on top of backdrop -->
	<div class="dialog-content">
		<DialogAnimatedBackground />
		<DialogHeader focus="Design Systems | Product Design | Team Leadership" />
		<DialogContent/>
		<DialogDetails/>
		<DialogSection/>
	</div>
{/if}

<style>
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999; /* Below content */
		/* Removed display flex properties */
		border: none; /* Optional: Remove button default border */
		padding: 0; /* Optional: Remove button default padding */
		cursor: default; /* Optional: Keep default cursor */
	}

	.dialog-content {
		position: fixed; /* Position independently */
		top: 50%; /* Center vertically */
		left: 50%; /* Center horizontally */
		transform: translate(-50%, -50%); /* Adjust for element size */
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		background-color: rgb(var(--color-bg-primary));
		border-radius: var(--bdr-radius-large);
		width: calc(100vw - 2rem);
		height: calc(100vh - 2rem);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		color: #333; /* Ensure text is visible */
		z-index: 1000; /* Above backdrop */
		/* pointer-events: auto; /* Allow interactions with content (removed 'none') */
		/* Note: pointer-events:auto is the default, so explicitly removing 'pointer-events: none' is sufficient */
	}

	/* Add more specific styling as needed */
</style>
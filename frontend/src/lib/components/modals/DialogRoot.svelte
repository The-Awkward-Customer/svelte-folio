<!-- DialogRoot.svelte -->
<script>
	import { dialogManager } from '$lib/stores/dialogManager';
	import Button from '$lib/components/actions/Button.svelte'; // Assuming a general Button component exists

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
	<button class="dialog-backdrop" on:click={handleClose}>
		<div class="dialog-content">
			<h2>Dialog Title</h2>
			<p>This is the content of the dialog.</p>
			<p>State received: {JSON.stringify($dialogManager.dialogState)}</p>
			<Button variant="secondary" on:click={handleClose}>Close Dialog</Button>
			<!-- Add more dialog content/structure here -->
		</div>
	</button>
{/if}

<style>
	.dialog-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000; /* Ensure it's above other content */
	}

	.dialog-content {
		background-color: white;
		padding: 2rem;
		border-radius: 8px;
		min-width: 300px;
		max-width: 80%;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		color: #333; /* Ensure text is visible on white background */
	}

	/* Add more specific styling as needed */
</style>
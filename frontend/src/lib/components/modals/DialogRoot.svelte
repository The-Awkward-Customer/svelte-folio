<!-- DialogRoot.svelte -->
<script>
	import { dialogManager } from '$lib/stores/dialogManager';
    import DialogHeader from '$lib/components/modals/DialogHeader.svelte';
    import DialogContent from '$lib/components/modals/DialogContent.svelte';
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
			<DialogHeader title="Dialog Title" />
            <DialogContent> 
                <p>This is the content of the dialog.</p>
            </DialogContent>
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
		z-index: 999; /* Ensure it's above other content */
	}

	.dialog-content {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
		background-color: white;
		border-radius: 8px;
		width:calc(100vw - 2rem);
        height:calc(100vh - 2rem);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		color: #333; /* Ensure text is visible on white background */
        z-index: 1000;
        pointer-events: none;
	}

	/* Add more specific styling as needed */
</style>
<!-- DialogFooter.svelte -->

<script lang="ts">
	import { dialogManager } from '$lib/stores/dialogManager.svelte.js';
	import { COMPOSED_DIALOGS, DIALOG_METADATA } from '$lib/config/dialogRegistry.js';
	import type { GridArea } from './DialogSection.svelte';
	import Button from '../actions/Button.svelte';
	import ProgressToast from '../feedback/ProgressToast.svelte';
	import IconButton from '../actions/IconButton.svelte';

	interface DialogFooterProps {
		label?: string;
		gridArea?: GridArea;
		variant?: 'ghost' | 'strong';
	}

	const {
		label = 'Close Dialog',
		gridArea = 'footer',
		variant = 'strong'
	}: DialogFooterProps = $props();

	// Reactive button states
	const canContinue = $derived(!dialogManager.cycleCompleted);
	const nextDialogId = $derived(dialogManager.getNextDialog());
	const nextDialogTitle = $derived(nextDialogId ? DIALOG_METADATA[nextDialogId]?.title : null);
	const rightButtonText = $derived(
		dialogManager.cycleCompleted
			? 'Lets chat ❤️'
			: nextDialogTitle
				? `${nextDialogTitle}`
				: 'Next Case Study'
	);
	const availableDialogsCount = $derived(
		COMPOSED_DIALOGS.length - dialogManager.state.failedDialogs.size
	);

	function handleLeftButtonClick() {
		// Left button maintains existing close behavior
		dialogManager.closeDialog();
	}

	function handleRightButtonClick() {
		if (dialogManager.cycleCompleted) {
			// All available dialogs have been cycled through
			dialogManager.closeDialog();

			// Functional tracking - log completion event locally
			console.log('Dialog cycle completed!', {
				timestamp: new Date().toISOString(),
				totalDialogs: COMPOSED_DIALOGS.length,
				completedHistory: dialogManager.dialogHistory,
				failedDialogs: Array.from(dialogManager.state.failedDialogs),
				availableDialogs: availableDialogsCount,
				sessionDetails: {
					cycleStartTime: dialogManager.getCycleStartTime(),
					cycleEndTime: Date.now(),
					totalTimeSpent: Date.now() - dialogManager.getCycleStartTime()
				}
			});

			// Trigger completion flow (ready for future view transition)
			triggerCycleCompletionFlow();
		} else {
			// Core cycling behavior: close current, open next
			const success = dialogManager.cycleToNextDialog();

			if (!success) {
				console.warn('Failed to cycle to next dialog');
				// Could show user feedback here if needed
			}
		}
	}

	// Placeholder for future view transition logic
	function triggerCycleCompletionFlow() {
		// This function will be replaced with actual view navigation
		console.log('🎉 Triggering cycle completion flow - ready for view transition');

		// Future implementation will navigate to new view
		// For now, provide hook point for next development phase
	}

	// Simple keyboard shortcuts for dev mode
	function handleKeyDown(event: KeyboardEvent) {
		if (!import.meta.env.DEV) return;

		// Dev reset: Ctrl+Shift+R
		if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			console.log('🔄 Dev reset triggered via Ctrl+Shift+K');
			dialogManager.devReset();
		}

		// Quick close: Escape
		if (event.key === 'Escape') {
			event.preventDefault();
			console.log('🚪 Dialog closed via Escape key');
			dialogManager.closeDialog();
		}

		// Next dialog: Ctrl+N
		if (event.ctrlKey && event.key.toLowerCase() === 'n') {
			event.preventDefault();
			console.log('⏭️ Next dialog triggered via Ctrl+N');
			handleRightButtonClick();
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<!-- // A snippet that displays if the cycle is completed that is renders above the button -->

{#snippet SuccessMessage()}
	{#if dialogManager.cycleCompleted}
		<div class="dialog-completion-message">
			<p>All available case studies have been cycled through.</p>
			<p>Click the button below to start a new conversation.</p>
		</div>
	{/if}
{/snippet}

<div class="footer-section-root" style:--grid-area={gridArea}>
	<!-- Progress Toast Component -->
	<ProgressToast
		currentProgress={dialogManager.dialogHistory.length}
		totalItems={availableDialogsCount}
		hasErrors={dialogManager.hasErrors}
		errorCount={dialogManager.state.failedDialogs.size}
		label="Total"
		showProgressBar={true}
		animateOnView={true}
	/>
	<div class="footer-section-content">
		{@render SuccessMessage()}

		<Button
			as="button"
			label={rightButtonText}
			variant="inverse"
			handleClick={handleRightButtonClick}
			fullWidth={true}
		/>
	</div>
</div>

<style>
	.footer-section-root {
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center;
		align-items: stretch;
		gap: 1rem;
		/* Visual debugging - pink background with opacity */
		/* background-color: rgba(255, 192, 203, 0.3);
		border: 2px solid rgba(255, 192, 203, 0.6); */
		grid-area: var(--grid-area);
	}

	.footer-section-content {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 1rem;
		width: 100%;
	}

	.dialog-completion-message {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		gap: 0.5em;
		font-size: var(--fs-200);
		color: rgb(var(--color-txt-primary));
		text-align: center;
		padding: 1em;
		background-color: rgba(var(--bg-inverse) / 0.8);
		border-radius: var(--bdr-radius-small);
		box-shadow: inset 0 0 0 1px rgba(var(--bdr-primary) / 1);
	}

	/* Desktop breakpoint at 896px */
	@media (min-width: 896px) {
		.footer-section-root {
			flex-direction: row;
			justify-content: flex-end;
			align-items: flex-end;
		}

		.footer-section-content {
			flex-direction: column;
			justify-content: stretch;
			gap: 0.5em;
		}
	}
</style>

<!-- DialogFooter.svelte -->

<script lang="ts">
  import { goto } from '$app/navigation';
  import { dialogManager } from '$lib';
  import {
    COMPOSED_DIALOGS,
    DIALOG_METADATA,
  } from '$lib/config/dialogRegistry.js';
  import type { GridArea } from './DialogSection.svelte';
  import Button from '../actions/Button.svelte';
  import ProgressToast from '../feedback/ProgressToast.svelte';
  import Icon from '../primitives/Icon.svelte';

  interface DialogFooterProps {
    label?: string;
    gridArea?: GridArea;
    variant?: 'ghost' | 'strong';
  }

  const {
    label = 'Close Dialog',
    gridArea = 'footer',
    variant = 'strong',
  }: DialogFooterProps = $props();

  // Reactive button states
  const canContinue = $derived(!dialogManager.cycleCompleted);
  const nextDialogId = $derived(dialogManager.getNextDialog());
  const nextDialogTitle = $derived(
    nextDialogId ? DIALOG_METADATA[nextDialogId]?.title : null
  );
  const rightButtonText = $derived(
    dialogManager.cycleCompleted
      ? 'Lets chat ❤️'
      : nextDialogTitle
        ? `Up Next${nextDialogTitle}`
        : 'Next Case Study'
  );
  const availableDialogsCount = $derived(COMPOSED_DIALOGS.length);

  // Calculate unique dialogs viewed (handles revisits correctly)
  const uniqueDialogsViewed = $derived(
    new Set(dialogManager.dialogHistory).size
  );

  // Calculate progress values for animation
  const currentProgress = $derived(uniqueDialogsViewed);

  // The issue: when switching dialogs, we need to know what the progress was BEFORE adding the new dialog
  // But by the time this component renders, the new dialog is already in the history
  // So we need to look at the history length from before the current dialog was added
  const previousProgress = $derived(
    dialogManager.dialogHistory.length <= 1
      ? undefined
      : new Set(dialogManager.dialogHistory.slice(0, -1)).size
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
        availableDialogs: availableDialogsCount,
        sessionDetails: {
          cycleStartTime: dialogManager.getCycleStartTime(),
          cycleEndTime: Date.now(),
          totalTimeSpent: Date.now() - dialogManager.getCycleStartTime(),
        },
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

  // Navigate to contact page when cycle is complete
  function triggerCycleCompletionFlow() {
    console.log('🎉 Dialog cycle completed - navigating to contact page');

    // Navigate to contact page using SvelteKit's goto
    goto('/contact');
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
      <Icon name="diamond_filled" size={32} fill="--fg-positive" />
      <div>
        <span>COMPLETED</span>
        <p>Click the button below to start a new conversation.</p>
      </div>
    </div>
  {/if}
{/snippet}

<div class="footer-section-root" style:--grid-area={gridArea}>
  <!-- Progress Toast Component -->
  <ProgressToast
    dialogHistory={dialogManager.dialogHistory}
    availableDialogs={COMPOSED_DIALOGS}
    currentDialog={dialogManager.currentDialog}
    label="Progress"
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
    flex-direction: column-reverse;
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
    align-items: center;
    justify-content: flex-start;
    gap: 1em;
    font-size: var(--fs-200);
    color: rgb(var(--color-txt-primary));
    text-align: center;
    padding: 2em;
    background-color: rgba(var(--bg-inverse) / 0.8);
    border-radius: var(--bdr-radius-small);
    box-shadow: inset 0 0 0 1px rgba(var(--bdr-primary) / 0);
  }
  .dialog-completion-message span {
    font-weight: var(--fw-bold);
    font-size: var(--fs-300);
  }
  .dialog-completion-message p {
    font-size: var(--fs-200);
    color: rgba(var(--color-txt-secondary), 0.8);
    margin: 0;
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
      gap: 1em;
    }
  }
</style>

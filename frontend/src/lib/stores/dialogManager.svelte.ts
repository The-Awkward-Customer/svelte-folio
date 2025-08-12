import {
  COMPOSED_DIALOGS,
  type DialogId,
  isValidDialogId,
} from '../config/dialogRegistry.js';
import { createLogger } from '$lib/utils/logger';

const log = createLogger('dialog');

export interface DialogCycleState {
  activeDialogId: DialogId | null;
  dialogHistory: DialogId[];
  hasCompletedCycle: boolean;
}

// Simple sequential dialog selection
function getNextDialogInSequence(currentId: DialogId | null): DialogId | null {
  if (!currentId) {
    return COMPOSED_DIALOGS[0];
  }

  const currentIndex = COMPOSED_DIALOGS.indexOf(currentId);
  const nextIndex = (currentIndex + 1) % COMPOSED_DIALOGS.length;
  return COMPOSED_DIALOGS[nextIndex];
}

// Create dialog manager using Svelte 5 runes
function createDialogManager() {
  // Simple state
  let state = $state<DialogCycleState>({
    activeDialogId: null,
    dialogHistory: [],
    hasCompletedCycle: false,
  });

  // Derived runes
  const currentDialog = $derived(state.activeDialogId);
  const dialogHistory = $derived(state.dialogHistory);
  const cycleCompleted = $derived(state.hasCompletedCycle);
  const isDialogOpen = $derived(state.activeDialogId !== null);

  // Core actions
  const actions = {
    showDialog(dialogId: DialogId): boolean {
      if (!isValidDialogId(dialogId)) {
        log.warn(`Invalid dialog ID: ${dialogId}`);
        return false;
      }

      state.activeDialogId = dialogId;

      // Add to history if not already viewed
      if (!state.dialogHistory.includes(dialogId)) {
        state.dialogHistory = [...state.dialogHistory, dialogId];

        // Check if all dialogs have been viewed
        if (state.dialogHistory.length >= COMPOSED_DIALOGS.length) {
          state.hasCompletedCycle = true;
        }

        // Save to localStorage
        saveToStorage();
      }

      return true;
    },

    closeDialog(): void {
      state.activeDialogId = null;
    },

    getNextDialog(): DialogId | null {
      return getNextDialogInSequence(state.activeDialogId);
    },

    cycleToNextDialog(): boolean {
      const nextDialog = actions.getNextDialog();
      if (!nextDialog) {
        return false;
      }
      return actions.showDialog(nextDialog);
    },

    resetCycle(): void {
      state.activeDialogId = null;
      state.dialogHistory = [];
      state.hasCompletedCycle = false;

      // Clear storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('svelte-folio:dialog-state');
      }
    },

    // Dev reset function
    devReset(): void {
      log.debug('Developer reset triggered');
      actions.resetCycle();
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },

    getCycleStartTime(): number {
      // Simple implementation - just return current time
      return Date.now();
    },
  };

  // Simple storage functions
  function saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'svelte-folio:dialog-state',
          JSON.stringify({
            history: state.dialogHistory,
            completed: state.hasCompletedCycle,
          })
        );
      } catch (e) {
        log.warn('Failed to save dialog state:', e as any);
      }
    }
  }

  function loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('svelte-folio:dialog-state');
        if (saved) {
          const data = JSON.parse(saved);
          state.dialogHistory = data.history || [];
          state.hasCompletedCycle = data.completed || false;
        }
      } catch (e) {
        log.warn('Failed to load dialog state:', e as any);
      }
    }
  }

  // Initialize from storage
  if (typeof window !== 'undefined') {
    loadFromStorage();

    // Expose dev functions in development
    if (import.meta.env.DEV) {
      (window as any).__dialogManager = actions;
      (window as any).__resetDialogs = () => actions.devReset();
    }
  }

  return {
    // State getters
    get currentDialog() {
      return currentDialog;
    },
    get dialogHistory() {
      return dialogHistory;
    },
    get cycleCompleted() {
      return cycleCompleted;
    },
    get isDialogOpen() {
      return isDialogOpen;
    },
    get state() {
      return state;
    },

    // Actions
    ...actions,
  };
}

export const dialogManager = createDialogManager();

// Type for accessing the manager
export type DialogManager = typeof dialogManager;

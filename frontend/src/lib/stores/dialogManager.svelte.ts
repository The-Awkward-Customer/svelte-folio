import { COMPOSED_DIALOGS, type DialogId, isValidDialogId, triggerDevReset } from '../config/dialogRegistry.js';
import { dialogStorage, type DialogInteraction } from '../services/dialogStorage.js';

export interface DialogCycleState {
  activeDialogId: DialogId | null;
  dialogHistory: DialogId[];
  previousDialogId: DialogId | null;
  availableDialogs: readonly DialogId[];
  hasCompletedCycle: boolean;
  dialogState: Record<string, any>;
  isInitialized: boolean;
  cycleStartTime?: number;
  failedDialogs: Set<DialogId>;
  lastError?: string;
}

// Smart dialog selection algorithm with error handling
function selectNextDialog(
  currentId: DialogId | null, 
  previousId: DialogId | null, 
  history: DialogId[],
  failedDialogs: Set<DialogId>
): DialogId | null {
  const availableOptions = COMPOSED_DIALOGS.filter(dialogId => {
    // Exclude current dialog
    if (dialogId === currentId) return false;
    
    // Exclude previous dialog if we have more than 2 options total
    if (COMPOSED_DIALOGS.length > 2 && dialogId === previousId) return false;
    
    // Exclude failed dialogs
    if (failedDialogs.has(dialogId)) return false;
    
    return true;
  });

  if (availableOptions.length === 0) return null;
  
  // If we haven't seen any dialogs yet, start with first available
  if (history.length === 0) {
    return availableOptions[0];
  }
  
  // Prefer dialogs we haven't seen yet
  const unseenDialogs = availableOptions.filter(id => !history.includes(id));
  
  if (unseenDialogs.length > 0) {
    // Randomly select from unseen dialogs
    const randomIndex = Math.floor(Math.random() * unseenDialogs.length);
    return unseenDialogs[randomIndex];
  }
  
  // If all have been seen, randomly select from available options
  const randomIndex = Math.floor(Math.random() * availableOptions.length);
  return availableOptions[randomIndex];
}

// Create dialog manager using Svelte 5 runes
function createDialogManager() {
  const initialState: DialogCycleState = {
    activeDialogId: null,
    dialogHistory: [],
    previousDialogId: null,
    availableDialogs: COMPOSED_DIALOGS,
    hasCompletedCycle: false,
    dialogState: {},
    isInitialized: false,
    cycleStartTime: undefined,
    failedDialogs: new Set(),
    lastError: undefined
  };

  // Main state rune
  let state = $state<DialogCycleState>(initialState);

  // Derived runes for easier component usage
  const currentDialog = $derived(state.activeDialogId);
  const dialogHistory = $derived(state.dialogHistory);
  const cycleCompleted = $derived(state.hasCompletedCycle);
  const isDialogOpen = $derived(state.activeDialogId !== null);
  const hasErrors = $derived(state.failedDialogs.size > 0);

  // Functional tracking
  function logDialogInteraction(
    dialogId: DialogId, 
    action: 'opened' | 'closed' | 'switched' | 'failed',
    error?: string
  ): void {
    const event: DialogInteraction = {
      dialogId,
      action,
      timestamp: Date.now(),
      sessionId: dialogStorage.getCurrentSession(),
      error
    };
    
    // Store interaction locally
    const interactions = dialogStorage.loadInteractionHistory();
    interactions.push(event);
    dialogStorage.saveInteractionHistory(interactions);
    
    console.log('Dialog interaction logged:', event);
  }

  // Core actions
  const actions = {
    showDialog(dialogId: DialogId, dialogState: any = {}): boolean {
      if (!isValidDialogId(dialogId)) {
        console.warn(`Invalid dialog ID: ${dialogId}`);
        return false;
      }

      try {
        // Set cycle start time if this is the first dialog
        if (!state.cycleStartTime && state.dialogHistory.length === 0) {
          const startTime = Date.now();
          state.cycleStartTime = startTime;
          dialogStorage.saveCycleStartTime(startTime);
        }

        state.previousDialogId = state.activeDialogId;
        state.activeDialogId = dialogId;
        state.dialogState = { ...state.dialogState, [dialogId]: dialogState };

        // Log interaction for functional tracking
        logDialogInteraction(dialogId, 'opened');
        
        // Mark as viewed and update history
        actions.markDialogAsViewed(dialogId);
        
        return true;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Failed to show dialog ${dialogId}:`, errorMsg);
        
        // Log error and mark dialog as failed
        state.failedDialogs.add(dialogId);
        state.lastError = errorMsg;
        dialogStorage.logDialogError(dialogId, errorMsg, false);
        logDialogInteraction(dialogId, 'failed', errorMsg);
        
        return false;
      }
    },

    closeDialog(): void {
      try {
        // Log interaction for functional tracking
        if (state.activeDialogId) {
          logDialogInteraction(state.activeDialogId, 'closed');
        }

        state.previousDialogId = state.activeDialogId;
        state.activeDialogId = null;
      } catch (error) {
        console.error('Failed to close dialog:', error);
      }
    },

    switchToDialog(dialogId: DialogId): boolean {
      try {
        // Log switching interaction
        if (state.activeDialogId) {
          logDialogInteraction(state.activeDialogId, 'switched');
        }
        
        return actions.showDialog(dialogId);
      } catch (error) {
        console.error(`Failed to switch to dialog ${dialogId}:`, error);
        return false;
      }
    },

    getNextDialog(): DialogId | null {
      return selectNextDialog(
        state.activeDialogId,
        state.previousDialogId,
        state.dialogHistory,
        state.failedDialogs
      );
    },

    cycleToNextDialog(): boolean {
      const nextDialog = actions.getNextDialog();
      if (!nextDialog) {
        console.warn('No next dialog available for cycling');
        return false;
      }

      const success = actions.switchToDialog(nextDialog);
      if (!success) {
        // If switching failed, try to recover by getting another dialog
        console.log(`Failed to switch to ${nextDialog}, attempting recovery...`);
        const recoveryDialog = actions.getNextDialog();
        if (recoveryDialog && recoveryDialog !== nextDialog) {
          dialogStorage.logDialogError(nextDialog, 'Switch failed, recovered', true);
          return actions.switchToDialog(recoveryDialog);
        }
      }
      
      return success;
    },

    markDialogAsViewed(dialogId: DialogId): void {
      const updatedHistory = state.dialogHistory.includes(dialogId)
        ? state.dialogHistory
        : [...state.dialogHistory, dialogId];

      state.dialogHistory = updatedHistory;
      
      // Check completion - exclude failed dialogs from completion count
      const availableDialogs = COMPOSED_DIALOGS.filter(id => !state.failedDialogs.has(id));
      const hasCompleted = updatedHistory.length >= availableDialogs.length;
      state.hasCompletedCycle = hasCompleted;

      // Persist to storage
      dialogStorage.saveDialogHistory(updatedHistory);
      dialogStorage.saveLastViewed(dialogId);
      
      if (hasCompleted) {
        dialogStorage.saveCycleCompletion(true);
      }
    },

    checkCycleCompletion(): boolean {
      const availableDialogs = COMPOSED_DIALOGS.filter(id => !state.failedDialogs.has(id));
      return state.dialogHistory.length >= availableDialogs.length;
    },

    resetCycle(): void {
      dialogStorage.clearAllStorage();
      
      // Reset to initial state
      Object.assign(state, {
        ...initialState,
        isInitialized: true,
        failedDialogs: new Set()
      });
    },

    // Hidden dev function
    devReset(): void {
      console.log('🔄 Developer reset triggered');
      actions.resetCycle();
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },

    initializeFromStorage(): void {
      try {
        const history = dialogStorage.loadDialogHistory();
        const cycleCompleted = dialogStorage.loadCycleCompletion();
        const lastViewed = dialogStorage.loadLastViewed();
        const cycleStartTime = dialogStorage.loadCycleStartTime();
        const errorLog = dialogStorage.loadErrorLog();

        // Rebuild failed dialogs set from error log
        const failedDialogs = new Set<DialogId>();
        errorLog
          .filter(error => !error.recovered)
          .forEach(error => {
            if (isValidDialogId(error.dialogId)) {
              failedDialogs.add(error.dialogId);
            }
          });

        state.dialogHistory = history.filter(isValidDialogId);
        state.hasCompletedCycle = cycleCompleted;
        state.previousDialogId = (lastViewed && isValidDialogId(lastViewed)) ? lastViewed : null;
        state.cycleStartTime = cycleStartTime || undefined;
        state.failedDialogs = failedDialogs;
        state.isInitialized = true;

        console.log('Dialog manager initialized from storage', {
          history: state.dialogHistory,
          completed: state.hasCompletedCycle,
          failed: Array.from(state.failedDialogs)
        });
      } catch (error) {
        console.error('Failed to initialize from storage:', error);
        state.isInitialized = true; // Mark as initialized even if failed
      }
    },

    getCycleStartTime(): number {
      return state.cycleStartTime || Date.now();
    }
  };

  // Initialize on creation
  if (typeof window !== 'undefined') {
    actions.initializeFromStorage();
    triggerDevReset(); // Setup hidden dev reset
    
    // Expose dev reset globally in development
    if (import.meta.env.DEV) {
      (window as any).__dialogManager = actions;
    }
  }

  return {
    // State getters
    get currentDialog() { return currentDialog; },
    get dialogHistory() { return dialogHistory; },
    get cycleCompleted() { return cycleCompleted; },
    get isDialogOpen() { return isDialogOpen; },
    get hasErrors() { return hasErrors; },
    get state() { return state; },
    
    // Actions
    ...actions
  };
}

export const dialogManager = createDialogManager();

// Type for accessing the manager
export type DialogManager = typeof dialogManager;

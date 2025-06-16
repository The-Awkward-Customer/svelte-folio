// Storage key constants with namespace to avoid conflicts
const STORAGE_KEYS = {
  DIALOG_HISTORY: 'peter-abbott-folio:dialog-history',
  CYCLE_COMPLETED: 'peter-abbott-folio:dialog-cycle-completed', 
  LAST_VIEWED: 'peter-abbott-folio:last-viewed-dialog',
  CURRENT_SESSION: 'peter-abbott-folio:current-session',
  CYCLE_START_TIME: 'peter-abbott-folio:cycle-start-time',
  INTERACTION_HISTORY: 'peter-abbott-folio:interaction-history',
  ERROR_LOG: 'peter-abbott-folio:error-log'
} as const;

export interface DialogStorageData {
  history: string[];
  cycleCompleted: boolean;
  lastViewed: string | null;
  sessionId: string;
  cycleStartTime?: number;
  interactionHistory: DialogInteraction[];
  errorLog: DialogError[];
}

export interface DialogInteraction {
  dialogId: string;
  action: 'opened' | 'closed' | 'switched' | 'failed';
  timestamp: number;
  sessionId: string;
  error?: string;
}

export interface DialogError {
  dialogId: string;
  error: string;
  timestamp: number;
  recovered: boolean;
}

export class DialogStorageService {
  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Core storage methods
  saveDialogHistory(history: string[]): void {
    if (!this.isStorageAvailable()) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.DIALOG_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save dialog history:', error);
    }
  }

  loadDialogHistory(): string[] {
    if (!this.isStorageAvailable()) return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.DIALOG_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load dialog history:', error);
      return [];
    }
  }

  saveCycleCompletion(completed: boolean): void {
    if (!this.isStorageAvailable()) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.CYCLE_COMPLETED, JSON.stringify(completed));
    } catch (error) {
      console.warn('Failed to save cycle completion:', error);
    }
  }

  loadCycleCompletion(): boolean {
    if (!this.isStorageAvailable()) return false;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CYCLE_COMPLETED);
      return stored ? JSON.parse(stored) : false;
    } catch (error) {
      console.warn('Failed to load cycle completion:', error);
      return false;
    }
  }

  saveLastViewed(dialogId: string | null): void {
    if (!this.isStorageAvailable()) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_VIEWED, JSON.stringify(dialogId));
    } catch (error) {
      console.warn('Failed to save last viewed dialog:', error);
    }
  }

  loadLastViewed(): string | null {
    if (!this.isStorageAvailable()) return null;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_VIEWED);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to load last viewed dialog:', error);
      return null;
    }
  }

  getCurrentSession(): string {
    if (!this.isStorageAvailable()) return this.generateSessionId();
    
    try {
      let sessionId = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
      if (!sessionId) {
        sessionId = this.generateSessionId();
        localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, sessionId);
      }
      return sessionId;
    } catch (error) {
      console.warn('Failed to manage session:', error);
      return this.generateSessionId();
    }
  }

  saveCycleStartTime(startTime: number): void {
    if (!this.isStorageAvailable()) return;
    
    try {
      localStorage.setItem(STORAGE_KEYS.CYCLE_START_TIME, JSON.stringify(startTime));
    } catch (error) {
      console.warn('Failed to save cycle start time:', error);
    }
  }

  loadCycleStartTime(): number | null {
    if (!this.isStorageAvailable()) return null;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CYCLE_START_TIME);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to load cycle start time:', error);
      return null;
    }
  }

  saveInteractionHistory(interactions: DialogInteraction[]): void {
    if (!this.isStorageAvailable()) return;
    
    try {
      // Keep only last 100 interactions to prevent storage bloat
      const recentInteractions = interactions.slice(-100);
      localStorage.setItem(STORAGE_KEYS.INTERACTION_HISTORY, JSON.stringify(recentInteractions));
    } catch (error) {
      console.warn('Failed to save interaction history:', error);
    }
  }

  loadInteractionHistory(): DialogInteraction[] {
    if (!this.isStorageAvailable()) return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.INTERACTION_HISTORY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load interaction history:', error);
      return [];
    }
  }

  logDialogError(dialogId: string, error: string, recovered: boolean = false): void {
    const errors = this.loadErrorLog();
    errors.push({
      dialogId,
      error,
      timestamp: Date.now(),
      recovered
    });
    this.saveErrorLog(errors);
  }

  saveErrorLog(errors: DialogError[]): void {
    if (!this.isStorageAvailable()) return;
    
    try {
      // Keep only last 50 errors
      const recentErrors = errors.slice(-50);
      localStorage.setItem(STORAGE_KEYS.ERROR_LOG, JSON.stringify(recentErrors));
    } catch (error) {
      console.warn('Failed to save error log:', error);
    }
  }

  loadErrorLog(): DialogError[] {
    if (!this.isStorageAvailable()) return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ERROR_LOG);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to load error log:', error);
      return [];
    }
  }

  clearAllStorage(): void {
    if (!this.isStorageAvailable()) return;
    
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }
  }

  exportStorageData(): DialogStorageData {
    return {
      history: this.loadDialogHistory(),
      cycleCompleted: this.loadCycleCompletion(),
      lastViewed: this.loadLastViewed(),
      sessionId: this.getCurrentSession(),
      cycleStartTime: this.loadCycleStartTime() ?? undefined,
      interactionHistory: this.loadInteractionHistory(),
      errorLog: this.loadErrorLog()
    };
  }
}

// Create singleton instance
export const dialogStorage = new DialogStorageService();

import { createLogger } from '$lib/utils/logger';

const log = createLogger('popover');

export interface PopoverState {
  openPopovers: Set<string>;
  triggerRects: Map<string, DOMRect>;
  scrollLocked: boolean;
  scrollPosition: number;
}

function createPopoverManager() {
  let state = $state<PopoverState>({
    openPopovers: new Set<string>(),
    triggerRects: new Map<string, DOMRect>(),
    scrollLocked: false,
    scrollPosition: 0
  });

  const openPopovers = $derived(state.openPopovers);
  const isAnyOpen = $derived(state.openPopovers.size > 0);
  
  // Force reactivity by creating a derived that triggers on changes
  const openPopoversList = $derived(Array.from(state.openPopovers));

  const actions = {
    isOpen(id: string): boolean {
      return state.openPopovers.has(id);
    },

    open(id: string, triggerEl: HTMLElement): void {
      if (state.openPopovers.has(id)) return;

      log.debug(`Opening popover: ${id}`);
      
      // Store trigger rect for positioning
      state.triggerRects.set(id, triggerEl.getBoundingClientRect());
      
      // Force reactivity by reassigning the Set
      state.openPopovers = new Set([...state.openPopovers, id]);

      // Lock scroll on mobile
      if (typeof window !== 'undefined' && window.innerWidth < 768 && !state.scrollLocked) {
        actions.lockScroll();
      }
    },

    close(id: string): void {
      console.log(`[STORE DEBUG] close called for ${id}, current state:`, state.openPopovers.has(id));
      if (!state.openPopovers.has(id)) return;

      log.debug(`Closing popover: ${id}`);
      console.log(`[STORE DEBUG] Closing popover ${id}, before:`, Array.from(state.openPopovers));
      
      // Force reactivity by reassigning the Set
      const newOpenPopovers = new Set(state.openPopovers);
      newOpenPopovers.delete(id);
      state.openPopovers = newOpenPopovers;
      
      console.log(`[STORE DEBUG] After closing ${id}:`, Array.from(state.openPopovers));
      
      state.triggerRects.delete(id);

      // Unlock scroll if no popovers open
      if (state.openPopovers.size === 0 && state.scrollLocked) {
        actions.unlockScroll();
      }
    },

    toggle(id: string, triggerEl: HTMLElement): void {
      if (state.openPopovers.has(id)) {
        actions.close(id);
      } else {
        actions.open(id, triggerEl);
      }
    },

    closeAll(): void {
      log.debug('Closing all popovers');
      state.openPopovers = new Set();
      state.triggerRects.clear();
      if (state.scrollLocked) {
        actions.unlockScroll();
      }
    },

    getTriggerRect(id: string): DOMRect | undefined {
      return state.triggerRects.get(id);
    },

    lockScroll(): void {
      if (state.scrollLocked || typeof window === 'undefined') return;

      state.scrollPosition = window.scrollY;
      
      // Apply styles to prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${state.scrollPosition}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Prevent iOS bounce
      document.documentElement.style.overflow = 'hidden';
      
      state.scrollLocked = true;
      log.debug('Scroll locked');
    },

    unlockScroll(): void {
      if (!state.scrollLocked || typeof window === 'undefined') return;

      // Remove scroll lock styles
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      
      // Restore scroll position
      window.scrollTo(0, state.scrollPosition);
      
      state.scrollLocked = false;
      log.debug('Scroll unlocked');
    },

    isScrollLocked(): boolean {
      return state.scrollLocked;
    }
  };

  // Expose debug functions in development
  if (typeof window !== 'undefined' && import.meta.env.DEV) {
    (window as any).__popoverManager = actions;
    (window as any).__closeAllPopovers = () => actions.closeAll();
  }

  return {
    // State getters
    get openPopovers() {
      return openPopovers;
    },
    get openPopoversList() {
      return openPopoversList;
    },
    get isAnyOpen() {
      return isAnyOpen;
    },
    get state() {
      return state;
    },

    // Actions
    ...actions
  };
}

export const popoverManager = createPopoverManager();
export type PopoverManager = typeof popoverManager;
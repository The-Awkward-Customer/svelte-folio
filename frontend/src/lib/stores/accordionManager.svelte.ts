import { createLogger } from '$lib/utils/logger';

const log = createLogger('accordion');

export interface AccordionState {
  id: string;
  isOpen: boolean;
  hasBeenOpened: boolean;
}

const accordionRegistry = new Map<string, AccordionState>();

export function createAccordionState(): AccordionState {
  const id = crypto.randomUUID();

  // Return a plain object - the component will wrap it with $state
  const state: AccordionState = {
    id,
    isOpen: false,
    hasBeenOpened: false,
  };

  return state;
}

export function registerAccordion(state: AccordionState) {
  log.debug('Registering accordion', state.id);
  accordionRegistry.set(state.id, state);
}

export function toggleAccordion(state: AccordionState) {
  log.debug('toggleAccordion called', {
    id: state.id,
    currentState: state.isOpen,
  });

  // If opening this accordion, close all others first
  if (!state.isOpen) {
    log.debug('Closing all other accordions...');
    accordionRegistry.forEach((otherState, otherId) => {
      if (otherId !== state.id) {
        log.debug('Closing accordion', otherId);
        otherState.isOpen = false;
      }
    });
  }

  state.isOpen = !state.isOpen;
  if (state.isOpen) {
    state.hasBeenOpened = true;
  }

  log.debug('Final state', { id: state.id, isOpen: state.isOpen });
}

// Get all currently open accordions
export function getOpenAccordions(): AccordionState[] {
  const openAccordions: AccordionState[] = [];
  accordionRegistry.forEach((state) => {
    if (state.isOpen) {
      openAccordions.push(state);
    }
  });
  return openAccordions;
}

// Cleanup function (optional, for when component unmounts)
export function removeAccordionState(state: AccordionState) {
  accordionRegistry.delete(state.id);
}

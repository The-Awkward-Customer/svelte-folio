
interface AccordionState{
    id:string;
    isOpen:boolean;
    hasBeenOpened:boolean;
}

const accordionRegistry = new Map<string, AccordionState>();


export function createAccordionState() {

    const id = crypto.randomUUID();

    const state = {
        id,
        isOpen: false,
        hasBeenOpened:false
    };

 return state;

}

export function registerAccordion(state: AccordionState){
    accordionRegistry.set(state.id, state);
}

export function toggleAccordion(state: AccordionState) {
    // If opening this accordion, close all others first
    if (!state.isOpen) {
        accordionRegistry.forEach((otherState, otherId) => {
            if (otherId !== state.id) {
                otherState.isOpen = false; // This will now update the actual proxy
            }
        });
    }

    state.isOpen = !state.isOpen;
    if (state.isOpen) {
        state.hasBeenOpened = true;
    }

    console.log(`${state.id}: ${state.isOpen}`);
}

// Cleanup function (optional, for when component unmounts)
export function removeAccordionState(state: AccordionState) {
    accordionRegistry.delete(state.id);
}
interface AccordionState{
    id:string;
    isOpen:boolean;
    hasBeenOpened:boolean;
}

const accordionRegistry = new Map<string, AccordionState>();


export function createAccordionState(): AccordionState {

    const id = crypto.randomUUID();

    // Return a plain object - the component will wrap it with $state
    const state = {
        id,
        isOpen: false,
        hasBeenOpened:false
    };

 return state;

}

export function registerAccordion(state: AccordionState){
    console.log('📋 Registering accordion:', state.id);
    accordionRegistry.set(state.id, state);
}

export function toggleAccordion(state: AccordionState) {
    console.log('🔄 toggleAccordion called:', { id: state.id, currentState: state.isOpen });
    
    // If opening this accordion, close all others first
    if (!state.isOpen) {
        console.log('🔄 Closing all other accordions...');
        accordionRegistry.forEach((otherState, otherId) => {
            if (otherId !== state.id) {
                console.log(`🔄 Closing accordion: ${otherId}`);
                otherState.isOpen = false;
            }
        });
    }

    state.isOpen = !state.isOpen;
    if (state.isOpen) {
        state.hasBeenOpened = true;
    }

    console.log(`🔄 Final state - ${state.id}: ${state.isOpen}`);
}

// Cleanup function (optional, for when component unmounts)
export function removeAccordionState(state: AccordionState) {
    accordionRegistry.delete(state.id);
}
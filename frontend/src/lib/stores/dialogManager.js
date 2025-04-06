// dialogManager.js

import { writable } from 'svelte/store';

/**
 * @typedef {object} DialogManagerState
 * @property {string | null} activeDialogId - The ID of the currently active dialog, or null if none.
 * @property {Record<string, any>} dialogState - State associated with the active dialog.
 */

function createDialogManager() {
	/** @type {import('svelte/store').Writable<DialogManagerState>} */
	const { subscribe, update, set } = writable({
		activeDialogId: null, // Track the ID of the currently open dialog
		dialogState: {}       // Store any state needed by the active dialog
	});

	return {
		subscribe,
		/**
		 * Show a specific dialog with optional state.
		 * @param {string} dialogId - The ID of the dialog to show.
		 * @param {Record<string, any>} [dialogState={}] - Optional state for the dialog.
		 */
		showDialog: (dialogId, dialogState = {}) => {
			update(store => ({
				...store,
				activeDialogId: dialogId,
				dialogState: dialogState
			}));
		},
		// Close the currently active dialog
		closeDialog: () => {
			update(store => ({
				...store,
				activeDialogId: null,
				dialogState: {}
			}));
		},
		// Reset the store completely (optional)
		reset: () => set({ activeDialogId: null, dialogState: {} })
	};
}

export const dialogManager = createDialogManager();

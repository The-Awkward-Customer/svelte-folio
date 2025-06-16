// Define all available dialogs as a const assertion for type safety
export const COMPOSED_DIALOGS = [
  'fresha',
  'shell', 
  'testOne',
  'testTwo'
] as const;

// Create union type from the array
export type DialogId = typeof COMPOSED_DIALOGS[number];

// Dialog metadata for display purposes
export interface DialogMetadata {
  id: DialogId;
  title: string;
  description?: string;
}

export const DIALOG_METADATA: Record<DialogId, DialogMetadata> = {
  fresha: {
    id: 'fresha',
    title: 'Fresha',
    description: 'Fresha integration dialog'
  },
  shell: {
    id: 'shell',
    title: 'Shell',
    description: 'Shell command dialog'
  },
  testOne: {
    id: 'testOne',
    title: 'Test One',
    description: 'First test dialog'
  },
  testTwo: {
    id: 'testTwo',
    title: 'Test Two',
    description: 'Second test dialog'
  }
};

// Validation helper
export function isValidDialogId(id: string): id is DialogId {
  return COMPOSED_DIALOGS.includes(id as DialogId);
}

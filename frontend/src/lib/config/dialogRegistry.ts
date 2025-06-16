// Define all available dialogs as a const assertion for type safety
export const COMPOSED_DIALOGS = [
  'fresha',
  'shell', 
  'testOne',
  'testTwo'
] as const;

// Create union type from the array
export type DialogId = typeof COMPOSED_DIALOGS[number];

// Dialog metadata for enhanced functionality
export interface DialogMetadata {
  id: DialogId;
  title: string;
  description?: string;
  required?: boolean;
  component?: any; // Will hold the actual component reference
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

// Hidden dev reset mechanism
export function triggerDevReset(): void {
  if (typeof window !== 'undefined') {
    // Hidden global function for development
    (window as any).__resetDialogCycle = () => {
      const { dialogStorage } = require('../services/dialogStorage.js');
      dialogStorage.clearAllStorage();
      console.log('🔄 Dialog cycle reset (dev mode)');
      window.location.reload();
    };
    
    console.log('🔧 Dev reset available: __resetDialogCycle()');
  }
}

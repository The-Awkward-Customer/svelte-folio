// Vitest setup for DOM-based tests
// - Provides matchMedia polyfill used by themeManager
// - Can be extended with more DOM stubs as needed

// Minimal matchMedia polyfill
if (!(globalThis as any).matchMedia) {
  // @ts-ignore
  (globalThis as any).matchMedia = (query: string) => ({
    matches: query.includes('dark') ? false : true,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  });
}

// Ensure documentElement exists in environment
if (typeof document !== 'undefined') {
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-brand');
  document.documentElement.removeAttribute('data-brand-override');
  document.documentElement.style.cssText = '';
}


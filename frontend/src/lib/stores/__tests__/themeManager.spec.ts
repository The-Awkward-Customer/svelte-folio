import { describe, it, beforeEach, expect, vi } from 'vitest';
import { themeManager } from '$lib';

// Minimal matchMedia mock for jsdom
function ensureMatchMedia() {
  if (!('matchMedia' in window)) {
    // @ts-ignore
    window.matchMedia = (query: string) => ({
      matches: query.includes('dark') ? false : true,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  }
}

// Skip tests if no DOM (jsdom not installed)
const hasDOM = typeof document !== 'undefined' && typeof window !== 'undefined';

const suite = hasDOM ? describe : describe.skip;

suite('themeManager', () => {
  beforeEach(() => {
    ensureMatchMedia();
    // Reset applied attributes/styles
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('data-brand');
    document.documentElement.removeAttribute('data-brand-override');
    document.documentElement.style.cssText = '';
    // Reset manager state
    themeManager.reset();
  });

  it('applies user theme preference to data-theme', () => {
    themeManager.setUserPreference('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    themeManager.setUserPreference('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('sets legacy brand attributes and CSS vars when activeBrand is set', () => {
    themeManager.setActiveBrand('folio');
    expect(document.documentElement.getAttribute('data-brand')).toBe('folio');
    // Should set at least one brand-related CSS var
    expect(
      document.documentElement.style.getPropertyValue('--bg-page')
    ).not.toBe('');
  });

  it('sets brand-theme override attribute and clears legacy brand when override is used', () => {
    themeManager.setActiveBrand('folio');
    themeManager.setBrandThemeOverride('folio', 'dark');
    expect(document.documentElement.getAttribute('data-brand-override')).toBe(
      'folio'
    );
    expect(document.documentElement.getAttribute('data-brand')).toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});

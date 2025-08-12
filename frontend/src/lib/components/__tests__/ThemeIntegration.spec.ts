/* @vitest-environment jsdom */
import { describe, it, expect } from 'vitest';

let render: any;
let hasLib = true;
try {
  // Dynamically import to avoid hard failure if not installed yet
  // @ts-ignore
  ({ render } = await import('@testing-library/svelte'));
} catch (e) {
  hasLib = false;
}

const suite = hasLib ? describe : describe.skip;

suite('Theme integration (component)', () => {
  it('applies data-theme via component hook', async () => {
    const { default: Cmp } = await import('../TestThemeHook.svelte');
    render(Cmp, { pref: 'dark' });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('sets legacy brand attributes and CSS vars when brand is set', async () => {
    const { default: Cmp } = await import('../TestThemeHook.svelte');
    render(Cmp, { pref: 'light', brand: 'folio' });
    expect(document.documentElement.getAttribute('data-brand')).toBe('folio');
    expect(document.documentElement.style.getPropertyValue('--bg-page')).not.toBe('');
  });

  it('uses brand-theme override attribute and clears legacy brand', async () => {
    const { default: Cmp } = await import('../TestThemeHook.svelte');
    render(Cmp, { pref: 'light', override: { brand: 'folio', theme: 'dark' } });
    expect(document.documentElement.getAttribute('data-brand-override')).toBe('folio');
    expect(document.documentElement.getAttribute('data-brand')).toBeNull();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});


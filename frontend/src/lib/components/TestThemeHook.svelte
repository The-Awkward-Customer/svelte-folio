<script lang="ts">
  import { onMount } from 'svelte';
  import { themeManager } from '$lib';

  export let pref: 'light' | 'dark' = 'dark';
  export let brand: string | null = null;
  export let override: { brand: string; theme: 'light' | 'dark' } | null = null;

  onMount(() => {
    themeManager.setUserPreference(pref);
    if (brand) themeManager.setActiveBrand(brand as any);
    if (override) themeManager.setBrandThemeOverride(override.brand as any, override.theme);
  });
</script>

<div data-testid="theme-root">
  Theme: {pref}
</div>


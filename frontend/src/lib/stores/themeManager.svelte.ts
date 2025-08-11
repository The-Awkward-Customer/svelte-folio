import { browser } from '$app/environment';
import { createLogger } from '$lib/utils/logger';
import { BRANDS, type BrandKey } from '$lib/config/brands';

type ThemePreference = 'light' | 'dark' | 'high-contrast';

interface ThemeState {
  userPreference: ThemePreference;
  activeBrand: BrandKey | null;
  brandThemeOverride: { brand: BrandKey; theme: ThemePreference } | null;
  isTransitioning: boolean;
}

class ThemeManager {
  private log = createLogger('theme');
  private state = $state<ThemeState>({
    userPreference: 'light',
    activeBrand: null,
    brandThemeOverride: null,
    isTransitioning: false
  });

  private transitionTimeout: number | null = null;

  constructor() {
    if (browser) {
      this.init();
      this.setupNavigationCleanup();
    }
  }

  get current() {
    return this.state;
  }

  get userPreference() {
    return this.state.userPreference;
  }

  get activeBrand() {
    return this.state.activeBrand;
  }

  get isTransitioning() {
    return this.state.isTransitioning;
  }

  get brandThemeOverride() {
    return this.state.brandThemeOverride;
  }

  get appliedTheme() {
    return this.state.brandThemeOverride?.theme || this.state.userPreference;
  }

  private init() {
    // Get saved preference or system preference
    const saved = localStorage.getItem('theme-preference') as ThemePreference;
    const systemPrefers: ThemePreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.state.userPreference = saved || systemPrefers;
    
    // Apply initial theme
    this.applyTheme();
    
    // Listen for system theme changes
    this.setupSystemListener();
  }

  private setupSystemListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if no manual preference is saved
      if (!localStorage.getItem('theme-preference')) {
        this.state.userPreference = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }

  private setupNavigationCleanup() {
    // This will be called from a component that has access to SvelteKit navigation
    // We'll export a method that components can call
    if (typeof window !== 'undefined') {
      // Fallback: clear on page unload
      window.addEventListener('beforeunload', () => {
        this.clearAllOverrides();
      });
    }
  }

  // Method for components to call when navigation occurs
  clearAllOverrides() {
    this.log.debug('Clearing all theme overrides due to navigation');
    this.state.brandThemeOverride = null;
    this.state.activeBrand = null;
    this.applyTheme();
  }

  setUserPreference(theme: ThemePreference) {
    this.state.userPreference = theme;
    localStorage.setItem('theme-preference', theme);
    this.applyTheme();
  }

  setActiveBrand(brand: BrandKey | null) {
    this.log.debug('setActiveBrand called', { requestedBrand: brand, currentBrand: this.state.activeBrand, willSkip: this.state.activeBrand === brand });
    
    if (this.state.activeBrand === brand) {
      this.log.debug('SKIPPING - brand already active');
      return;
    }
    
    // Start transition
    this.state.isTransitioning = true;
    this.state.activeBrand = brand;
    
    // Clear any existing timeout
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }
    
    // Apply theme immediately
    this.applyTheme();
    
    // End transition after animation completes
    this.transitionTimeout = window.setTimeout(() => {
      this.state.isTransitioning = false;
      this.transitionTimeout = null;
    }, 300);
  }

  private applyTheme() {
    if (!browser) return;
    
    const root = document.documentElement;
    
    // Determine which theme to apply (brand override takes priority)
    const themeToApply = this.appliedTheme;
    root.setAttribute('data-theme', themeToApply);
    
    // Handle brand-theme override (new system)
    if (this.state.brandThemeOverride) {
      const { brand } = this.state.brandThemeOverride;
      
      // Use CSS variable for brand color to override --bg-page
      root.style.setProperty('--bg-page', `var(--color-brand-${brand})`);
      
      // Set data attribute for additional styling hooks
      root.setAttribute('data-brand-override', brand);
      
      this.log.debug('Applied brand-theme override', { brand, theme: themeToApply, backgroundOverride: `var(--color-brand-${brand})` });
    } 
    // Handle legacy brand override (old system) 
    else if (this.state.activeBrand) {
      const brandColor = BRANDS[this.state.activeBrand];
      const textColor = this.getContrastColor(brandColor);
      
      // Override CSS variables (legacy approach)
      root.style.setProperty('--color-bg-page', brandColor);
      root.style.setProperty('--bg-page', brandColor);
      root.style.setProperty('--color-text-primary', textColor);
      root.style.setProperty('--fg-text-primary', textColor);
      root.style.setProperty('--color-text-secondary', textColor);
      root.style.setProperty('--fg-text-secondary', textColor);
      root.style.setProperty('--color-text-muted', this.adjustOpacity(textColor, 0.6));
      root.style.setProperty('--fg-text-muted', this.adjustOpacity(textColor, 0.6));
      
      // Set brand data attribute for additional styling hooks
      root.setAttribute('data-brand', this.state.activeBrand);
    } 
    // Clear all overrides
    else {
      // Clear new system overrides
      root.style.removeProperty('--bg-page');
      root.removeAttribute('data-brand-override');
      
      // Clear legacy system overrides
      root.style.removeProperty('--color-bg-page');
      root.style.removeProperty('--color-text-primary');
      root.style.removeProperty('--fg-text-primary');
      root.style.removeProperty('--color-text-secondary');
      root.style.removeProperty('--fg-text-secondary');
      root.style.removeProperty('--color-text-muted');
      root.style.removeProperty('--fg-text-muted');
      root.removeAttribute('data-brand');
    }
    
    // Apply transition class
    if (this.state.isTransitioning) {
      root.classList.add('transitioning');
    } else {
      root.classList.remove('transitioning');
    }
  }

  private getContrastColor(hexColor: string): string {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }

  private adjustOpacity(color: string, opacity: number): string {
    if (color === '#000000') {
      return `rgba(0, 0, 0, ${opacity})`;
    } else {
      return `rgba(255, 255, 255, ${opacity})`;
    }
  }

  setBrandThemeOverride(brand: BrandKey, theme: ThemePreference) {
    this.log.debug('setBrandThemeOverride called', { brand, theme, current: this.state.brandThemeOverride });
    
    // Check if this is the same combination already active
    if (this.state.brandThemeOverride?.brand === brand && 
        this.state.brandThemeOverride?.theme === theme) {
      this.log.debug('SKIPPING - same brand-theme combination already active');
      return;
    }
    
    // Start transition
    this.state.isTransitioning = true;
    this.state.brandThemeOverride = { brand, theme };
    
    // Clear any existing timeout
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }
    
    // Apply theme immediately
    this.applyTheme();
    
    // End transition after animation completes
    this.transitionTimeout = window.setTimeout(() => {
      this.state.isTransitioning = false;
      this.transitionTimeout = null;
    }, 300);
  }

  clearBrandThemeOverride() {
    this.log.debug('clearBrandThemeOverride called');
    
    if (!this.state.brandThemeOverride) {
      this.log.debug('SKIPPING - no brand theme override active');
      return;
    }
    
    // Start transition
    this.state.isTransitioning = true;
    this.state.brandThemeOverride = null;
    
    // Clear any existing timeout
    if (this.transitionTimeout) {
      clearTimeout(this.transitionTimeout);
    }
    
    // Apply theme immediately
    this.applyTheme();
    
    // End transition after animation completes
    this.transitionTimeout = window.setTimeout(() => {
      this.state.isTransitioning = false;
      this.transitionTimeout = null;
    }, 300);
  }

  clearBrand() {
    this.log.debug('clearBrand called');
    this.setActiveBrand(null);
  }

  reset() {
    localStorage.removeItem('theme-preference');
    const systemPrefers: ThemePreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.state.userPreference = systemPrefers;
    this.state.activeBrand = null;
    this.state.brandThemeOverride = null;
    this.applyTheme();
  }
}

// Export singleton instance
export const themeManager = new ThemeManager();

import { browser } from '$app/environment';
import { BRANDS, type BrandKey } from '$lib/config/brands';

type ThemePreference = 'light' | 'dark' | 'high-contrast';

interface ThemeState {
  userPreference: ThemePreference;
  activeBrand: BrandKey | null;
  isTransitioning: boolean;
}

class ThemeManager {
  private state = $state<ThemeState>({
    userPreference: 'light',
    activeBrand: null,
    isTransitioning: false
  });

  private transitionTimeout: number | null = null;

  constructor() {
    if (browser) {
      this.init();
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

  setUserPreference(theme: ThemePreference) {
    this.state.userPreference = theme;
    localStorage.setItem('theme-preference', theme);
    this.applyTheme();
  }

  setActiveBrand(brand: BrandKey | null) {
    console.log('🎨 setActiveBrand called:', { 
      requestedBrand: brand, 
      currentBrand: this.state.activeBrand,
      willSkip: this.state.activeBrand === brand 
    });
    
    if (this.state.activeBrand === brand) {
      console.log('🎨 SKIPPING - brand already active');
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
    
    // Set base theme
    root.setAttribute('data-theme', this.state.userPreference);
    
    // Apply brand override if active
    if (this.state.activeBrand) {
      const brandColor = BRANDS[this.state.activeBrand];
      const textColor = this.getContrastColor(brandColor);
      
      // Override CSS variables
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
    } else {
      // Clear brand overrides
      root.style.removeProperty('--color-bg-page');
      root.style.removeProperty('--bg-page');
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

  clearBrand() {
    console.log('🎨 clearBrand called');
    this.setActiveBrand(null);
  }

  reset() {
    localStorage.removeItem('theme-preference');
    const systemPrefers: ThemePreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.state.userPreference = systemPrefers;
    this.state.activeBrand = null;
    this.applyTheme();
  }
}

// Export singleton instance
export const themeManager = new ThemeManager();
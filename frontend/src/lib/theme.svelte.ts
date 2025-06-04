import { browser } from "$app/environment";

type Theme = 'light' | 'dark' | 'high-contrast';

let currentTheme = $state<Theme>('light');


let mediaQuery: MediaQueryList | null = null;



export const theme = {
    get current(): Theme {
        return currentTheme;
    },


        setTheme(newTheme: Theme) : void {
            if ( browser ) {
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
            }
            currentTheme = newTheme;
        },

        init(): void { 
            if (browser) {

                const saved = localStorage.getItem('theme');
                const systemPrefers: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const initialTheme: Theme = (saved as Theme) || systemPrefers;

                    // Debug logging
                    console.log('🎨 Theme Debug Info:');
                    console.log('  Saved theme from localStorage:', saved);
                    console.log('  System prefers dark mode:', window.matchMedia('(prefers-color-scheme: dark)').matches);
                    console.log('  Detected system preference:', systemPrefers);
                    console.log('  Final initial theme:', initialTheme);
                    console.log('  Current theme state before update:', currentTheme);
                
                document.documentElement.setAttribute('data-theme', initialTheme);
                currentTheme = initialTheme;

                this.setupSystemListener();

                    console.log('  Theme applied to DOM:', document.documentElement.getAttribute('data-theme'));
                    console.log('  Current theme state after update:', currentTheme);
            }
        },


        setupSystemListener(): void {
    if (browser) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e: MediaQueryListEvent) => {
        // Only auto-switch if no manual preference is saved
        const hasManualPreference = localStorage.getItem('theme');
        if (!hasManualPreference) {
          const newTheme: Theme = e.matches ? 'dark' : 'light';
          console.log('🌓 System theme changed to:', newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
          currentTheme = newTheme;
        }
      };
      
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    }
  },

  // Method to clear manual preference and follow system
  followSystem(): void {
    if (browser) {
      localStorage.removeItem('theme');
      const systemPrefers: Theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      this.setTheme(systemPrefers);
    }
  }
    };

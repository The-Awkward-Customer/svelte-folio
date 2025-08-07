# Theming System Documentation

This portfolio application implements a comprehensive theming system that supports multiple theme modes, dynamic brand color overrides, and explicit brand-theme combinations.

## Architecture Overview

The theming system consists of three main components:

1. **ThemeManager** (`frontend/src/lib/stores/themeManager.svelte.ts`) - Core logic and state management
2. **CSS Variables** (`frontend/src/app.css`) - Theme definitions and color tokens
3. **Theme Initialization** (`frontend/src/app.html`) - Immediate theme application to prevent FOUC
4. **Navigation Integration** (`frontend/src/routes/+layout.svelte`) - Automatic cleanup on page navigation

## Theme Manager

### Core Features

The `ThemeManager` class provides:

- **Theme Preferences**: Light, dark, and high-contrast modes
- **Brand Overrides**: Dynamic brand color application (legacy)
- **Brand-Theme Combinations**: Explicit brand + theme overrides (new)
- **Smooth Transitions**: Animated theme switching
- **System Integration**: Automatic system theme detection
- **Persistence**: localStorage integration for user preferences
- **Navigation Cleanup**: Automatic override clearing on page navigation

### Key Methods

```typescript
// Set user theme preference
themeManager.setUserPreference('dark' | 'light' | 'high-contrast')

// NEW: Apply brand-theme combination override
themeManager.setBrandThemeOverride('godesk', 'dark')
themeManager.setBrandThemeOverride('fresha', 'light')

// NEW: Clear brand-theme override
themeManager.clearBrandThemeOverride()

// LEGACY: Apply brand color override (backwards compatibility)
themeManager.setActiveBrand('fresha' | 'jio' | 'warhammer' | null)

// LEGACY: Clear brand override (backwards compatibility)
themeManager.clearBrand()

// Reset to system default
themeManager.reset()
```

### State Management

The manager maintains reactive state using Svelte 5's `$state`:

```typescript
interface ThemeState {
  userPreference: 'light' | 'dark' | 'high-contrast';
  activeBrand: BrandKey | null; // Legacy brand override
  brandThemeOverride: { brand: BrandKey; theme: ThemePreference } | null; // New system
  isTransitioning: boolean;
}
```

### New Getters

```typescript
// Check if brand-theme override is active
themeManager.brandThemeOverride // Returns { brand: 'godesk', theme: 'dark' } | null

// Get the currently applied theme (considers overrides)
themeManager.appliedTheme // Returns 'light' | 'dark' | 'high-contrast'
```

## CSS Theme System

### Theme Structure

The CSS defines three theme modes via `data-theme` attributes:

- `[data-theme="light"]` - Default light theme
- `[data-theme="dark"]` - Dark theme with inverted colors
- `[data-theme="high-contrast"]` - Accessibility-focused high contrast

### Color Token Architecture

Colors are organized using a semantic naming system:

```css
/* Foreground (text) colors */
--fg-text-primary: rgba(38, 39, 45, 1);
--fg-text-secondary: rgba(112, 113, 125, 1);
--fg-text-muted: rgba(146, 147, 161, 1);
--fg-text-inverse: rgba(255, 255, 255, 1);
--fg-text-danger: rgba(255, 62, 0, 1);

/* Background colors */
--bg-page: rgba(255, 255, 255, 1);
--bg-component: rgba(180, 180, 180, 1);
--bg-primary: rgba(38, 39, 45, 1);

/* Border colors */
--bdr-primary: rgba(38, 39, 45, 1);
--bdr-secondary: rgba(192, 192, 192, 1);
```

Each color includes opacity variants (80%, 60%, 40%, 20%, 10%).

### Brand Colors

Brand-specific colors are defined as CSS custom properties:

```css
--color-brand-fresha: rgba(105, 80, 243, 1);
--color-brand-jio: rgba(2, 35, 134, 1);
--color-brand-warhammer: rgba(0, 0, 0, 1);
/* ... additional brands */
```

## Theme Application Process

### 1. Initial Theme Detection

The `app.html` includes an inline script that applies the theme before any content renders:

```javascript
const saved = localStorage.getItem('theme');
const systemPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
const theme = saved || systemPrefers;
document.documentElement.setAttribute('data-theme', theme);
```

### 2. Runtime Theme Management

The `ThemeManager` handles theme changes by:

1. Setting `data-theme` attribute on `document.documentElement`
2. Applying brand color overrides via CSS custom properties
3. Managing transition states with the `transitioning` class
4. Calculating appropriate contrast colors for brand overrides

### 3. Brand Override Systems

#### New Brand-Theme Override System (Recommended)

When a brand-theme override is active, the manager:

- Sets the theme to the specified override theme (not user preference)
- Uses CSS variables to override `--bg-page` with `var(--color-brand-{brand})`
- Lets the CSS theme system handle text colors naturally
- Sets `data-brand-override` attribute for additional styling hooks
- Preserves existing themed variables and color relationships

```typescript
// Example: GoDesk with Dark theme
themeManager.setBrandThemeOverride('godesk', 'dark');
// Result: 
// - document.documentElement.setAttribute('data-theme', 'dark')
// - root.style.setProperty('--bg-page', 'var(--color-brand-godesk)')
// - root.setAttribute('data-brand-override', 'godesk')
```

#### Legacy Brand Override System (Backwards Compatibility)

When a legacy brand is active, the manager:

- Overrides `--color-bg-page` and `--bg-page` with brand color
- Calculates contrasting text color using luminance formula
- Updates text color variables accordingly
- Sets `data-brand` attribute for additional styling hooks

```typescript
private getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
```

## Transition System

### Smooth Theme Changes

Transitions are handled through:

1. `isTransitioning` state management
2. CSS transition rules for brand color changes
3. 300ms timeout for transition completion
4. Reduced motion support for accessibility

```css
:root.transitioning * {
  transition: 
    background-color 300ms ease-out,
    color 300ms ease-out,
    border-color 300ms ease-out;
}

@media (prefers-reduced-motion: reduce) {
  :root.transitioning * {
    transition-duration: 0.01ms !important;
  }
}
```

## Design System Integration

The theme system integrates with a comprehensive design token system including:

- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale from 2px to 160px
- **Layout**: Width constraints, breakpoints, and responsive utilities
- **Effects**: Shadows, border radius, and opacity levels

## Usage Examples

### Basic Theme Switching

```typescript
import { themeManager } from '$lib/stores/themeManager.svelte.ts';

// Switch to dark mode
themeManager.setUserPreference('dark');

// NEW: Apply brand-theme combination
themeManager.setBrandThemeOverride('fresha', 'light');

// LEGACY: Apply brand override (backwards compatibility)
themeManager.setActiveBrand('fresha');
```

### Reactive Theme State

```svelte
<script>
  import { themeManager } from '$lib/stores/themeManager.svelte.ts';
  
  // Access current theme state
  $: currentTheme = themeManager.current;
  $: isTransitioning = themeManager.isTransitioning;
  $: appliedTheme = themeManager.appliedTheme;
  $: brandThemeOverride = themeManager.brandThemeOverride;
</script>

<div class="theme-indicator" class:transitioning={isTransitioning}>
  User Preference: {currentTheme.userPreference}
  Applied Theme: {appliedTheme}
  
  {#if brandThemeOverride}
    Brand Override: {brandThemeOverride.brand} + {brandThemeOverride.theme}
  {:else if currentTheme.activeBrand}
    Legacy Brand: {currentTheme.activeBrand}
  {/if}
</div>
```

### Accordion Component Integration

The Accordion component now supports explicit brand-theme combinations:

```svelte
<!-- NEW: Explicit brand-theme combinations -->
<Accordion label="GoDesk" brand="godesk" themeOverride="dark">
  <!-- Opens with GoDesk brand background + Dark theme -->
</Accordion>

<Accordion label="Fresha" brand="fresha" themeOverride="light">
  <!-- Opens with Fresha brand background + Light theme -->
</Accordion>

<Accordion label="Accessibility Project" brand="warhammer" themeOverride="high-contrast">
  <!-- Opens with Warhammer brand background + High contrast theme -->
</Accordion>

<!-- LEGACY: Brand-only (backwards compatibility) -->
<Accordion label="Legacy" brand="jio">
  <!-- Uses legacy brand override system -->
</Accordion>
```

#### Accordion Behavior

- **Opening**: Applies specified brand background + theme override
- **Closing**: Reverts to user's preferred theme and original background
- **Navigation**: Automatically clears all overrides when navigating between pages
- **Multiple Accordions**: Only one override active at a time

## Navigation Integration

The layout automatically clears theme overrides on navigation:

```svelte
<!-- frontend/src/routes/+layout.svelte -->
<script>
  import { beforeNavigate } from '$app/navigation';
  import { themeManager } from '$lib/stores/themeManager.svelte';
  
  // Clear theme overrides when navigating between pages
  beforeNavigate(({ from, to }) => {
    if (from && to && from.url.pathname !== to.url.pathname) {
      console.log('🎨 Navigation detected, clearing theme overrides');
      themeManager.clearAllOverrides();
    }
  });
</script>
```

## Accessibility Features

The theming system includes several accessibility considerations:

1. **High Contrast Theme**: Pure black/white contrast for users with visual impairments
2. **System Theme Respect**: Automatic detection of user's system preference
3. **Reduced Motion**: Respects `prefers-reduced-motion` for transitions
4. **Focus Management**: Consistent focus ring styling across themes
5. **No Noise Texture**: High contrast theme removes decorative noise for clarity

## Benefits of the New System

The updated theming system provides significant improvements:

### Technical Benefits
- **No CSS Variable Conflicts**: Uses existing CSS variables instead of overriding them
- **Theme System Unity**: Leverages CSS themes for consistent text colors
- **Backward Compatibility**: Legacy brand system continues to work
- **Clean Architecture**: Separates brand colors from theme logic
- **Navigation Safety**: Automatic cleanup prevents theme "leaks"

### User Experience Benefits
- **Explicit Control**: Developers can specify exact brand-theme combinations
- **Predictable Behavior**: "GoDesk-Dark" and "Fresha-Light" combinations work as expected
- **Smooth Transitions**: Maintains existing animation and transition system
- **Accessibility Support**: Full support for high-contrast mode with any brand

### Developer Experience Benefits
- **Type Safety**: Full TypeScript support for all new methods
- **Clear Intent**: Code clearly shows brand + theme combinations
- **Easy Migration**: Can adopt gradually alongside legacy system
- **Flexible Configuration**: Each accordion can specify its own combination

This theming system provides a robust, accessible, and visually appealing foundation for the portfolio application while maintaining excellent performance and user experience. The new brand-theme override system offers the flexibility and control needed for complex brand presentations while preserving the simplicity of the underlying theme architecture.
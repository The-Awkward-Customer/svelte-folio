# CSS Architecture Overview - 2025-08-28 11:25

## Overview
This document describes the modular CSS architecture implemented for the Svelte folio project, including design token organization and theming system.

## Directory Structure

```
frontend/src/styles/
├── app.css                          # Main entry point
├── base/
│   ├── reset.css                    # CSS reset & base styles
│   └── fonts.css                    # Font declarations (@font-face)
└── design-tokens/
    ├── global/                      # Theme-independent tokens
    │   ├── typography.css           # Font families, sizes, weights, line heights
    │   ├── spacing.css              # Margin, padding, gap values
    │   ├── sizing.css               # Width, height, size tokens
    │   ├── motion.css               # Transitions and animations
    │   ├── elevation.css            # Shadows
    │   ├── opacity.css              # Opacity tokens
    │   └── radius.css               # Border radius values
    ├── themes/                      # Theme-specific tokens
    │   ├── base/
    │   │   └── colors.css           # Base theme variables (focus, breakpoints)
    │   ├── light/
    │   │   └── semantic.css         # Light theme color variables
    │   ├── dark/
    │   │   └── semantic.css         # Dark theme color variables
    │   └── contrast/
    │       └── semantic.css         # High-contrast theme variables
    └── brands/
        └── brand-colors.css         # Brand-specific color tokens
```

## Import Strategy

### Main Entry Point (app.css)
```css
/* Import Design Tokens */
@import './design-tokens/global/typography.css';
@import './design-tokens/global/spacing.css';
@import './design-tokens/global/sizing.css';
@import './design-tokens/global/motion.css';
@import './design-tokens/global/elevation.css';
@import './design-tokens/global/opacity.css';
@import './design-tokens/global/radius.css';

/* Import Base Styles */
@import './base/reset.css';
@import './base/fonts.css';

/* Import Theme-specific Tokens */
@import './design-tokens/themes/base/colors.css';
@import './design-tokens/themes/light/semantic.css';
@import './design-tokens/themes/dark/semantic.css';
@import './design-tokens/themes/contrast/semantic.css';

/* Import Brand Colors */
@import './design-tokens/brands/brand-colors.css';

/* Global Styles */
/* Focus styles, typography application, transitions */
```

## Design Token Categories

### Global Tokens (Theme-Independent)

#### Typography (typography.css)
- Font families: `--font-family-main`, `--font-family-alt`
- Font sizes: `--fs-200` to `--fs-1500` + clamped responsive sizes
- Font weights: `--fw-thin` to `--fw-super`
- Line heights: `--lh-none` to `--lh-loose` + semantic variants
- Text transforms: `--text-transform-*`

#### Spacing (spacing.css)
- Space scale: `--space-0` to `--space-11xl`
- Semantic spacing: `--spacing-none` to `--spacing-isolated`
- Page padding: `--padding-page-default`

#### Sizing (sizing.css)
- Width tokens: Fixed, content, prose, percentage-based
- Touch-safe sizes: `--size-touch-safe`
- Min-width tokens for components
- Responsive breakpoints

#### Motion (motion.css)
- Transition durations: `--transition-fast/normal/slow`
- Theme transition combinations

#### Elevation (elevation.css)
- Shadow tokens: `--shadow-sm/md/lg`

#### Opacity (opacity.css)
- Opacity tokens: `--opacity-invisible/hover/active/selected`

#### Radius (radius.css)
- Border radius: `--border-radius-tiny` to `--border-radius-pill`

### Theme-Specific Tokens

#### Base Colors (base/colors.css)
- Focus ring properties
- Development colors
- Brand accent colors
- Breakpoint values

#### Light Theme (light/semantic.css)
- Selector: `:root, [data-theme='light']` (default + explicit)
- Text colors with opacity variants (`--fg-text-*`)
- Background colors (`--bg-*`)
- Border colors (`--bdr-*`)
- Status/semantic colors
- Surface tokens
- Legacy compatibility mappings

#### Dark Theme (dark/semantic.css)
- Selector: `[data-theme='dark']` (explicit only)
- Inverted color scheme
- Dark-optimized noise textures
- Adjusted contrast ratios

#### High-Contrast Theme (contrast/semantic.css)
- Selector: `[data-theme='high-contrast']` (explicit only)
- Maximum contrast ratios
- No decorative elements (noise disabled)
- Accessibility-focused color choices

### Brand Tokens (brands/brand-colors.css)
- Brand-specific color variables: `--color-brand-{name}`
- Used for dynamic brand theming via themeManager

## Theming System

### Theme Application Flow

1. **Initial Load (app.html)**:
   ```javascript
   const saved = localStorage.getItem('theme-preference');
   const systemPrefers = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
   const theme = saved || systemPrefers;
   document.documentElement.setAttribute('data-theme', theme);
   ```

2. **Runtime Management (themeManager.svelte.ts)**:
   - Manages theme state and persistence
   - Handles brand overrides
   - Applies smooth transitions
   - Synchronizes with localStorage

### Theme Selector Strategy

- **Light Theme**: `:root, [data-theme='light']`
  - Applied by default AND when explicitly set
  - Provides fallback base styles

- **Dark/Contrast Themes**: `[data-theme='dark']`, `[data-theme='high-contrast']`
  - Only applied when explicitly set via data attribute
  - Override light theme defaults

### Brand Override System

The themeManager supports two override methods:

1. **CSS Variable Override**:
   ```javascript
   root.style.setProperty('--bg-page', `var(--color-brand-${brand})`);
   ```

2. **Legacy Color Override**:
   - Direct CSS variable manipulation
   - Contrast color calculation
   - Opacity adjustments

### Transition System

- **Transition Class**: `.transitioning` applied during theme changes
- **CSS Transitions**: 
  ```css
  :root.transitioning * {
    transition: background-color 300ms ease-out, color 300ms ease-out, border-color 300ms ease-out;
  }
  ```
- **Reduced Motion**: Respects `prefers-reduced-motion`

## Key Features

### Modular Architecture
- Each concern separated into focused files
- Clear import hierarchy
- Easy to maintain and extend

### Theme Flexibility
- System preference detection
- User preference persistence
- Dynamic brand theming
- High-contrast accessibility support

### Performance Optimized
- CSS custom properties for runtime changes
- Minimal JavaScript theme switching
- Efficient cascade order

### Developer Experience
- Clear naming conventions
- Comprehensive token coverage
- Semantic color naming
- Legacy compatibility layer

## Migration Notes

### From Monolithic app.css
- Extracted ~800 lines into focused modules
- Preserved all existing functionality
- Maintained backward compatibility
- Improved maintainability

### Breaking Changes
- Import path changed from `../app.css` to `../styles/app.css`
- Border-radius token renames:
  - `--bdr-radius-tiny` → `--border-radius-tiny`
  - `--bdr-radius-small` → `--border-radius-sm`
  - `--bdr-radius-medium` → `--border-radius-md`
  - `--bdr-radius-large` → `--border-radius-lg`
  - `--bdr-radius-pill` → `--border-radius-pill`
- Legacy `--bdr-…` variables have been removed so consumers must update references or add alias fallbacks

## Best Practices

### Adding New Tokens
1. Determine appropriate category (global vs theme-specific)
2. Use consistent naming conventions
3. Provide all theme variants if theme-dependent
4. Document semantic usage

### Theme Development
1. Start with light theme as base
2. Ensure sufficient contrast ratios
3. Test with brand overrides
4. Verify accessibility compliance

### File Organization
1. Keep imports in order: global → base → themes → brands
2. Use semantic file names
3. Group related tokens together
4. Maintain consistent formatting

## Future Enhancements

- Automatic contrast calculation
- CSS custom property validation
- Design token generation from design systems
- Advanced theme customization API
- Component-specific token namespacing
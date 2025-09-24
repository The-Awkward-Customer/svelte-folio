# Styles Architecture Documentation

## Overview

This document provides a comprehensive guide to the CSS/styles architecture used in the Svelte Folio project. The styles are organized using a design token-based system with clear separation of concerns between global tokens, themes, base styles, and component-specific styling.

## Directory Structure

```
src/styles/
├── app.css                           # Main styles entry point
├── base/                             # Foundation styles
│   ├── fonts.css                     # Font declarations
│   └── reset.css                     # CSS reset and base styles
└── design-tokens/                    # Design token system
    ├── brands/                       # Brand-specific tokens
    │   └── brand-colors.css          # Brand color definitions
    ├── global/                       # Global design tokens
    │   ├── elevation.css             # Shadow and opacity tokens
    │   ├── motion.css                # Animation and transition tokens
    │   ├── opacity.css               # Opacity level tokens
    │   ├── radius.css                # Border radius tokens
    │   ├── sizing.css                # Width, height, and size tokens
    │   ├── spacing.css               # Margin, padding, and gap tokens
    │   └── typography.css            # Font, size, and text tokens
    └── themes/                       # Theme-specific tokens
        ├── base/
        │   └── colors.css            # Base color definitions
        ├── light/
        │   └── semantic.css          # Light theme semantic colors
        ├── dark/
        │   └── semantic.css          # Dark theme semantic colors
        └── contrast/
            └── semantic.css          # High contrast theme colors
```

## File Descriptions

### Entry Point

#### `app.css`
- **Purpose**: Main stylesheet that imports all design tokens and base styles
- **Key Features**:
  - Imports all design token files in proper order
  - Defines global focus ring styles using CSS custom properties
  - Sets up typography styles for headings and body text
  - Implements theme transition animations with reduced motion support
  - Provides fallback behavior for accessibility preferences

### Base Styles

#### `base/reset.css`
- **Purpose**: CSS reset and foundational styles
- **Key Features**:
  - Modern CSS reset with box-sizing border-box
  - Font smoothing optimizations for better text rendering
  - Flexible body layout with min-height viewport support
  - Responsive media defaults (images, videos)
  - Focus management with :focus-visible support
  - Defines focus ring CSS custom properties
  - Includes transition system for theme switching

#### `base/fonts.css`
- **Purpose**: Font face declarations for custom typography
- **Fonts Included**:
  - **Geist**: Main sans-serif font family
    - Weights: 100 (Thin), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 900 (Black)
  - **Geist-Mono**: Monospace font family
    - Weights: 100 (Thin), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold), 900 (Black)
- **Features**:
  - Uses `font-display: swap` for better loading performance
  - OpenType format for optimal rendering

### Design Tokens

#### Global Tokens

##### `design-tokens/global/typography.css`
- **Purpose**: Typography design tokens and utilities
- **Tokens Include**:
  - **Font Sizes**: Comprehensive scale from 0.5rem to 10rem (--font-size-200 to --font-size-1500)
  - **Font Weights**: Semantic weight tokens (thin, regular, medium, semibold, bold, super)
  - **Line Heights**: Contextual line-height tokens for different use cases
  - **Font Families**: Main (Geist) and alt (Geist-Mono) family definitions
  - **Text Transform**: Utility tokens for text casing
- **Utilities**:
  - `.text-button-sm`: Small button text styling
  - `.text-link-sm`: Small link text styling
- **Legacy Support**: Maintains backward compatibility with older token names

##### `design-tokens/global/spacing.css`
- **Purpose**: Spacing system for consistent layouts
- **Tokens Include**:
  - **Gap Tokens**: For flexbox/grid spacing (2px to 48px)
  - **Padding Tokens**: Comprehensive padding system with directional variants
  - **Responsive Spacing**: Fluid spacing tokens using rem units
- **Naming Convention**: Size-based naming (tiny, xsmall, small, medium, large)
- **Directional Support**: Individual tokens for left, top, right, bottom spacing

##### `design-tokens/global/sizing.css`
- **Purpose**: Width, height, and size tokens for consistent dimensioning
- **Tokens Include**:
  - **Fixed Widths**: Scale from 0.125rem to 10rem
  - **Content Widths**: Responsive breakpoint widths (640px to 1920px)
  - **Prose Widths**: Optimal reading widths using ch units
  - **Touch Targets**: Mobile-friendly touch target sizes
  - **Percentage Widths**: Fractional width tokens (quarter, third, half, etc.)
- **Features**:
  - Touch-safe sizing for mobile interfaces
  - Responsive card minimum widths
  - Viewport-based sizing options

##### `design-tokens/global/radius.css`
- **Purpose**: Border radius tokens for consistent corner treatments
- **Tokens Include**:
  - **tiny**: 4px - Subtle rounded corners
  - **sm**: 8px - Small rounded corners
  - **md**: 16px - Medium rounded corners
  - **lg**: 24px - Large rounded corners
  - **pill**: 999px - Fully rounded (pill shape)

##### `design-tokens/global/elevation.css`
- **Purpose**: Shadow and opacity tokens for depth and interaction states
- **Shadow Tokens**:
  - **sm**: Subtle shadow for slight elevation
  - **md**: Standard shadow for cards and modals
  - **lg**: Prominent shadow for high elevation elements
- **Opacity Tokens**:
  - **invisible**: 0% - Completely transparent
  - **hover**: 4% - Subtle hover state
  - **active**: 8% - Active interaction state
  - **selected**: 12% - Selected state indication

#### Theme Tokens

##### `design-tokens/themes/base/colors.css`
- **Purpose**: Base color definitions and system-level tokens
- **Key Colors**:
  - **Dev Colors**: Development-specific colors (pink debug color)
  - **Project Colors**: Brand-specific colors (Fresha purple)
  - **Focus Ring**: Accessibility-compliant focus indication color
  - **Breakpoints**: Responsive design breakpoint definitions
- **Modern Color Format**: Uses OKLCH color space for better perceptual uniformity

##### `design-tokens/themes/light/semantic.css`
- **Purpose**: Light theme semantic color definitions
- **Color Categories**:
  - **Text Colors**: Primary, secondary, inverse, danger, muted with opacity variants
  - **Background Colors**: Page, component, primary with opacity variants
  - **Border Colors**: Primary, secondary with opacity variants
  - **Status Colors**: Positive states with opacity variants
  - **Surface Colors**: Neutral and semantic surface treatments
- **Advanced Features**:
  - **Opacity Variants**: Each color includes 90%, 80%, 60%, 40%, 20%, 10% opacity versions
  - **Interaction States**: Hover, active, and disabled state colors
  - **Overlay System**: Semi-transparent overlays for modals and popovers
  - **Noise Texture**: SVG-based subtle texture for visual interest
- **Modern CSS Support**: Includes color-mix() fallbacks for better browser support
- **Legacy Compatibility**: Maintains backward compatibility with older variable names

#### Brand Tokens

##### `design-tokens/brands/brand-colors.css`
- **Purpose**: Brand-specific color definitions
- **Content**: Currently minimal, designed for future brand color expansion

## Design System Principles

### 1. Token-Based Architecture
- All visual properties use CSS custom properties (variables)
- Semantic naming convention for better maintainability
- Hierarchical organization from global to specific

### 2. Theme System
- Multiple theme support (light, dark, contrast)
- Semantic color tokens that adapt to theme context
- Smooth transitions between themes with accessibility considerations

### 3. Modern CSS Features
- OKLCH color space for perceptual color uniformity
- CSS custom properties for dynamic theming
- Modern layout techniques (flexbox, grid)
- Progressive enhancement with feature queries

### 4. Accessibility First
- WCAG-compliant focus ring system
- High contrast theme support
- Reduced motion preference handling
- Touch-friendly sizing tokens

### 5. Performance Optimizations
- Font loading optimization with font-display: swap
- Efficient CSS reset for minimal styles
- Minimal duplication through token reuse

## Usage Guidelines

### For Developers

1. **Use Design Tokens**: Always use CSS custom properties instead of hardcoded values
2. **Follow Naming Conventions**: Use semantic token names that describe purpose, not appearance
3. **Theme Awareness**: Ensure components work across all theme variants
4. **Component Styling**: Use the established article component CSS naming convention

### For Components

1. **Semantic Colors**: Use `--fg-text-primary` instead of specific color values
2. **Consistent Spacing**: Use spacing tokens for margins, padding, and gaps
3. **Responsive Sizing**: Leverage sizing tokens for consistent dimensions
4. **Modern CSS**: Take advantage of the token system for dynamic styling

### Example Usage

```css
.my-component {
  color: var(--fg-text-primary);
  background: var(--bg-component);
  padding: var(--padding-medium);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-md);

  /* Hover state */
  &:hover {
    background: var(--bg-ghost-hover);
  }
}
```

## Component Integration

The styles system integrates seamlessly with the article component system:

- **ArticleBody**: Uses layout tokens for responsive design
- **ArticleText**: Leverages typography tokens for consistent text treatment
- **ArticleImage**: Uses sizing and spacing tokens for proper layout
- **ArticleTableOfContents**: Integrates with theme colors and spacing

## Future Considerations

1. **Brand Expansion**: The brand tokens directory is prepared for multiple brand support
2. **Additional Themes**: Dark and contrast themes follow the same semantic structure
3. **Motion Tokens**: Motion.css is referenced but not yet fully utilized
4. **Component Tokens**: Potential for component-specific token files

This architecture provides a scalable, maintainable foundation for consistent visual design across the entire application.
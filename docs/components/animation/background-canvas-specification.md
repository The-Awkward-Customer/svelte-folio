# Background Canvas Component Specification

## Overview
This document defines the specifications for interactive background canvas components used in the experiments section. These components provide dynamic, theme-aware backgrounds that respond to user interactions.

## DotGridBackground Component

### Visual Design
- **Grid Pattern**: Regular dot grid with configurable spacing
- **Dot Appearance**: Small circular dots with consistent radius
- **Theme Support**: Automatic adaptation to light/dark themes
- **Interactive Effects**: Radial opacity changes based on cursor proximity

### Technical Specifications

#### Configuration Parameters
```typescript
interface DotGridConfig {
  dotSpacing: number;        // Distance between dot centers (default: 15px)
  dotRadius: number;         // Radius of each dot (default: 2px, debug mode)
  highlightDistance: number; // Cursor influence radius (default: 180px)
  baseOpacity: number;       // Minimum dot opacity (default: 0.5, debug mode)
  maxOpacity: number;        // Maximum dot opacity (default: 1.0)
}
```

#### Color System Integration
```typescript
// CSS Variables Used
--fg-text-primary: Primary text color for light themes
--fg-text-inverse: Inverse text color for dark themes

// Color Parsing Support
rgba(255, 255, 255, 1)    // Full RGBA format
rgb(255, 255, 255)        // RGB format (converted to RGBA)
255, 255, 255             // Raw RGB values (wrapped in RGBA)
```

#### Theme Integration
- **Light Theme**: Black dots (`rgba(0, 0, 0, alpha)`)
- **Dark Theme**: White dots (`rgba(255, 255, 255, alpha)`)
- **Theme Detection**: Uses existing `themeManager.appliedTheme`

#### Interactive Behavior
1. **Cursor Tracking**: Mouse position updates in real-time via parent container events
2. **Radial Effect**: Dots within `highlightDistance` increase opacity with linear interpolation
3. **Smooth Transitions**: Opacity changes are immediate and smooth
4. **Edge Handling**: Effect gracefully handles canvas boundaries
5. **Event Architecture**: Uses exported functions for parent-to-child communication

#### Performance Considerations
- **Canvas Rendering**: Uses HTML5 Canvas for optimal performance
- **Device Pixel Ratio**: Handles high-DPI displays correctly
- **Resize Handling**: Responsive to container size changes
- **Efficient Redraws**: Only redraws when mouse moves or theme changes

### Implementation Details

#### Canvas Setup
```typescript
// Canvas dimensions match container with proper DPI scaling
canvas.width = rect.width * window.devicePixelRatio;
canvas.height = rect.height * window.devicePixelRatio;
ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
```

#### Grid Calculation
```typescript
// Center the grid within the canvas
const offsetX = (width % dotSpacing) / 2;
const offsetY = (height % dotSpacing) / 2;
```

#### Opacity Calculation
```typescript
// Linear interpolation based on distance from cursor
const intensity = 1 - (distance / highlightDistance);
const alpha = baseOpacity + (maxOpacity - baseOpacity) * intensity;
```

### Usage Guidelines

#### Container Requirements
- **Position**: Container must have `position: relative`
- **Dimensions**: Container should have defined width/height
- **Z-index**: Background should have negative z-index

#### Integration Example
```svelte
<script>
  import { DotGridBackground } from "$lib/components/experiments";
  
  let dotGridRef;
  
  function handleMouseMove(event) {
    if (dotGridRef) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      dotGridRef.updateMousePosition(x, y);
    }
  }
  
  function handleMouseLeave() {
    if (dotGridRef) {
      dotGridRef.setMouseLeave();
    }
  }
</script>

<div 
  class="container"
  on:mousemove={handleMouseMove}
  on:mouseleave={handleMouseLeave}
  role="presentation"
>
  <DotGridBackground bind:this={dotGridRef} />
  <div class="content">
    <!-- Foreground content -->
  </div>
</div>

<style>
  .container {
    position: relative;
    min-height: 100vh;
  }
  
  .content {
    position: relative;
    z-index: 1;
  }
</style>
```

### Accessibility Considerations
- **Reduced Motion**: Should respect `prefers-reduced-motion` setting
- **Performance**: Lightweight enough not to impact accessibility tools
- **Non-Essential**: Decorative only, doesn't convey critical information

### Testing & Debugging

#### Visual Verification
1. **Grid Alignment**: Dots should be evenly spaced and centered
2. **Theme Switching**: Colors should update immediately on theme change
3. **Cursor Interaction**: Opacity should increase smoothly near cursor
4. **Responsive Behavior**: Grid should adapt to container size changes

#### Performance Metrics
- **Frame Rate**: Should maintain 60fps during interaction
- **Memory Usage**: Canvas should not leak memory on resize
- **CPU Usage**: Should remain low during idle state

#### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **Canvas Support**: Requires HTML5 Canvas API
- **ResizeObserver**: Uses ResizeObserver for responsive behavior

### Future Enhancements

#### Potential Features
- **Animation Easing**: Add smooth animation transitions
- **Multiple Cursor Support**: Handle touch devices with multiple points
- **Pattern Variations**: Different shapes, sizes, or arrangements
- **Performance Modes**: Adaptive quality based on device capabilities

#### Configuration Options
- **Customizable Colors**: Allow override of theme colors
- **Effect Intensity**: Adjustable highlight strength
- **Grid Patterns**: Support for different geometric arrangements
- **Animation Speed**: Configurable transition timing

### Architecture Notes

#### Component API
```typescript
// Exported functions for parent interaction
export function updateMousePosition(x: number, y: number): void;
export function setMouseLeave(): void;
```

#### Event Flow
1. Parent container captures mouse events
2. Parent calculates relative coordinates
3. Parent calls component's exported functions
4. Component updates internal state and redraws

#### Code Documentation
- **Grid Configuration**: Extensively commented parameter definitions
- **Layout Calculation**: Documented grid centering logic  
- **Rendering Loop**: Commented dot generation and drawing process
- **Interactive Effects**: Documented opacity calculation algorithms

### Debugging and Troubleshooting

#### Debug Mode
The component includes comprehensive debugging capabilities:

```typescript
// Console logging for troubleshooting
console.log('Debug - Draw function called:', { isDark, width, height, ... });
console.log('Debug - Canvas resized:', { parentRect, canvasWidth, ... });
console.log('Debug - First dot color:', { alpha, finalColor, isDark });
console.log('Debug - Dots drawn:', dotCount);
```

#### Common Issues and Solutions

**Grid Not Visible**
1. Check canvas dimensions in console logs
2. Verify parent container has proper dimensions
3. Increase `baseOpacity` and `dotRadius` for debugging
4. Use hardcoded colors to isolate CSS variable issues

**CSS Variable Integration**
```typescript
// Fallback hierarchy for color parsing:
if (!baseColor || baseColor === '') {
  // Use hardcoded fallback colors
} else if (baseColor.startsWith("rgba(")) {
  // Handle full rgba() values
} else if (baseColor.startsWith("rgb(")) {
  // Handle rgb() values, convert to rgba
} else {
  // Handle raw RGB values like "38, 39, 45"
}
```

**Theme Integration Issues**
- CSS variables should be available at `document.documentElement`
- Variables format: `--fg-text-primary`, `--fg-text-inverse`
- Supports rgba(), rgb(), and raw RGB value formats

### Known Issues and Analysis

#### CSS Variable Alpha Management Hypothesis (v1.2)
**Issue**: Grid invisible when using CSS variables despite fallback colors working.

**Root Cause Analysis**: 
The CSS variables in the design system are stored as full RGBA values (e.g., `rgba(38, 39, 45, 1)`), but the component attempts to dynamically manage the alpha channel for opacity effects. This creates a conflict:

```typescript
// CSS Variable: "rgba(38, 39, 45, 1)"
// Our parsing: baseColor.replace(/,\s*[\d\.]+\)$/, `, ${alpha})`)
// Intended result: "rgba(38, 39, 45, 0.5)"
// Potential failure: Malformed color string or failed regex match
```

**Evidence**:
- Hardcoded colors work (bypass CSS parsing)
- CSS variables are retrieved successfully 
- Drawing logic confirmed functional via fallback mode
- Issue appears specifically in RGBA parsing/replacement logic

**Impact**: Malformed color strings cause canvas rendering to fail silently, resulting in invisible dots.

**Priority**: High - affects core design system integration

**Proposed Solutions**:
1. Extract RGB values from RGBA and rebuild color string
2. Use CSS variables that store RGB components separately
3. Validate color string format before canvas assignment
4. Implement more robust RGBA parsing with error handling

### Change Log

#### v1.2 (Current)
- **Design System Integration**: Integrated CSS variables from design system for theme consistency
- **Color Management**: Dynamic CSS variable parsing for `--fg-text-primary` and `--fg-text-inverse`
- **Robust Theming**: Handles rgba(), rgb(), and raw RGB value formats from CSS variables
- **Debugging Framework**: Added comprehensive debugging logs for troubleshooting
- **Fallback System**: Graceful degradation with hardcoded colors if CSS variables fail
- **Visibility Improvements**: Configurable opacity and radius for debugging and production

#### v1.1
- **Bug Fix**: Fixed cursor interaction by moving event handling to parent
- **Architecture**: Implemented exported function API for parent-child communication
- **Configuration**: Updated defaults for denser, more subtle grid (15px spacing, 1px radius, 180px effect)
- **Documentation**: Added comprehensive code comments for maintainability
- **CSS**: Set `pointer-events: none` to prevent event interference

#### v1.0 
- Initial implementation with basic dot grid
- Theme-aware color adaptation
- Cursor proximity opacity effects
- Responsive canvas rendering

---

**Last Updated**: August 17, 2025  
**Component**: DotGridBackground v1.2  
**Author**: Interactive Background System
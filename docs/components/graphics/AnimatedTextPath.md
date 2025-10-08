# AnimatedTextPath Component
*Created: 2025-09-30 22:20:00 UTC*

## Overview

The AnimatedTextPath component creates smooth, organic animated text that follows along a dynamically generated path. It features sophisticated path generation algorithms using Catmull-Rom splines and Gaussian smoothing to create natural, flowing animations. The component is commonly used for decorative text effects and hero sections.

## Component Location

`/frontend/src/lib/components/graphics/AnimatedTextPath.svelte`

## Visual Characteristics
<!-- Updated: 2025-09-30 22:20:00 UTC -->

### Current Styling (v1.1)
- **Container Position**: `relative` - Integrated into page flow
- **Container Height**: `20vh` - Compact viewport height
- **Stroke Width**: `40px` - Bold, prominent path stroke
- **Z-Index**: `-999` - Positioned behind other content
- **Overflow**: Hidden horizontally, visible vertically

### Previous Styling (v1.0)
- **Container Position**: `absolute` - Floating overlay
- **Container Height**: `100vh` - Full viewport height
- **Stroke Width**: `2px` - Thin, subtle path stroke

## Component Features

### Path Generation
- **Organic Curves**: Uses Catmull-Rom spline interpolation for smooth, natural curves
- **Irregular Spacing**: Random spacing between curve points creates organic flow
- **Wildness Control**: Configurable curve variation (0-1 scale)
- **Gaussian Smoothing**: Multi-pass smoothing for reduced sharp angles
- **Vertical Bounds**: Configurable margins from viewport edges

### Animation System
- **GSAP Integration**: Smooth, performant animation using GreenSock
- **Text Following Path**: Characters rotate and position along the path
- **Infinite Looping**: Seamless continuous animation
- **Configurable Speed**: Adjustable animation speed in pixels per second
- **Viewport Optimization**: Only renders visible portions of the path

### Accessibility
- **Screen Reader Support**: Text content provided via `.sr-only` element
- **Motion Preferences**: Respects `prefers-reduced-motion` media query
- **ARIA Hidden**: Canvas marked as decorative with `aria-hidden="true"`

## Props Interface

```typescript
interface Props {
  texts: string[];                    // Array of text options (one selected randomly)
  speed?: number;                     // Animation speed in pixels/second (default: 50)
  pathWildness?: number;              // Curve variation 0-1 (default: 0.7)
  verticalBounds?: number;            // Margin from edges 0-1 (default: 0.1)
  showPath?: boolean;                 // Show path stroke (default: true)
  fixedCanvasWidth?: number;          // Fixed width for stability (default: 2560)
  pathStyle?: {
    strokeColor: string;              // Path stroke color (default: '#cccccc')
    strokeWidth: number;              // Path stroke width (default: 40)
    opacity: number;                  // Path opacity (default: 0.5)
  };
  textStyle?: {
    font: string;                     // Font specification (default: 'bold 24px sans-serif')
    size: number;                     // Font size in pixels (default: 24)
    color: string;                    // Text color (default: '#000000')
  };
}
```

## Usage Examples

### Basic Usage

```svelte
<script>
  import AnimatedTextPath from '$lib/components/graphics/AnimatedTextPath.svelte';
</script>

<AnimatedTextPath texts={['HELLO WORLD']} />
```

### Multiple Text Options

```svelte
<AnimatedTextPath
  texts={[
    'HALLO •',
    'HEJ •',
    'HOLA •',
    'BONJOUR •'
  ]}
  speed={70}
/>
```

### Custom Styling

```svelte
<AnimatedTextPath
  texts={['LETS COOK –']}
  speed={100}
  pathWildness={0.9}
  pathStyle={{
    strokeColor: '#ff6b6b',
    strokeWidth: 40,
    opacity: 0.7
  }}
  textStyle={{
    font: 'bold 32px Arial',
    size: 32,
    color: '#2c3e50'
  }}
/>
```

### Index Page Implementation

The component is used on the homepage to replace large inline SVG decorative elements:

```svelte
<AnimatedTextPath
  texts={[
    'HALLO •',
    'HEJ •',
    'HOLA •',
    'BONJOUR •',
    'NAMASTE •',
    'SALAAM •'
  ]}
  speed={70}
/>
```

## Technical Implementation

### Path Generation Algorithm

1. **Control Point Generation**
   - Creates irregular spacing between curves (0.5-1.5x average)
   - Alternates between high and low vertical positions
   - Applies wildness factor to variation range

2. **Catmull-Rom Interpolation**
   - Smooth curves through control points
   - Natural, organic flow without sharp corners
   - High resolution for smooth rendering

3. **Gaussian Smoothing**
   - Multi-pass smoothing with weighted averaging
   - Reduces sharp angle changes
   - Creates flowing, continuous paths

4. **Path Length Calculation**
   - Precise distance measurements along path
   - Enables accurate text positioning
   - Supports seamless looping

### Text Animation

- **Character Positioning**: Each character placed at specific distance along path
- **Rotation**: Characters rotated to match path angle at their position
- **Smoothed Angles**: Averaging nearby segments for smooth text rotation
- **Repeating Pattern**: Text pattern repeats seamlessly for infinite animation
- **Viewport Culling**: Only renders characters within visible area plus margin

### Performance Optimizations

- **Fixed Canvas Width**: Stable canvas dimensions prevent recalculations
- **Device Pixel Ratio**: Proper scaling for sharp rendering on high-DPI displays
- **Viewport Tracking**: Only renders visible portions of animation
- **GSAP Animation**: Hardware-accelerated, efficient animation loop
- **Resize Handling**: Lightweight viewport updates without full regeneration

## Recent Changes (v1.1)
<!-- Updated: 2025-09-30 22:20:00 UTC -->

### Visual Updates
- **Stroke Width**: Increased from `2px` to `40px` for bold, prominent appearance
- **Container Position**: Changed from `absolute` to `relative` for page flow integration
- **Container Height**: Reduced from `100vh` to `20vh` for compact header decoration

### Impact on Usage
- **Page Layout**: Component now affects page flow instead of floating as overlay
- **Visual Prominence**: Much more visible path creates stronger design element
- **Space Efficiency**: Reduced height makes component suitable for header/banner areas

### Migration from Previous Version

**Before (v1.0):**
```svelte
<!-- Floating full-height overlay with subtle path -->
<AnimatedTextPath
  texts={['HELLO']}
  pathStyle={{ strokeWidth: 2 }}
/>
```

**After (v1.1):**
```svelte
<!-- Integrated compact header with bold path -->
<AnimatedTextPath
  texts={['HELLO']}
  pathStyle={{ strokeWidth: 40 }}
/>
```

## Browser Compatibility

### Required Features
- Canvas API support
- IntersectionObserver API (for viewport detection)
- GSAP animation library
- ES6+ JavaScript features

### Fallback Behavior
- On browsers without canvas support, only screen-reader text is shown
- Motion preferences automatically respected
- Graceful degradation for accessibility

## Best Practices

### Text Selection
- **Keep it short**: 1-3 words work best
- **Use separators**: Add spaces or symbols between repeating text
- **Consider readability**: Ensure text remains legible while animated

### Performance
- **Limit instances**: Use sparingly (1-2 per page)
- **Optimize speed**: Lower speeds reduce frame rate requirements
- **Monitor canvas size**: Larger canvases impact performance

### Styling
- **Contrast**: Ensure text and path have sufficient contrast with background
- **Path visibility**: Balance path prominence with text readability
- **Responsive design**: Consider different viewport sizes

## Related Documentation

- [AnimatedTextPath Spag Implementation Plan](../animatedText/AnimatedTextPathSpag-Implementation-Plan.md) - Advanced spaghetti-style implementation
- [Dual AnimatedTextPath Refactor Plan](../animatedText/dual-animated-text-path-refactor-plan.md) - Multi-path coordination
- [Enhanced Glitch Animation](../animation/Enhanced-Glitch-Animation-Refactor-Plan.md) - Related animation effects
- [Index Page Route](/frontend/src/routes/+page.svelte) - Current usage example

## Troubleshooting

### Path Not Rendering
**Problem**: Path or text not appearing
**Solution**: Check that canvas dimensions are properly set and context is initialized

### Animation Stuttering
**Problem**: Choppy animation performance
**Solution**: Reduce path complexity (lower wildness) or increase animation speed

### Text Overlap
**Problem**: Repeated text overlapping itself
**Solution**: Adjust text length or add more spacing between repetitions

### Viewport Issues
**Problem**: Animation cut off or misaligned
**Solution**: Verify container dimensions and fixedCanvasWidth settings

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-09-30 22:20:00 UTC | v1.1 | Updated visual styling: strokeWidth 2→40, position absolute→relative, height 100vh→20vh |
| 2025-08-27 15:00:00 UTC | v1.0 | Initial implementation with organic path generation and GSAP animation |

---

*This documentation covers the AnimatedTextPath graphics component. For implementation details, refer to `/frontend/src/lib/components/graphics/AnimatedTextPath.svelte`.*

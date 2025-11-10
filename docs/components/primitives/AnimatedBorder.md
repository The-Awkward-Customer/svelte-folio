# AnimatedBorder Primitive Component
*Created: 2025-10-06 00:00:00 UTC*

## Overview

The AnimatedBorder primitive is a reusable wrapper component that adds an animated rotating gradient border to any child element. This component was extracted from the deprecated Card component to provide a focused, composable primitive for border animations that can be applied to any element in the application.

## Component Location

`/frontend/src/lib/components/primitives/AnimatedBorder.svelte`

## Component Features

### Core Functionality
- **Universal Wrapper**: Wraps any child content with animated border effect
- **Viewport Detection**: Uses IntersectionObserver to activate animation only when visible
- **Svelte 5 Snippets**: Modern children pattern for optimal performance
- **Customizable Configuration**: All aspects of the border and animation are configurable
- **Border Radius Inheritance**: Border automatically inherits the child element's border-radius
- **Performance Optimized**: GPU-accelerated CSS animation with minimal JavaScript

### Visual Characteristics
- **Animated Gradient**: Rotating conic gradient creates a dynamic border effect
- **Smooth Transitions**: 0.3s opacity fade when entering/exiting viewport
- **Mask Composite Technique**: CSS mask creates border-only effect without affecting content
- **Default Multi-Color Gradient**: Purple, red, yellow, blue gradient sequence

## Props Interface

```typescript
interface Props {
  children: Snippet;              // Required: Content to wrap with animated border
  borderWidth?: number;           // Border width in pixels (default: 1)
  animationDuration?: number;     // Animation duration in seconds (default: 8)
  threshold?: number;             // IntersectionObserver threshold 0-1 (default: 0.1)
  gradient?: string;              // Custom CSS conic-gradient string
}
```

### Prop Details

#### `borderWidth` (optional)
- **Type**: `number`
- **Default**: `1`
- **Description**: Width of the animated border in pixels
- **Example**: `borderWidth={2}` creates a 2px border

#### `animationDuration` (optional)
- **Type**: `number`
- **Default**: `8`
- **Description**: Duration of one complete rotation in seconds
- **Example**: `animationDuration={5}` makes the animation faster

#### `threshold` (optional)
- **Type**: `number`
- **Default**: `0.1`
- **Description**: IntersectionObserver threshold (0-1) for viewport detection
- **Example**: `threshold={0.5}` activates when 50% of element is visible

#### `gradient` (optional)
- **Type**: `string`
- **Default**: Multi-color conic gradient (see Technical Implementation)
- **Description**: Custom CSS conic-gradient definition
- **Example**: `gradient="conic-gradient(from var(--gradient-angle, 0deg), red, blue)"`

## Usage Examples

### Basic Usage

Wrap any element with an animated border:

```svelte
<script>
  import { AnimatedBorder } from '$lib/components/primitives';
</script>

<AnimatedBorder>
  <div style="padding: 2rem; border-radius: 8px; background: white;">
    <h2>Content with animated border</h2>
    <p>This content is wrapped with a rotating gradient border.</p>
  </div>
</AnimatedBorder>
```

### Custom Border Width

Create a thicker, more prominent border:

```svelte
<AnimatedBorder borderWidth={3}>
  <div class="card">
    <h3>Feature Card</h3>
    <p>With a bold 3px animated border</p>
  </div>
</AnimatedBorder>
```

### Faster Animation

Speed up the rotation animation:

```svelte
<AnimatedBorder animationDuration={4}>
  <button class="cta-button">
    Click Me!
  </button>
</AnimatedBorder>
```

### Custom Gradient

Define your own color scheme:

```svelte
<AnimatedBorder
  borderWidth={2}
  gradient="conic-gradient(
    from var(--gradient-angle, 0deg),
    #ff6b6b 0%,
    #4ecdc4 25%,
    #45b7d1 50%,
    #f7b731 75%,
    #ff6b6b 100%
  )"
>
  <div class="custom-card">
    Custom gradient border
  </div>
</AnimatedBorder>
```

### Delayed Activation

Require more of the element to be visible before activating:

```svelte
<AnimatedBorder threshold={0.5}>
  <div class="hero-section">
    <!-- Border activates when 50% visible -->
  </div>
</AnimatedBorder>
```

### Wrapping Images

Add animated border to images:

```svelte
<AnimatedBorder borderWidth={2}>
  <img
    src="/product.jpg"
    alt="Product"
    style="border-radius: 12px; display: block;"
  />
</AnimatedBorder>
```

### Wrapping Custom Components

Combine with other primitives:

```svelte
<script>
  import { AnimatedBorder, Image } from '$lib/components/primitives';
</script>

<AnimatedBorder borderWidth={2}>
  <Image
    src="/avatar.jpg"
    alt="User avatar"
    borderRadius="pill"
    width={200}
    height={200}
  />
</AnimatedBorder>
```

## Technical Implementation

### Default Gradient

The default gradient uses a carefully crafted multi-color conic gradient:

```css
conic-gradient(
  from var(--gradient-angle, 0deg),
  #161616 0%,        /* Dark start */
  #161616 33.33%,    /* Extended dark */
  #c679c4 40%,       /* Purple */
  #fa3d1d 45%,       /* Red */
  #ffc800 50%,       /* Yellow */
  #e1e1e1 55%,       /* Light gray */
  #3b58e7 60%,       /* Blue */
  rgba(255, 255, 255, 0) 66%,  /* Transparent */
  #161616 100%       /* Back to dark */
)
```

### Animation Mechanism

1. **CSS Custom Property**: Uses `--gradient-angle` with `@property` for smooth animation
2. **Pseudo-element**: Border is rendered on `::before` pseudo-element
3. **Mask Composite**: CSS mask technique creates border-only effect
4. **Viewport State**: Class `.animated-border--active` triggers animation

### CSS Structure

```css
.animated-border {
  position: relative;  /* Required for absolute pseudo-element */
}

.animated-border::before {
  content: "";
  position: absolute;
  inset: calc(var(--border-width) * -1);  /* Extends beyond element */
  border-radius: inherit;                  /* Matches child border-radius */
  padding: var(--border-width);
  background: var(--gradient);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;                             /* Hidden by default */
  transition: opacity 0.3s ease;
}

.animated-border--active::before {
  opacity: 1;                             /* Visible when in viewport */
  animation: rotate-border var(--animation-duration) linear infinite;
}
```

### Viewport Detection

The component uses IntersectionObserver for efficient viewport tracking:

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      isInViewport = entry.isIntersecting;
    });
  },
  { threshold }  // Configurable visibility threshold
);
```

## Performance Considerations

### Optimization Techniques
- **GPU Acceleration**: CSS custom properties with `@property` enable hardware acceleration
- **Viewport Detection**: Animation only runs when element is visible
- **CSS-Only Animation**: No JavaScript animation loop required
- **Efficient Masking**: Modern CSS mask-composite for border effect
- **Proper Cleanup**: Observer disconnected on component unmount

### Performance Tips
- **Limit Usage**: Use sparingly for featured elements (2-3 per page max)
- **Consider Mobile**: Thinner borders and longer durations reduce mobile CPU usage
- **Batch Elements**: Group multiple elements in a single wrapper when possible

## Browser Support

### Required Features
- CSS `@property` for smooth gradient rotation
- CSS `conic-gradient` support
- CSS mask and mask-composite
- IntersectionObserver API
- Svelte 5 snippet support

### Fallback Behavior
On browsers without full support:
- Border will not animate but element remains functional
- Content is always visible and accessible
- Graceful degradation ensures usability

## Accessibility Features

### Motion Preferences
The component should respect reduced motion preferences (add to your global CSS):

```css
@media (prefers-reduced-motion: reduce) {
  .animated-border--active::before {
    animation: none;
  }
}
```

### Screen Reader Support
- Border is purely decorative and doesn't affect content
- Child content remains fully accessible
- No additional ARIA attributes needed

## Migration from Card Component

### Before (Card with animated border)

```svelte
<script>
  import { Card } from '$lib/components/primitives';
</script>

<Card alignment="center">
  <h2>Feature</h2>
  <p>Description</p>
</Card>
```

### After (AnimatedBorder wrapper)

```svelte
<script>
  import { AnimatedBorder } from '$lib/components/primitives';
</script>

<AnimatedBorder>
  <div style="display: flex; flex-direction: column; align-items: center;">
    <h2>Feature</h2>
    <p>Description</p>
  </div>
</AnimatedBorder>
```

**Benefits of Migration:**
- More focused, single-purpose component
- Reusable with any element, not just card layouts
- Simpler mental model (wrapper vs. layout component)
- Easier to compose with other primitives

## Integration with Other Primitives

### With Section Component

```svelte
<Section id="hero">
  {#snippet main()}
    <AnimatedBorder borderWidth={2}>
      <div class="hero-content">
        <h1>Welcome</h1>
        <p>Hero section with animated border</p>
      </div>
    </AnimatedBorder>
  {/snippet}
</Section>
```

### With Image Component

```svelte
<AnimatedBorder borderWidth={3}>
  <Image
    src="/featured.jpg"
    alt="Featured content"
    borderRadius="lg"
    objectFit="cover"
  />
</AnimatedBorder>
```

### With Badge Component

```svelte
<AnimatedBorder>
  <div class="status-card">
    <h3>System Status</h3>
    <Badge pulse={true} />
    <p>All systems operational</p>
  </div>
</AnimatedBorder>
```

## Best Practices

### Border Width Selection
- **1-2px**: Subtle, elegant borders for professional layouts
- **3-4px**: Medium prominence for featured content
- **5px+**: Bold, attention-grabbing for CTAs and hero sections

### Animation Duration
- **Fast (3-5s)**: Eye-catching, energetic feel
- **Medium (6-8s)**: Balanced, professional appearance (default)
- **Slow (10-15s)**: Subtle, ambient effect

### Gradient Design
- **Brand Colors**: Use your brand palette in the gradient
- **Contrast**: Ensure gradient colors work with background
- **Simplicity**: 3-5 colors typically work best
- **Opacity**: Consider transparent sections for varied visual rhythm

### When to Use AnimatedBorder
**Good use cases:**
- Hero sections and landing page features
- Call-to-action buttons and cards
- Featured images or profile avatars
- Premium content indicators
- Interactive elements on hover

**Avoid using for:**
- Large numbers of elements (performance)
- Small text elements (visual noise)
- Rapidly changing content (animation disruption)
- Print styles or static exports

## Troubleshooting

### Border Not Appearing
**Problem**: Border is invisible
**Solutions**:
- Ensure child element has background color
- Check that element has entered viewport (scroll down/up)
- Verify browser supports CSS mask and conic-gradient
- Inspect DevTools for CSS conflicts

### Border Not Animating
**Problem**: Border visible but not rotating
**Solutions**:
- Check browser support for CSS `@property`
- Verify element is in viewport (check IntersectionObserver)
- Look for CSS that might override animation
- Check console for JavaScript errors

### Border Doesn't Match Element Shape
**Problem**: Border corners don't align with content
**Solutions**:
- Ensure child element has `border-radius` defined
- Border inherits radius from child, not wrapper
- Check that child element doesn't have conflicting positioning

### Animation Performance Issues
**Problem**: Choppy or laggy animation
**Solutions**:
- Reduce number of AnimatedBorder instances on page
- Increase animation duration for smoother motion
- Check for other heavy animations/operations on page
- Test on different devices to identify bottlenecks

## Related Documentation

- [Section Component](./Section.md) - Grid-based layout primitive
- [Badge Component](./Badge.md) - Status indicator with pulse animation
- [Image Component](./Image.md) - Image primitive with placeholder support
- [Primitives Overview](./README.md) - Complete primitives system
- [Card Component [DEPRECATED]](./Card.md) - Historical Card component

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-06 00:00:00 UTC | v1.0 | Initial AnimatedBorder component documentation, extracted from deprecated Card component |

---

*This documentation covers the AnimatedBorder primitive component. For implementation details, refer to `/frontend/src/lib/components/primitives/AnimatedBorder.svelte`.*

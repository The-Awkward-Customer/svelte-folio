# Card Primitive Component [DEPRECATED]
*Created: 2025-09-25 12:30:00 UTC*
*Last Updated: 2025-09-30 22:15:00 UTC*
*Deprecated: 2025-10-06 00:00:00 UTC*

## Deprecation Notice

**This component has been removed from the codebase as of October 6, 2025.**

The Card component has been decomposed into two more focused, reusable primitives:
- **AnimatedBorder** - Reusable animated gradient border wrapper (see [AnimatedBorder.md](./AnimatedBorder.md))
- **Section** - Grid-based layout component for page sections (see [Section.md](./Section.md))

### Migration Path

If you were using the Card component, please migrate to:
1. **AnimatedBorder** for components that need animated borders
2. **Section** for layout and content sectioning
3. Custom div elements for simple container needs

## Overview (Historical)

The Card primitive component provided a flexible container with consistent styling, alignment options, modern Svelte 5 children snippet patterns, and an animated gradient border effect. It served as a foundational building block for layouts, content grouping, and UI composition throughout the application.

## Component Features

### Core Functionality
- **Flexible Alignment**: Three alignment options for content positioning
- **Svelte 5 Snippets**: Modern children pattern using snippets for optimal performance
- **Design Token Integration**: Consistent styling using OKLCH color space
- **Responsive Design**: Automatic responsive behavior with full-width constraints
- **Viewport Detection**: IntersectionObserver integration to detect when cards enter the viewport
- **Animated Border**: Rotating gradient border that activates when card is visible

### Visual Characteristics
- **Rounded Corners**: Uses `--border-radius-lg` token for consistent corner rounding
- **Neutral Background**: Subtle background using `--surface-neutral-reading` token
- **Flexbox Layout**: Column-based layout with customizable content alignment
- **Full Container**: Takes full width and height of parent container
- **Animated Gradient Border**: Multi-color conic gradient border that rotates when card is in viewport

## Props Interface

```typescript
interface Props {
  alignment?: "left" | "center" | "right";  // Content alignment (default: "left")
  children?: Snippet;                       // Content using Svelte 5 snippets
}
```

## Alignment Variants

### Left Alignment (Default)
Content is aligned to the flex-start, creating left-aligned layouts.

```svelte
<Card alignment="left">
  <h3>Left-aligned content</h3>
  <p>This content aligns to the left side of the card.</p>
</Card>
```

### Center Alignment
Content is centered both horizontally within the card container.

```svelte
<Card alignment="center">
  <h3>Centered content</h3>
  <p>This content is perfectly centered in the card.</p>
</Card>
```

### Right Alignment
Content is aligned to the flex-end, creating right-aligned layouts.

```svelte
<Card alignment="right">
  <h3>Right-aligned content</h3>
  <p>This content aligns to the right side of the card.</p>
</Card>
```

## Usage Examples

### Basic Content Card
<!-- Updated: 2025-09-25 12:30:00 UTC -->
```svelte
<script>
  import { Card } from '$lib/components/primitives';
</script>

<Card>
  <h2>Welcome</h2>
  <p>This is a basic card with default left alignment.</p>
  <button>Get Started</button>
</Card>
```

### Profile Card with Center Alignment
```svelte
<script>
  import { Card, Image } from '$lib/components/primitives';
</script>

<Card alignment="center">
  <Image
    src="/avatars/user.jpg"
    alt="User avatar"
    borderRadius="pill"
    width={80}
    height={80}
  />
  <h3>John Doe</h3>
  <p>Senior Developer</p>
  <button>View Profile</button>
</Card>
```

### Action Card with Right Alignment
```svelte
<Card alignment="right">
  <h4>Settings</h4>
  <p>Configure your preferences</p>
  <div class="button-group">
    <button>Cancel</button>
    <button class="primary">Save</button>
  </div>
</Card>
```

### Complex Layout Card
```svelte
<script>
  import { Card, Image, Badge } from '$lib/components/primitives';
</script>

<Card alignment="left">
  <div class="card-header">
    <h3>Project Status</h3>
    <Badge pulse={true} />
  </div>

  <Image
    src="/projects/dashboard-preview.jpg"
    alt="Dashboard preview"
    borderRadius="md"
    objectFit="cover"
  />

  <div class="card-content">
    <p>Latest updates to the admin dashboard are now live.</p>
    <div class="metrics">
      <span>95% Complete</span>
      <span>Due: Oct 1</span>
    </div>
  </div>

  <div class="card-actions">
    <button>View Details</button>
    <button class="secondary">Edit</button>
  </div>
</Card>
```

## Advanced Composition Patterns

### Grid Layout with Cards
```svelte
<div class="card-grid">
  <Card alignment="center">
    <h3>Feature A</h3>
    <p>Description of feature A</p>
  </Card>

  <Card alignment="center">
    <h3>Feature B</h3>
    <p>Description of feature B</p>
  </Card>

  <Card alignment="center">
    <h3>Feature C</h3>
    <p>Description of feature C</p>
  </Card>
</div>

<style>
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  }
</style>
```

### Nested Card Composition
```svelte
<Card alignment="left">
  <h2>Dashboard Overview</h2>

  <div class="nested-cards">
    <Card alignment="center">
      <h4>Users</h4>
      <p class="metric">1,234</p>
    </Card>

    <Card alignment="center">
      <h4>Revenue</h4>
      <p class="metric">$12,345</p>
    </Card>
  </div>
</Card>

<style>
  .nested-cards {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .nested-cards :global(.card) {
    flex: 1;
    padding: 1rem;
  }

  .metric {
    font-size: 2rem;
    font-weight: bold;
    color: var(--fg-primary-default);
  }
</style>
```

### Conditional Content Cards
```svelte
<script>
  let userType = $state('premium');
  let showNotification = $state(true);
</script>

<Card alignment="center">
  <h3>Account Status</h3>

  {#if userType === 'premium'}
    <div class="premium-badge">Premium Member</div>
    <p>Enjoy unlimited access to all features.</p>
  {:else}
    <p>Upgrade to premium for more features.</p>
    <button class="upgrade-btn">Upgrade Now</button>
  {/if}

  {#if showNotification}
    <div class="notification">
      <p>Don't forget to check your settings!</p>
      <button on:click={() => showNotification = false}>Dismiss</button>
    </div>
  {/if}
</Card>
```

## Animated Border Feature
<!-- Updated: 2025-09-30 22:15:00 UTC -->

The Card component includes a sophisticated animated border effect that activates when the card enters the viewport. This feature uses modern CSS techniques to create a rotating gradient border without affecting the card's content.

### How It Works

1. **Viewport Detection**: An IntersectionObserver monitors when the card enters the viewport (with a 10% threshold)
2. **State Management**: The `isInViewport` state updates when the card's visibility changes
3. **CSS Class Toggle**: The `card--in-viewport` class is added when the card is visible
4. **Border Animation**: A rotating conic gradient border animates continuously when the viewport class is active

### Technical Implementation

The animated border uses a `::before` pseudo-element with:
- **Conic gradient**: Multi-color gradient with custom color stops
- **CSS Custom Property**: `--gradient-angle` for animatable rotation
- **Mask Composite**: Creates border effect by masking the content area
- **Smooth Transition**: 0.3s opacity transition for graceful appearance

### Border Color Palette

```css
#161616 (Dark) → #C679C4 (Purple) → #FA3D1D (Red) →
#FFC800 (Yellow) → #E1E1E1 (Light Gray) → #3B58E7 (Blue) →
Transparent → #161616 (Dark)
```

### Animation Behavior

- **Initial State**: Border is invisible (opacity: 0)
- **In Viewport**: Border fades in and begins rotating
- **Animation Duration**: 8 seconds for one complete rotation
- **Animation Type**: Linear, infinite loop
- **Performance**: Uses CSS custom properties with `@property` for optimal GPU acceleration

### Accessibility

The animation respects user motion preferences:
```css
@media (prefers-reduced-motion: reduce) {
  .card--in-viewport::before {
    animation: none;
  }
}
```

## CSS Classes and Styling

### Generated Classes
```css
/* Base component */
.card

/* Alignment variants */
.card--left      /* align-items: flex-start */
.card--center    /* align-items: center */
.card--right     /* align-items: flex-end */

/* Viewport state */
.card--in-viewport  /* Applied when card is visible in viewport */
```

### Default Styling
```css
.card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  border-radius: var(--border-radius-lg);
  background-color: var(--surface-neutral-reading);
  position: relative;
}
```

### Animated Border Styling
```css
.card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: var(--border-radius-lg);
  padding: 2px;
  background: conic-gradient(
    from var(--gradient-angle, 0deg),
    #161616 0%,
    #161616 33.33%,
    #C679C4 40%,
    #FA3D1D 45%,
    #FFC800 50%,
    #E1E1E1 55%,
    #3B58E7 60%,
    rgba(255, 255, 255, 0.00) 66%,
    #161616 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card--in-viewport::before {
  opacity: 1;
  animation: rotate-border 8s linear infinite;
}
```

### Custom Styling with CSS Classes
```svelte
<Card alignment="center" class="custom-card">
  <h3>Custom Styled Card</h3>
</Card>

<style>
  :global(.custom-card) {
    border: 2px solid var(--border-primary-default);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
  }

  :global(.custom-card:hover) {
    transform: translateY(-2px);
  }
</style>
```

## Design Token Integration

### Background Colors
```css
--surface-neutral-reading: oklch(98.36% 0.01 15.84); /* Card background */
```

### Border Radius
```css
--border-radius-lg: 0.5rem; /* Card corner rounding */
```

### Responsive Behavior
The Card component adapts to its container and works well across different screen sizes:

```css
/* Example responsive usage */
@media (min-width: 768px) {
  .card-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .card-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

## Svelte 5 Snippets Pattern

### Modern Children API
The Card component uses Svelte 5's children snippet pattern for optimal performance:

```typescript
interface Props {
  children?: Snippet; // Optional snippet for content
}
```

### Rendering Children
```svelte
<div class={classes}>
  {@render children?.()}
</div>
```

### Benefits of Snippet Pattern
- **Performance**: No unnecessary re-renders of child content
- **Type Safety**: Full TypeScript support for child components
- **Flexibility**: Any content can be passed as children
- **Modern**: Leverages latest Svelte 5 capabilities

## Accessibility Features

### Semantic Structure
- Uses proper `div` container with semantic role when needed
- Maintains natural tab order for child elements
- Preserves focus management within card content

### Screen Reader Support
- Content flows naturally for screen readers
- Child elements maintain their semantic meaning
- Proper heading hierarchy is preserved

## Performance Considerations

### Lightweight Implementation
- Minimal JavaScript runtime overhead
- CSS-only styling approach for visual variants
- No complex state management or event handling

### Efficient Rendering
- Svelte 5 snippets prevent unnecessary re-renders
- Derived classes computed only when props change
- Optimized CSS selectors for fast rendering

## Migration from Legacy Card Patterns

### Before (Custom div with classes)
```svelte
<div class="card custom-card">
  <h3>Content</h3>
  <p>Description</p>
</div>

<style>
  .custom-card {
    /* Custom styling */
  }
</style>
```

### After (Card Primitive)
```svelte
<script>
  import { Card } from '$lib/components/primitives';
</script>

<Card alignment="left">
  <h3>Content</h3>
  <p>Description</p>
</Card>
```

### Benefits of Migration
- Consistent styling across application
- Built-in alignment options
- Design token integration
- TypeScript type safety
- Modern Svelte 5 patterns

## Integration with Other Primitives

### With Image Primitive
```svelte
<Card alignment="center">
  <Image
    src="/product.jpg"
    alt="Product image"
    borderRadius="md"
    objectFit="cover"
  />
  <h3>Product Name</h3>
  <p>$99.99</p>
</Card>
```

### With Badge Primitive
```svelte
<Card alignment="left">
  <div class="card-header">
    <h3>Notifications</h3>
    <Badge pulse={true} />
  </div>
  <p>You have new messages.</p>
</Card>
```

## Best Practices

### Content Organization
**Do**: Use semantic HTML within cards
```svelte
<Card>
  <header>
    <h2>Article Title</h2>
    <time datetime="2025-09-25">September 25, 2025</time>
  </header>
  <main>
    <p>Article content...</p>
  </main>
  <footer>
    <button>Read More</button>
  </footer>
</Card>
```

### Alignment Selection
**Do**: Choose alignment based on content type
```svelte
<!-- Center for symmetric content -->
<Card alignment="center">
  <img src="/icon.svg" alt="Icon" />
  <h3>Feature</h3>
</Card>

<!-- Left for text-heavy content -->
<Card alignment="left">
  <h3>Long Article Title</h3>
  <p>Extended description...</p>
</Card>

<!-- Right for actions -->
<Card alignment="right">
  <button>Cancel</button>
  <button class="primary">Confirm</button>
</Card>
```

### Responsive Considerations
**Do**: Plan card layouts for different screen sizes
```svelte
<div class="responsive-cards">
  <Card alignment="center">Content A</Card>
  <Card alignment="center">Content B</Card>
  <Card alignment="center">Content C</Card>
</div>

<style>
  .responsive-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (min-width: 768px) {
    .responsive-cards {
      flex-direction: row;
    }
  }
</style>
```

## Common Patterns

### Dashboard Cards
```svelte
<div class="dashboard-grid">
  <Card alignment="center">
    <h3>Total Users</h3>
    <div class="metric">12,345</div>
    <span class="change positive">+12%</span>
  </Card>

  <Card alignment="center">
    <h3>Revenue</h3>
    <div class="metric">$98,765</div>
    <span class="change positive">+8%</span>
  </Card>

  <Card alignment="center">
    <h3>Orders</h3>
    <div class="metric">1,234</div>
    <span class="change negative">-3%</span>
  </Card>
</div>
```

### Feature Cards
```svelte
<div class="feature-grid">
  <Card alignment="left">
    <div class="feature-icon">🚀</div>
    <h3>Fast Performance</h3>
    <p>Lightning-fast loading times and smooth interactions.</p>
  </Card>

  <Card alignment="left">
    <div class="feature-icon">🔒</div>
    <h3>Secure</h3>
    <p>Enterprise-grade security with end-to-end encryption.</p>
  </Card>

  <Card alignment="left">
    <div class="feature-icon">📱</div>
    <h3>Responsive</h3>
    <p>Works perfectly on all devices and screen sizes.</p>
  </Card>
</div>
```

## Troubleshooting

### Content Alignment Issues
**Problem**: Content not aligning as expected
**Solution**: Check parent container constraints and ensure proper CSS display properties

**Problem**: Cards not responding to alignment props
**Solution**: Verify that child content doesn't have conflicting CSS that overrides the card's flex alignment

### Layout Problems
**Problem**: Cards not filling container height
**Solution**: Ensure parent container has defined height or use CSS Grid for equal-height cards

## Related Documentation

- [Image Primitive](./Image.md) - Composable image component
- [Badge Primitive](./Badge.md) - Status indicator component
- [Primitives Overview](./README.md) - Complete primitives system
- [CSS Architecture](../../css/css-architecture-overview-2025-08-28-1125.md) - Design system integration

## Viewport Detection API

### IntersectionObserver Configuration

The Card component automatically sets up viewport detection using the IntersectionObserver API:

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      isInViewport = entry.isIntersecting;
    });
  },
  { threshold: 0.1 }
);
```

### Configuration Options

- **Threshold**: 0.1 (10%) - Card is considered "in viewport" when 10% is visible
- **Root**: Default (viewport) - Uses the browser viewport as the root
- **Automatic Cleanup**: Observer is properly disconnected when component unmounts

### State Management

The component uses Svelte 5's `$state` rune for reactive viewport tracking:

```typescript
let isInViewport = $state(false);
```

This state automatically updates when the card enters or exits the viewport, triggering the animated border effect.

## Performance Considerations

### Viewport Detection Performance

- **Lightweight Observer**: Single IntersectionObserver instance per card
- **Efficient Threshold**: 10% threshold balances early activation with performance
- **Proper Cleanup**: Observer is disconnected on component unmount to prevent memory leaks

### Animation Performance

- **CSS-Only Animation**: Border rotation uses pure CSS for 60fps performance
- **GPU Acceleration**: Conic gradient and custom properties leverage GPU
- **Mask Composite**: Modern CSS mask technique for efficient border rendering
- **No JavaScript Animation Loop**: All animation handled by CSS engine

### Browser Support

The animated border feature requires:
- CSS `@property` support for smooth gradient rotation
- CSS `conic-gradient` support
- CSS mask compositing support
- IntersectionObserver API support

**Fallback Behavior**: On browsers without full support, the border will not animate but the card remains fully functional.

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-09-30 22:15:00 UTC | v1.1 | Added animated gradient border feature with viewport detection using IntersectionObserver |
| 2025-09-25 12:30:00 UTC | v1.0 | Initial Card primitive documentation with alignment variants and Svelte 5 patterns |

---

*This documentation covers the Card primitive component. For the latest implementation details, refer to `/frontend/src/lib/components/primitives/Card.svelte`.*
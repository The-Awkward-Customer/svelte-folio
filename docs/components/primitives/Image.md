# Image Primitive Component
*Created: 2025-09-25 12:20:00 UTC*

## Overview

The Image primitive component provides comprehensive image display functionality with built-in placeholder support, flexible styling options, and consistent aspect ratio handling. It serves as the foundation for all image-related components throughout the application.

## Component Features

### Core Functionality
- **Smart Placeholder System**: Automatic fallback to styled placeholder when no `src` provided
- **Object Fit Variants**: Five different object-fit options for image scaling behavior
- **Border Radius Options**: Five border radius variants from sharp corners to pill-shaped
- **Lazy Loading**: Built-in lazy loading support with configurable loading strategy
- **Responsive Design**: Automatic responsive behavior with max-width constraints

### Visual Consistency
- **Fixed Aspect Ratio**: Maintains 16:9 aspect ratio for consistent layouts (placeholder mode)
- **Design Token Integration**: Uses OKLCH color space and consistent spacing tokens
- **Accessible Defaults**: Requires alt text and includes proper semantic structure

## Props Interface

```typescript
interface Props {
  src?: string;                    // Image source URL (optional)
  alt: string;                     // Required alt text for accessibility
  class?: string;                  // Additional CSS classes
  width?: number;                  // Explicit width in pixels
  height?: number;                 // Explicit height in pixels
  loading?: "eager" | "lazy";      // Loading strategy (default: "lazy")
  objectFit?: "cover" | "contain" | "fill" | "scale-down" | "none"; // Default: "cover"
  borderRadius?: "none" | "sm" | "md" | "lg" | "pill"; // Default: "none"
  placeholder?: boolean;           // Force placeholder mode (default: false)
  placeholderText?: string;        // Custom placeholder text (default: "Image Placeholder")
  placeholderSubtext?: string;     // Additional placeholder context (default: "")
}
```

## Object Fit Variants

### Cover (Default)
The image is scaled to maintain aspect ratio while filling the container. Portions may be cropped.
```svelte
<Image src="/image.jpg" alt="Example" objectFit="cover" />
```

### Contain
The image is scaled to maintain aspect ratio while fitting entirely within the container.
```svelte
<Image src="/image.jpg" alt="Example" objectFit="contain" />
```

### Fill
The image is scaled to fill the container exactly, potentially changing aspect ratio.
```svelte
<Image src="/image.jpg" alt="Example" objectFit="fill" />
```

### Scale-down
The image behaves as `none` or `contain`, whichever results in a smaller size.
```svelte
<Image src="/image.jpg" alt="Example" objectFit="scale-down" />
```

### None
The image is not scaled and keeps its original size.
```svelte
<Image src="/image.jpg" alt="Example" objectFit="none" />
```

## Border Radius Variants

### None (Default)
Sharp corners with no border radius.
```svelte
<Image src="/image.jpg" alt="Example" borderRadius="none" />
```

### Small
Subtle rounded corners using `--border-radius-sm` token.
```svelte
<Image src="/image.jpg" alt="Example" borderRadius="sm" />
```

### Medium
Moderate rounded corners using `--border-radius-md` token.
```svelte
<Image src="/image.jpg" alt="Example" borderRadius="md" />
```

### Large
Prominent rounded corners using `--border-radius-lg` token.
```svelte
<Image src="/image.jpg" alt="Example" borderRadius="lg" />
```

### Pill
Fully rounded ends creating pill shape using `--border-radius-pill` token.
```svelte
<Image src="/image.jpg" alt="Example" borderRadius="pill" />
```

## Placeholder System

### Automatic Placeholder Mode
When no `src` is provided, the component automatically displays a styled placeholder:

```svelte
<Image alt="Missing image" placeholderText="No image available" />
```

### Forced Placeholder Mode
Override even when `src` is provided to show placeholder:

```svelte
<Image
  src="/image.jpg"
  alt="Hidden image"
  placeholder={true}
  placeholderText="Content loading..."
  placeholderSubtext="Please wait"
/>
```

### Placeholder Styling
The placeholder maintains visual consistency with actual images:
- **Aspect Ratio**: Fixed 16:9 aspect ratio for layout stability
- **Visual Design**: Pink background with dashed border matching ArticleImage
- **Typography**: Hierarchical text with primary and secondary content
- **Responsive**: Scales appropriately across screen sizes

## Usage Examples

### Basic Image Display
<!-- Updated: 2025-09-25 12:20:00 UTC -->
```svelte
<script>
  import { Image } from '$lib/components/primitives';
</script>

<Image
  src="/photos/landscape.jpg"
  alt="Mountain landscape at sunset"
  borderRadius="md"
  objectFit="cover"
/>
```

### Avatar with Pill Shape
```svelte
<Image
  src="/avatars/user-123.jpg"
  alt="User profile photo"
  borderRadius="pill"
  objectFit="cover"
  width={64}
  height={64}
/>
```

### Product Image with Contain Fit
```svelte
<Image
  src="/products/widget-pro.jpg"
  alt="Widget Pro device on white background"
  objectFit="contain"
  borderRadius="lg"
  class="product-showcase"
/>
```

### Placeholder with Custom Text
```svelte
<Image
  alt="Product photo coming soon"
  placeholderText="Photo Unavailable"
  placeholderSubtext="We're working on adding product images"
  borderRadius="sm"
/>
```

### Hero Image with Eager Loading
```svelte
<Image
  src="/hero/homepage-banner.jpg"
  alt="Our modern office space with team collaboration"
  loading="eager"
  objectFit="cover"
  borderRadius="none"
  class="hero-image"
/>
```

## Advanced Integration Patterns

### Conditional Image Loading
```svelte
<script>
  let imageLoaded = $state(false);
  let imageSrc = $state('');

  function handleImageLoad(src: string) {
    imageSrc = src;
    imageLoaded = true;
  }
</script>

<Image
  src={imageLoaded ? imageSrc : undefined}
  alt="Dynamically loaded content"
  placeholderText="Loading image..."
  placeholderSubtext="Please wait while we fetch the content"
  borderRadius="md"
/>
```

### Gallery Thumbnail
```svelte
<Image
  src="/gallery/thumb-{item.id}.jpg"
  alt="Gallery item {item.title}"
  objectFit="cover"
  borderRadius="sm"
  width={150}
  height={150}
  class="gallery-thumbnail"
  loading="lazy"
/>
```

### Profile Card Integration
```svelte
<script>
  import { Image, Card } from '$lib/components/primitives';
</script>

<Card alignment="center">
  <Image
    src={user.avatar}
    alt="{user.name}'s profile photo"
    borderRadius="pill"
    objectFit="cover"
    width={80}
    height={80}
  />
  <h3>{user.name}</h3>
  <p>{user.role}</p>
</Card>
```

## CSS Classes and Styling

### Generated Classes
The component applies classes based on prop values:

```css
/* Base component */
.image

/* Object fit variants */
.image--cover
.image--contain
.image--fill
.image--scale-down
.image--none

/* Border radius variants */
.image--radius-sm
.image--radius-md
.image--radius-lg
.image--radius-pill

/* Placeholder mode */
.image-placeholder
.image-placeholder__text
.image-placeholder__subtext
```

### Custom Styling Override
Use the `class` prop to add custom styles:

```svelte
<Image
  src="/image.jpg"
  alt="Custom styled image"
  class="custom-image-style"
/>
```

```css
.custom-image-style {
  filter: grayscale(50%);
  transition: filter 0.3s ease;
}

.custom-image-style:hover {
  filter: grayscale(0%);
}
```

## Design Token Integration

### Color Tokens Used
```css
/* Placeholder styling */
--placeholder-bg: rgba(255, 0, 234, 0.07);
--placeholder-border: #f700ff;
--placeholder-text: #666;
```

### Spacing Tokens Used
```css
--border-radius-sm: 0.125rem;
--border-radius-md: 0.375rem;
--border-radius-lg: 0.5rem;
--border-radius-pill: 9999px;
```

## Accessibility Features

### Required Alt Text
The component enforces accessibility by requiring alt text:
```typescript
alt: string; // Required prop, cannot be omitted
```

### Semantic HTML
Uses proper `img` element for actual images and `div` with appropriate text content for placeholders.

### Screen Reader Support
- Alt text is always present and descriptive
- Placeholder text provides context when images aren't available
- Proper semantic structure for assistive technology

## Performance Considerations

### Lazy Loading Default
Images load lazily by default to improve page performance:
```svelte
<!-- Lazy loading (default) -->
<Image src="/image.jpg" alt="Deferred loading" />

<!-- Eager loading for above-the-fold content -->
<Image src="/hero.jpg" alt="Hero image" loading="eager" />
```

### Layout Stability
- Fixed aspect ratio for placeholders prevents layout shift
- Proper width/height attributes when specified
- CSS containment for predictable rendering

### Bundle Size
- Minimal runtime JavaScript
- CSS-only styling approach
- Tree-shakeable imports

## Integration with Higher-Level Components

### Used by ArticleImage
The ArticleImage component now uses this Image primitive:

```svelte
<!-- In ArticleImage.svelte -->
<Image {src} {alt} borderRadius="sm" class="article-image" />
```

### Composable with Card
Works seamlessly with Card primitive for layout:

```svelte
<Card alignment="center">
  <Image src="/preview.jpg" alt="Preview" borderRadius="md" />
</Card>
```

## Best Practices

### Alt Text Guidelines
**Do**: Write descriptive alt text
```svelte
<Image
  src="/chart.png"
  alt="Sales increased by 40% from Q2 to Q3 2025"
/>
```

**Don't**: Use generic or redundant alt text
```svelte
<!-- Avoid -->
<Image src="/image.png" alt="Image" />
```

### Loading Strategy
**Do**: Use eager loading for above-the-fold images
```svelte
<Image src="/hero.jpg" alt="Hero banner" loading="eager" />
```

**Do**: Keep lazy loading for gallery and content images
```svelte
<Image src="/gallery-item.jpg" alt="Gallery item" loading="lazy" />
```

### Object Fit Selection
**Do**: Use `cover` for thumbnails and previews
```svelte
<Image objectFit="cover" />
```

**Do**: Use `contain` for product photos and logos
```svelte
<Image objectFit="contain" />
```

## Error Handling

### Missing Images
When an image fails to load, the browser's default behavior applies. Consider implementing error handling:

```svelte
<script>
  let imageError = $state(false);
</script>

<Image
  src="/might-not-exist.jpg"
  alt="Potentially missing image"
  placeholder={imageError}
  placeholderText="Image failed to load"
  on:error={() => imageError = true}
/>
```

### Network Issues
The lazy loading default helps with slow network conditions by only loading images as needed.

## Migration from Standard img Elements

### Before (Standard HTML)
```html
<img src="/image.jpg" alt="Example image" class="rounded-image" />
```

### After (Image Primitive)
```svelte
<Image
  src="/image.jpg"
  alt="Example image"
  borderRadius="md"
/>
```

### Benefits of Migration
- Consistent placeholder system
- Standardized border radius options
- Built-in responsive behavior
- Design token integration
- TypeScript type safety

## Related Documentation

- [Card Primitive](./Card.md) - Composable container component
- [Badge Primitive](./Badge.md) - Status indicator component
- [ArticleImage Component](../article/ArticleImage.md) - Higher-level article image component
- [CSS Architecture Overview](../../css/css-architecture-overview-2025-08-28-1125.md) - Design system integration

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-09-25 12:20:00 UTC | v1.0 | Initial Image primitive documentation with comprehensive API and usage examples |

---

*This documentation covers the Image primitive component. For the latest implementation details, refer to `/frontend/src/lib/components/primitives/Image.svelte`.*
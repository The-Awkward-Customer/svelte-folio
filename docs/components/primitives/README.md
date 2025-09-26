# Primitive Components System
*Created: 2025-09-25 12:15:00 UTC*

## Overview

The Primitive Components System provides foundational UI building blocks designed for composability and reusability across the entire application. These components follow modern Svelte 5 patterns with TypeScript interfaces, design token integration, and consistent API conventions.

## Architecture Principles

### Svelte 5 First Design
- All components use `$props()` and `$derived()` reactive patterns
- TypeScript interfaces for comprehensive type safety
- Modern snippet-based composition where appropriate

### Design Token Integration
- Consistent use of CSS custom properties from the design system
- OKLCH color space support for modern color handling
- Responsive scaling through standardized tokens

### Compositional API
- Primitives can be composed into more complex components
- Consistent prop naming and behavior across all primitives
- Minimal but flexible configuration options

## Component Catalog

| Component | Purpose | Status | Location |
|-----------|---------|--------|----------|
| [Image](#image) | Image display with placeholders and variants | ✅ Active | `$lib/components/primitives/Image.svelte` |
| [Card](#card) | Flexible container with alignment options | ✅ Active | `$lib/components/primitives/Card.svelte` |
| [Badge](#badge) | Status indicators with animations | ✅ Active | `$lib/components/primitives/Badge.svelte` |

## Recent Changes
<!-- Updated: 2025-09-25 12:15:00 UTC -->

### Component Updates (September 2025)
- **NEW**: Image primitive component with comprehensive placeholder functionality
- **UPDATED**: Card component extracted with alignment props and Svelte 5 children snippets
- **RENAMED**: Indicator component renamed to Badge with updated class names and imports

## Design System Integration

### Color Tokens
All primitives use the OKLCH color space tokens:
```css
--fg-text-danger: oklch(63.61% 0.24 15.84);
--surface-neutral-reading: oklch(98.36% 0.01 15.84);
--border-radius-sm: 0.125rem;
--border-radius-md: 0.375rem;
--border-radius-lg: 0.5rem;
--border-radius-pill: 9999px;
```

### Responsive Breakpoints
Consistent breakpoints across all primitives:
```css
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
```

## Usage Patterns

### Direct Usage
Use primitives directly in your components:

```svelte
<script>
  import { Image, Card, Badge } from '$lib/components/primitives';
</script>

<Card alignment="center">
  <Image
    src="/example.jpg"
    alt="Example image"
    borderRadius="md"
    objectFit="cover"
  />
  <Badge pulse={true} />
</Card>
```

### Composition Pattern
Build higher-level components using primitives:

```svelte
<script>
  import { Image, Card } from '$lib/components/primitives';

  interface Props {
    imageUrl: string;
    title: string;
    description: string;
  }

  let { imageUrl, title, description }: Props = $props();
</script>

<Card alignment="left">
  <Image
    src={imageUrl}
    alt={title}
    borderRadius="lg"
    placeholder={!imageUrl}
    placeholderText="No image available"
  />
  <h3>{title}</h3>
  <p>{description}</p>
</Card>
```

## Component Documentation

### Quick Reference Links

- **[Image Component](./Image.md)** - Image display with placeholder functionality
- **[Card Component](./Card.md)** - Flexible container with alignment options
- **[Badge Component](./Badge.md)** - Animated status indicators

### Migration Guides

- **[Indicator → Badge Migration](./Badge.md#migration-guide)** - Guide for updating existing Indicator usage

## Best Practices

### Prop Naming Conventions
- Use descriptive, semantic prop names (`borderRadius` not `radius`)
- Boolean props should be questions (`placeholder`, `pulse`)
- Enums should be lowercase strings (`"left"`, `"center"`, `"right"`)

### Composition Guidelines
**Do**: Use primitives as building blocks
```svelte
<Card alignment="center">
  <Image src="/avatar.jpg" borderRadius="pill" />
  <Badge pulse={true} />
</Card>
```

**Don't**: Nest primitives inappropriately
```svelte
<!-- Avoid this -->
<Image>
  <Card>Content</Card>
</Image>
```

### Performance Considerations
- **Lazy Loading**: Image component defaults to `loading="lazy"`
- **Minimal Bundles**: Import only the primitives you need
- **CSS Containment**: All components use proper containment for layout stability

## Development Features

### Visual Debugging
All primitives include development-friendly class names following BEM conventions:
```css
.image
.image--cover
.image--radius-md

.card
.card--center

.badge
.badge--pulse
```

### TypeScript Support
Full TypeScript interfaces for all components:
```typescript
interface ImageProps {
  src?: string;
  alt: string;
  borderRadius?: "none" | "sm" | "md" | "lg" | "pill";
  // ... other props
}
```

## Accessibility Features

### Built-in ARIA Support
- Badge component includes `role="status"` and `aria-label`
- Image component requires `alt` text
- Proper semantic HTML structure throughout

### Motion Preferences
All animations respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  .badge--pulse {
    animation: none;
  }
}
```

## Future Enhancements

### Planned Additions
- **Button** primitive with variant support
- **Input** primitives (text, checkbox, radio)
- **Modal** primitive with focus management
- **Tooltip** primitive with positioning logic

### API Improvements
- Standardize size prop patterns across all primitives
- Add comprehensive theme customization hooks
- Implement consistent loading states for all interactive primitives

## Related Documentation

- [Article Component System](../article/README.md) - Higher-level components that use primitives
- [CSS Architecture Overview](../../css/css-architecture-overview-2025-08-28-1125.md) - Design system integration
- [Component Migration Guides](./migrations/) - Guides for updating existing components

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-09-25 12:15:00 UTC | v1.0 | Initial primitives documentation with Image, Card, and Badge components |

---

*This documentation covers the Primitive Components System as of September 25, 2025. For implementation details, refer to the individual component files in `/frontend/src/lib/components/primitives/`.*
# Section Primitive Component
*Created: 2025-10-06 00:00:00 UTC*

## Overview

The Section primitive is a grid-based layout component designed for organizing page content into three distinct areas: leading, main, and trailing. It provides responsive column sizing, consistent spacing, and automatic layout adjustments between mobile and desktop viewports.

## Component Location

`/frontend/src/lib/components/primitives/Section.svelte`

## Component Features

### Core Functionality
- **Three-Column Grid**: Leading, main, and trailing areas for flexible layouts
- **Responsive Breakpoints**: Automatic layout changes at 768px (tablet/desktop)
- **Svelte 5 Snippets**: Modern snippet-based content areas
- **Optional Section ID**: Supports anchor linking and navigation
- **Debug Mode**: Visual placeholders when content is not provided
- **Consistent Styling**: Integrated design tokens for backgrounds and borders

### Layout Specifications

#### Mobile Layout (< 768px)
- **Leading**: 21px fixed width (decorative sidebar)
- **Main**: 1fr flexible width (primary content)
- **Trailing**: 21px fixed width (decorative sidebar)
- **Gap**: 4px between grid areas
- **Max Width**: Full viewport width

#### Desktop Layout (≥ 768px)
- **Leading**: 1fr flexible width (expands to fill space)
- **Main**: Up to 1024px max width (content-focused area)
- **Trailing**: 1fr flexible width (expands to fill space)
- **Gap**: 4px between grid areas
- **Centering**: Main content automatically centered

### Visual Characteristics
- **Background Color**: `var(--surface-neutral-reading)` on all areas
- **Border Radius**: Rounded corners on all grid areas
  - Leading: `0px 6px 6px 0px` (rounded right)
  - Main: `6px` (fully rounded)
  - Trailing: `6px 0px 0px 6px` (rounded left)
- **Min Height**: 200px ensures visible sections even with minimal content

## Props Interface

```typescript
interface Props {
  id?: string;        // Optional section ID for anchors
  leading?: Snippet;  // Optional content for leading area
  main?: Snippet;     // Optional content for main area
  trailing?: Snippet; // Optional content for trailing area
}
```

### Prop Details

#### `id` (optional)
- **Type**: `string`
- **Description**: HTML id attribute for the section element
- **Use Cases**: Anchor links, navigation targets, analytics tracking
- **Example**: `id="hero"` creates `<section id="hero">`

#### `leading` (optional)
- **Type**: `Snippet`
- **Description**: Content for the leading (left) grid area
- **Common Uses**: Decorative elements, navigation aids, timeline markers
- **Fallback**: Shows debug placeholder if not provided

#### `main` (optional)
- **Type**: `Snippet`
- **Description**: Content for the main (center) grid area
- **Common Uses**: Primary content, articles, cards, features
- **Fallback**: Shows debug placeholder if not provided

#### `trailing` (optional)
- **Type**: `Snippet`
- **Description**: Content for the trailing (right) grid area
- **Common Uses**: Decorative elements, metadata, side notes
- **Fallback**: Shows debug placeholder if not provided

## Usage Examples

### Basic Section with Main Content

```svelte
<script>
  import { Section } from '$lib/components/primitives';
</script>

<Section id="introduction">
  {#snippet main()}
    <h1>Welcome</h1>
    <p>This is the main content area.</p>
  {/snippet}
</Section>
```

### Full Three-Column Layout

```svelte
<Section id="features">
  {#snippet leading()}
    <div class="timeline-marker">01</div>
  {/snippet}

  {#snippet main()}
    <h2>Feature Showcase</h2>
    <p>Main content describing the feature in detail.</p>
    <button>Learn More</button>
  {/snippet}

  {#snippet trailing()}
    <div class="metadata">
      <span>Updated: Oct 2025</span>
    </div>
  {/snippet}
</Section>
```

### Index Page Implementation

Real-world usage from the homepage:

```svelte
<Section id="what-is-this">
  {#snippet main()}
    <h2>What is this?</h2>
    <p>
      This is a personal portfolio and playground showcasing design work,
      development experiments, and creative projects from 2016-2025.
    </p>
  {/snippet}
</Section>

<Section id="capabilities">
  {#snippet main()}
    <h2>What I can do</h2>
    <ul>
      <li>Full-stack web development</li>
      <li>UI/UX design and prototyping</li>
      <li>Motion graphics and animation</li>
    </ul>
  {/snippet}
</Section>
```

### Nested Components

Combine with other primitives:

```svelte
<script>
  import { Section, AnimatedBorder, Image } from '$lib/components/primitives';
</script>

<Section id="hero">
  {#snippet main()}
    <AnimatedBorder borderWidth={2}>
      <div class="hero-content">
        <Image
          src="/hero.jpg"
          alt="Hero image"
          borderRadius="lg"
        />
        <h1>Featured Project</h1>
        <p>Detailed description of the featured work.</p>
      </div>
    </AnimatedBorder>
  {/snippet}
</Section>
```

### Article Layout Pattern

Create consistent article sections:

```svelte
{#each articleSections as section}
  <Section id={section.id}>
    {#snippet leading()}
      <div class="section-number">{section.number}</div>
    {/snippet}

    {#snippet main()}
      <h2>{section.title}</h2>
      <p>{section.content}</p>
    {/snippet}

    {#snippet trailing()}
      <time datetime={section.date}>{section.formattedDate}</time>
    {/snippet}
  </Section>
{/each}
```

### Asymmetric Layouts

Use only specific areas:

```svelte
<!-- Main content only -->
<Section id="simple">
  {#snippet main()}
    <h2>Simple Section</h2>
  {/snippet}
</Section>

<!-- Main with leading decoration -->
<Section id="with-marker">
  {#snippet leading()}
    <div class="accent-line"></div>
  {/snippet}

  {#snippet main()}
    <h2>Section with Visual Accent</h2>
  {/snippet}
</Section>
```

## Technical Implementation

### Grid Template Structure

The component uses CSS Grid with named areas:

```css
.section-grid {
  display: grid;
  grid-template-columns:
    [leading-start] 21px
    [leading-end main-start] 1fr
    [main-end trailing-start] 21px
    [trailing-end];
  grid-template-areas: "leading main trailing";
  gap: 4px;
}
```

### Responsive Transformation

Desktop layout changes the grid definition:

```css
@media (min-width: 768px) {
  .section-grid {
    grid-template-columns:
      [leading-start] 1fr
      [leading-end main-start] minmax(auto, 1024px)
      [main-end trailing-start] 1fr
      [trailing-end];
    justify-items: center;
  }
}
```

### Debug Placeholders

When snippets are not provided, debug boxes appear:

```css
.debug-box {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  border: 1px dashed;
}

.debug-box--leading {
  border-color: #c679c4;  /* Purple */
  writing-mode: vertical-rl;
}

.debug-box--main {
  border-color: #3b58e7;  /* Blue */
}

.debug-box--trailing {
  border-color: #fa3d1d;  /* Red */
  writing-mode: vertical-rl;
}
```

## Design Token Integration

### Background Colors
```css
--surface-neutral-reading: oklch(98.36% 0.01 15.84);  /* Section backgrounds */
```

### Border Radius Values
The component uses fixed border-radius values optimized for the grid layout:
- Leading: `0px 6px 6px 0px`
- Main: `6px`
- Trailing: `6px 0px 0px 6px`

### Spacing
- **Gap**: `4px` - Minimal gap creates visual connection between areas
- **Min Height**: `200px` - Ensures sections have presence even with little content

## Responsive Behavior

### Mobile Strategy (< 768px)
- **Narrow Sidebars**: 21px leading/trailing create subtle framing
- **Full-Width Content**: Main area uses all available space
- **Compact Gap**: 4px gap maintains visual cohesion

### Desktop Strategy (≥ 768px)
- **Expanding Sidebars**: Leading/trailing flex to fill horizontal space
- **Constrained Content**: Main limited to 1024px for optimal reading
- **Centered Layout**: Main content centered within the grid
- **Balanced Composition**: Equal left/right spacing creates symmetry

### Breakpoint Justification
- **768px**: Standard tablet breakpoint balances mobile and desktop needs
- **1024px max-width**: Optimal line length for reading (45-75 characters)

## Accessibility Features

### Semantic HTML
- Uses proper `<section>` element
- Supports `id` attribute for anchor navigation
- Maintains natural tab order within grid areas

### Screen Reader Support
- Grid areas are navigable in logical order
- Content flows naturally: leading → main → trailing
- Section IDs enable skip navigation patterns

### Keyboard Navigation
- All focusable elements maintain proper tab order
- Grid layout doesn't interfere with focus management
- Native HTML semantics preserved

## Performance Considerations

### Optimization Techniques
- **CSS Grid**: Native browser layout engine, highly performant
- **Minimal JavaScript**: Component has no runtime logic
- **Static Grid Definition**: Layout calculated once per viewport size
- **No Dynamic Calculations**: All sizing handled by CSS

### Render Efficiency
- **Svelte Compiler**: Optimized component compilation
- **Conditional Rendering**: Debug boxes only render when snippets absent
- **No Reactive State**: Component is purely presentational

## Integration with Other Components

### With AnimatedBorder

```svelte
<Section id="featured">
  {#snippet main()}
    <AnimatedBorder borderWidth={3}>
      <div class="featured-content">
        <!-- Content here -->
      </div>
    </AnimatedBorder>
  {/snippet}
</Section>
```

### With Article Components

```svelte
<Section id="article">
  {#snippet main()}
    <ArticleLayout>
      <ArticleHeader title="Article Title" />
      <ArticleBody>
        <ArticleText>Content here</ArticleText>
      </ArticleBody>
    </ArticleLayout>
  {/snippet}
</Section>
```

### With Navigation Components

```svelte
<Section id="nav-section">
  {#snippet leading()}
    <div class="scroll-indicator" />
  {/snippet}

  {#snippet main()}
    <LinkList items={navigationItems} />
  {/snippet}

  {#snippet trailing()}
    <div class="progress-bar" />
  {/snippet}
</Section>
```

## Common Patterns

### Hero Section Pattern

```svelte
<Section id="hero">
  {#snippet main()}
    <div class="hero">
      <h1>Large Hero Title</h1>
      <p class="subtitle">Supporting text or tagline</p>
      <button class="cta">Get Started</button>
    </div>
  {/snippet}
</Section>

<style>
  .hero {
    text-align: center;
    padding: 4rem 2rem;
  }
</style>
```

### Content Section Pattern

```svelte
<Section id="content">
  {#snippet leading()}
    <div class="chapter-marker">Ch. 1</div>
  {/snippet}

  {#snippet main()}
    <article>
      <h2>Section Title</h2>
      <p>Paragraph content with optimal reading width.</p>
    </article>
  {/snippet}

  {#snippet trailing()}
    <aside class="metadata">
      <time>Oct 6, 2025</time>
    </aside>
  {/snippet}
</Section>
```

### Feature Grid Pattern

```svelte
<Section id="features">
  {#snippet main()}
    <div class="feature-grid">
      <div class="feature">
        <h3>Feature 1</h3>
        <p>Description</p>
      </div>
      <div class="feature">
        <h3>Feature 2</h3>
        <p>Description</p>
      </div>
    </div>
  {/snippet}
</Section>

<style>
  .feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }
</style>
```

## Best Practices

### When to Use Section
**Good use cases:**
- Page content areas that need consistent width constraints
- Layouts requiring decorative side elements
- Content that benefits from centered, max-width containers
- Sections with logical semantic grouping

**Consider alternatives for:**
- Full-width hero sections (use custom layout)
- Complex multi-column layouts (use CSS Grid directly)
- Nested sectioning (avoid section-within-section)

### Content Organization
**Do**: Use main snippet for primary content
```svelte
<Section id="about">
  {#snippet main()}
    <h2>About</h2>
    <p>Primary information here.</p>
  {/snippet}
</Section>
```

**Don't**: Leave main snippet empty
```svelte
<!-- Avoid this -->
<Section id="empty">
  {#snippet leading()}
    <div>All content in sidebar</div>
  {/snippet}
</Section>
```

### Naming Conventions
**Do**: Use descriptive, semantic IDs
```svelte
<Section id="introduction">
<Section id="methodology">
<Section id="results">
```

**Don't**: Use generic or sequential IDs
```svelte
<!-- Avoid this -->
<Section id="section1">
<Section id="div2">
<Section id="content">
```

### Responsive Considerations
- Test layouts at mobile, tablet, and desktop sizes
- Ensure main content is readable at all breakpoints
- Consider vertical rhythm and section spacing
- Verify decorative elements don't overwhelm content

## Troubleshooting

### Content Overflowing Grid
**Problem**: Content breaks out of grid areas
**Solutions**:
- Add `overflow: hidden` to grid area styles
- Ensure child elements respect max-width constraints
- Check for absolutely positioned elements escaping containers

### Layout Not Centering on Desktop
**Problem**: Main content not centered at 768px+
**Solutions**:
- Verify browser window is wider than 768px
- Check for CSS overrides on `.section-grid`
- Inspect grid-template-columns in DevTools
- Ensure parent container isn't constraining width

### Debug Boxes Not Disappearing
**Problem**: Placeholder boxes visible with content
**Solutions**:
- Ensure snippets are defined with correct syntax: `{#snippet name()}`
- Verify snippet is being rendered: `{@render name()}`
- Check for typos in snippet names
- Inspect component in Svelte DevTools

### Min-Height Issues
**Problem**: Sections too tall or too short
**Solutions**:
- Adjust `min-height` in component CSS (default 200px)
- Add height constraints to snippet content
- Use flexbox within grid areas for vertical alignment
- Consider viewport-relative heights (vh) for full-screen sections

## Related Documentation

- [AnimatedBorder Component](./AnimatedBorder.md) - Animated border wrapper primitive
- [Badge Component](./Badge.md) - Status indicator component
- [Image Component](./Image.md) - Image primitive with placeholders
- [Primitives Overview](./README.md) - Complete primitives system
- [Card Component [DEPRECATED]](./Card.md) - Historical Card component

## Migration from Card Component

### Before (Multiple sections with Card)

```svelte
<section>
  <Card alignment="center">
    <h2>Section 1</h2>
  </Card>
</section>

<section>
  <Card alignment="left">
    <h2>Section 2</h2>
  </Card>
</section>
```

### After (Section component)

```svelte
<Section id="section-1">
  {#snippet main()}
    <div style="text-align: center;">
      <h2>Section 1</h2>
    </div>
  {/snippet}
</Section>

<Section id="section-2">
  {#snippet main()}
    <h2>Section 2</h2>
  {/snippet}
</Section>
```

**Benefits:**
- Semantic `<section>` elements instead of generic divs
- Built-in responsive grid layout
- Consistent max-width for reading comfort
- Support for decorative side elements
- Better SEO with proper section structure

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-10-06 00:00:00 UTC | v1.0 | Initial Section component documentation with grid layout system and snippet-based API |

---

*This documentation covers the Section primitive component. For implementation details, refer to `/frontend/src/lib/components/primitives/Section.svelte`.*

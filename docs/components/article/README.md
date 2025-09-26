# Article Component System
*Created: 2025-09-24 09:45:00 UTC*
*Last Updated: 2025-09-25 12:50:00 UTC*

## Overview

The Article Component System is a comprehensive suite of Svelte 5 components designed for creating rich, long-form content with professional typography, responsive layouts, and excellent developer experience. Built on modern web standards with a focus on accessibility, performance, and maintainability.

## Recent Updates (v3.0)
<!-- Updated: 2025-09-24 18:45:00 UTC -->

The Article Component System has been significantly enhanced with new interactive and visual features:

### Key Enhancements
- **ArticleImage**: Fixed 16:9 aspect ratio support for consistent layouts
- **ArticleOrnament**: Interactive hover animations with staggered color effects
- **ArticleText**: Optional subtitle support with semantic HTML structure
- **ArticleList**: Simplified API with required items array and consistent typography

### Breaking Changes Summary
- **ArticleList**: Removed children snippet support, items prop now required
- **ArticleOrnament**: Removed all customization props, now fully interactive
- **ArticleText**: Removed size variants, added subtitle functionality

### New Interactive Features
- **Hover Animations**: ArticleOrnament responds with staggered path animations
- **Fixed Aspect Ratios**: All images maintain consistent 16:9 proportions
- **Enhanced Typography**: Improved text utilities and semantic structure

## Architecture

The system follows a compositional architecture where components work together to create complete article experiences:

- **Layout Components**: Handle page structure and responsive design
- **Content Components**: Manage text, images, lists, and other content types
- **Navigation Components**: Provide table of contents and section jumping
- **Decorative Components**: Add visual polish with ornaments and dividers

## Core Principles

### Svelte 5 First
- All components use the latest Svelte 5 syntax with `$props()` and snippets
- Leverages reactive `$derived` for computed values
- TypeScript interfaces for type safety and developer experience

### Design Token Integration
- Consistent use of CSS custom properties from the design system
- Follows established color, spacing, and typography tokens
- Seamless integration with existing site theming

### Developer Experience
- Visual component labels in development for easy identification
- Consistent naming conventions following BEM-like patterns
- Clear component boundaries with visual debugging aids

### Responsive Design
- Mobile-first approach with progressive enhancement
- Flexible layouts that adapt to content and screen size
- Thoughtful typography scaling across device categories

## Component Catalog

| Component | Purpose | Location |
|-----------|---------|----------|
| [ArticleLayout](#articlelayout) | Two-column responsive container | `$lib/components/article/ArticleLayout.svelte` |
| [ArticleBody](#articlebody) | Main content wrapper with serif typography | `$lib/components/article/ArticleBody.svelte` |
| [ArticleSection](#articlesection) | Semantic section containers with ID support | `$lib/components/article/ArticleSection.svelte` |
| [ArticleHeader](#articleheader) | Title, author, date display | `$lib/components/article/ArticleHeader.svelte` |
| [ArticleText](#articletext) | Paragraph text with size variants | `$lib/components/article/ArticleText.svelte` |
| [ArticleImage](#articleimage) | Images with captions and alignment options | `$lib/components/article/ArticleImage.svelte` |
| [ArticleList](#articlelist) | Styled ordered and unordered lists | `$lib/components/article/ArticleList.svelte` |
| [ArticleOrnament](#articleornament) | Decorative elements and dividers | `$lib/components/article/ArticleOrnament.svelte` |
| [ArticleTableOfContents](#articletableofcontents) | Navigation sidebar with smooth scrolling | `$lib/components/article/ArticleTableOfContents.svelte` |

## Quick Start

### Basic Article Structure
<!-- Updated: 2025-09-24 18:45:00 UTC -->

```svelte
<script>
  import {
    ArticleLayout,
    ArticleBody,
    ArticleHeader,
    ArticleSection,
    ArticleText,
    ArticleImage,
    ArticleList,
    ArticleOrnament
  } from '$lib/components/article';
</script>

<ArticleLayout>
  <ArticleBody>
    <ArticleHeader
      title="My Article Title"
      author="Author Name"
      date="September 24, 2025"
    />

    <ArticleSection id="introduction" sectionType="intro">
      <ArticleText subtitle="Getting Started">
        Your introduction content here...
      </ArticleText>

      <!-- Interactive ornament with hover animations -->
      <ArticleOrnament />
    </ArticleSection>

    <ArticleSection id="main-content">
      <ArticleText>
        Main article content...
      </ArticleText>

      <!-- Fixed 16:9 aspect ratio image -->
      <ArticleImage
        src="/images/example.jpg"
        alt="Example with fixed aspect ratio"
        caption="All images now maintain 16:9 aspect ratio"
      />

      <!-- Simplified list with required items array -->
      <ArticleList
        type="ordered"
        items={[
          "First key point",
          "Second important item",
          "Third conclusion"
        ]}
      />
    </ArticleSection>
  </ArticleBody>
</ArticleLayout>
```

### With Table of Contents

```svelte
<script>
  const tocItems = [
    { id: "introduction", title: "Introduction" },
    { id: "main-content", title: "Main Content" }
  ];
</script>

<ArticleLayout>
  {#snippet sidebar()}
    <ArticleTableOfContents items={tocItems} />
  {/snippet}

  <ArticleBody>
    <!-- Article content -->
  </ArticleBody>
</ArticleLayout>
```

## Detailed Component Documentation

### ArticleLayout

The foundation component providing responsive two-column layout with optional sidebar.

#### Props
<!-- Updated: 2025-09-24 15:30:00 UTC -->
```typescript
interface Props {
  children: Snippet;           // Main article content
  sidebar?: Snippet;           // Optional sidebar content
}
```

#### Breaking Changes (v2.0)
- **Removed Props**: `sidebarPosition`, `contentMaxWidth`, `sidebarWidth` have been removed
- **Fixed Layout**: Sidebar is now always positioned on the right side
- **Fixed Dimensions**: Content max-width is hardcoded to 800px, sidebar width to 320px
- **Simplified API**: Fewer configuration options for more consistent layouts

#### Features
<!-- Updated: 2025-09-24 15:30:00 UTC -->
- **Responsive Behavior**: Single column on mobile, two-column on desktop (1024px+)
- **Fixed Sticky Sidebar**: Sidebar remains visible with improved sticky positioning implementation
- **Consistent Layout**: Right-positioned sidebar with optimized dimensions (800px content, 320px sidebar)
- **Improved Sticky Behavior**: Fixed sticky positioning issues with proper min-height implementation

#### CSS Classes
- `.article-layout-root` - Container with responsive flexbox
- `.article-layout-content` - Main content area
- `.article-layout-sidebar` - Sidebar container with sticky positioning

#### Usage Examples
<!-- Updated: 2025-09-24 15:30:00 UTC -->

```svelte
<!-- Basic single-column layout -->
<ArticleLayout>
  <ArticleBody>Content here</ArticleBody>
</ArticleLayout>

<!-- Two-column with right sidebar (only option) -->
<ArticleLayout>
  {#snippet sidebar()}
    <ArticleTableOfContents items={tocItems} />
  {/snippet}

  <ArticleBody>Content here</ArticleBody>
</ArticleLayout>
```

### ArticleBody

Main content wrapper that establishes serif typography context and visual boundaries.

#### Props
```typescript
interface Props {
  children: Snippet;
}
```

#### Features
<!-- Updated: 2025-09-24 15:30:00 UTC -->
- **Serif Typography**: Uses `var(--font-family-serif)` for enhanced readability
- **Minimal Styling**: Simplified to essential styles only, removing excessive development styling
- **Clean Layout**: Focused on content presentation without visual distractions

### ArticleSection

Semantic sectioning with ID support for navigation and visual type indicators.

#### Props
```typescript
interface Props {
  id?: string;                 // For anchor navigation
  sectionType?: string;        // 'intro', 'default', 'conclusion'
  children: Snippet;
}
```

#### Section Types
- **intro**: Light blue background for introduction sections
- **default**: Standard white background
- **conclusion**: Light green background for closing sections

#### Features
- **Semantic HTML**: Uses `<section>` with proper ID attributes
- **Visual Hierarchy**: Different background colors for section types
- **Navigation Ready**: IDs work seamlessly with ArticleTableOfContents

### ArticleHeader

Article metadata display with hero typography.

#### Props
```typescript
interface Props {
  title?: string;
  subtitle?: string;
  author?: string;
  date?: string;
  children?: Snippet;
}
```

#### Features
- **Hero Typography**: Uses `headline-hero` utility class
- **Flexible Metadata**: Author and date display with proper hierarchy
- **Custom Content**: Optional children snippet for additional content

### ArticleText

Paragraph component with optional subtitle support and optimized readability.

#### Props
<!-- Updated: 2025-09-24 18:45:00 UTC -->
```typescript
interface Props {
  children: Snippet;
  subtitle?: string;              // Optional subtitle text
}
```

#### New Features (v3.0)
<!-- Updated: 2025-09-24 18:45:00 UTC -->
- **Subtitle Support**: Optional `subtitle` prop for additional heading content
- **Semantic Structure**: Subtitle renders as `<h3>` with `subtitle-display` class
- **Flexible Positioning**: Subtitle appears above main paragraph content
- **Muted Styling**: Uses `var(--fg-primary-default)` for consistent theming

#### Features
- **Typography Classes**: Uses `text-prose` utility class for body text
- **Color Consistency**: Uses design system colors
- **Semantic HTML**: Proper heading hierarchy with h3 subtitles

#### Usage Examples
<!-- Updated: 2025-09-24 18:45:00 UTC -->

```svelte
<!-- Basic paragraph text -->
<ArticleText>
  This is standard paragraph content with the text-prose utility class.
</ArticleText>

<!-- Text with subtitle -->
<ArticleText subtitle="Important Note">
  This paragraph has a subtitle that appears as an h3 element above the content.
</ArticleText>

<!-- Multiple paragraphs with subtitles for structured content -->
<ArticleText subtitle="Background">
  This section provides background information...
</ArticleText>

<ArticleText subtitle="Implementation">
  This section covers the technical implementation details...
</ArticleText>

<ArticleText subtitle="Results">
  This section discusses the outcomes and findings...
</ArticleText>
```

### ArticleImage

Rich image component with captions, sizing, and alignment options. Built using the [Image primitive component](../primitives/Image.md) for consistent behavior and enhanced functionality.

#### Props
```typescript
interface Props {
  src?: string;
  alt?: string;
  caption?: string;
  width?: 'full' | 'half';        // Default: 'full'
  alignment?: 'left' | 'right' | 'center';  // Default: 'center'
}
```

#### Features
- **Responsive Images**: Automatic sizing with `max-width: 100%`
- **Lazy Loading**: Built-in `loading="lazy"` for performance through Image primitive
- **Caption Support**: Styled figcaption with italic text
- **Placeholder Mode**: Visual placeholder when no src provided
- **Multiple Alignments**: Flexible positioning options
- **Primitive Integration**: Uses Image primitive with `borderRadius="sm"` for consistent styling

#### New Features (v4.0)
<!-- Updated: 2025-09-25 12:50:00 UTC -->
- **Image Primitive Integration**: Now uses the Image primitive component for enhanced functionality
- **Consistent Placeholder System**: Inherits advanced placeholder features from Image primitive
- **Border Radius Support**: Automatic small border radius through primitive integration
- **Enhanced Object Fit**: Leverages Image primitive's object-fit variants
- **Reduced Code Duplication**: Simplified implementation using composable primitives

#### Previous Features (v3.0)
<!-- Updated: 2025-09-24 18:45:00 UTC -->
- **Fixed Aspect Ratio**: All images maintain a consistent 16:9 aspect ratio
- **Enhanced Object Fit**: Uses `object-fit: cover` to maintain proportions within the fixed aspect ratio
- **Consistent Placeholders**: Placeholder maintains the same 16:9 aspect ratio for design consistency
- **Improved Layout Predictability**: Fixed dimensions prevent layout shifts during loading

#### Technical Implementation
<!-- Updated: 2025-09-25 12:50:00 UTC -->
ArticleImage now composes the Image primitive:
```svelte
<script>
  import { Image } from "$lib/components/primitives";
</script>

{#if src}
  <Image {src} {alt} borderRadius="sm" class="article-image" />
{:else}
  <div class="article-image-placeholder">
    <span>Image Placeholder</span>
    <small>{width} width, {alignment} aligned</small>
  </div>
{/if}
```

Legacy CSS properties (now handled by Image primitive):
```css
.article-image {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
}
```

#### Usage Examples
<!-- Updated: 2025-09-24 18:45:00 UTC -->

```svelte
<!-- Full-width centered image with caption and fixed 16:9 aspect ratio -->
<ArticleImage
  src="/images/example.jpg"
  alt="Example image"
  caption="This is a demonstration image"
  width="full"
  alignment="center"
/>

<!-- Half-width left-aligned image - maintains 16:9 aspect ratio -->
<ArticleImage
  src="/images/small.jpg"
  alt="Small image"
  width="half"
  alignment="left"
/>

<!-- Placeholder mode also maintains 16:9 aspect ratio -->
<ArticleImage
  caption="Placeholder with consistent aspect ratio"
  width="full"
  alignment="center"
/>
```

### ArticleList

Enhanced list component with custom styling and flexible content options.

#### Props
<!-- Updated: 2025-09-24 18:45:00 UTC -->
```typescript
interface Props {
  type?: "ordered" | "unordered";  // Default: "unordered"
  items: string[];                 // Required array of items
  compact?: boolean;               // Default: false
}
```

#### Breaking Changes (v3.0)
<!-- Updated: 2025-09-24 18:45:00 UTC -->
- **Removed `children` Snippet**: No longer supports custom content via children snippet
- **Required `items` Prop**: The `items` array is now required, not optional
- **Simplified API**: Single approach using only the items array for consistency
- **Internal Rendering**: Component handles all `<li>` element creation internally

#### Features
<!-- Updated: 2025-09-24 18:45:00 UTC -->
- **Consistent Typography**: Uses `text-list-small` utility class for all list items
- **Design Token Integration**: Uses `--fg-primary-default` and `--fg-primary-muted` colors
- **Custom Styling**: Maintains custom bullets and numbers with consistent spacing
- **Compact Mode**: Reduced spacing for dense lists
- **Performance**: Simplified rendering logic with no conditional content

#### Usage Examples
<!-- Updated: 2025-09-24 18:45:00 UTC -->

```svelte
<!-- Simple ordered list -->
<ArticleList
  type="ordered"
  items={[
    "First item",
    "Second item",
    "Third item"
  ]}
/>

<!-- Unordered list with compact spacing -->
<ArticleList
  type="unordered"
  compact={true}
  items={[
    "Compact item one",
    "Compact item two",
    "Compact item three"
  ]}
/>

<!-- Default unordered list -->
<ArticleList
  items={[
    "Default list item",
    "Another list item",
    "Final list item"
  ]}
/>
```

### ArticleOrnament

Decorative elements for visual breaks and content separation.

#### Props
<!-- Updated: 2025-09-24 15:30:00 UTC -->
```typescript
interface Props {
  // No props - simplified component
}
```

#### Props
<!-- Updated: 2025-09-24 18:45:00 UTC -->
```typescript
interface Props {
  // No props - component manages all state internally
}
```

#### Breaking Changes (v3.0)
<!-- Updated: 2025-09-24 18:45:00 UTC -->
- **Removed All Props**: All previous customization props have been removed
- **Interactive SVG**: Now features a fully interactive snowflake ornament
- **Fixed Design**: Consistent three-path snowflake SVG with hover animations

#### New Interactive Features (v3.0)
<!-- Updated: 2025-09-24 18:45:00 UTC -->
- **Hover Activation**: Interactive SVG responds to mouse hover on entire element
- **Staggered Animation**: Each path animates with progressive delays (0ms, 150ms, 300ms)
- **Random Color Generation**: Each hover generates random colors from predefined palette
- **Color Palette**: Uses 5 predefined colors - #FF6B6B, #4ECDC4, #45B7D1, #FFA07A, #98D8C8
- **Scale Animation**: Paths scale to 1.2x size when active
- **Smooth Transitions**: 0.3s ease transitions for both color and transform properties
- **State Management**: Tracks hover state and individual path activation

#### Technical Implementation
<!-- Updated: 2025-09-24 18:45:00 UTC -->
The component uses:
- **State Variables**: `isHovered`, `pathColors`, `activePathIndexes` for animation control
- **Event Handlers**: `handleSvgMouseEnter` and `handleSvgMouseLeave` for interaction
- **Staggered Timing**: setTimeout functions create cascading animation effect
- **CSS Transforms**: `transform-origin: center` and `transform-box: fill-box` for proper scaling

#### Usage Examples
<!-- Updated: 2025-09-24 18:45:00 UTC -->

```svelte
<!-- Interactive ornament - hover to see animation -->
<ArticleOrnament />

<!-- Use between content sections for visual breaks -->
<ArticleSection>
  <ArticleText>First section content...</ArticleText>
</ArticleSection>

<ArticleOrnament />

<ArticleSection>
  <ArticleText>Second section content...</ArticleText>
</ArticleSection>

<!-- Multiple ornaments maintain independent hover states -->
<ArticleOrnament />
<ArticleOrnament />
<ArticleOrnament />
```

### ArticleTableOfContents

Navigation component with smooth scrolling and active state management.

#### Props
<!-- Updated: 2025-09-24 15:30:00 UTC -->
```typescript
interface Props {
  items?: TocItem[];               // Array of navigation items
  title?: string;                  // Default: "Table of Contents"
  children?: Snippet;              // Alternative content
}

interface TocItem {
  id: string;                      // Target element ID
  title: string;                   // Display text
  level?: number;                  // Hierarchy level (future use)
}
```

#### Breaking Changes (v2.0)
- **Removed `sticky` Prop**: Sticky positioning is now handled automatically
- **Improved Sticky Behavior**: Fixed implementation with proper CSS positioning

#### Features
<!-- Updated: 2025-09-24 15:30:00 UTC -->
- **Automatic Sticky Positioning**: Uses `position: sticky`, `top: 30vh`, and `align-self: flex-start`
- **Fixed Layout Issues**: Resolved margin conflicts that prevented sticky behavior
- **Smooth Scrolling**: Integrates with LinkList for smooth anchor navigation
- **Visual Styling**: Distinct background and hover states
- **Flexible Content**: Use items array or custom children
- **Responsive Design**: Adapts to sidebar constraints

#### Technical Implementation Notes
<!-- Updated: 2025-09-24 15:30:00 UTC -->
The sticky positioning fix required:
- Adding `min-height: 100vh` to the sidebar container in ArticleLayout
- Using `position: sticky` with `top: 30vh` on the TOC component
- Setting `align-self: flex-start` to prevent full-height stretching
- Removing margin conflicts that interfered with sticky calculations

#### Integration Example

```svelte
<script>
  const tocItems = [
    { id: "introduction", title: "Getting Started" },
    { id: "features", title: "Key Features" },
    { id: "examples", title: "Code Examples" },
    { id: "conclusion", title: "Next Steps" }
  ];
</script>

<ArticleLayout>
  {#snippet sidebar()}
    <ArticleTableOfContents
      items={tocItems}
      title="Article Contents"
    />
  {/snippet}

  <ArticleBody>
    <ArticleSection id="introduction" sectionType="intro">
      <!-- Content -->
    </ArticleSection>

    <ArticleSection id="features">
      <!-- Content -->
    </ArticleSection>

    <!-- More sections -->
  </ArticleBody>
</ArticleLayout>
```

## Typography System Integration

### Font Stacks

The article system leverages two primary typefaces:

**Serif (Lora)** - Used in ArticleBody
- Optimized for long-form reading
- Excellent x-height and character spacing
- Applied via `var(--font-family-serif)`

**Sans-Serif (Silka)** - Used for UI elements
- Clean, modern appearance
- Headers, navigation, metadata
- Applied via `var(--font-family-sans)`

### Type Scale

Components use a consistent type scale through design tokens:

```css
/* Available in all article components */
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;
```

### Line Height & Spacing

Optimized for readability:
- **Body Text**: 1.7 line height for comfortable scanning
- **Headers**: 1.2-1.4 for visual impact
- **Captions**: 1.5 for compact readability

## CSS Architecture

### Naming Convention

All components follow a consistent BEM-like naming pattern:

```css
.article-[component]-[element]--[modifier]
```

Examples:
- `.article-layout-root`
- `.article-text-root--large`
- `.article-image-caption`
- `.article-section-root--intro`

### Design Token Usage

Components consistently use CSS custom properties:

```css
/* Spacing */
--gap-small: 0.5rem;
--gap-medium: 1rem;
--gap-large: 1.5rem;
--gap-xlarge: 2rem;

/* Colors */
--fg-primary-default: #2c3e50;
--bg-primary-subtle: #f8f9fa;
--border-primary-default: #e9ecef;

/* Typography */
--font-family-serif: 'Lora', Georgia, serif;
--font-family-sans: 'Silka', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Responsive Breakpoints

Consistent breakpoints across all components:

```css
/* Mobile first approach */
@media (min-width: 768px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Large desktop */ }
```

## Development Features

### Component Identification

All components include development-friendly labels:

```css
.article-component::before {
  content: 'ComponentName';
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 0.7rem;
  color: #666;
  font-family: monospace;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  border: 1px solid #ddd;
  z-index: 1000;
}
```

### Visual Debugging

Components use subtle borders and backgrounds in development to help visualize:
- Component boundaries
- Content flow
- Responsive behavior changes

### Performance Considerations

- **Lazy Loading**: Images load lazily by default
- **CSS Containment**: Proper containment for layout stability
- **Minimal JavaScript**: Most features use CSS and native browser APIs
- **Tree Shaking**: Components can be imported individually

## Best Practices

### Component Composition

**Do**: Build articles using semantic component hierarchy
```svelte
<ArticleLayout>
  <ArticleBody>
    <ArticleHeader />
    <ArticleSection>
      <ArticleText />
      <ArticleImage />
    </ArticleSection>
  </ArticleBody>
</ArticleLayout>
```

**Don't**: Skip semantic containers or nest inappropriately
```svelte
<!-- Avoid this -->
<ArticleText>
  <ArticleHeader />  <!-- Headers don't belong inside text -->
</ArticleText>
```

### Content Organization

**Do**: Use sections with meaningful IDs for navigation
```svelte
<ArticleSection id="methodology" sectionType="default">
  <ArticleText>Research methodology...</ArticleText>
</ArticleSection>
```

**Do**: Provide alternative text for all images
```svelte
<ArticleImage
  src="/chart.png"
  alt="Bar chart showing 40% increase in user engagement"
  caption="User engagement metrics from Q3 2025"
/>
```

### Performance Optimization

**Do**: Use appropriate image sizes and formats
- WebP for modern browsers
- Proper sizing for responsive breakpoints
- Descriptive alt text for accessibility

**Do**: Structure content for progressive loading
- Critical content first
- Heavy media elements later
- Table of contents for long articles

### Accessibility Guidelines

**Do**: Maintain proper heading hierarchy
- Use ArticleHeader for main titles
- Structure sections logically
- Provide skip navigation where needed

**Do**: Ensure sufficient color contrast
- All text meets WCAG AA standards
- Focus indicators are clearly visible
- Links are distinguishable from body text

## Migration Guide

### Migrating to v3.0
<!-- Updated: 2025-09-24 18:45:00 UTC -->

If upgrading from previous versions of the Article Component System:

#### ArticleList Changes
```svelte
<!-- OLD (v2.0) - No longer supported -->
<ArticleList type="unordered">
  <li>Custom content with <strong>markup</strong></li>
  <li>Complex <a href="/link">linked</a> items</li>
</ArticleList>

<!-- NEW (v3.0) - Required approach -->
<ArticleList
  type="unordered"
  items={[
    "Simple string content only",
    "Another plain text item",
    "Third list item"
  ]}
/>
```

#### ArticleText Changes
```svelte
<!-- OLD (v2.0) - Size variants no longer supported -->
<ArticleText size="large">Large text content</ArticleText>

<!-- NEW (v3.0) - Use subtitle for additional hierarchy -->
<ArticleText subtitle="Section Title">
  Regular text content with optional subtitle above
</ArticleText>
```

#### ArticleOrnament Changes
```svelte
<!-- OLD (v2.0) - Props no longer supported -->
<ArticleOrnament type="divider" size="large" />

<!-- NEW (v3.0) - Interactive, no configuration needed -->
<ArticleOrnament />
```

#### ArticleImage Benefits
No breaking changes, but images now automatically:
- Maintain 16:9 aspect ratio for consistent layouts
- Use `object-fit: cover` for better image presentation
- Apply consistent aspect ratio to placeholders

### Migration from Other Systems

### From Markdown

If migrating from markdown-based systems:

1. **Headers** → `ArticleHeader` for main title, regular `<h2>`, `<h3>` for sections
2. **Paragraphs** → `ArticleText` with optional subtitle support
3. **Images** → `ArticleImage` with fixed 16:9 aspect ratio and captions
4. **Lists** → `ArticleList` with required string array format
5. **Horizontal Rules** → `ArticleOrnament` with interactive hover effects

### From Other Component Libraries

1. **Container Components**: Replace with `ArticleLayout` for responsive behavior
2. **Typography Components**: Map to `ArticleText` with size variants
3. **Media Components**: Use `ArticleImage` for enhanced features
4. **Navigation Components**: Integrate with `ArticleTableOfContents`

## Extending the System

### Creating Custom Ornaments

```svelte
<ArticleOrnament type="custom">
  <div class="my-custom-ornament">
    <!-- Custom decorative content -->
  </div>
</ArticleOrnament>
```

### Custom Section Types

Extend ArticleSection with new types:

```css
.article-section-root--warning {
  background: #fff3cd;
  border-color: #ffc107;
}
```

### Additional Text Variants

Extend ArticleText with new sizes:

```css
.article-text-root--caption {
  font-size: 0.75rem;
  color: #6c757d;
  font-style: italic;
}
```

## Troubleshooting

### Common Issues

**Images not displaying**: Check src path and ensure images are in static directory

**Table of contents not scrolling**: Verify section IDs match exactly with tocItems

**Responsive layout not working**: Ensure parent containers don't constrain max-width

**Typography looking inconsistent**: Verify design tokens are loaded and CSS custom properties are available

### Debug Mode

Enable visual debugging by adding this CSS:

```css
/* Show component boundaries */
[class*="article-"] {
  outline: 1px dashed rgba(255, 0, 0, 0.3) !important;
}

/* Show text content boundaries */
.article-text-root {
  background: rgba(0, 255, 0, 0.1) !important;
}
```

## Recent Enhancements (v3.0)
<!-- Updated: 2025-09-24 18:45:00 UTC -->

Recently completed improvements:

### ✅ Completed Features
- **Interactive Ornaments**: ArticleOrnament now features hover animations with staggered color effects
- **Fixed Aspect Ratios**: ArticleImage maintains consistent 16:9 aspect ratio for better layout predictability
- **Enhanced Typography**: ArticleText supports optional subtitles with proper semantic structure
- **Simplified Lists**: ArticleList uses consistent string-array API with design token integration

## Future Enhancements

Planned improvements for the article system:

- **Print Styles**: Optimized CSS for print layouts
- **Reading Time**: Automatic reading time calculation
- **Social Sharing**: Built-in sharing component integration
- **Interactive Elements**: Code blocks with syntax highlighting
- **Analytics Integration**: Reading progress and engagement tracking
- **Internationalization**: RTL language support and localization
- **Advanced List Support**: Consider supporting rich content in lists while maintaining simplicity
- **Image Aspect Ratio Options**: Potentially add support for different aspect ratios (square, portrait, etc.)

## Related Documentation

- [LinkList Component](../linkList/LinkList.md) - Navigation component used by ArticleTableOfContents
- [CSS Architecture Overview](../../css/css-architecture-overview-2025-08-28-1125.md) - Design system integration
- [Component Structure Proposal](../../architecture/frontend/COMPONENT_STRUCTURE_PROPOSAL.md) - Overall component organization

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-09-25 12:50:00 UTC | v4.0 | Updated ArticleImage to use Image primitive component for enhanced functionality and reduced code duplication |
| 2025-09-24 18:45:00 UTC | v3.0 | Added interactive ArticleOrnament with hover animations, fixed 16:9 aspect ratios for ArticleImage, optional subtitles for ArticleText, simplified ArticleList API with required items array |
| 2025-09-24 15:30:00 UTC | v2.0 | ArticleLayout sticky sidebar fixes, ArticleTableOfContents improvements |
| 2025-09-24 09:45:00 UTC | v1.0 | Initial comprehensive documentation |

---

*This documentation covers the complete Article Component System as of September 25, 2025 (v4.0). For the most current implementation details, refer to the individual component files in `/frontend/src/lib/components/article/`.*
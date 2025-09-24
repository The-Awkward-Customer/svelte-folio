# LinkList Component
*Last Updated: 2025-01-24 16:30:00 UTC*

## Overview
A navigation component that renders a list of links with active state management, smooth anchor scrolling, and accessibility features.

## Location
`frontend/src/lib/components/navigation/LinkList.svelte`

## Props

### LinkListProps
- `list?: LinkItem[]` - Optional array of link items. Defaults to predefined navigation items.
- `axis?: 'horizontal' | 'vertical'` - Optional layout direction. Defaults to `'horizontal'`.

### LinkItem Interface
```typescript
interface LinkItem {
  label: string;
  href: string;
}
```

## Default Data
- Index (`/`)
- Graphics (`/graphics`)

**Note**: The default data varies by parent component. In TopNavigation, it defaults to anchor links:
- Introduction (`#introduction`)
- Work (`#work`)
- Articles (`#articles`)

## Features

### Smooth Anchor Scrolling
<!-- Updated: 2025-09-22 18:45:00 UTC -->
- Intercepts clicks on anchor links (href starting with `#`)
- Uses `scrollIntoView()` with smooth behavior for navigation
- Prevents default browser behavior for anchor links
- Automatically scrolls to target element with `block: 'start'` alignment
- Falls back to default navigation for non-anchor links

### Active State Management
- Uses `$page.url.pathname` to determine active links
- Root path (`/`) requires exact match
- Other paths use `startsWith()` matching
- Applies `.active` class to current page links

### Accessibility
- `aria-label="Main navigation"` on nav element
- `role="list"` on ul element
- `aria-label` with descriptive text for each link
- `aria-current="page"` for active links

### Styling
- Flexbox layout with configurable direction (horizontal/vertical)
- Responsive gap spacing
- Hover and focus-visible states
- Touch-safe height sizing with padding
- Custom CSS properties for colors and spacing
- Smooth transitions (0.2s ease-in-out)

## CSS Classes
- `.link-list` - Base list container styling
- `.link-list--horizontal` - Horizontal layout (flex-direction: row)
- `.link-list--vertical` - Vertical layout (flex-direction: column)
- `.nav-link` - Base link styling
- `.nav-link:hover` - Hover state
- `.nav-link.active` - Active page indicator
- `.nav-link:focus-visible` - Keyboard focus outline

## Technical Implementation

### Anchor Scrolling Logic
<!-- Updated: 2025-09-22 18:45:00 UTC -->
```javascript
function handleAnchorClick(event: MouseEvent, href: string) {
  // Only handle anchor links (starting with #)
  if (href.startsWith('#')) {
    event.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
```

The function:
1. Checks if the href starts with `#` (anchor link)
2. Prevents default browser navigation
3. Extracts the target ID by removing the `#` prefix
4. Finds the target element using `document.getElementById()`
5. Smoothly scrolls to the element if found

### Event Handler Integration
The anchor scrolling is attached via onclick handler:
```svelte
<a
  href={item.href}
  onclick={(event) => handleAnchorClick(event, item.href)}
>
  {item.label}
</a>
```

## Usage Examples

### Basic Navigation (Page Routes)
```svelte
<LinkList />
<!-- Uses default page navigation with horizontal layout -->
```

### Vertical Navigation Layout
```svelte
<LinkList axis="vertical" />
<!-- Same navigation but in vertical layout -->
```

### Anchor Navigation (TopNavigation Integration)
```svelte
<LinkList list={[
  { label: "Introduction", href: "#introduction" },
  { label: "Work", href: "#work" },
  { label: "Articles", href: "#articles" }
]} />
```

### Vertical Table of Contents
```svelte
<LinkList
  axis="vertical"
  list={[
    { label: "Section 1", href: "#section-1" },
    { label: "Section 2", href: "#section-2" },
    { label: "Section 3", href: "#section-3" }
  ]}
/>
```

### Mixed Navigation
```svelte
<LinkList list={[
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "#contact" }
]} />
```

## Integration with Page Sections

When using anchor links, ensure target sections have matching IDs:

```svelte
<!-- In +page.svelte -->
<section id="introduction" class="section">
  <p>Introduction Content</p>
</section>

<section id="work" class="section">
  <p>Work Content</p>
</section>
```

The sections should have sufficient height for proper scrolling behavior:
```css
.section {
  height: 100vh; /* Full viewport height recommended */
  /* other styles */
}
```
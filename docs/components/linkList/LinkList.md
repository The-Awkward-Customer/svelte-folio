# LinkList Component

## Overview
A navigation component that renders a list of links with active state management and accessibility features.

## Location
`frontend/src/lib/components/navigation/LinkList.svelte`

## Props

### LinkListProps
- `list?: LinkItem[]` - Optional array of link items. Defaults to predefined navigation items.

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

## Features

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
- Flexbox horizontal layout with gap
- Hover and focus-visible states
- Touch-safe height sizing
- Custom CSS properties for colors and spacing
- Smooth transitions (0.2s ease-in-out)

## CSS Classes
- `.nav-link` - Base link styling
- `.nav-link:hover` - Hover state
- `.nav-link.active` - Active page indicator
- `.nav-link:focus-visible` - Keyboard focus outline

## Usage Example
```svelte
<LinkList />
<!-- or with custom links -->
<LinkList list={[
  { label: "Home", href: "/" },
  { label: "About", href: "/about" }
]} />
```
# GridLayout Component Specification

## Overview
The GridLayout component provides a responsive masonry-style grid system that adapts between mobile (2-column) and desktop (4+ column) layouts. It dynamically renders Svelte components within grid items with configurable sizing.

## Component Location
`frontend/src/lib/components/grids/GridLayout.svelte`

## Interface

### Props
```typescript
interface Props {
  items: readonly GridItem[];
  columns?: number; // Default: 4
}
```

### GridItem Interface
```typescript
export interface GridItem {
  readonly id: string;
  readonly component: Component<Record<string, any>>;
  readonly size: "2-2" | "4-2";
  readonly props?: Record<string, any>;
}
```

## Grid Sizes
- `"2-2"`: Square item (2 columns × 2 rows) with enforced 1:1 aspect ratio
- `"4-2"`: Rectangle item (4 columns × 2 rows)

## Responsive Behavior

### Mobile (< 896px)
- 2-column grid layout
- Items span based on size but limited to 2 columns max
- Maintains aspect ratios and proportional spacing

### Desktop (≥ 896px)
- Configurable column count (default: 4)
- Items span full specified grid dimensions
- Dense grid flow for optimal space utilization

## Features

### Dynamic Component Rendering
- Accepts any Svelte component via `Component`
- Passes optional props to each component instance
- Conditional rendering based on component presence

### Grid Item Management
- Unique ID-based tracking for each item
- Data attributes for styling and animations (`data-flip-id`, `data-grid-size`)
- CSS custom properties for dynamic sizing

### Styling System
- CSS Grid with auto-flow row dense
- Custom properties for responsive column/row spans
- Rounded corners and overflow handling
- Responsive gap spacing

## CSS Custom Properties
- `--columns`: Number of desktop columns
- `--grid-cols`: Item column span
- `--grid-rows`: Item row span
- `--spc-700`: Top padding
- `--spc-1000`: Bottom padding
- `--border-radius-sm`: Item border radius

## Usage Example
```typescript
const gridItems: GridItem[] = [
  {
    id: "item1",
    component: MyComponent,
    size: "2-2",
    props: { title: "Square Item" }
  },
  {
    id: "item2", 
    component: AnotherComponent,
    size: "4-2",
    props: { content: "Rectangle Item" }
  }
];
```

## Current Issues
- Props interface could be more specific for better type safety
- Could benefit from more granular component type constraints

## Dependencies
- Svelte 5 component system
- CSS Grid support
- CSS custom properties support
# Popper Utility Feature Specification

**Date:** 2025-08-25  
**Version:** 1.0  
**Status:** Implemented  
**Location:** `frontend/src/lib/utils/popper.ts`

## Overview

The Popper utility provides reusable positioning logic for floating elements like popovers, tooltips, and dropdowns. It abstracts complex viewport collision detection and smart positioning into a clean, type-safe API.

## Features

### Core Positioning Functions

#### `positionWrapper(triggerElement, wrapperElement)`
- Positions a wrapper element at the exact location of the trigger
- Creates fixed positioning that follows the trigger element
- Used for maintaining spatial relationship during scroll

#### `calculatePosition(triggerElement, contentElement, options)`
- Calculates optimal position for content relative to trigger
- Performs viewport collision detection
- Returns position data with fallback positioning logic

#### `applyPosition(contentElement, result)`
- Applies calculated position styles to the content element
- Manages visibility and pointer events
- Ensures proper CSS positioning

### Smart Positioning Algorithm

1. **Primary Position**: Attempts requested position (top/bottom/left/right)
2. **Opposite Fallback**: If primary doesn't fit, tries opposite side
3. **Cross-axis Fallback**: If opposite fails, tries perpendicular positions
4. **Viewport Padding**: Maintains 8px minimum distance from viewport edges

### Type Safety

```typescript
type Position = 'top' | 'bottom' | 'left' | 'right';

interface PopperOptions {
  position: Position;
  offset: number;
}

interface PopperResult {
  position: Position;
  top: number;
  left: number;
}
```

## Server-Side Rendering (SSR) Support

- All functions include `typeof window !== 'undefined'` checks to prevent runtime errors
- Graceful degradation with fallback viewport dimensions (1000x1000px)
- **Important Limitation**: Functions that call `getBoundingClientRect()` require a mounted DOM element and will not produce meaningful values during SSR
- **Recommended Usage**: Only call positioning utilities after component mount (e.g., in `onMount()`, effects, or user interactions)
- **Consumer Responsibility**: Components should perform their own runtime checks before invoking DOM-reading utilities during SSR
- **Alternative Approaches**: Consider providing fallback dimensions, mocked DOMRect objects, or deferring positioning calculations until client-side hydration

## Usage Example

```typescript
import { positionWrapper, calculatePosition, applyPosition } from '$lib/utils/popper';

// Position wrapper at trigger location
positionWrapper(triggerElement, wrapperElement);

// Calculate optimal position
const result = calculatePosition(triggerElement, contentElement, {
  position: 'bottom',
  offset: 8
});

// Apply calculated position
applyPosition(contentElement, result);
```

## Integration with Popover Component

The Popper utility replaced ~100 lines of positioning logic in the Popover component:

**Before:**
- Inline positioning calculations
- Duplicate viewport detection logic
- Manual style application

**After:**
- Clean function calls
- Reusable positioning logic
- Centralized collision detection

## Benefits

1. **Reusability**: Can be used by any component needing smart positioning
2. **Maintainability**: Single source of truth for positioning logic
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **SSR Compatible**: Works in both client and server environments
5. **Performance**: Efficient collision detection with minimal DOM reads

## Future Enhancements

- Animation support for position transitions
- Custom viewport boundaries
- Multiple trigger support
- Advanced collision detection strategies

## Related Files

- **Implementation**: `frontend/src/lib/utils/popper.ts`
- **Consumer**: `frontend/src/lib/components/popover/Popover.svelte`
- **Test Page**: `frontend/src/routes/popover-test/+page.svelte`
- **Previous Docs**: `docs/components/popover/`

## Migration Notes

The refactor from inline positioning to the Popper utility was completed on 2025-08-25. All existing functionality is preserved while providing a cleaner, more maintainable architecture for future development.
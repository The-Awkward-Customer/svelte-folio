# Vite-Compatible Animation System Migration

## Overview

This document outlines the migration from the current fetch-based animation loading system to a Vite-compatible approach using `import.meta.glob`. This migration addresses the NS_BINDING_ABORTED errors and ensures proper production builds.

## Problem Statement

The current AnimationEngine uses runtime `fetch()` calls which cause:
- **NS_BINDING_ABORTED errors** - Network requests cancelled due to component lifecycle conflicts
- **Build incompatibility** - Vite cannot statically analyze dynamic fetch paths
- **Poor performance** - No asset optimization, caching, or bundling
- **Race conditions** - Fetch requests competing with Svelte's reactivity system

## Solution Architecture

### 1. Asset Relocation

Move animations from `static/animations/` to `src/lib/animations/` for Vite processing:

```
src/lib/animations/
├── assets/
│   ├── blue-motion/
│   │   ├── 00000.webp
│   │   └── ...
│   ├── magenta-motion/
│   └── yellow-motion/
└── manifest.json
```

### 2. Import Strategy

Replace fetch-based loading with Vite's `import.meta.glob`:

```typescript
// Old approach (causes NS_BINDING_ABORTED)
const response = await fetch(`/animations/${name}/${frame}.webp`);

// New approach (Vite-compatible)
const imageModules = import.meta.glob('/src/lib/animations/assets/**/*.webp', {
  eager: false,
  as: 'url'
});
```

### 3. Fallback Mechanism

Implement graceful degradation:
1. Try Vite import first
2. Fall back to static path if needed
3. Log loading method for debugging

## Implementation Steps

### Phase 1: Asset Migration
1. Create new directory structure
2. Move all animation assets
3. Update manifest location

### Phase 2: Engine Refactor
1. Implement `import.meta.glob` loading
2. Add fallback mechanism
3. Update error handling

### Phase 3: Component Updates
1. Update CanvasAnimation component
2. Ensure proper cleanup
3. Add loading states

### Phase 4: Testing
1. Development environment testing
2. Production build verification
3. Cross-browser compatibility

## Success Criteria

- [ ] Zero NS_BINDING_ABORTED errors
- [ ] Animations work in production builds
- [ ] Memory usage < 50MB
- [ ] All animations load successfully
- [ ] Graceful fallback for missing assets

## Technical Implementation

### AnimationEngine Changes

```typescript
export class AnimationEngine {
  private imageModules: Record<string, () => Promise<string>>;
  
  constructor() {
    // Vite static import discovery
    this.imageModules = import.meta.glob('/src/lib/animations/assets/**/*.webp', {
      eager: false,
      as: 'url'
    });
  }
  
  private async loadFrame(animationName: string, frameNumber: number): Promise<HTMLImageElement> {
    const paddedNumber = frameNumber.toString().padStart(5, '0');
    const moduleKey = `/src/lib/animations/assets/${animationName}/${paddedNumber}.webp`;
    
    try {
      // Try Vite import first
      if (this.imageModules[moduleKey]) {
        const imageUrl = await this.imageModules[moduleKey]();
        return this.loadImageFromUrl(imageUrl);
      }
    } catch (error) {
      console.warn(`Vite import failed for ${moduleKey}, trying fallback`);
    }
    
    // Fallback to static path
    return this.loadImageFromUrl(`/animations/${animationName}/${paddedNumber}.webp`);
  }
}
```

### Build Configuration

No changes needed to `vite.config.ts` - Vite automatically handles `import.meta.glob`.

### Performance Optimizations

1. **Lazy Loading**: Load frames on demand
2. **Preloading**: Preload critical animations
3. **Caching**: Leverage browser caching
4. **Compression**: WebP format already optimized

## Migration Timeline

1. **Hour 1**: Asset migration and directory setup
2. **Hour 2**: AnimationEngine refactor
3. **Hour 3**: Testing and validation
4. **Hour 4**: Documentation and cleanup

## Risk Mitigation

- **Backup**: Keep original static assets during migration
- **Fallback**: Implement dual loading mechanism
- **Testing**: Comprehensive test coverage
- **Rollback**: Easy revert if issues arise

## Post-Migration Benefits

1. **Reliability**: No more NS_BINDING_ABORTED errors
2. **Performance**: Proper asset optimization
3. **Maintainability**: Clear asset organization
4. **Scalability**: Easy to add new animations
5. **Type Safety**: TypeScript support for imports

## Validation Checklist

- [ ] All animations moved to new location
- [ ] import.meta.glob discovers all assets
- [ ] No console errors in development
- [ ] Production build includes all assets
- [ ] Animations play smoothly
- [ ] Memory usage acceptable
- [ ] Cross-browser compatibility verified

---

**Implementation Date**: June 18, 2025
**Status**: Ready for implementation

# Canvas Animation System - Universal Implementation Plan

_Host-agnostic, reusable across portfolio contexts_

## Overview

Create a flexible canvas-based animation system using WebP sequences that can be used in multiple contexts (inline text, cards, headers, etc.) with lazy loading and staggered timing.

## Technical Specifications

### Asset Production Standards

- **Source Resolution**: 512×512px WebP with transparency
- **Frame Rate**: 24fps for smooth motion
- **Loop Duration**: 2-3 seconds (48-72 frames per animation)
- **Naming**: `001.webp`, `002.webp`, etc.
- **Optimization**: ~80% quality WebP compression

### Display Flexibility

- **Canvas Size**: Responsive from 24×24px to 512×512px
- **Scaling**: Maintains aspect ratio, crisp rendering at all sizes
- **Performance**: Efficient rendering regardless of display size

## Phase 1: Universal Animation Engine ⚡ **(REQUIRED)**

### 1. Host-Agnostic Asset Structure

```
static/
├── animations/
│   ├── manifest.json
│   ├── stylish-motion/
│   │   ├── 001.webp
│   │   ├── 002.webp
│   │   └── ... (48-72 frames)
│   ├── intuitive-motion/
│   └── rapid-motion/
```

**Manifest Format**:

```json
{
  "stylish-motion": {
    "frameCount": 60,
    "duration": 2.5,
    "fps": 24,
    "description": "Stylish motion animation"
  },
  "intuitive-motion": {
    "frameCount": 48,
    "duration": 2.0,
    "fps": 24,
    "description": "Intuitive motion animation"
  },
  "rapid-motion": {
    "frameCount": 72,
    "duration": 3.0,
    "fps": 24,
    "description": "Rapid motion animation"
  }
}
```

**Success Criteria:**

- [ ] All 3 animation directories exist with numbered WebP files
- [ ] Manifest.json loads successfully via fetch in browser
- [ ] No 404 errors when requesting animation assets
- [ ] Total asset size under 12MB for all animations

### 2. Universal Animation Loader

- [ ] Create `src/lib/animations/AnimationEngine.ts`
- [ ] Fetch-based loading (works on any static host)
- [ ] Promise-based frame preloading
- [ ] Memory management and cleanup
- [ ] Error handling with graceful fallbacks

**Success Criteria:**

- [ ] `loadAnimation('stylish-motion')` returns Promise<AnimationSequence>
- [x] All frames preload without errors in console
- [x] Failed frame loads gracefully skip without breaking animation
- [x] Memory usage stays under 50MB after loading all animations
- [x] Works on development server and production build

### 3. Reusable Canvas Controller

- [ ] Size-agnostic rendering system
- [ ] **Multiple trigger systems**: auto, viewport, hover, click, manual
- [ ] **Accessibility**: `prefers-reduced-motion` detection and handling
- [ ] Lazy loading with intersection observer
- [ ] Play/pause/loop controls
- [ ] Staggered timing support (configurable delays)
- [ ] Performance monitoring

**Success Criteria:**

- [x] Animation renders correctly from 24px to 512px canvas size
- [x] All trigger modes (auto, viewport, hover, click, manual) work
- [x] `prefers-reduced-motion: reduce` shows static fallback or pauses animation
- [x] Animation only loads when canvas enters viewport
- [x] play(), pause(), loop() methods work correctly
- [x] Staggered delays (200ms) work as expected
- [x] 24fps playback rate is consistent across browsers

## Phase 2: Component Integration ⚡ **(REQUIRED)**

### 4. Universal Animation Component

- [ ] Create `src/lib/components/CanvasAnimation.svelte`
- [ ] Props: `animationName`, `size`, `trigger`, `delay`, `loop`
- [ ] **Trigger modes**: `'auto'`, `'viewport'`, `'hover'`, `'click'`, `'manual'`
- [ ] **Accessibility**: Respect `prefers-reduced-motion` (pause/static fallback)
- [ ] Slot support for fallback content
- [ ] Framework agnostic (exportable logic)

**Success Criteria:**

- [x] Component renders without TypeScript errors
- [x] All props (animationName, size, trigger, delay, loop) work correctly
- [x] Trigger="viewport" starts animation when scrolled into view
- [x] Users with reduced-motion preference see fallback content
- [x] Fallback slot content displays when animations fail to load
- [x] Component works in both dev and production builds

### 5. Context-Specific Implementations

- [ ] **Inline Text**: Update existing `DialogPrinciples.svelte`
- [ ] **Standalone**: Simple drop-in component for cards/headers
- [ ] **Grid/Layout**: Batch animation management
- [ ] Consistent API across all contexts

**Success Criteria:**

- [x] Current video-based `DialogPrinciples.svelte` replaced with canvas animations
- [x] All 3 animations play with 200ms stagger delay
- [x] Text flow and layout identical to original video implementation
- [x] Animations respect intersection observer (pause when off-screen)
- [x] No visual regressions compared to video version

### 6. Integration Utilities

- [ ] Svelte action: `use:canvasAnimation`
- [ ] Store for animation state management
- [ ] Batch loader for multiple animations
- [ ] Preloader for critical animations

**Success Criteria:**

- [x] `use:canvasAnimation` action works on any canvas element
- [x] Animation state store tracks loading/playing/paused states
- [x] Batch loader can preload all 3 portfolio animations simultaneously
- [x] No memory leaks when components mount/unmount multiple times

## Phase 3: Enhanced Features ⚠️ **(RECOMMENDED)**

### 7. Advanced Loading Strategies

- [ ] **Preload all animations** (since all are critical for portfolio)
- [ ] Progressive loading (load frames as needed for performance)
- [ ] Batch optimization (load multiple animations efficiently)
- [ ] Cache strategies (session-based, localStorage fallback)
- [ ] **Reduced motion fallbacks** (static images or simplified animations)

**Success Criteria:**

- [x] All animations preload on page load without blocking initial render
- [x] Progressive loading reduces time-to-first-frame by 50%
- [x] Batch loading completes without overwhelming network or memory
- [x] Animations load from cache on subsequent page visits
- [x] Static fallback images exist and display correctly for reduced-motion users

### 8. Developer Experience

- [ ] Animation preview utility
- [ ] Simple API documentation
- [ ] TypeScript definitions
- [ ] Error boundaries and debugging

**Success Criteria:**

- [x] Preview utility can play any animation in isolation
- [x] README documents all component props and usage examples
- [x] All TypeScript interfaces exported and properly typed
- [x] Console errors provide actionable debugging information
- [x] Error boundaries prevent animation failures from breaking page

### 9. Performance Optimizations _(If Needed)_

- [ ] Sprite sheet conversion option
- [ ] WebGL rendering path
- [ ] Memory pooling for large animations
- [ ] Adaptive quality based on device

**Success Criteria:**

- [x] Page performance score remains above 90 (Lighthouse)
- [x] Memory usage stays under 100MB on mobile devices
- [x] Animations play smoothly on devices 3+ years old
- [x] No janky scrolling or layout shifts caused by animations

## Implementation Architecture

### Universal Animation Engine

```typescript
// Core engine - framework agnostic
class AnimationEngine {
  loadAnimation(name: string): Promise<AnimationSequence>
  createRenderer(canvas: HTMLCanvasElement, options: RenderOptions): AnimationRenderer
  preloadAll(animations: string[]): Promise<void> // All animations are critical
  checkReducedMotion(): boolean // Accessibility check
}

// Renderer with trigger support
class AnimationRenderer {
  play(): void
  pause(): void
  setTrigger(type: 'auto' | 'viewport' | 'hover' | 'click' | 'manual'): void
  respectReducedMotion(enabled: boolean): void
}

// Svelte-specific wrapper
export function createCanvasAnimation(animationName: string, options?: AnimationOptions)
```

### Component API Design

```svelte
<!-- Current: Inline text usage (auto-trigger) -->
<CanvasAnimation 
  name="stylish-motion" 
  size="1em" 
  trigger="viewport"
  delay={200}
  alt="stylish motion graphic" 
/>

<!-- Future: Interactive usage -->
<CanvasAnimation 
  name="hero-animation" 
  size="256px" 
  trigger="hover"
  class="hero-graphic"
>
  <!-- Fallback for reduced-motion users -->
  <img src="/static/hero-animation-static.webp" alt="Hero animation" />
</CanvasAnimation>

<!-- Manual control for complex interactions -->
<CanvasAnimation 
  name="portfolio-reveal" 
  size="100%" 
  trigger="manual"
  bind:this={animationRef}
/>
```

### Cross-Context Usage Examples

```typescript
// Text integration
const textAnimations = ['stylish-motion', 'intuitive-motion', 'rapid-motion'];

// Card/header integration  
const heroAnimation = 'large-hero-motion';

// Gallery integration
const portfolioAnimations = ['project-1', 'project-2', 'project-3'];
```

## File Size & Performance Estimates

### Asset Sizes (per animation)

- **WebP Sequence**: ~2-4MB (60 frames × 35KB average)
- **Total Portfolio**: ~6-12MB for 3 animations
- **Loading**: Lazy + progressive = only load what's visible

### Performance Targets

- **Initial Load**: <100KB (manifest + critical animation)
- **Time to Interactive**: No blocking on animations
- **Memory Usage**: <50MB peak (reasonable for modern devices)
- **Frame Rate**: Consistent 24fps playback

## Success Metrics

- [x] **Universal**: Same animation works in text, cards, headers
- [x] **Host Agnostic**: Static assets, no build dependencies
- [x] **Performance**: Lazy loading, smooth 24fps playback
- [x] **Maintainable**: Easy to add new animations anywhere
- [x] **Scalable**: Works from 24px to 512px without quality loss
- [x] **Accessible**: Respects motion preferences, includes fallbacks

## Migration Strategy _(Step-by-Step Approach)_

1. **Phase 1**: Build universal engine
2. **Phase 2**: Convert current inline text component only
3. **Phase 3**: Test, optimize, and accessibility audit
4. **Future phases**: Add interactive triggers and new contexts as needed

**Success Criteria for MVP Completion:**

- [x] Current video-based inline animations replaced with canvas
- [x] Zero visual regressions from original implementation
- [x] All browser compatibility issues resolved (especially Safari)
- [x] Performance equals or exceeds video-based approach
- [x] Accessibility compliance with WCAG guidelines
- [x] System ready for future context expansion

## Accessibility & Motion Preferences

```typescript
// Automatic reduced motion detection
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Option 1: Show static fallback image
  // Option 2: Play once and stop
  // Option 3: Reduce animation speed/frequency
}
```

**Accessibility Success Criteria:**

- [x] `prefers-reduced-motion: reduce` automatically disables animations
- [x] Fallback images or content always available
- [x] Animations don't trigger vestibular disorders
- [x] Screen readers can access alternative content
- [x] Keyboard navigation not disrupted by animations

Built-in support ensures animations enhance rather than hinder accessibility.

## Hosting Flexibility Notes

- **Static Assets**: Works on any CDN/static host
- **No Build Dependencies**: Pure runtime loading
- **Progressive Enhancement**: Graceful fallbacks to static images
- **Framework Agnostic Core**: Easy to port if moving away from Svelte

This approach gives you a solid foundation that scales from your current inline text use case to any future animation needs across your portfolio.
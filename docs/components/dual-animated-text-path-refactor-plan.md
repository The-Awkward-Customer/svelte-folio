# Dual AnimatedTextPath Refactor Plan

## Current Situation

The homepage (`+page.svelte`) renders two separate `AnimatedTextPath` components:

1. **Greeting Path**: "HALLO •", "HEJ •", "HOLA •", etc. - speed: 70, random color pair
2. **Action Path**: "LETS COOK –", "WHY NOT TRY?", etc. - speed: 100, different random color pair

Each component generates its own organic path with independent calculations, creating visual variance but requiring duplicate component instances.

## Problems with Current Approach

1. **Code duplication** - Two identical component instances with different props
2. **Lack of visual coordination** - Paths are completely independent
3. **Missed opportunity** - Could create more interesting visual relationships between paths
4. **Performance** - Two separate canvas contexts and animation loops

## Proposed Solution: MultiPathAnimatedText Component

### Architecture Overview

Create a new component that internally manages multiple animated text paths with coordinated behavior while maintaining the organic path generation quality of the original.

### Key Features

1. **Multiple Independent Paths** - Each with own text arrays, speeds, and styles
2. **Coordinated Color Management** - Unified random color selection system
3. **Shared Canvas Context** - Single canvas with multiple path rendering
4. **Optional Path Interaction** - Future capability for intersecting paths (spaghetti effect)
5. **Backward Compatible Props** - Easy migration from dual component setup

## Implementation Strategy

### Phase 1: Component Structure

```typescript
interface PathConfig {
  texts: string[];
  speed: number;
  pathWildness: number;
  pathStyle: PathStyleConfig;
  textStyle: TextStyleConfig;
}

interface MultiPathProps {
  paths: PathConfig[];
  colorPairs?: ColorPair[];
  sharedCanvas?: boolean;
  verticalStacking?: 'random' | 'distributed' | 'overlapping';
}
```

### Phase 2: Path Generation System

- **Reuse organic path generation** from AnimatedTextPath.svelte
- **Vertical distribution strategy** to prevent paths from overlapping unintentionally
- **Independent path calculations** maintaining current visual variety
- **Configurable vertical bounds** per path for custom positioning

### Phase 3: Rendering Pipeline

- **Single canvas context** with multiple path rendering
- **Layered rendering** - paths behind, text on top (or configurable)
- **Independent animation progress** for each path
- **Shared color coordination** system

### Phase 4: Migration Strategy

- **Drop-in replacement** for current dual component setup
- **Props mapping** from current configuration to new multi-path structure
- **Performance optimization** over current dual-component approach

## Technical Implementation Details

### Path Coordination Strategies

1. **Vertical Distribution**: Automatically distribute paths across different vertical regions
2. **Wildness Coordination**: Vary wildness between paths to create visual hierarchy
3. **Speed Variation**: Maintain independent speeds for visual interest
4. **Color Harmony**: Coordinated color selection from shared palette

### Performance Considerations

- **Single requestAnimationFrame** loop instead of two
- **Shared context operations** (clearRect, setup)
- **Optimized rendering** with viewport culling per path
- **Memory efficiency** with shared path calculation utilities

## Benefits of New Approach

1. **Cleaner component usage** - Single component instance
2. **Better coordination** - Unified color and timing management
3. **Performance improvement** - Shared canvas and animation loop
4. **Extensibility** - Easy to add more paths or path interactions
5. **Maintainability** - Single component to maintain instead of managing dual instances

## Migration Plan

### Step 1: Create MultiPathAnimatedText component
- Copy and adapt organic path generation from AnimatedTextPath.svelte
- Implement multi-path rendering system
- Add coordinated color management

### Step 2: Update +page.svelte
- Replace dual AnimatedTextPath with single MultiPathAnimatedText
- Map current props to new path configuration array
- Test visual parity with current setup

### Step 3: Optimization and Polish
- Performance testing and optimization
- Visual fine-tuning
- Documentation and component API finalization

## Future Enhancements

1. **Path Intersection** - Implement spaghetti-like intertwining (from AnimatedTextPathSpag plan)
2. **Dynamic Path Addition** - Runtime path management
3. **Path Interaction Effects** - Hover effects, click interactions
4. **Advanced Coordination** - Synchronized timing effects, cross-path animations

## Expected Outcome

- **Same visual result** as current dual component setup
- **Cleaner, more maintainable code** in +page.svelte
- **Foundation for future enhancements** like path intersections
- **Performance improvement** through shared resources
- **Better developer experience** with unified component API

## Next Steps

1. **Review this plan** with team/stakeholder
2. **Create MultiPathAnimatedText.svelte** component
3. **Implement path coordination system**
4. **Test migration in +page.svelte**
5. **Performance validation** and optimization
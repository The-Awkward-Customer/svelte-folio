# Accordion Theme Refactor Plan - REVISED

## Problem Statement

The current Accordion component uses a brand-based theming system that conflicts with existing themed variables by overriding global CSS custom properties. When an accordion opens, it applies brand colors globally, affecting the entire page appearance rather than using standard theme switching.

## Current Issues

1. **Global CSS Variable Conflicts**: `themeManager.setActiveBrand()` overrides root-level CSS variables like `--bg-page`, `--fg-text-primary`
2. **Limited Brand-Theme Combinations**: Cannot specify which theme works best with each brand color
3. **Inflexible System**: Cannot easily configure "GoDesk-Dark" or "Fresha-Light" combinations

## Revised Requirements

Based on user clarification, the system should:

1. **Brand Background Override**: Use brand-specific CSS variables (e.g., `--color-brand-godesk`) to override `--bg-page`
2. **Manual Theme Selection**: For each brand, manually specify whether to use `light`, `dark`, or `high-contrast` theme
3. **Clean Reversion**: When accordion closes or user navigates away, revert to user's preference
4. **Flexible Configuration**: Support combinations like:
   - GoDesk → `--color-brand-godesk` + Dark theme
   - Fresha → `--color-brand-fresha` + Light theme
   - Any Brand → High-contrast theme (fallback)

## Current Brand Variables (from CSS)

The CSS already defines brand color variables:
- `--color-brand-jio`
- `--color-brand-fresha` 
- `--color-brand-godesk`
- `--color-brand-suzuki`
- `--color-brand-warhammer`
- `--color-brand-shell`
- `--color-brand-ikea`
- `--color-brand-postoffice`
- `--color-brand-hsbc`
- `--color-brand-unilever`
- `--color-brand-axa`
- `--color-brand-tsb`

## Implementation Plan

### Phase 1: Create Brand-Theme Configuration
- Create a configuration object mapping brands to their preferred themes
- Example: `{ godesk: 'dark', fresha: 'light', warhammer: 'high-contrast' }`
- This allows declarative configuration of brand-theme combinations

### Phase 2: Extend ThemeManager  
- Add `brandOverride: { brand: BrandKey, theme: ThemePreference } | null` to ThemeState
- Add `setBrandThemeOverride(brand: BrandKey, theme: ThemePreference)` method
- Add `clearBrandThemeOverride()` method
- Modify `applyTheme()` to:
  - Set theme to specified theme (not user preference)  
  - Use `--color-brand-{brand}` to override `--bg-page`
  - Calculate contrasting text colors for the brand background

### Phase 3: Update Accordion Component
- Replace `brand?: BrandKey` with `brand?: BrandKey` and `themeOverride?: ThemePreference`
- Replace `themeManager.setActiveBrand()` with `themeManager.setBrandThemeOverride(brand, themeOverride)`
- Allow explicit theme override per accordion instance
- Fallback to configuration object if no explicit theme specified

### Phase 4: Handle Navigation/Cleanup
- Listen for page navigation to clear overrides
- Ensure accordion close clears the override

## Success Criteria

### ✅ Functional Requirements
- [ ] Accordion opens → Overrides page background color AND forces specific theme (light/dark/high-contrast) as configured
- [ ] Accordion closes → Returns to user's preferred theme and original background color
- [ ] Multiple accordions → Only one theme override active at a time
- [ ] Background color override works with light, dark, and high-contrast theme fallbacks
- [ ] Smooth transitions between theme states and background colors
- [ ] Respects user's `prefers-reduced-motion` setting

### ✅ Technical Requirements
- [ ] Manual page background color override capability
- [ ] Theme fallback system supports light, dark, and high-contrast modes
- [ ] Uses standard `data-theme` attribute switching with background override
- [ ] Clean separation between user preference and temporary overrides
- [ ] Maintains existing theme system architecture
- [ ] No breaking changes to other components

### ✅ User Experience Requirements
- [ ] Theme changes are immediate and smooth
- [ ] No flash of unstyled content (FOUC)
- [ ] Consistent behavior across all accordions
- [ ] Accessible theme transitions
- [ ] System theme detection still works when no manual override

## Implementation Details

### New ThemeManager Methods
```typescript
// Force a specific theme with background color override
setManualThemeOverride(theme: 'light' | 'dark' | 'high-contrast', backgroundColor?: string): void

// Clear manual override and return to user preference  
clearManualThemeOverride(): void

// Check if manual override is active
get hasManualOverride(): boolean

// Get the currently applied theme (considering overrides)
get appliedTheme(): ThemePreference

// Get current background override
get backgroundOverride(): string | null
```

### Updated Accordion Usage
```svelte
<!-- GoDesk with explicit dark theme -->
<Accordion label="GoDesk Case Study" brand="godesk" themeOverride="dark">
  <!-- content --> 
</Accordion>

<!-- Fresha with explicit light theme -->
<Accordion label="Fresha Project" brand="fresha" themeOverride="light">
  <!-- content -->
</Accordion>

<!-- Warhammer using configured default (high-contrast) -->
<Accordion label="Warhammer Experience" brand="warhammer">
  <!-- Uses configuration: warhammer: 'high-contrast' -->
</Accordion>
```

### Theme Priority Logic
1. Manual theme override (if active)
2. User's saved preference 
3. System preference (if no saved preference)

## Benefits of This Approach

1. **No CSS Conflicts**: Uses standard theme switching instead of variable overrides
2. **Predictable Behavior**: Simple light/dark theme forcing
3. **Clean Architecture**: Clear separation of concerns
4. **Maintainable**: Easier to debug and extend
5. **Accessible**: Maintains all existing accessibility features
6. **Performance**: No complex CSS variable calculations

## Testing Strategy

1. **Theme Override Testing**
   - Open accordion → Verify theme changes to specified override
   - Close accordion → Verify theme returns to user preference
   - Multiple accordions → Verify only one override active

2. **Integration Testing**
   - Test with different user preferences (light/dark/high-contrast)
   - Test with system theme changes
   - Test transition animations
   - Test reduced motion preferences

3. **Regression Testing**
   - Verify existing themed variables still work
   - Test other theme-dependent components
   - Verify localStorage persistence
   - Test system theme detection

## Migration Path

1. Implement new ThemeManager methods alongside existing brand system
2. Update Accordion component to use new system
3. Test thoroughly in development
4. Deploy with feature flag if needed
5. Remove old brand system after verification
## Related Components & Paths
- [`../frontend/src/lib/components/accordian/Accordian.svelte`](../../../frontend/src/lib/components/accordian/Accordian.svelte)
- [`../frontend/src/lib/components/accordian/AccordionList.svelte`](../../../frontend/src/lib/components/accordian/AccordionList.svelte)
- Theme systems: `../frontend/src/lib/stores/themeManager.svelte.ts`, `../frontend/src/lib/theme.svelte.ts`

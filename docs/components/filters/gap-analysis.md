# Filter Toggle Component - Gap Analysis

## Figma Design Analysis

### Design Token Variables (from Figma)
- **Font Size**: `fs-300` (16px)
- **Padding**: 
  - Left/Right: `padding-left-small-relaxed` / `padding-right-small-relaxed` (12px)
  - Top/Bottom: `padding-top-none` / `padding-bottom-none` (0px)
- **Size**: `size-touch-utility` (32px) - likely minimum touch target
- **Border Radius**: `radius-border-radius-pill` (999px) - pill shape
- **Spacing**: `spacing-x-xsmall` (4px)

### Color Tokens
- **Ghost State** (Inactive):
  - Background: `bg-ghost-default` (transparent)
  - Hover: `bg-ghost-hover` (#0000000d)
  - Active: `bg-ghost-active` (#0000001a)
  - Text: `fg-primary-default` (#26272d)

- **Primary State** (Active):
  - Background: `bg-primary-default` (#26272d)
  - Hover: `bg-primary-hover` (#26272d)
  - Active: `bg-primary-active` (#26272d)
  - Text: `fg-on-interactive-default` (#ffffff)

- **Focus States**:
  - Outer: `focus-outer` (#ff9500)
  - Inset: `focus-inset` (#ffffff)

## Current Implementation Analysis

### FilterToggle.svelte Current State
- **Padding**: `6px 10px` (different from Figma's 12px horizontal, 0px vertical)
- **Border Radius**: `var(--border-radius-sm)` (not pill shape like Figma)
- **Font Size**: `var(--fs-350)` (may not match Figma's fs-300)
- **Hover Effects**: Box-shadow based (inset borders)
- **Active State**: Uses `--bg-primary` and `--fg-text-inverse`

## Gap Analysis

### ✅ Matches
- Basic toggle functionality
- Active/inactive states
- Hover effects
- Cursor pointer behavior
- Smooth transitions

### ❌ Gaps Identified

#### 1. Spacing & Sizing
- **Current**: `6px 10px` padding
- **Figma**: `12px 0px` padding
- **Gap**: Horizontal padding too small, vertical padding should be removed

#### 2. Border Radius
- **Current**: Uses `--border-radius-sm`
- **Figma**: Uses pill shape (`border-radius-pill: 999px`)
- **Gap**: Should use pill border radius for rounded appearance

#### 3. Font Size
- **Current**: `var(--fs-350)`
- **Figma**: `fs-300` (16px)
- **Gap**: Font size token mismatch

#### 4. Color Tokens
- **Current**: Uses generic `--bg-pae`, `--fg-text-primary`, `--bg-primary`
- **Figma**: Specific ghost/primary color tokens with hover states
- **Gap**: Missing specific ghost state colors and proper color token structure

#### 5. Focus States
- **Current**: No visible focus indicators
- **Figma**: Orange focus outline with white inset
- **Gap**: Missing accessibility focus indicators

#### 6. Minimum Touch Target
- **Current**: No minimum size constraint
- **Figma**: `size-touch-utility` (32px)
- **Gap**: Should ensure 32px minimum for touch accessibility

### 🔧 Required Updates

1. **Update padding** from `6px 10px` to `0px 12px`
2. **Change border-radius** to pill shape (`999px`)
3. **Implement proper color tokens** for ghost and primary states
4. **Add focus indicators** with orange outline and white inset
5. **Ensure minimum 32px touch target**
6. **Update font size** to match `fs-300` token
7. **Implement proper hover state colors** per Figma specifications

### Design System Token Gaps

#### Missing Tokens Needed:
- `--bg-ghost-default`: transparent
- `--bg-ghost-hover`: #0000000d
- `--bg-ghost-active`: #0000001a
- `--focus-outer`: #ff9500
- `--focus-inset`: #ffffff
- `--size-touch-utility`: 32px
- `--border-radius-pill`: 999px

### Priority Recommendations

**High Priority:**
- Fix padding and border radius for visual consistency
- Implement proper color tokens for ghost states
- Add focus indicators for accessibility (❌ not required)

**Medium Priority:**
- Ensure minimum touch target size
- Update font size token reference

**Low Priority:**
- Optimize transition timing and easing functions
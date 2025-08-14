# Svelte Components CSS Analysis Report

## Overview
- **Total Components**: 67
- **Components with Styles**: 63
- **Components without Styles**: 4
- **Total CSS Properties Found**: 112

## CSS Properties Analysis

### Most Used CSS Properties
 1. **display**: 96 components (152.4%)
 2. **color**: 75 components (119.0%)
 3. **width**: 74 components (117.5%)
 4. **align-items**: 59 components (93.7%)
 5. **height**: 56 components (88.9%)
 6. **justify-content**: 49 components (77.8%)
 7. **font-size**: 48 components (76.2%)
 8. **flex-direction**: 43 components (68.3%)
 9. **font-weight**: 41 components (65.1%)
10. **position**: 41 components (65.1%)
11. **background-color**: 40 components (63.5%)
12. **border-radius**: 37 components (58.7%)
13. **gap**: 37 components (58.7%)
14. **transform**: 33 components (52.4%)
15. **padding**: 31 components (49.2%)
16. **background**: 24 components (38.1%)
17. **opacity**: 22 components (34.9%)
18. **cursor**: 21 components (33.3%)
19. **border**: 20 components (31.7%)
20. **padding-left**: 20 components (31.7%)

### CSS Custom Properties (Design Tokens)

**Background**:
- `--bg-inverse`
- `--bg-overlay`
- `--bg-pae`
- `--bg-page`
- `--bg-page-20`
- `--bg-positive`
- `--bg-primary`
- `--bg-secondary`
- `--bg-secondary-hover`

**Border**:
- `--bdr-primary`
- `--bdr-radius-medium`
- `--bdr-radius-pill`
- `--bdr-radius-small`
- `--bdr-radius-tiny`

**Font Family**:
- `--font-family-alt`
- `--font-family-main`

**Font Size**:
- `--fs-200`
- `--fs-250`
- `--fs-275`
- `--fs-300`
- `--fs-350`
- `--fs-400`
- `--fs-500`
- `--fs-700`
- `--fs-800`
- `--fs-large-clamped`
- `--fs-xlarge-clamped`
- `--fs-xxlarge-clamped`

**Font Weight**:
- `--fw-bold`
- `--fw-medium`
- `--fw-regular`
- `--fw-semibold`

**Foreground/Text**:
- `--fg-positive`
- `--fg-text`
- `--fg-text-danger`
- `--fg-text-inverse`
- `--fg-text-inverse-60`
- `--fg-text-muted`
- `--fg-text-primary`
- `--fg-text-primary-20`
- `--fg-text-primary-30`
- `--fg-text-primary-40`
- `--fg-text-primary-60`
- `--fg-text-primary-80`
- `--fg-text-secondary`

**Other**:
- `--before-color`
- `--border-secondary`
- `--color-bdr-muted`
- `--color-bdr-primary`
- `--color-bg-page`
- `--color-txt-muted`
- `--color-txt-primary`
- `--color-txt-secondary`
- `--columns`
- `--error-bg`
- `--error-border`
- `--error-text`
- `--error-text-secondary`
- `--focus-ring-color`
- `--focus-ring-offset`
- `--focus-ring-width`
- `--grid-area`
- `--grid-cols`
- `--grid-desktop-columns`
- `--grid-rows`
- `--lh-snug`
- `--padding-page-default`
- `--primary-color`
- `--primary-hover-color`
- `--secondary-hover-color`
- `--text-color`
- `--transition-fast`
- `--width-4xl`
- `--width-prose-sm`

**Spacing**:
- `--space-lg`
- `--space-md`
- `--space-sm`
- `--space-xl`
- `--space-xs`
- `--spc-100`
- `--spc-1000`
- `--spc-200`
- `--spc-300`
- `--spc-400`
- `--spc-50`
- `--spc-500`
- `--spc-75`

**Total Custom Properties Found**: 87

## Component Complexity Analysis

### Most Complex Components (by CSS rule count)
 1. **WeatherDebugPanel**: 31 CSS rules
 2. **ChatMessage**: 21 CSS rules
 3. **Avatar**: 21 CSS rules
 4. **IconButton**: 16 CSS rules
 5. **VideoTile**: 16 CSS rules
 6. **List**: 14 CSS rules
 7. **Weather**: 13 CSS rules
 8. **Details**: 12 CSS rules
 9. **ProgressToast**: 11 CSS rules
10. **TagList**: 11 CSS rules
11. **Button**: 10 CSS rules
12. **ImageGrid**: 10 CSS rules
13. **ChatInput**: 9 CSS rules
14. **Accordion**: 9 CSS rules
15. **ProgressIndicator**: 9 CSS rules

### Components with Most CSS Property Diversity
 1. **Avatar**: 35 unique CSS properties
 2. **WeatherDebugPanel**: 32 unique CSS properties
 3. **VideoCard**: 31 unique CSS properties
 4. **ChatMessage**: 27 unique CSS properties
 5. **PromptButton**: 27 unique CSS properties
 6. **ProgressIndicator**: 26 unique CSS properties
 7. **VideoTile**: 26 unique CSS properties
 8. **Weather**: 25 unique CSS properties
 9. **ProgressToast**: 23 unique CSS properties
10. **Details**: 22 unique CSS properties
11. **Button**: 21 unique CSS properties
12. **Accordion**: 20 unique CSS properties
13. **Prefix**: 20 unique CSS properties
14. **McpText**: 19 unique CSS properties
15. **ChatTrigger**: 19 unique CSS properties

### Components Without Styles
- IconRefresh
- RainDrops
- TestThemeHook
- WeatherIcon

## CSS Property Categories

**Layout Properties** (10): display, overflow-x, position, overflow-y, left, top, z-index, overflow, right, bottom

**Flexbox Properties** (10): align-items, flex-wrap, justify-content, flex-direction, flex-shrink, flex, flex-grow, align-self, flex-flow, align-content

**Spacing Properties** (12): padding, padding-bottom, padding-left, padding-right, padding-top, gap, margin, margin-top, padding-inline, padding-block, margin-bottom, margin-right

**Typography Properties** (8): font-weight, font-family, font-size, text-transform, text-align, line-height, text-decoration, font-style

**Color Properties** (4): background-color, color, background, border-color

## Component Organization

**accordion/** (2/2 with styles)
  ✓ Accordion
  ✓ AccordionList

**accordion/items/** (3/3 with styles)
  ✓ Experience
  ✓ Introduction
  ✓ Process

**actions/** (4/4 with styles)
  ✓ Button
  ✓ GemButton
  ✓ IconButton
  ✓ PromptButton

**cards/** (3/3 with styles)
  ✓ ImageCard
  ✓ TextCard
  ✓ VideoCard

**chat/** (5/5 with styles)
  ✓ ChatDialog
  ✓ ChatInput
  ✓ ChatMessage
  ✓ ChatMessages
  ✓ QAChat

**experimental/dialog/** (3/3 with styles)
  ✓ TestOne
  ✓ TestThree
  ✓ TestTwo

**feedback/** (3/3 with styles)
  ✓ Callout
  ✓ ProgressIndicator
  ✓ ProgressToast

**filters/** (2/2 with styles)
  ✓ FilterGroup
  ✓ FilterToggle

**graphics/** (3/3 with styles)
  ✓ AnimatedTextPath
  ✓ AnimatedTextPathSpag
  ✓ CanvasAnimation

**grids/** (1/1 with styles)
  ✓ GridLayout

**layout/** (3/3 with styles)
  ✓ BasicLayout
  ✓ Grid
  ✓ GridItem

**layout/footer/** (1/1 with styles)
  ✓ FooterTitle

**marginalia/** (0/1 with styles)
  ○ RainDrops

**media/** (1/1 with styles)
  ✓ VideoTile

**navigation/** (2/2 with styles)
  ✓ Link
  ✓ LinkList

**overlays/dialog/** (15/15 with styles)
  ✓ AnimatedBackground
  ✓ Details
  ✓ Footer
  ✓ Fresha
  ✓ Header
  ✓ Image
  ✓ ImageGrid
  ✓ Intro
  ✓ Prefix
  ✓ Principles
  ✓ Root
  ✓ Section
  ✓ Shell
  ✓ Text
  ✓ Title

**primitives/** (8/9 with styles)
  ✓ Avatar
  ✓ Icon
  ○ IconRefresh
  ✓ Indicator
  ✓ List
  ✓ McpText
  ✓ Subheader
  ✓ Tag
  ✓ TagList

**root/** (0/1 with styles)
  ○ TestThemeHook

**snoop/** (2/3 with styles)
  ✓ Weather
  ✓ WeatherDebugPanel
  ○ WeatherIcon

**top-nav/** (2/2 with styles)
  ✓ ChatTrigger
  ✓ TopNav


# Badge Primitive Component
*Created: 2025-09-25 12:40:00 UTC*

## Overview

The Badge primitive component provides animated status indicators with modern Svelte 5 patterns and accessibility features. Originally named "Indicator", the component has been renamed to "Badge" with updated class names and improved API consistency across the primitive system.

## Component Features

### Core Functionality
- **Animated Entry**: Smooth scale animation with bounce easing on mount
- **Pulse Animation**: Optional pulsing animation for attention-grabbing indicators
- **Accessibility**: Built-in ARIA labels and status role for screen readers
- **Motion Preferences**: Respects `prefers-reduced-motion` for inclusive design
- **Delayed Mount**: 1-second delay before showing to prevent layout flash

### Visual Characteristics
- **Pill Shape**: Fully rounded using `--border-radius-pill` token
- **Danger Styling**: Uses `--fg-text-danger` token for high-visibility red color
- **Border Accent**: White border for contrast against various backgrounds
- **Compact Size**: 16x16 pixel dimensions for subtle presence
- **Absolute Positioning**: Positioned relative to parent container

## Props Interface

```typescript
interface Props {
  pulse?: boolean;  // Enable pulsing animation (default: false)
  class?: string;   // Additional CSS classes (default: "")
}
```

## Component States

### Static Badge
Default state with no animation beyond the initial entry transition.

```svelte
<Badge />
```

### Pulsing Badge
Continuously pulses to draw attention, ideal for notifications.

```svelte
<Badge pulse={true} />
```

### Custom Styled Badge
Additional CSS classes can be applied for customization.

```svelte
<Badge class="custom-badge" />
```

## Usage Examples

### Basic Notification Badge
<!-- Updated: 2025-09-25 12:40:00 UTC -->
```svelte
<script>
  import { Badge } from '$lib/components/primitives';
</script>

<div class="notification-container">
  <span>Messages</span>
  <Badge />
</div>

<style>
  .notification-container {
    position: relative;
    display: inline-block;
  }
</style>
```

### Pulsing Alert Badge
```svelte
<div class="alert-container">
  <button>Notifications</button>
  <Badge pulse={true} />
</div>

<style>
  .alert-container {
    position: relative;
    display: inline-block;
  }
</style>
```

### Avatar with Status Badge
```svelte
<script>
  import { Badge, Image } from '$lib/components/primitives';
</script>

<div class="avatar-container">
  <Image
    src="/avatars/user.jpg"
    alt="User avatar"
    borderRadius="pill"
    width={48}
    height={48}
  />
  <Badge pulse={true} />
</div>

<style>
  .avatar-container {
    position: relative;
    display: inline-block;
  }
</style>
```

### Custom Styled Badge
```svelte
<div class="custom-container">
  <span>Custom Badge</span>
  <Badge class="success-badge" />
</div>

<style>
  .custom-container {
    position: relative;
    display: inline-block;
  }

  :global(.success-badge) {
    background-color: var(--fg-text-success);
  }
</style>
```

## Animation System

### Entry Animation
All badges animate in with a scale transition:
- **Duration**: 800ms
- **Easing**: Bounce out for playful entry
- **Delay**: 1000ms after mount to prevent flash
- **Scale**: From 0 to 1 for smooth appearance

```javascript
in:scale={{ duration: 800, start: 0, easing: bounceOut }}
```

### Pulse Animation
When `pulse={true}`, the badge continuously pulses:
- **Duration**: 2s per cycle
- **Easing**: Cubic bezier for natural motion
- **Scale Range**: 1.0 to 1.1 and back
- **Infinite**: Continues until component unmounts

```css
@keyframes scale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

### Accessibility Animation Respect
```css
@media (prefers-reduced-motion: reduce) {
  .badge--pulse {
    animation: none;
  }
}
```

## CSS Classes and Styling

### Generated Classes
```css
/* Base component */
.badge

/* Pulse variant */
.badge--pulse
```

### Default Styling
```css
.badge {
  position: absolute;
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: var(--border-radius-pill);
  border: 2px solid var(--surface-neutral-reading);
  background-color: var(--fg-text-danger);
  top: 0px;
  right: 0px;
}
```

## Design Token Integration

### Color Tokens Used
```css
--fg-text-danger: oklch(63.61% 0.24 15.84);      /* Badge background */
--surface-neutral-reading: oklch(98.36% 0.01 15.84); /* Border color */
```

### Shape Tokens Used
```css
--border-radius-pill: 9999px; /* Fully rounded shape */
```

## Accessibility Features

### ARIA Support
The badge includes proper accessibility attributes:

```svelte
<span
  class={classes}
  role="status"
  aria-label="Status badge"
>
```

### Screen Reader Support
- **Role**: `status` indicates dynamic content that should be announced
- **Aria-label**: Provides context for screen readers
- **Motion Respect**: Honors `prefers-reduced-motion` settings

### Focus Management
Since badges are visual indicators, they don't receive keyboard focus, maintaining proper tab order for interactive elements.

## Migration Guide

### Indicator → Badge Renaming
<!-- Updated: 2025-09-25 12:40:00 UTC -->

The component has been renamed from "Indicator" to "Badge" with corresponding updates to class names and imports.

#### Import Changes
```svelte
<!-- OLD -->
import { Indicator } from '$lib/components/primitives';

<!-- NEW -->
import { Badge } from '$lib/components/primitives';
```

#### Component Usage
```svelte
<!-- OLD -->
<Indicator pulse={true} />

<!-- NEW -->
<Badge pulse={true} />
```

#### CSS Class Updates
```css
/* OLD classes (no longer generated) */
.indicator
.indicator--pulse

/* NEW classes */
.badge
.badge--pulse
```

#### Custom Styling Migration
```css
/* OLD custom styles */
.my-indicator {
  /* styles */
}

/* NEW custom styles */
.my-badge {
  /* same styles */
}
```

### Migration Checklist

1. **Update Imports**: Change `Indicator` to `Badge` in all import statements
2. **Update Components**: Replace `<Indicator>` tags with `<Badge>`
3. **Update CSS**: Change `.indicator` class references to `.badge`
4. **Update Custom Classes**: Rename custom CSS classes if they reference "indicator"
5. **Test Animations**: Verify pulse animations still work as expected
6. **Accessibility Check**: Confirm screen reader functionality remains intact

### Automated Migration Script
For projects with many instances, consider this find-and-replace pattern:

```bash
# Update imports
find . -name "*.svelte" -exec sed -i 's/import.*Indicator.*from/import { Badge } from/g' {} \;

# Update component usage
find . -name "*.svelte" -exec sed -i 's/<Indicator/<Badge/g' {} \;
find . -name "*.svelte" -exec sed -i 's/<\/Indicator>/<\/Badge>/g' {} \;

# Update CSS classes in styles
find . -name "*.svelte" -exec sed -i 's/\.indicator/\.badge/g' {} \;
```

## Advanced Usage Patterns

### Conditional Badge Display
```svelte
<script>
  let hasNotifications = $state(true);
  let isOnline = $state(false);
</script>

<div class="user-status">
  <span>User Name</span>
  {#if hasNotifications}
    <Badge pulse={true} />
  {/if}
  {#if isOnline}
    <Badge class="online-badge" />
  {/if}
</div>
```

### Multiple Badge States
```svelte
<script>
  let badgeType = $state('notification'); // 'notification' | 'error' | 'success'
</script>

<div class="multi-badge-container">
  <span>Status</span>
  <Badge
    pulse={badgeType === 'error'}
    class="{badgeType}-badge"
  />
</div>

<style>
  :global(.notification-badge) {
    background-color: var(--fg-text-info);
  }

  :global(.error-badge) {
    background-color: var(--fg-text-danger);
  }

  :global(.success-badge) {
    background-color: var(--fg-text-success);
  }
</style>
```

### Badge with Count (Custom Extension)
```svelte
<script>
  import { Badge } from '$lib/components/primitives';
  let count = $state(3);
</script>

<div class="count-badge-container">
  <span>Messages</span>
  {#if count > 0}
    <div class="count-badge">
      <span class="count-text">{count}</span>
      <Badge class="count-indicator" />
    </div>
  {/if}
</div>

<style>
  .count-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--fg-text-danger);
    color: white;
    border-radius: var(--border-radius-pill);
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    min-width: 20px;
    text-align: center;
  }
</style>
```

## Integration with Other Primitives

### With Card Component
```svelte
<script>
  import { Card, Badge } from '$lib/components/primitives';
</script>

<Card alignment="left">
  <div class="card-header">
    <h3>Project Status</h3>
    <Badge pulse={true} />
  </div>
  <p>Active development in progress</p>
</Card>

<style>
  .card-header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
```

### With Image Component
```svelte
<script>
  import { Image, Badge } from '$lib/components/primitives';
</script>

<div class="avatar-with-status">
  <Image
    src="/user-avatar.jpg"
    alt="User profile"
    borderRadius="pill"
    width={64}
    height={64}
  />
  <Badge pulse={true} />
</div>

<style>
  .avatar-with-status {
    position: relative;
    display: inline-block;
  }
</style>
```

## Performance Considerations

### Efficient Animations
- Uses CSS animations instead of JavaScript for optimal performance
- Minimal DOM manipulation with simple class toggling
- GPU-accelerated transforms for smooth animations

### Bundle Size
- Minimal JavaScript footprint
- CSS-only styling approach
- No external dependencies

### Memory Usage
- Automatic cleanup when component unmounts
- No persistent timers or intervals
- Efficient SVG-free design

## Best Practices

### When to Use Badges
**Do**: Use for status indicators and notifications
```svelte
<Badge pulse={true} /> <!-- For urgent notifications -->
<Badge /> <!-- For general status indication -->
```

**Don't**: Use for decorative purposes without meaning
```svelte
<!-- Avoid purely decorative badges -->
<Badge class="decoration-only" />
```

### Positioning Guidelines
**Do**: Position badges on interactive elements
```svelte
<button class="notification-button">
  Notifications
  <Badge pulse={hasNewMessages} />
</button>
```

**Do**: Use relative positioning containers
```svelte
<div class="relative-container">
  <span>Content</span>
  <Badge />
</div>
```

### Animation Usage
**Do**: Use pulse for urgent notifications
```svelte
<Badge pulse={isUrgent} />
```

**Don't**: Overuse pulse animations
```svelte
<!-- Too many pulsing badges can be distracting -->
<Badge pulse={true} />
<Badge pulse={true} />
<Badge pulse={true} />
```

## Common Issues and Solutions

### Badge Not Showing
**Problem**: Badge appears but immediately disappears
**Solution**: Ensure parent container has `position: relative`

**Problem**: Badge doesn't appear at all
**Solution**: Check the 1-second mount delay is appropriate for your use case

### Animation Problems
**Problem**: Pulse animation not working
**Solution**: Verify the `pulse` prop is set to `true` and CSS animations are enabled

**Problem**: Entry animation looks jarring
**Solution**: Consider the timing context and adjust the mount delay if needed

### Positioning Issues
**Problem**: Badge appears in wrong position
**Solution**: Confirm parent container has proper positioning context

## Related Documentation

- [Image Primitive](./Image.md) - Composable image component
- [Card Primitive](./Card.md) - Container component for layouts
- [Primitives Overview](./README.md) - Complete primitives system
- [CSS Architecture](../../css/css-architecture-overview-2025-08-28-1125.md) - Design token system

## Revision History

| Date | Version | Changes |
|------|---------|---------|
| 2025-09-25 12:40:00 UTC | v2.0 | Renamed from Indicator to Badge with updated class names and comprehensive migration guide |
| Previous | v1.0 | Original Indicator component implementation |

---

*This documentation covers the Badge primitive component. For the latest implementation details, refer to `/frontend/src/lib/components/primitives/Badge.svelte`.*
# GSAP Text Animations Module

A modular text animation system for Svelte 5 using GSAP, designed for reusable and scalable text effects.

## Features

- **Character Shuffle Animation**: Cycles through random characters before revealing the final text
- **Typewriter Effect**: Progressive character reveal animation
- **Wave Animation**: Placeholder for future wave motion implementation
- **Accessibility**: Respects `prefers-reduced-motion` settings
- **Modular Design**: Easy to import and use across components

## Installation

GSAP is already installed as a dependency. Import animations from the module:

```typescript
import { shuffleText, typewriterText } from '$lib/animations/gsap';
```

## Usage

### Character Shuffle Animation

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { shuffleText } from '$lib/animations/gsap';

  let textElement: HTMLElement;

  onMount(() => {
    if (textElement) {
      shuffleText(textElement, 'HELLO WORLD', {
        duration: 1.2,
        iterations: 2,
        stagger: 0.05,
        delay: 0.1,
      });
    }
  });
</script>

<span bind:this={textElement}>HELLO WORLD</span>
```

### Typewriter Animation

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { typewriterText } from '$lib/animations/gsap';

  let textElement: HTMLElement;

  onMount(() => {
    if (textElement) {
      typewriterText(textElement, 'Hello World', {
        duration: 2,
        delay: 0.5,
      });
    }
  });
</script>

<span bind:this={textElement}></span>
```

## Animation Options

### ShuffleOptions

- `duration?: number` - Total animation duration (default: 1.2s)
- `iterations?: number` - Number of random character cycles (default: 4)
- `stagger?: number` - Delay between character animations (default: 0.05s)
- `delay?: number` - Initial delay before animation starts
- `characters?: string` - Custom character set for randomization
- `preserveSpaces?: boolean` - Keep spaces intact during animation (default: true)
- `respectReducedMotion?: boolean` - Honor accessibility preferences (default: true)

## Implementation Example: Accordion Component

The accordion component demonstrates the integration pattern:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { shuffleText } from '$lib/animations/gsap';

  interface Props {
    label: string;
    enableShuffleAnimation?: boolean;
  }

  let { label, enableShuffleAnimation = true }: Props = $props();
  let labelElement: HTMLElement | undefined;

  onMount(() => {
    if (enableShuffleAnimation) {
      setTimeout(() => {
        if (labelElement) {
          shuffleText(labelElement, label, {
            duration: 1.2,
            iterations: 4,
            stagger: 0.05,
            delay: 0.1,
          });
        }
      }, 50);
    }
  });
</script>

<span bind:this={labelElement}>{label}</span>
```

## CSS Considerations

The animations create temporary `<span>` elements with these classes:

```css
/* Character spans */
:global(.gsap-char) {
  display: inline-block;
  position: relative;
}

/* Space preservation */
:global(.gsap-space) {
  display: inline-block;
}
```

## Accessibility

- Automatically detects `prefers-reduced-motion: reduce`
- Provides instant text changes when motion is reduced
- Maintains semantic text content for screen readers

## Future Enhancements

- Wave motion animation implementation
- Additional text effects (glitch, fade, etc.)
- Trigger system integration (hover, viewport, click)
- Performance optimizations for large text blocks

## File Structure

```
frontend/src/lib/animations/gsap/
├── index.ts              # Main exports
├── textAnimations.ts     # Core animation functions
├── types.ts             # TypeScript definitions
├── utils.ts             # Helper utilities
└── README.md            # This documentation
```

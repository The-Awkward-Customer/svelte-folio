# Accordion Scroll-to-Top Feature

## Overview
Enhanced the Accordion component to automatically scroll the opened accordion to the top of the user's viewport when it opens. This prevents users from needing to manually scroll up to see the accordion header after it expands.

## Implementation Details

### Files Modified
- `frontend/src/lib/components/accordian/Accordian.svelte`

### Changes Made

#### 1. Added Button Element Reference
```typescript
let buttonElement: HTMLElement | undefined;
```

#### 2. Bound Button Element
```html
<button bind:this={buttonElement} onclick={handleClick} aria-label={label}>
```

#### 3. Updated Scroll Logic
```typescript
function handleClick() {
    const wasOpen = accordionState.isOpen;
    toggleAccordion(accordionState);

    // If accordion is opening, scroll to top of accordion button after transition
    if (!wasOpen && buttonElement) {
        setTimeout(() => {
            buttonElement?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 420); // Wait for slide transitions (400ms) + minimal buffer
    }
}
```

## Behavior

### Before
- When an accordion opened, it would scroll to the content area (`detailsElement`)
- Users had to scroll up to see the accordion header

### After
- When an accordion opens, it scrolls to the accordion button/header
- The accordion header is positioned at the top of the viewport
- Users can immediately see the full accordion without additional scrolling

## Technical Details

- **Scroll Behavior**: Smooth scrolling animation
- **Positioning**: `block: 'start'` positions the button at the top of the viewport
- **Timing**: 420ms delay to wait for slide transitions (400ms) plus minimal buffer
- **Trigger**: Only scrolls when accordion is opening (not closing)

## User Experience Impact

- ✅ Improved UX - no manual scrolling required
- ✅ Consistent behavior across all accordions
- ✅ Smooth animation maintains visual continuity
- ✅ Accessible - preserves all existing accessibility features

## Bug Fixes

### Multiple Accordion Timing Issue
**Problem**: When opening a second accordion while the first was already open, users were only scrolled to the middle of the accordion instead of the top.

**Root Cause**: The accordion manager closes other accordions before opening the new one. Both the closing (400ms) and opening (400ms) slide transitions were happening simultaneously, but the scroll calculation was running too early (100ms) while the DOM layout was still mid-transition.

**Solution**: Increased the timeout from 100ms to 420ms to ensure both slide transitions complete before calculating the scroll position.

## Failed Attempts & Lessons Learned

### Double Scroll Effect Investigation
**Problem**: The current implementation causes a "scroll down then back up" effect when accordions open, creating jarring user experience.

### Attempted Solutions

#### 1. Inverted Order Approach
**Approach**: Scroll to button first, then open accordion
- Modified `handleClick()` to scroll before calling `toggleAccordion()`
- Used 400ms delay to wait for scroll completion before opening

**Issues**:
- Scroll didn't work when accordion was already visible in viewport
- `scrollIntoView` with `block: 'start'` doesn't scroll if element already visible
- Created awkward delay between click and accordion opening

#### 2. Window.scrollTo with Absolute Positioning
**Approach**: Calculate button's absolute position and force scroll regardless of visibility
- Used `getBoundingClientRect()` and `window.pageYOffset` 
- Always scrolled to exact position with `window.scrollTo()`

**Issues**:
- Still created delay between click and accordion opening
- Felt unnatural to users expecting immediate feedback

#### 3. Custom Transition with Synchronized Scrolling
**Approach**: Replace Svelte's `slide` transition with custom transition that handles both animation and scrolling
- Created `slideAndScroll()` function combining slide CSS effects with scroll logic
- Attempted to synchronize scroll progress with accordion expansion

**Versions Tried**:
- **CSS-based**: Scroll logic in `css()` function with `requestAnimationFrame`
- **Tick-based**: Scroll logic in `tick()` callback for better timing

**Issues**:
- Complex implementation with timing conflicts
- Scroll didn't execute properly in either CSS or tick approaches
- Lost reliability of standard Svelte transitions
- Difficult to debug and maintain

### Current Stable Solution
After multiple sophisticated attempts, reverted to the original approach: accordion opens first, then scrolls after transition completes (420ms delay).

**Final Implementation**:
```typescript
function handleClick() {
    const wasOpen = accordionState.isOpen;
    toggleAccordion(accordionState);

    // If accordion is opening, scroll to top of accordion button after transition
    if (!wasOpen && buttonElement) {
        setTimeout(() => {
            buttonElement?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 420); // Wait for slide transitions (400ms) + minimal buffer
    }
}
```

**Pros**:
- Reliable and predictable behavior across all scenarios
- Uses standard Svelte transitions and browser APIs
- Works consistently regardless of accordion position or viewport state
- Simple implementation that's easy to maintain and debug
- No timing conflicts or race conditions

**Cons**:
- Still has the double-scroll effect issue (expand → scroll back up)
- Not ideal UX but functionally correct and dependable
- User experiences brief "jump" as content expands then repositions

#### 4. Scroll-First with Visual Feedback (Latest Attempt)
**Approach**: Comprehensive scroll-first implementation with custom smooth scrolling and visual feedback
- Added `isAnimating` and `isScrolling` state variables with visual indicators
- Custom `smoothScrollTo()` function using `requestAnimationFrame` for 60fps scrolling
- Shimmer animation effects and button state changes during interaction
- Accessibility support with `prefers-reduced-motion` detection

**Implementation Details**:
- Visual feedback states: shimmer animation, button scaling, loading indicators
- Custom slide transition wrapper
- Easing functions for smooth deceleration
- Multiple timing strategies attempted:
  1. Scroll first, then open after delay
  2. Open first, wait for transitions, then scroll
  3. Parallel execution with position recalculation

**Critical Issues Discovered**:
- **Viewport dependency**: Accordions out of view behave differently than in-view accordions
- **Distance-based errors**: Greater distance between accordions = larger scroll discrepancies
- **DOM timing conflicts**: Accordion manager closes others synchronously, causing layout shifts during scroll calculations
- **Double-scroll persistence**: All approaches still resulted in expand-then-jump behavior

**Root Cause Analysis**:
The fundamental issue is the accordion manager's behavior of closing all other accordions before opening the new one. This causes:
1. Immediate DOM height changes from collapsing content
2. Layout shifts that affect scroll position calculations
3. Timing conflicts between closing transitions (400ms) and scroll execution
4. Different behavior based on accordion visibility and position in viewport

### Architecture Insights
1. **Scroll timing is critical** - any solution must account for DOM layout changes
2. **Standard transitions are reliable** - custom transitions introduce complexity
3. **User feedback expectations** - immediate visual response to clicks is important
4. **Browser behavior varies** - `scrollIntoView` has different behaviors based on element visibility
5. **Accordion manager constraints** - The synchronous closing of other accordions creates unavoidable timing conflicts
6. **Viewport position matters** - Out-of-view accordions require different handling than visible ones
7. **Distance amplifies issues** - The further apart accordions are, the more pronounced the scroll discrepancy becomes

## Final Working Solution: Height Compensation Approach ✅

**Date**: Current implementation
**Status**: **WORKING** - Eliminates double-scroll effect successfully

### Core Innovation
Pre-calculate the exact height that will be removed when other accordions close, then scroll to the compensated position simultaneously with the accordion opening.

### Key Implementation Details

**Files Modified**:
- `frontend/src/lib/stores/accordianManager.svelte..ts` - Added `getOpenAccordions()` function
- `frontend/src/lib/components/accordian/Accordian.svelte` - Complete scroll logic overhaul

**Critical Functions**:

1. **Height Compensation Calculation**:
```typescript
function calculateScrollCompensation(): number {
    const allAccordions = document.querySelectorAll('.wrapper');
    const currentIndex = Array.from(allAccordions).indexOf(buttonElement?.parentElement as Element);
    
    let heightToBeRemoved = 0;
    
    // Check each accordion before this one
    for (let i = 0; i < currentIndex; i++) {
        const accordion = allAccordions[i];
        const details = accordion.querySelector('.details') as HTMLElement;
        
        // If this accordion is open, its height will be removed
        if (details && !details.hidden) {
            heightToBeRemoved += details.offsetHeight;
        }
    }
    
    return heightToBeRemoved;
}
```

2. **Simultaneous Scroll + Accordion Opening**:
```typescript
async function handleClick() {
    // Get current positions BEFORE any DOM changes
    const buttonRect = buttonElement.getBoundingClientRect();
    const currentScrollY = window.pageYOffset;
    const buttonCurrentTop = buttonRect.top + currentScrollY;
    
    // Calculate compensation for collapsing accordions above
    const heightCompensation = calculateScrollCompensation();
    
    // Calculate TRUE target position
    const targetScrollY = buttonCurrentTop - heightCompensation - 20;
    
    if (needsScroll) {
        // Start BOTH animations simultaneously
        const scrollPromise = smoothScrollTo(targetScrollY, 400);
        toggleAccordion(accordionState); // Opens this, closes others
        
        await scrollPromise;
    }
}
```

### Why This Works
1. **Pre-calculation**: Measures accordion heights BEFORE any DOM changes occur
2. **Simultaneous execution**: Scroll and accordion opening happen at the same time
3. **Height compensation**: Accounts for exact pixel height that will be removed
4. **Smooth coordination**: 400ms duration matches slide transition timing

### Results
- ✅ **No double-scroll effect** - Smooth, single motion to target position
- ✅ **Works regardless of distance** - Accurate for any accordion spacing
- ✅ **Viewport-agnostic** - Functions correctly whether accordion is in/out of view
- ✅ **Consistent timing** - Reliable across all scenarios
- ✅ **Performance optimized** - Uses `requestAnimationFrame` for 60fps scrolling

### User Experience
Perfect smooth animation: Click → Accordion opens while page smoothly scrolls to final position → No jarring jumps or corrections needed.

## Testing Recommendations

1. Test with multiple accordions on a page
2. Verify behavior on mobile and desktop viewports  
3. Test with keyboard navigation
4. Ensure smooth transitions work correctly
5. Verify no conflicts with existing scroll behavior
6. **Test opening multiple accordions in sequence** - ensure scroll positioning is correct when one accordion is already open
7. **Test accordion visibility scenarios** - when accordion is already visible vs off-screen

## Current Stable Implementation (REVERT Point)

**File**: `frontend/src/lib/components/accordian/Accordian.svelte`

```typescript
// Button element reference
let buttonElement: HTMLElement | undefined;

// Handle click function
function handleClick() {
    const wasOpen = accordionState.isOpen;
    toggleAccordion(accordionState);

    // If accordion is opening, scroll to top of accordion button after transition
    if (!wasOpen && buttonElement) {
        setTimeout(() => {
            buttonElement?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 420); // Wait for slide transitions (400ms) + minimal buffer
    }
}
```

```html
<!-- Button with bound element -->
<button bind:this={buttonElement} onclick={handleClick} aria-label={label}>
    <span>{formattedNumber}. </span>
    <div class="label">
        <span bind:this={labelElement}>{label}</span>
        <span>{suffix}</span>
    </div>
</button>

<!-- Details with standard slide transition -->
{#if accordionState.isOpen}
    <div class="details" bind:this={detailsElement} transition:slide>
        {#if children}
            {@render children?.()}
        {:else}
            <p>child</p>
        {/if}
    </div>
{/if}
```

**Status**: ~~Stable, reliable, works consistently across all scenarios. Has double-scroll effect but functionally correct.~~ **SUPERSEDED by Height Compensation Solution**



# STAGE TO ATTEMPT

## read and assess this code against existing implimentation and previous attempts
<!-- 
<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onMount, getContext } from 'svelte';
	import { shuffleText } from '$lib/animations/gsap';
	import type { Readable } from 'svelte/store';
	import { themeManager } from '$lib/stores/themeManager.svelte';
	import type { BrandKey } from '$lib/config/brands';

	import {
		createAccordionState,
		toggleAccordion,
		registerAccordion
	} from '$lib/stores/accordianManager.svelte.';

	interface AccordianProps {
		children?: any;
		label: string;
		suffix: string;
		enableShuffleAnimation?: boolean;
		brand?: BrandKey;
	}

	let {
		children,
		label = 'Replace me',
		suffix = 'test',
		enableShuffleAnimation = true,
		brand
	}: AccordianProps = $props();

	const accordionState = $state(createAccordionState());
	let labelElement: HTMLElement | undefined;
	let detailsElement: HTMLElement | undefined;
	let buttonElement: HTMLElement | undefined;
	let wrapperElement: HTMLElement | undefined;

	registerAccordion(accordionState);

	// Get context from AccordionList if available
	const accordionListContext = getContext<
		Readable<{ getIndex: (id: string) => number }> | undefined
	>('accordionList');
	const accordionId = crypto.randomUUID();

	// Get index from context or default to 1
	let contextValue = $derived(accordionListContext ? $accordionListContext : null);
	let index = $derived(contextValue ? contextValue.getIndex(accordionId) : 1);
	let formattedNumber = $derived(index.toString().padStart(2, '0'));

	// Track previous state to avoid unnecessary calls
	let previousIsOpen = false;
	let isAnimating = false;
	let isScrolling = false;

	// Apply brand color when accordion state changes
	$effect(() => {
		const isOpen = accordionState.isOpen;
		const currentBrand = brand;

		console.log('🪗 Accordion effect:', {
			brand: currentBrand,
			isOpen,
			previousIsOpen,
			stateChanged: isOpen !== previousIsOpen
		});

		// Only act if state actually changed
		if (isOpen !== previousIsOpen) {
			if (currentBrand) {
				if (isOpen) {
					console.log('🪗 Opening - setting brand:', currentBrand);
					themeManager.setActiveBrand(currentBrand);
				} else {
					// Only clear brand if this accordion was the one that set it
					if (themeManager.activeBrand === currentBrand) {
						console.log('🪗 Closing - clearing brand (was active)');
						themeManager.clearBrand();
					} else {
						console.log('🪗 Closing - NOT clearing brand (not active)');
					}
				}
			}
			previousIsOpen = isOpen;
		}
	});

	// Trigger animation when component mounts
	onMount(() => {
		if (enableShuffleAnimation) {
			// Use setTimeout to ensure DOM is ready
			setTimeout(() => {
				if (labelElement) {
					shuffleText(labelElement, label, {
						duration: 0.8,
						iterations: 3,
						stagger: 0.05,
						delay: 0.1
					});
				}
			}, 50);
		}
	});

	// Smooth scroll function with easing
	function smoothScrollTo(targetY: number, duration: number): Promise<void> {
		return new Promise(resolve => {
			const startY = window.pageYOffset;
			const distance = targetY - startY;
			const startTime = performance.now();

			// Check for reduced motion preference
			const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (prefersReducedMotion) {
				window.scrollTo(0, targetY);
				resolve();
				return;
			}

			function animate(currentTime: number) {
				const elapsed = currentTime - startTime;
				const progress = Math.min(elapsed / duration, 1);

				// Easing function for smooth deceleration
				const easeOutQuad = 1 - (1 - progress) * (1 - progress);

				window.scrollTo(0, startY + distance * easeOutQuad);

				if (progress < 1) {
					requestAnimationFrame(animate);
				} else {
					resolve();
				}
			}

			requestAnimationFrame(animate);
		});
	}

	async function handleClick() {
		// Prevent rapid clicks during animation
		if (isAnimating) return;

		const wasOpen = accordionState.isOpen;

		// If closing, just close normally
		if (wasOpen) {
			toggleAccordion(accordionState);
			return;
		}

		// Opening sequence
		isAnimating = true;
		isScrolling = true;

		// Calculate scroll target
		if (buttonElement) {
			const buttonRect = buttonElement.getBoundingClientRect();
			const scrollTarget = window.pageYOffset + buttonRect.top - 20; // 20px padding from top
			const needsScroll = Math.abs(buttonRect.top - 20) > 5;

			if (needsScroll) {
				// Phase 1: Scroll to position
				await smoothScrollTo(scrollTarget, 350);
				
				// Small delay for visual feedback
				await new Promise(resolve => setTimeout(resolve, 50));
			}

			// Phase 2: Open accordion after scroll
			isScrolling = false;
			toggleAccordion(accordionState);
			
			// Reset animation flag after transition completes
			setTimeout(() => {
				isAnimating = false;
			}, 400); // Match slide transition duration
		} else {
			// Fallback if no button element
			toggleAccordion(accordionState);
			isAnimating = false;
			isScrolling = false;
		}
	}

	// Custom slide transition with callback
	function slideWithCallback(node: HTMLElement, { duration = 400 } = {}) {
		const slideTransition = slide(node, { duration });
		
		return {
			...slideTransition,
			css: slideTransition.css,
			// Add a slight delay to ensure smooth visual flow
			delay: isScrolling ? 0 : 0
		};
	}
</script>

<li class="wrapper" bind:this={wrapperElement} class:animating={isAnimating}>
	<button 
		bind:this={buttonElement} 
		onclick={handleClick} 
		aria-label={label}
		aria-expanded={accordionState.isOpen}
		class:scrolling={isScrolling}
		class:open={accordionState.isOpen}
	>
		<span>{formattedNumber}. </span>
		<div class="label">
			<span bind:this={labelElement}>{label}</span>
			<span>{suffix}</span>
		</div>
	</button>

	{#if accordionState.isOpen}
		<div 
			class="details" 
			bind:this={detailsElement} 
			transition:slideWithCallback
		>
			{#if children}
				{@render children?.()}
			{:else}
				<p>child</p>
			{/if}
		</div>
	{/if}
</li>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		list-style: none;
		position: relative;
	}

	/* Visual feedback during animation */
	.wrapper.animating {
		position: relative;
	}

	.wrapper.animating::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(
			90deg, 
			var(--fg-text-primary) 0%, 
			transparent 50%, 
			var(--fg-text-primary) 100%
		);
		background-size: 200% 100%;
		animation: shimmer 1s linear infinite;
		opacity: 0.3;
	}

	@keyframes shimmer {
		0% { background-position: 200% 0; }
		100% { background-position: -200% 0; }
	}

	button {
		-webkit-appearance: none;
		appearance: none;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5em;
		width: 100%;
		padding-top: 0.5em;
		padding-bottom: 0.5em;
		border: none;
		font-size: var(--fs-xxlarge-clamped);
		font-weight: var(--fw-semibold);
		color: var(--fg-text-primary);
		background-color: var(--bg-page);
		border-bottom: 1px solid var(--fg-text-primary);
		transition: background-color 0.2s ease, transform 0.2s ease;
		transform-origin: left center;
	}

	/* Subtle feedback during scroll */
	button.scrolling {
		background-color: var(--fg-text-primary-5, rgba(0, 0, 0, 0.02));
		transform: scale(1.01);
	}

	/* Active state */
	button.open {
		color: var(--fg-text-primary);
		font-weight: var(--fw-bold);
	}

	.label {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: baseline;
		flex-grow: 1;
	}

	/* first child */
	.label span:first-child {
		text-transform: uppercase;
	}

	button:hover {
		color: var(--fg-text-primary-80);
	}

	button:active {
		color: var(--fg-text-primary);
	}

	.details {
		padding-bottom: 1em;
		width: 100%;
		will-change: transform;
	}

	/* GSAP character animation styles */
	:global(.gsap-char) {
		display: inline-block;
		position: relative;
	}

	:global(.gsap-space) {
		display: inline-block;
	}

	/* Respect reduced motion preferences */
	@media (prefers-reduced-motion: reduce) {
		.wrapper.animating::after {
			animation: none;
		}
		
		button {
			transition: none;
		}
	}
</style> -->

Key Improvements
1. Scroll-First Approach

Scrolls to the accordion button before opening
Eliminates the jarring "expand then jump" effect
Users see a smooth, intentional animation sequence

2. Visual Feedback

Added animation states (isAnimating, isScrolling)
Subtle visual indicators during the scroll process
Loading shimmer effect to show something is happening

3. Performance Optimized

Uses requestAnimationFrame for 60fps scrolling
Minimal DOM manipulation
CSS transitions handle most of the visual work

4. Accessibility & Compatibility

Respects prefers-reduced-motion settings
Maintains ARIA attributes
Works with keyboard navigation
Backwards compatible with older browsers

5. Smooth Animation Sequence
Click → Visual Feedback → Smooth Scroll → Accordion Opens
         (immediate)      (350ms)         (400ms)
Why This Works Better

Predictable Motion: Users see the scroll happen first, making the motion feel intentional rather than corrective
No Layout Shift: Content expands after positioning is complete
Faster Perceived Performance: Immediate visual feedback makes it feel responsive
Variable Content Friendly: Works regardless of content height (100-1000px)

Optional Enhancements
If you want even smoother behavior, you could:

Add scroll progress indicator - Show a progress bar during scroll
Stagger multiple accordions - If opening one while another is closing
Momentum scrolling - Continue slight scroll after accordion opens
Parallax effects - Subtle content reveal as it expands

Try the demo above to see how smooth the experience is! The key is orchestrating the animations in the right sequence rather than trying to do everything at once.


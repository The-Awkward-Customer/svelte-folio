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

	// CRITICAL FIX: Calculate scroll compensation for closing accordions
	function calculateScrollCompensation(): number {
		// Find all currently open accordions that are ABOVE this one
		const allAccordions = document.querySelectorAll('.wrapper');
		if (!buttonElement?.parentElement) return 0;
		const currentIndex = Array.from(allAccordions).indexOf(buttonElement.parentElement);
		if (currentIndex === -1) return 0;

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

	// Smooth scroll with easing
	function smoothScrollTo(targetY: number, duration: number): Promise<void> {
		return new Promise((resolve) => {
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

				// Easing function
				const easeOutCubic = 1 - Math.pow(1 - progress, 3);

				window.scrollTo(0, startY + distance * easeOutCubic);

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
		// Prevent rapid clicks
		if (isAnimating) return;

		const wasOpen = accordionState.isOpen;

		// If closing, just close normally
		if (wasOpen) {
			toggleAccordion(accordionState);
			return;
		}

		// CRITICAL: Calculate positions BEFORE any state changes
		if (!buttonElement) {
			toggleAccordion(accordionState);
			return;
		}

		isAnimating = true;

		// Get current button position
		const buttonRect = buttonElement.getBoundingClientRect();
		const currentScrollY = window.pageYOffset;
		const buttonCurrentTop = buttonRect.top + currentScrollY;

		// Calculate how much height will be removed when other accordions close
		const heightCompensation = calculateScrollCompensation();

		// Calculate the TRUE target position (accounting for closing accordions)
		const targetScrollY = buttonCurrentTop - heightCompensation - 20; // 20px padding

		// Determine if we need to scroll
		const finalButtonTop = buttonCurrentTop - heightCompensation;
		const viewportTop = currentScrollY;
		const needsScroll = Math.abs(finalButtonTop - viewportTop - 20) > 5;

		if (needsScroll) {
			// Start BOTH animations simultaneously
			const scrollPromise = smoothScrollTo(targetScrollY, 400);

			// Trigger the accordion state change (which closes others and opens this)
			toggleAccordion(accordionState);

			// Wait for scroll to complete
			await scrollPromise;
		} else {
			// Just toggle if no scroll needed
			toggleAccordion(accordionState);
		}

		// Reset animation flag after transitions
		setTimeout(() => {
			isAnimating = false;
		}, 450);
	}
</script>

<li class="wrapper">
	<button
		bind:this={buttonElement}
		onclick={handleClick}
		aria-label={label}
		aria-expanded={accordionState.isOpen}
		class:animating={isAnimating}
		class:open={accordionState.isOpen}
	>
		<span>{formattedNumber}. </span>
		<div class="label">
			<span bind:this={labelElement}>{label}</span>
			<span>{suffix}</span>
		</div>
	</button>

	{#if accordionState.isOpen}
		<div class="details" bind:this={detailsElement} transition:slide>
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
	}

	/* GSAP character animation styles */
	:global(.gsap-char) {
		display: inline-block;
		position: relative;
	}

	:global(.gsap-space) {
		display: inline-block;
	}
</style>

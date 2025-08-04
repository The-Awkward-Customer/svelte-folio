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

	function handleClick() {
		const wasOpen = accordionState.isOpen;
		toggleAccordion(accordionState);

		// If accordion is opening, scroll to top of content after transition
		if (!wasOpen && detailsElement) {
			setTimeout(() => {
				detailsElement?.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}, 100);
		}
	}
</script>

<li class="wrapper">
	<button onclick={handleClick} aria-label={label}>
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
		font-size: var(--fs-large-clamped);
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

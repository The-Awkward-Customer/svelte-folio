<script lang="ts">
	import { onMount } from 'svelte';
	import { shuffleText } from '$lib/animations/gsap';

	interface FooterTitleProps {
		title?: string;
		enableShuffleAnimation?: boolean;
		shuffleOptions?: {
			duration?: number;
			iterations?: number;
			stagger?: number;
			delay?: number;
		};
	}

	let {
		title = 'A\ndigital\ndesigner\n& engineer',
		enableShuffleAnimation = true,
		shuffleOptions = {
			duration: 0.8,
			iterations: 3,
			stagger: 0.05,
			delay: 0.1
		}
	}: FooterTitleProps = $props();

	// Split title into lines and create reactive array
	const titleLines = $derived(title.split('\n').filter((line) => line.trim() !== ''));

	// Array to hold references to each span element (reactive in Svelte 5)
	let spanElements: HTMLElement[] = $state([]);

	onMount(() => {
		if (enableShuffleAnimation && spanElements.length > 0) {
			// Use setTimeout to ensure DOM is ready
			setTimeout(() => {
				spanElements.forEach((spanElement, index) => {
					if (spanElement && titleLines[index]) {
						// Add a slight delay between each line animation
						const lineDelay = (shuffleOptions.delay || 0) + index * 0.2;
						shuffleText(spanElement, titleLines[index], {
							...shuffleOptions,
							delay: lineDelay
						});
					}
				});
			}, 50);
		}
	});
</script>

<h2 class="footer-title-root">
	{#each titleLines as line, index}
		<span class="title-line" bind:this={spanElements[index]}>{line}</span>
	{/each}
</h2>

<style>
	.footer-title-root {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: flex-start;
		font-size: var(--fs-large-clamped);
		font-weight: var(--fw-semibold);
		color: var(--fg-text-primary);
		text-transform: capitalize;
		text-align: start;
	}

	.title-line {
		display: block;
		line-height: 1.1;
	}
</style>

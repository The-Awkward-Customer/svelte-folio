<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { widgetManager } from '$lib/stores/widgetManager.svelte.js';
	import PlaceholderWidget from './PlaceholderWidget.svelte';

	interface Props {
		widgetCount?: number;
	}

	let { widgetCount = 5 }: Props = $props();

	// Neon colors for placeholder widgets
	const neonColors = [
		'#00ffff', // Cyan
		'#ff00ff', // Magenta
		'#00ff00', // Lime
		'#ffff00', // Yellow
		'#ff6600', // Orange
	];

	let containerElement: HTMLElement;

	function animateWidgetEntrance(element: HTMLElement, index: number) {
		if (!element) return;

		// Check for reduced motion preference
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		
		if (prefersReducedMotion) {
			// Skip animation for users who prefer reduced motion
			gsap.set(element, { opacity: 1 });
			return;
		}

		// Get the final position from the widget's CSS custom properties
		const computedStyle = getComputedStyle(element);
		const finalX = parseFloat(computedStyle.getPropertyValue('--widget-x')) || 0;
		const finalY = parseFloat(computedStyle.getPropertyValue('--widget-y')) || 0;
		const finalScale = parseFloat(computedStyle.getPropertyValue('--widget-scale')) || 1;

		// Start from center of viewport
		const startX = window.innerWidth / 2 - (512 * finalScale) / 2;
		const startY = window.innerHeight / 2 - (512 * finalScale) / 2;

		// Set initial state
		gsap.set(element, {
			x: startX - finalX,
			y: startY - finalY,
			scale: 0.8 * finalScale,
			opacity: 0,
		});

		// Animate to final position
		gsap.to(element, {
			x: 0,
			y: 0,
			scale: finalScale,
			opacity: 1,
			duration: 0.6,
			delay: index * 0.1, // Stagger effect
			ease: 'power2.out',
			onComplete: () => {
				// Clear transform after animation for better performance
				gsap.set(element, { clearProps: 'transform' });
			}
		});
	}

	function initializeWidgets() {
		widgetManager.initialize(widgetCount);
	}

	function animateWidgetsIn() {
		if (!containerElement) return;

		// Find all widget elements
		const widgetElements = containerElement.querySelectorAll('.placeholder-widget');
		
		widgetElements.forEach((element, index) => {
			animateWidgetEntrance(element as HTMLElement, index);
		});
	}

	// Initialize widgets when component mounts
	onMount(() => {
		widgetManager.setupEffects();
		initializeWidgets();
		
		// Small delay to ensure DOM is ready
		setTimeout(() => {
			animateWidgetsIn();
		}, 100);
	});

	// Get widgets as array for rendering
	let positionsArray = $derived(Array.from(widgetManager.positions.entries()));
</script>

<div 
	bind:this={containerElement}
	class="widget-container"
	aria-label="Interactive widget display"
>
	{#each positionsArray as [, position], index}
		<PlaceholderWidget
			{position}
			color={neonColors[index % neonColors.length]}
			number={index + 1}
		/>
	{/each}
</div>

<style>
	.widget-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		pointer-events: none;
		z-index: 998;
		contain: layout;
	}

	.widget-container :global(.placeholder-widget) {
		pointer-events: auto;
	}
</style>
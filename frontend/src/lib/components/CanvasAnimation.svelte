<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { AnimationEngine } from '$lib/animations/AnimationEngine';
	import type { RenderOptions, AnimationState } from '$lib/animations/types';

	// Props with TypeScript types
	export let animationName: string;
	export let size: string = '100%';
	export let trigger: 'auto' | 'viewport' | 'hover' | 'click' | 'manual' = 'auto';
	export let delay: number = 0;
	export let loop: boolean = true;

	// Internal state
	let canvas: HTMLCanvasElement;
	let engine: AnimationEngine;
	let renderer: any;
	let error: Error | null = null;
	let initialized = false;
	let animationState: AnimationState = {
		isLoading: true,
		isPlaying: false,
		isPaused: false,
		currentFrame: 0
	};

	// Create a unique ID for the canvas
	const canvasId = `canvas-${Math.random().toString(36).slice(2)}`;

	// Initialize the animation engine
	async function initializeAnimation() {
		if (!canvas || initialized) return;
		initialized = true;

		console.log(`Initializing animation: ${animationName}`);
		try {
			engine = new AnimationEngine();

			// Check for reduced motion preference
			const prefersReducedMotion = engine.checkReducedMotion();
			if (prefersReducedMotion) {
				error = new Error('Reduced motion is enabled');
				return;
			}

			// Set up canvas size
			const updateCanvasSize = () => {
				const container = canvas.parentElement;
				if (container) {
					const rect = container.getBoundingClientRect();
					if (rect.width === 0) return; // Skip if container has no width
					canvas.width = rect.width;
					canvas.height = rect.width; // Maintain 1:1 aspect ratio
					console.log(`Canvas size updated to ${canvas.width}x${canvas.height}`);
					renderer?.render(); // Re-render if renderer exists
				}
			};

			// Initial size setup
			updateCanvasSize();

			// Create renderer with options
			const options: RenderOptions = {
				trigger,
				loop,
				delay,
				respectReducedMotion: true,
				onError: (err) => {
					error = err;
					console.error('Animation error:', err);
				},
				onComplete: () => {
					if (!loop) {
						renderer?.pause();
					}
				},
				onStateChange: (state) => {
					animationState = state;
				}
			};

			console.log('Creating renderer with canvas:', canvas);
			renderer = engine.createRenderer(canvas, options);

			// Load and set up the animation
			console.log('Loading animation sequence...');
			const sequence = await engine.loadAnimation(animationName);
			console.log('Setting up renderer with sequence:', sequence);
			renderer.setSequence(sequence);

			// Set up resize observer
			resizeObserver = new ResizeObserver(() => {
				console.log('Container resized, updating canvas size');
				updateCanvasSize();
			});
			resizeObserver.observe(canvas.parentElement!);

			// Set up event listeners based on trigger
			if (trigger === 'hover') {
				canvas.addEventListener('mouseenter', playHandler);
				canvas.addEventListener('mouseleave', pauseHandler);
			} else if (trigger === 'click') {
				canvas.addEventListener('click', clickHandler);
			} else if (trigger === 'auto') {
				// Add delay if specified
				setTimeout(playHandler, delay);
			}
			animationState = { ...animationState, isLoading: false };
		} catch (err) {
			console.error('Animation initialization error:', err);
			error = err instanceof Error ? err : new Error('Failed to initialize animation');
			animationState = { ...animationState, isLoading: false };
		}
	}

	// Watch for canvas element changes
	$: if (canvas && !initialized) {
		console.log('Canvas element bound, initializing animation');
		initializeAnimation();
	}

	let resizeObserver: ResizeObserver | null = null;
	let playHandler: () => void;
	let pauseHandler: () => void;
	let clickHandler: () => void;

	// Initialize event handlers
	playHandler = () => renderer?.play();
	pauseHandler = () => renderer?.pause();
	clickHandler = () => {
		if (renderer?.isPlaying) {
			renderer.pause();
		} else {
			renderer?.play();
		}
	};

	// Cleanup on component destroy
	onDestroy(() => {
		if (canvas) {
			// Clean up resize observer
			resizeObserver?.disconnect();

			// Clean up event listeners
			if (trigger === 'hover') {
				canvas.removeEventListener('mouseenter', playHandler);
				canvas.removeEventListener('mouseleave', pauseHandler);
			} else if (trigger === 'click') {
				canvas.removeEventListener('click', clickHandler);
			}

			// Clean up animation resources
			engine?.unloadAnimation(animationName);
		}
	});
</script>

<div class="canvas-container" style:width={size} style:height={size}>
	<canvas
		bind:this={canvas}
		id={canvasId}
		class="animation-canvas"
		role="img"
		aria-label={`Animation: ${animationName}`}
		class:hidden={animationState.isLoading || error}
	/>
	{#if animationState.isLoading}
		<div class="loading">
			<slot name="loading">Loading animation...</slot>
		</div>
	{:else if error}
		<div class="error">
			<slot name="fallback">
				<slot>Static fallback content</slot>
			</slot>
		</div>
	{/if}
</div>

<style>
	.canvas-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 192, 203, 0.1); /* Light pink with opacity */
	}

	.animation-canvas {
		width: 100%;
		height: 100%;
		display: block;
	}

	.animation-canvas.hidden {
		display: none;
	}

	.loading,
	.error {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(173, 216, 230, 0.1); /* Light blue with opacity */
	}
</style>

<script lang="ts">
	import Ani_me from '$lib/assets/Ani_me.png';
	import { onMount } from 'svelte';
	import {
		createGlitchAnimation,
		type GlitchAnimationController
	} from '$lib/animations/gsap/glitchAnimations.js';

	// TypeScript interface for Avatar props
	type BaseAvatarProps = {
		size?: 'xs' | 'sm' | 'md' | 'lg';
		content?: string;
		alt?: string;
		class?: string;
		isLoading?: boolean;
		glitchRate?: number; // Delay between glitch cycles in seconds
	};

	type AvatarProps = BaseAvatarProps &
		(
			| {
					isButton: true;
					handleClick: () => void;
					disabled?: boolean;
			  }
			| {
					isButton?: false;
					handleClick?: never;
					disabled?: never;
			  }
		);

	// Props with discriminated union
	let props: AvatarProps = $props();

	const {
		size = 'md',
		content = Ani_me,
		alt = 'Avatar',
		class: className = '',
		isButton = false,
		isLoading = false,
		glitchRate = 2 // Default 2 seconds between glitch cycles
	} = props;

	// Refs
	let avatarRef: HTMLElement;
	let glitchController: GlitchAnimationController | null = null;

	// Check for reduced motion preference
	const prefersReducedMotion = $derived(
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
	);

	// Compute classes - access props directly for reactivity
	const classes = $derived(
		[
			'avatar',
			`avatar-${size}`,
			isButton && 'avatar-button',
			props.isLoading && 'glitch-active',
			className
		]
			.filter(Boolean)
			.join(' ')
	);

	// Handle click for button variant
	function handleClick() {
		if (isButton && props.handleClick && !props.disabled) {
			props.handleClick();
		}
	}

	// Lifecycle - handle loading state changes
	$effect(() => {
		// Access props directly to ensure reactivity tracking
		const currentIsLoading = props.isLoading;
		const currentGlitchRate = props.glitchRate || 2;

		console.log('🎭 Avatar $effect triggered:', {
			avatarRef: !!avatarRef,
			currentIsLoading,
			prefersReducedMotion,
			glitchController: !!glitchController,
			currentGlitchRate
		});

		if (!avatarRef) {
			console.log('🎭 No avatarRef, returning early');
			return;
		}

		if (currentIsLoading) {
			console.log('🎭 isLoading is true, setting up animation');
			// Create glitch controller if it doesn't exist
			if (!glitchController) {
				console.log('🎭 Creating new glitch controller');
				glitchController = createGlitchAnimation(avatarRef, {
					glitchRate: currentGlitchRate,
					respectReducedMotion: true
				});
			}

			// Update options and start animation
			console.log('🎭 Starting glitch animation with rate:', currentGlitchRate);
			glitchController.updateOptions({ glitchRate: currentGlitchRate });
			glitchController.start();
		} else {
			console.log('🎭 isLoading is false');
			if (glitchController) {
				// Stop animation when not loading
				console.log('🎭 Stopping glitch animation');
				glitchController.stop();
			}
		}
	});

	onMount(() => {
		return () => {
			// Cleanup on unmount
			if (glitchController) {
				glitchController.destroy();
				glitchController = null;
			}
		};
	});
</script>

{#if isButton}
	<button
		bind:this={avatarRef}
		class={classes}
		onclick={handleClick}
		disabled={props.disabled}
		aria-label={alt}
		aria-busy={isLoading}
	>
		<span
			class="avatar-image"
			style="
				background-image: url({content});
				--red-x: 0;
				--red-y: 0;
				--green-x: 0;
				--green-y: 0;
				--blue-x: 0;
				--blue-y: 0;
				--slice-count: 0;
				--slice-direction: 0;
				--slice-offset: 20;
			"
			role="img"
			aria-label={alt}
		></span>
	</button>
{:else}
	<div bind:this={avatarRef} class={classes} aria-busy={isLoading}>
		<span
			class="avatar-image"
			style="
				background-image: url({content});
				--red-x: 0;
				--red-y: 0;
				--green-x: 0;
				--green-y: 0;
				--blue-x: 0;
				--blue-y: 0;
				--slice-count: 0;
				--slice-direction: 0;
				--slice-offset: 20;
			"
			role="img"
			aria-label={alt}
		></span>
	</div>
{/if}

<style>
	.avatar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(var(--bg-page) / 0);
		border: none;
		border-radius: var(--bdr-radius-small);
		padding: 4px;
		box-shadow: inset 0 0 0 1px rgba(var(--fg-text-primary) / 1);
		container-type: inline-size;
		transition: var(--transition-fast);
		overflow: hidden; /* Important for glitch effect */
	}

	.avatar-image {
		display: flex;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: top;
		background-repeat: no-repeat;
		border-radius: var(--bdr-radius-tiny);
		transition: var(--transition-fast);
		position: relative;
		z-index: 1;
	}

	/* Multi-channel RGB split effect (recreates PIXI RGBSplitFilter) */
	.glitch-active .avatar-image {
		transition: none !important;
		filter: drop-shadow(
				calc(var(--red-x, 0) * 1px) calc(var(--red-y, 0) * 1px) 0 rgba(255, 0, 0, 1)
			)
			drop-shadow(calc(var(--green-x, 0) * 1px) calc(var(--green-y, 0) * 1px) 0 rgba(0, 255, 0, 1))
			drop-shadow(calc(var(--blue-x, 0) * 1px) calc(var(--blue-y, 0) * 1px) 0 rgba(0, 0, 255, 1));
	}

	/* Slice effect (recreates PIXI GlitchFilter slices) */
	.glitch-active .avatar-image::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: inherit;
		background-size: inherit;
		background-position: inherit;
		background-repeat: inherit;
		border-radius: inherit;
		opacity: calc(var(--slice-count, 0) / 20);
		transform: translateX(calc(var(--slice-direction, 0) * 0.1px))
			skewX(calc(var(--slice-direction, 0) * 0.01deg));
		mix-blend-mode: screen;
		pointer-events: none;
		z-index: 2;
	}

	/* Additional slice layers for more complex effect */
	.glitch-active .avatar-image::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: inherit;
		background-size: inherit;
		background-position: inherit;
		background-repeat: inherit;
		border-radius: inherit;
		opacity: calc(var(--slice-count, 0) / 40);
		transform: translateX(calc(var(--slice-direction, 0) * -0.15px))
			skewX(calc(var(--slice-direction, 0) * -0.005deg));
		mix-blend-mode: multiply;
		pointer-events: none;
		z-index: 1;
	}

	/* Slice animation for when slices are active */
	.glitch-active .avatar-image[style*='--slice-count: 20']::before,
	.glitch-active .avatar-image[style*='--slice-count: 12']::before {
		animation: slice-glitch 0.1s steps(1) infinite;
	}

	@keyframes slice-glitch {
		0% {
			clip-path: polygon(0 0%, 100% 0%, 100% 20%, 0 20%);
			transform: translateX(calc(var(--slice-direction, 0) * 0.1px));
		}
		20% {
			clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%);
			transform: translateX(calc(var(--slice-direction, 0) * -0.1px));
		}
		40% {
			clip-path: polygon(0 40%, 100% 40%, 100% 60%, 0 60%);
			transform: translateX(calc(var(--slice-direction, 0) * 0.15px));
		}
		60% {
			clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
			transform: translateX(calc(var(--slice-direction, 0) * -0.05px));
		}
		80% {
			clip-path: polygon(0 80%, 100% 80%, 100% 100%, 0 100%);
			transform: translateX(calc(var(--slice-direction, 0) * 0.08px));
		}
	}

	/* Reduced motion fallback */
	@media (prefers-reduced-motion: reduce) {
		.glitch-active .avatar-image {
			filter: none !important;
			transform: none !important;
			animation: glitch-pulse 2s ease-in-out infinite;
		}

		.glitch-active .avatar-image::before,
		.glitch-active .avatar-image::after {
			display: none;
		}

		@keyframes glitch-pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.7;
			}
		}
	}

	/* Size variants with consistent aspect ratio (4:5 from original) */
	.avatar-xs {
		width: clamp(24px, 10vw, 80px);
		aspect-ratio: 4 / 5;
	}

	.avatar-sm {
		width: clamp(40px, 15vw, 120px);
		aspect-ratio: 4 / 5;
	}

	.avatar-md {
		width: clamp(60px, 20vw, 180px); /* Current ChatTrigger size */
		aspect-ratio: 4 / 5;
	}

	.avatar-lg {
		width: clamp(80px, 25vw, 240px);
		aspect-ratio: 4 / 5;
	}

	/* Button-specific styles */
	.avatar-button {
		cursor: pointer;
	}

	.avatar-button:hover .avatar-image {
		transform: scale(0.98);
	}

	.avatar-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.avatar-button:disabled:hover .avatar-image {
		transform: none;
	}

	/* Focus states using design system variables */
	.avatar-button:focus-visible {
		outline: var(--focus-ring-width) solid var(--focus-ring-color);
		outline-offset: var(--focus-ring-offset);
	}
</style>

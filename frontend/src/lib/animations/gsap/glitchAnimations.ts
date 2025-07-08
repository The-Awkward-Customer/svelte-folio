import gsap from 'gsap';

export interface GlitchAnimationOptions {
	/** Delay between glitch cycles in seconds (will be randomized 0-3s like original) */
	glitchRate?: number;
	/** Whether to respect reduced motion preferences */
	respectReducedMotion?: boolean;
	/** Time scale multiplier for the entire animation */
	timeScale?: number;
}

export interface GlitchAnimationController {
	/** Start the glitch animation */
	start: () => void;
	/** Stop the glitch animation */
	stop: () => void;
	/** Update animation options */
	updateOptions: (options: Partial<GlitchAnimationOptions>) => void;
	/** Check if animation is currently running */
	isRunning: () => boolean;
	/** Cleanup all resources */
	destroy: () => void;
}

/**
 * Creates a glitch animation controller that recreates the exact PIXI.js glitch effect
 * This implementation follows the original timing sequence and multi-channel RGB splitting
 * @param element - The container element (should contain .avatar-image)
 * @param options - Animation configuration options
 * @returns Animation controller with start/stop methods
 */
export function createGlitchAnimation(
	element: HTMLElement,
	options: GlitchAnimationOptions = {}
): GlitchAnimationController {
	const {
		glitchRate = 2,
		respectReducedMotion = true,
		timeScale = 1.2
	} = options;

	let timeline: gsap.core.Timeline | null = null;
	let currentOptions = { ...options };
	let isActive = false;
	let animationId: number | null = null;

	// Check for reduced motion preference
	const prefersReducedMotion = respectReducedMotion && 
		typeof window !== 'undefined' && 
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Random number helper (matches original randomIntFromInterval)
	function randomIntFromInterval(min: number, max: number): number {
		return Math.random() * (max - min + 1) + min;
	}

	// Get the avatar image element
	function getImageElement(): HTMLElement | null {
		return element?.querySelector('.avatar-image') as HTMLElement;
	}

	// Reset all CSS variables to default state
	function resetVariables(): void {
		const imageEl = getImageElement();
		if (imageEl) {
			gsap.set(imageEl, {
				'--red-x': 0,
				'--red-y': 0,
				'--green-x': 0,
				'--green-y': 0,
				'--blue-x': 0,
				'--blue-y': 0,
				'--slice-count': 0,
				'--slice-direction': 0,
				'--slice-offset': 20
			});
		}
	}

	// Main animation function (recreates the original PIXI.js anim() method)
	function anim(): void {
		if (!isActive || prefersReducedMotion) return;

		const imageEl = getImageElement();
		if (!imageEl) return;

		// Create timeline with immediate start for testing (remove delay)
		const tl = gsap.timeline({
			delay: 0.1, // Very short delay for immediate feedback
			onStart: () => {
				console.log('Glitch animation starting');
			},
			onComplete: () => {
				console.log('Glitch animation completed, scheduling next cycle');
				// Recursive call to continue the animation loop
				if (isActive) {
					setTimeout(() => {
						if (isActive) anim();
					}, 1000); // 1 second between cycles for testing
				}
			}
		});

		// RED CHANNEL ANIMATION (matches original red channel timing)
		tl.to(imageEl, {
			duration: 0.2,
			'--red-x': randomIntFromInterval(-15, 15),
			'--red-y': randomIntFromInterval(-15, 15),
			ease: 'none',
			onStart: () => {
				console.log('Red channel animation started');
			}
		});

		tl.to(imageEl, {
			duration: 0.01,
			'--red-x': 0,
			'--red-y': 0,
			ease: 'none'
		});

		// BLUE CHANNEL ANIMATION + SLICE EFFECT (overlaps with red, matches original timing)
		tl.to(imageEl, {
			duration: 0.2,
			'--blue-x': randomIntFromInterval(-15, 15),
			'--blue-y': 0,
			ease: 'none',
			onComplete: () => {
				// Activate slices (matches original slice activation)
				gsap.set(imageEl, {
					'--slice-count': 20,
					'--slice-direction': randomIntFromInterval(-75, 75)
				});
			}
		}, '-=0.2'); // Start 0.2s before the previous animation ends

		tl.to(imageEl, {
			duration: 0.1,
			'--blue-x': randomIntFromInterval(-15, 15),
			'--blue-y': randomIntFromInterval(-5, 5),
			ease: 'none',
			onComplete: () => {
				// Update slices (matches original slice update)
				gsap.set(imageEl, {
					'--slice-count': 12,
					'--slice-direction': randomIntFromInterval(-75, 75)
				});
			}
		});

		tl.to(imageEl, {
			duration: 0.01,
			'--blue-x': 0,
			'--blue-y': 0,
			ease: 'none',
			onComplete: () => {
				// Reset slices (matches original slice reset)
				gsap.set(imageEl, {
					'--slice-count': 0,
					'--slice-direction': 0
				});
			}
		});

		// GREEN CHANNEL ANIMATION (overlaps with blue, matches original timing)
		tl.to(imageEl, {
			duration: 0.2,
			'--green-x': randomIntFromInterval(-15, 15),
			'--green-y': 0,
			ease: 'none'
		}, '-=0.2'); // Start 0.2s before the previous animation ends

		tl.to(imageEl, {
			duration: 0.1,
			'--green-x': randomIntFromInterval(-20, 20),
			'--green-y': randomIntFromInterval(-15, 15),
			ease: 'none'
		});

		tl.to(imageEl, {
			duration: 0.01,
			'--green-x': 0,
			'--green-y': 0,
			ease: 'none'
		});

		// Apply time scale (matches original timeScale(1.2))
		tl.timeScale(currentOptions.timeScale || timeScale);

		timeline = tl;
	}

	// Controller methods
	const controller: GlitchAnimationController = {
		start(): void {
			console.log('Glitch controller start() called', { isActive, prefersReducedMotion });
			if (isActive || prefersReducedMotion) {
				console.log('Glitch start aborted:', { isActive, prefersReducedMotion });
				return;
			}
			
			// Kill existing timeline and animation frame
			if (timeline) {
				timeline.kill();
			}
			if (animationId) {
				cancelAnimationFrame(animationId);
			}

			// Initialize CSS variables
			resetVariables();
			
			isActive = true;
			console.log('Starting glitch animation loop');
			anim(); // Start the animation loop
		},

		stop(): void {
			isActive = false;
			
			if (timeline) {
				timeline.kill();
				timeline = null;
			}
			
			if (animationId) {
				cancelAnimationFrame(animationId);
				animationId = null;
			}
			
			resetVariables();
		},

		updateOptions(newOptions: Partial<GlitchAnimationOptions>): void {
			currentOptions = { ...currentOptions, ...newOptions };
			
			// Restart animation with new options if currently running
			if (isActive) {
				this.stop();
				this.start();
			}
		},

		isRunning(): boolean {
			return isActive && (timeline !== null || animationId !== null);
		},

		destroy(): void {
			this.stop();
			// Clear any references
			timeline = null;
			animationId = null;
			isActive = false;
		}
	};

	return controller;
}

/**
 * Enhanced CSS for the exact PIXI.js glitch effect recreation
 * This includes multi-channel RGB splitting and slice effects
 */
export function createGlitchCSS(): string {
	return `
		/* Multi-channel RGB split effect (recreates PIXI RGBSplitFilter) */
		.glitch-active .avatar-image {
			transition: none !important;
			filter: 
				drop-shadow(calc(var(--red-x, 0) * 1px) calc(var(--red-y, 0) * 1px) 0 rgba(255, 0, 0, 0.8))
				drop-shadow(calc(var(--green-x, 0) * 1px) calc(var(--green-y, 0) * 1px) 0 rgba(0, 255, 0, 0.8))
				drop-shadow(calc(var(--blue-x, 0) * 1px) calc(var(--blue-y, 0) * 1px) 0 rgba(0, 0, 255, 0.8));
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
			transform: 
				translateX(calc(var(--slice-direction, 0) * 0.1px))
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
			transform: 
				translateX(calc(var(--slice-direction, 0) * -0.15px))
				skewX(calc(var(--slice-direction, 0) * -0.005deg));
			mix-blend-mode: multiply;
			pointer-events: none;
			z-index: 1;
		}

		/* Slice animation for when slices are active */
		.glitch-active .avatar-image[style*="--slice-count: 20"]::before,
		.glitch-active .avatar-image[style*="--slice-count: 12"]::before {
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
				0%, 100% { opacity: 1; }
				50% { opacity: 0.7; }
			}
		}
	`;
}

/**
 * Simple one-shot glitch effect for testing
 */
export function triggerGlitchBurst(element: HTMLElement): void {
	const imageEl = element.querySelector('.avatar-image') as HTMLElement;
	if (!imageEl) return;

	const tl = gsap.timeline();
	
	// Quick burst effect
	tl.to(imageEl, {
		duration: 0.1,
		'--red-x': randomIntFromInterval(-10, 10),
		'--blue-x': randomIntFromInterval(-10, 10),
		'--slice-count': 15,
		ease: 'none'
	})
	.to(imageEl, {
		duration: 0.05,
		'--red-x': 0,
		'--blue-x': 0,
		'--slice-count': 0,
		ease: 'none'
	});

	function randomIntFromInterval(min: number, max: number): number {
		return Math.random() * (max - min + 1) + min;
	}
}
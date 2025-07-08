import gsap from 'gsap';

export interface GlitchOptions {
	/** Delay between glitch cycles (seconds) */
	rate?: number;
	/** Overall intensity (0.5 = subtle, 1 = normal, 2 = intense) */
	intensity?: number;
	/** Respect prefers-reduced-motion */
	respectMotion?: boolean;
}

export interface GlitchController {
	start: () => void;
	stop: () => void;
	destroy: () => void;
}

/**
 * Creates a simple, effective glitch animation
 */
export function createGlitchAnimation(
	container: HTMLElement,
	options: GlitchOptions = {}
): GlitchController {
	const {
		rate = 2,
		intensity = 1,
		respectMotion = true
	} = options;

	let timeline: gsap.core.Timeline | null = null;

	// Check reduced motion preference
	const prefersReducedMotion = respectMotion && 
		window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

	// Random helper
	function random(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	// Get elements
	function getElements() {
		const image = container.querySelector('.avatar-image') as HTMLElement;
		const red = container.querySelector('.glitch-red') as HTMLElement;
		const green = container.querySelector('.glitch-green') as HTMLElement;
		const blue = container.querySelector('.glitch-blue') as HTMLElement;
		return { image, red, green, blue };
	}

	// Reset all elements
	function reset() {
		const { image, red, green, blue } = getElements();
		if (image) {
			// Reset main image to visible
			gsap.set(image, {
				x: 0,
				y: 0,
				scaleX: 1,
				scaleY: 1,
				rotation: 0,
				opacity: 1
			});
			
			// Reset RGB channels to hidden
			if (red) gsap.set(red, { x: 0, y: 0, opacity: 0 });
			if (green) gsap.set(green, { x: 0, y: 0, opacity: 0 });
			if (blue) gsap.set(blue, { x: 0, y: 0, opacity: 0 });
		}
	}

	// Store randomization values that get updated between cycles
	let cycleVars = {
		intensity: intensity,
		duration: 0.3,
		startDelay: 0,
		channelWeights: [1, 1, 1],
		timeScale: 1.2
	};

	// Generate new random values for the next cycle
	function generateCycleVars() {
		cycleVars = {
			intensity: intensity * random(0.7, 1.3),
			duration: random(0.15, 0.35),
			startDelay: random(0, 0.1),
			channelWeights: [random(0.5, 1), random(0.4, 0.9), random(0.6, 1)],
			timeScale: random(0.9, 1.4)
		};
	}

	// Create a single glitch cycle using current randomization values
	function createGlitchCycle() {
		const { image, red, green, blue } = getElements();
		if (!image) return gsap.timeline();

		const tl = gsap.timeline();
		const [redWeight, greenWeight, blueWeight] = cycleVars.channelWeights;

		// RGB channels split apart with current cycle values
		if (red && green && blue) {
			// Red channel
			tl.to(red, {
				x: random(-20, 20) * cycleVars.intensity * redWeight,
				y: random(-12, 12) * cycleVars.intensity * redWeight,
				opacity: random(0.5, 0.8) * redWeight,
				duration: cycleVars.duration * random(0.8, 1.2),
				ease: random(0, 1) > 0.5 ? 'power2.inOut' : 'none'
			}, cycleVars.startDelay)
			
			// Green channel
			.to(green, {
				x: random(-25, 25) * cycleVars.intensity * greenWeight,
				y: random(-8, 8) * cycleVars.intensity * greenWeight,
				opacity: random(0.4, 0.7) * greenWeight,
				duration: cycleVars.duration * random(0.9, 1.3),
				ease: random(0, 1) > 0.5 ? 'power2.inOut' : 'power1.out'
			}, cycleVars.startDelay + random(0, 0.05))
			
			// Blue channel
			.to(blue, {
				x: random(-22, 22) * cycleVars.intensity * blueWeight,
				y: random(-10, 10) * cycleVars.intensity * blueWeight,
				opacity: random(0.6, 0.9) * blueWeight,
				duration: cycleVars.duration * random(0.7, 1.1),
				ease: random(0, 1) > 0.5 ? 'power2.inOut' : 'bounce.out'
			}, cycleVars.startDelay + random(0.02, 0.08));
		}

		// Main image distortion
		const distortionStart = cycleVars.startDelay + random(0.05, 0.15);
		tl.to(image, {
			scaleX: 1 + random(-0.03, 0.03) * cycleVars.intensity,
			scaleY: 1 + random(-0.02, 0.02) * cycleVars.intensity,
			rotation: random(-1, 1) * cycleVars.intensity,
			x: random(-4, 4) * cycleVars.intensity,
			y: random(-2, 2) * cycleVars.intensity,
			duration: cycleVars.duration * 0.6,
			ease: random(0, 1) > 0.7 ? 'none' : 'power1.inOut'
		}, distortionStart);

		// Recovery phase
		const recoveryStart = cycleVars.duration + cycleVars.startDelay + random(0, 0.05);
		const recoveryDuration = random(0.03, 0.08);
		
		// Image recovery
		tl.to(image, {
			x: 0,
			y: 0,
			scaleX: 1,
			scaleY: 1,
			rotation: 0,
			duration: recoveryDuration,
			ease: random(0, 1) > 0.5 ? 'power4.out' : 'back.out(1.7)'
		}, recoveryStart);

		// RGB channels recovery
		if (red && green && blue) {
			tl.to([red, green, blue], {
				x: 0,
				y: 0,
				opacity: 0,
				duration: recoveryDuration,
				ease: 'power3.out',
				stagger: random(0.005, 0.02)
			}, recoveryStart + random(0, 0.02));
		}

		// Apply current cycle's time scale
		tl.timeScale(cycleVars.timeScale);

		return tl;
	}

	// Create the repeating effect with randomization between cycles
	function createEffect() {
		// Generate initial random values
		generateCycleVars();
		
		const masterTl = gsap.timeline({
			repeat: -1,
			repeatDelay: 0,
			onRepeat: () => {
				// Generate new random values for the next cycle
				generateCycleVars();
				
				// Clear and rebuild the timeline with new random values
				masterTl.clear();
				masterTl.add(createGlitchCycle());
			}
		});

		// Add the initial glitch cycle
		masterTl.add(createGlitchCycle());

		return masterTl;
	}

	// Controller
	return {
		start() {
			if (prefersReducedMotion || timeline) return;
			
			reset();
			timeline = createEffect();
		},

		stop() {
			if (timeline) {
				timeline.kill();
				timeline = null;
			}
			reset();
		},

		destroy() {
			this.stop();
		}
	};
}

/**
 * Minimal CSS needed for the effect
 */
export const glitchStyles = `
	.glitch-active {
		position: relative;
		overflow: hidden;
	}

	.glitch-red,
	.glitch-green,
	.glitch-blue {
		position: absolute;
		inset: 4px; /* Matches avatar padding */
		background: inherit;
		background-size: cover;
		background-position: top;
		border-radius: inherit;
		pointer-events: none;
		opacity: 0;
		will-change: transform, opacity;
	}

	.glitch-red {
		filter: sepia(1) saturate(10) hue-rotate(-60deg) brightness(1.5);
		mix-blend-mode: screen;
		z-index: 3;
	}

	.glitch-green {
		filter: sepia(1) saturate(10) hue-rotate(60deg) brightness(1.5);
		mix-blend-mode: screen;
		z-index: 2;
	}

	.glitch-blue {
		filter: sepia(1) saturate(10) hue-rotate(180deg) brightness(1.5);
		mix-blend-mode: screen;
		z-index: 4;
	}

	@media (prefers-reduced-motion: reduce) {
		.glitch-active .avatar-image {
			animation: pulse 2s ease-in-out infinite;
		}
		
		@keyframes pulse {
			50% { opacity: 0.8; }
		}
	}
`;
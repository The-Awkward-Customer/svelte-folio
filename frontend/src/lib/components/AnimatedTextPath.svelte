<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { gsap } from 'gsap';

	// Props
	export let texts: string[] = [
		'LETS COOK',
		'LETS TRY',
		'LETS CREATE',
		'LETS PLAY',
		'LETS EXPLORE'
	];
	export let speed: number = 50; // pixels per second
	export let pathWildness: number = 0.7; // 0-1 scale
	export let verticalBounds: number = 0.2; // 0.2 = 20% margin from top/bottom
	export let showPath: boolean = true; // Whether to show the path stroke
	export let fixedCanvasWidth: number = 2560; // Fixed width for stability
	export let pathStyle = {
		strokeColor: '#cccccc',
		strokeWidth: 2,
		opacity: 0.5
	};
	export let textStyle = {
		font: 'bold 24px sans-serif',
		size: 24,
		color: '#000000'
	};

	// State
	let canvas: HTMLCanvasElement;
	let container: HTMLDivElement;
	let ctx: CanvasRenderingContext2D;
	let selectedText = texts[Math.floor(Math.random() * texts.length)];
	let animationId: gsap.core.Tween;
	let canvasWidth: number = fixedCanvasWidth;
	let canvasHeight: number = 400;
	let viewportWidth: number = 0;

	// Path data
	let pathPoints: { x: number; y: number }[] = [];
	let pathLength = 0;
	let repeatedText = '';
	let textChars: { char: string; width: number }[] = [];
	let totalTextWidth = 0;

	// Generate smooth random path with organic, obtuse curves
	function generatePath(width: number, height: number) {
		const extendedWidth = width * 1.5; // Extend past canvas
		const startX = -width * 0.25;

		// Generate 3-6 curves with irregular spacing
		const numCurves = Math.floor(Math.random() * 4) + 3; // 3-6 curves
		const points: { x: number; y: number }[] = [];

		// Create irregular spacing
		const spacings: number[] = [];
		let totalSpacing = 0;

		for (let i = 0; i < numCurves; i++) {
			// Random spacing between 0.5 and 1.5 of average
			const spacing = 0.5 + Math.random();
			spacings.push(spacing);
			totalSpacing += spacing;
		}

		// Normalize spacings to fit the extended width
		const normalizedSpacings = spacings.map((s) => (s / totalSpacing) * extendedWidth);

		// Generate control points with organic variation
		let currentX = startX;
		const minY = height * verticalBounds;
		const maxY = height * (1 - verticalBounds);
		const yRange = maxY - minY;

		for (let i = 0; i < numCurves; i++) {
			const x = currentX + normalizedSpacings[i] * 0.5; // Place point at middle of spacing

			// Create organic vertical positions with alternating tendency
			let y: number;
			if (i === 0) {
				// Start somewhere in the middle range
				y = minY + yRange * (0.3 + Math.random() * 0.4);
			} else {
				// Alternate between high and low with organic variation
				const previousY = points[i - 1].y;
				const isHigh = previousY > (minY + maxY) / 2;

				if (isHigh) {
					// Go low, but with variation
					y = minY + yRange * (Math.random() * 0.35);
				} else {
					// Go high, but with variation
					y = minY + yRange * (0.65 + Math.random() * 0.35);
				}
			}

			points.push({ x, y });
			currentX += normalizedSpacings[i];
		}

		// Add extra point at the end for smooth continuation
		points.push({
			x: currentX + width * 0.25,
			y: points[0].y + (Math.random() - 0.5) * yRange * 0.3
		});

		// Convert control points to very smooth bezier path
		pathPoints = [];
		const resolution = 2; // Higher resolution for smoother curves

		// Use Catmull-Rom spline for smoother, more organic curves
		for (let i = 0; i < points.length - 1; i++) {
			const p0 = points[Math.max(0, i - 1)];
			const p1 = points[i];
			const p2 = points[i + 1];
			const p3 = points[Math.min(points.length - 1, i + 2)];

			const steps = Math.ceil(Math.abs(p2.x - p1.x) / resolution);

			for (let t = 0; t < steps; t++) {
				const ratio = t / steps;

				// Catmull-Rom spline interpolation for smoother curves
				const x = catmullRom(p0.x, p1.x, p2.x, p3.x, ratio);
				const y = catmullRom(p0.y, p1.y, p2.y, p3.y, ratio);

				pathPoints.push({ x, y });
			}
		}

		// Apply smoothing pass to reduce sharp angle changes
		smoothPath();

		// Calculate total path length
		calculatePathLength();
	}

	// Catmull-Rom spline interpolation
	function catmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
		const t2 = t * t;
		const t3 = t2 * t;

		return (
			0.5 *
			(2 * p1 +
				(-p0 + p2) * t +
				(2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
				(-p0 + 3 * p1 - 3 * p2 + p3) * t3)
		);
	}

	// Smooth the path to reduce sharp changes
	function smoothPath() {
		const smoothedPoints: { x: number; y: number }[] = [];
		const windowSize = 5; // Number of points to average

		for (let i = 0; i < pathPoints.length; i++) {
			let sumX = 0;
			let sumY = 0;
			let count = 0;

			for (let j = -windowSize; j <= windowSize; j++) {
				const index = i + j;
				if (index >= 0 && index < pathPoints.length) {
					// Use gaussian-like weights
					const weight = Math.exp(-(j * j) / (windowSize * 0.5));
					sumX += pathPoints[index].x * weight;
					sumY += pathPoints[index].y * weight;
					count += weight;
				}
			}

			smoothedPoints.push({
				x: sumX / count,
				y: sumY / count
			});
		}

		pathPoints = smoothedPoints;
	}

	// Calculate path length
	function calculatePathLength() {
		pathLength = 0;
		for (let i = 1; i < pathPoints.length; i++) {
			const dx = pathPoints[i].x - pathPoints[i - 1].x;
			const dy = pathPoints[i].y - pathPoints[i - 1].y;
			pathLength += Math.sqrt(dx * dx + dy * dy);
		}
	}

	// Get point and smoothed angle at specific distance along path
	function getPointAtDistance(distance: number): { x: number; y: number; angle: number } {
		// Ensure distance is positive
		while (distance < 0) distance += pathLength;
		distance = distance % pathLength;

		let currentDistance = 0;

		for (let i = 1; i < pathPoints.length; i++) {
			const dx = pathPoints[i].x - pathPoints[i - 1].x;
			const dy = pathPoints[i].y - pathPoints[i - 1].y;
			const segmentLength = Math.sqrt(dx * dx + dy * dy);

			if (currentDistance + segmentLength >= distance) {
				const ratio = (distance - currentDistance) / segmentLength;
				const x = pathPoints[i - 1].x + dx * ratio;
				const y = pathPoints[i - 1].y + dy * ratio;

				// Get smoothed angle by averaging nearby points
				const smoothAngle = getSmoothedAngle(i - 1, ratio);

				return { x, y, angle: smoothAngle };
			}

			currentDistance += segmentLength;
		}

		// Return last point if distance exceeds path length
		const lastPoint = pathPoints[pathPoints.length - 1];
		const smoothAngle = getSmoothedAngle(pathPoints.length - 2, 1);
		return { ...lastPoint, angle: smoothAngle };
	}

	// Get smoothed angle by averaging nearby segments
	function getSmoothedAngle(segmentIndex: number, ratio: number): number {
		const lookAhead = 15; // Number of points to look ahead/behind for smoothing
		let totalDx = 0;
		let totalDy = 0;
		let count = 0;

		// Look at points before and after current position
		for (let offset = -lookAhead; offset <= lookAhead; offset++) {
			const index = segmentIndex + offset;

			if (index >= 0 && index < pathPoints.length - 1) {
				const weight = Math.exp(-(offset * offset) / (lookAhead * 0.5)); // Gaussian weight
				const dx = pathPoints[index + 1].x - pathPoints[index].x;
				const dy = pathPoints[index + 1].y - pathPoints[index].y;

				totalDx += dx * weight;
				totalDy += dy * weight;
				count += weight;
			}
		}

		return Math.atan2(totalDy / count, totalDx / count);
	}

	// Create single repeating text string
	function createRepeatedText() {
		// Set font before measuring to ensure accurate character widths
		ctx.font = textStyle.font;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		// Create pattern with double space separator for clean separation
		const separator = '  ';
		const pattern = selectedText + separator;

		// Calculate pattern width
		const patternWidth = ctx.measureText(pattern).width;

		// We only need to store one pattern's worth of characters
		textChars = [];
		totalTextWidth = patternWidth;

		// Measure each character in one pattern
		for (const char of pattern) {
			const width = ctx.measureText(char).width;
			textChars.push({ char, width });
		}
	}

	// Render frame
	function render(progress: number) {
		if (!ctx || !canvas) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

		// Calculate center offset for viewport
		const centerOffset = (canvasWidth - viewportWidth) / 2;

		// Draw the path stroke first (behind text)
		if (showPath) {
			ctx.save();
			ctx.strokeStyle = pathStyle.strokeColor;
			ctx.lineWidth = pathStyle.strokeWidth;
			ctx.globalAlpha = pathStyle.opacity;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			ctx.beginPath();
			let started = false;

			for (let i = 0; i < pathPoints.length; i++) {
				const point = pathPoints[i];
				if (!started) {
					ctx.moveTo(point.x, point.y);
					started = true;
				} else {
					ctx.lineTo(point.x, point.y);
				}
			}

			ctx.stroke();
			ctx.restore();
		}

		// Set text style
		ctx.font = textStyle.font;
		ctx.fillStyle = textStyle.color;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		// Calculate how much to offset based on progress (left to right movement)
		// Negate the progress to reverse direction
		const offset = -(progress * pathLength) % totalTextWidth;

		// Start drawing from before the visible area to ensure smooth entry
		let currentDistance = -offset;

		// Keep drawing pattern instances until we've covered the entire path
		while (currentDistance < pathLength + totalTextWidth) {
			// Draw one instance of the pattern
			let charPosition = 0;

			for (const { char, width } of textChars) {
				const distance = currentDistance + charPosition;

				// Only process characters that are on the path
				if (distance >= 0 && distance <= pathLength) {
					const point = getPointAtDistance(distance);

					// Only render if in viewport (with margin for smooth entry/exit)
					if (point.x > centerOffset - 200 && point.x < centerOffset + viewportWidth + 200) {
						ctx.save();
						ctx.translate(point.x, point.y);
						ctx.rotate(point.angle);
						ctx.fillText(char, 0, 0);
						ctx.restore();
					}
				}

				charPosition += width;
			}

			// Move to next pattern instance
			currentDistance += totalTextWidth;
		}
	}

	// Setup canvas and animation
	function setup() {
		if (!browser || !canvas || !container) return;

		ctx = canvas.getContext('2d')!;

		// Get container dimensions
		const rect = container.getBoundingClientRect();
		canvasHeight = rect.height;
		viewportWidth = rect.width;

		// Set fixed canvas size
		const dpr = window.devicePixelRatio || 1;
		canvas.width = canvasWidth * dpr;
		canvas.height = canvasHeight * dpr;

		// Scale for DPR
		ctx.scale(dpr, dpr);

		// Generate path based on fixed canvas dimensions
		generatePath(canvasWidth, canvasHeight);

		// Create repeated text
		createRepeatedText();

		// Setup GSAP animation
		const duration = pathLength / speed;
		if (animationId) animationId.kill();

		animationId = gsap.to(
			{ progress: 0 },
			{
				progress: 1,
				duration,
				ease: 'none',
				repeat: -1,
				onUpdate: function () {
					render(this.targets()[0].progress);
				}
			}
		);
	}

	// Handle resize - only updates viewport tracking
	function handleResize() {
		if (!browser || !container) return;
		const rect = container.getBoundingClientRect();
		viewportWidth = rect.width;
		// Re-render at current progress
		if (animationId) {
			render(animationId.progress());
		}
	}

	onMount(() => {
		if (browser) {
			setup();
			window.addEventListener('resize', handleResize);
		}
	});

	onDestroy(() => {
		if (browser) {
			if (animationId) animationId.kill();
			window.removeEventListener('resize', handleResize);
		}
	});
</script>

<div class="animated-text-path-container" bind:this={container}>
	<div class="canvas-wrapper">
		<canvas bind:this={canvas} class="animated-text-path" aria-hidden="true" />
	</div>
	<div class="sr-only">{selectedText}</div>
</div>

<style>
	.animated-text-path-container {
		position: relative;
		width: 100%;
		height: 400px; /* Adjust as needed */
		overflow: hidden;
	}

	.canvas-wrapper {
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 2560px; /* Match fixedCanvasWidth prop */
		height: 100%;
	}

	.animated-text-path {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	@media (prefers-reduced-motion: reduce) {
		.animated-text-path {
			display: none;
		}
	}
</style>

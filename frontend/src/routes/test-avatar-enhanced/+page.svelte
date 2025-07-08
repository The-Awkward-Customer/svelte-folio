<script lang="ts">
	import { Avatar } from '$lib/components/primatives';
	import Button from '$lib/components/actions/Button.svelte';
	import Ani_me from '$lib/assets/Ani_me.png';
	import Ani_me_glitched from '$lib/assets/Ani_me_glitched.png';

	// Test state
	let isLoading = $state(false);
	let glitchRate = $state(2);
	let selectedSize: 'xs' | 'sm' | 'md' | 'lg' = $state('md');
	let selectedImage = $state(Ani_me);
	let isButton = $state(false);
	let simulateReducedMotion = $state(false);

	// Mock reduced motion for testing
	let originalMatchMedia: typeof window.matchMedia;

	function toggleReducedMotion() {
		simulateReducedMotion = !simulateReducedMotion;

		if (typeof window !== 'undefined') {
			if (simulateReducedMotion) {
				// Mock reduced motion preference
				originalMatchMedia = window.matchMedia;
				window.matchMedia = (query: string) => {
					if (query === '(prefers-reduced-motion: reduce)') {
						return {
							matches: true,
							media: query,
							onchange: null,
							addListener: () => {},
							removeListener: () => {},
							addEventListener: () => {},
							removeEventListener: () => {},
							dispatchEvent: () => true
						} as MediaQueryList;
					}
					return originalMatchMedia(query);
				};
			} else {
				// Restore original matchMedia
				if (originalMatchMedia) {
					window.matchMedia = originalMatchMedia;
				}
			}
		}
	}

	function handleAvatarClick() {
		console.log('Avatar clicked!');
		alert('Avatar clicked!');
	}

	function toggleLoading() {
		console.log('🔄 toggleLoading called, current isLoading:', isLoading);
		isLoading = !isLoading;
		console.log('🔄 toggleLoading finished, new isLoading:', isLoading);
	}

	function cycleSize() {
		const sizes: Array<'xs' | 'sm' | 'md' | 'lg'> = ['xs', 'sm', 'md', 'lg'];
		const currentIndex = sizes.indexOf(selectedSize);
		selectedSize = sizes[(currentIndex + 1) % sizes.length];
	}

	function toggleImage() {
		selectedImage = selectedImage === Ani_me ? Ani_me_glitched : Ani_me;
	}

	function toggleButtonMode() {
		isButton = !isButton;
	}
</script>

<svelte:head>
	<title>Enhanced Avatar Component Test</title>
	<meta
		name="description"
		content="Test page for the enhanced Avatar component with GSAP glitch animations"
	/>
</svelte:head>

<main class="test-page">
	<header class="test-header">
		<h1>Enhanced Avatar Component Test</h1>
		<p>Testing the Avatar component with GSAP-powered glitch animations and loading states</p>
	</header>

	<section class="controls-section">
		<h2>Interactive Controls</h2>
		<div class="controls-grid">
			<Button
				as="button"
				variant={isLoading ? 'primary' : 'inverse'}
				label={isLoading ? 'Stop Loading' : 'Start Loading'}
				handleClick={toggleLoading}
			/>

			<Button
				as="button"
				variant="inverse"
				label={`Size: ${selectedSize.toUpperCase()}`}
				handleClick={cycleSize}
			/>

			<Button as="button" variant="inverse" label="Toggle Image" handleClick={toggleImage} />

			<Button
				as="button"
				variant={isButton ? 'primary' : 'inverse'}
				label={isButton ? 'Button Mode' : 'Static Mode'}
				handleClick={toggleButtonMode}
			/>

			<Button
				as="button"
				variant={simulateReducedMotion ? 'primary' : 'inverse'}
				label={simulateReducedMotion ? 'Reduced Motion ON' : 'Reduced Motion OFF'}
				handleClick={toggleReducedMotion}
			/>
		</div>

		<div class="slider-control">
			<label for="glitch-rate">
				Glitch Rate: {glitchRate}s
				<input id="glitch-rate" type="range" min="0.5" max="5" step="0.1" bind:value={glitchRate} />
			</label>
		</div>
	</section>

	<section class="demo-section">
		<h2>Main Demo Avatar</h2>
		<div class="demo-avatar">
			{#if isButton}
				<Avatar
					size={selectedSize}
					content={selectedImage}
					alt="Test Avatar"
					{isLoading}
					{glitchRate}
					isButton={true}
					handleClick={handleAvatarClick}
				/>
			{:else}
				<Avatar
					size={selectedSize}
					content={selectedImage}
					alt="Test Avatar"
					{isLoading}
					{glitchRate}
				/>
			{/if}
		</div>

		<div class="demo-info">
			<p><strong>Current State:</strong></p>
			<ul>
				<li>Loading: {isLoading ? 'Yes' : 'No'}</li>
				<li>Size: {selectedSize}</li>
				<li>Mode: {isButton ? 'Button' : 'Static'}</li>
				<li>Glitch Rate: {glitchRate}s</li>
				<li>Reduced Motion: {simulateReducedMotion ? 'Simulated' : 'Normal'}</li>
			</ul>
		</div>
	</section>

	<section class="gallery-section">
		<h2>Size Variants Gallery</h2>
		<div class="size-gallery">
			<div class="size-demo">
				<h3>Extra Small (xs)</h3>
				<Avatar size="xs" content={selectedImage} alt="XS Avatar" {isLoading} {glitchRate} />
			</div>

			<div class="size-demo">
				<h3>Small (sm)</h3>
				<Avatar size="sm" content={selectedImage} alt="SM Avatar" {isLoading} {glitchRate} />
			</div>

			<div class="size-demo">
				<h3>Medium (md)</h3>
				<Avatar size="md" content={selectedImage} alt="MD Avatar" {isLoading} {glitchRate} />
			</div>

			<div class="size-demo">
				<h3>Large (lg)</h3>
				<Avatar size="lg" content={selectedImage} alt="LG Avatar" {isLoading} {glitchRate} />
			</div>
		</div>
	</section>

	<section class="button-gallery-section">
		<h2>Button Variants Gallery</h2>
		<div class="button-gallery">
			<div class="button-demo">
				<h3>Button Avatar (xs)</h3>
				<Avatar
					size="xs"
					content={selectedImage}
					alt="Button XS Avatar"
					{isLoading}
					{glitchRate}
					isButton={true}
					handleClick={handleAvatarClick}
				/>
			</div>

			<div class="button-demo">
				<h3>Button Avatar (sm)</h3>
				<Avatar
					size="sm"
					content={selectedImage}
					alt="Button SM Avatar"
					{isLoading}
					{glitchRate}
					isButton={true}
					handleClick={handleAvatarClick}
				/>
			</div>

			<div class="button-demo">
				<h3>Button Avatar (md)</h3>
				<Avatar
					size="md"
					content={selectedImage}
					alt="Button MD Avatar"
					{isLoading}
					{glitchRate}
					isButton={true}
					handleClick={handleAvatarClick}
				/>
			</div>

			<div class="button-demo">
				<h3>Disabled Button Avatar</h3>
				<Avatar
					size="md"
					content={selectedImage}
					alt="Disabled Button Avatar"
					{isLoading}
					{glitchRate}
					isButton={true}
					handleClick={handleAvatarClick}
					disabled={true}
				/>
			</div>
		</div>
	</section>

	<section class="technical-section">
		<h2>Technical Information</h2>
		<div class="tech-info">
			<h3>Features Demonstrated:</h3>
			<ul>
				<li>✅ GSAP-powered glitch animations</li>
				<li>✅ Configurable glitch rate (0.5s - 5s)</li>
				<li>✅ Four size variants (xs, sm, md, lg)</li>
				<li>✅ Button and static modes</li>
				<li>✅ Accessibility support (reduced motion)</li>
				<li>✅ TypeScript discriminated unions</li>
				<li>✅ CSS variables for dynamic animation</li>
				<li>✅ Proper cleanup and memory management</li>
			</ul>

			<h3>Animation Effects:</h3>
			<ul>
				<li><strong>RGB Split:</strong> Color channel separation with drop shadows</li>
				<li><strong>Glitch Slices:</strong> Horizontal displacement effects</li>
				<li><strong>Rotation:</strong> Subtle rotation during glitch cycles</li>
				<li><strong>Mix Blend Mode:</strong> Screen blending for slice effects</li>
				<li><strong>Randomization:</strong> Organic feel with randomized parameters</li>
			</ul>

			<h3>Accessibility Features:</h3>
			<ul>
				<li><strong>Reduced Motion:</strong> Respects user preferences</li>
				<li><strong>ARIA Attributes:</strong> Proper screen reader support</li>
				<li><strong>Focus Management:</strong> Keyboard navigation support</li>
				<li><strong>Fallback Animation:</strong> Simple pulse for reduced motion</li>
			</ul>
		</div>
	</section>
</main>

<style>
	.test-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: var(--font-family-main);
		color: rgb(var(--fg-text-primary));
		background: rgb(var(--bg-page));
		min-height: 100vh;
	}

	.test-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.test-header h1 {
		font-size: var(--fs-800);
		font-weight: var(--fw-bold);
		margin-bottom: 1rem;
		color: rgb(var(--fg-text-primary));
	}

	.test-header p {
		font-size: var(--fs-400);
		color: rgb(var(--fg-text-inverse));
		max-width: 600px;
		margin: 0 auto;
	}

	.controls-section,
	.demo-section,
	.gallery-section,
	.button-gallery-section,
	.technical-section {
		margin-bottom: 3rem;
		padding: 2rem;
		background: rgba(var(--bg-inverse) / 0.02);
		border-radius: var(--bdr-radius-medium);
		border: 1px solid rgba(var(--fg-text-primary) / 0.1);
	}

	.controls-section h2,
	.demo-section h2,
	.gallery-section h2,
	.button-gallery-section h2,
	.technical-section h2 {
		font-size: var(--fs-600);
		font-weight: var(--fw-semibold);
		margin-bottom: 1.5rem;
		color: rgb(var(--fg-text-primary));
	}

	.controls-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	.slider-control {
		margin-top: 1rem;
	}

	.slider-control label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-weight: var(--fw-medium);
	}

	.slider-control input[type='range'] {
		width: 100%;
		max-width: 300px;
	}

	.demo-avatar {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 3rem;
		background: rgba(var(--bg-primary) / 0.05);
		border-radius: var(--bdr-radius-small);
		margin-bottom: 1.5rem;
	}

	.demo-info {
		background: rgba(var(--bg-primary) / 0.02);
		padding: 1rem;
		border-radius: var(--bdr-radius-small);
		border-left: 4px solid rgb(var(--fg-text-primary));
	}

	.demo-info p {
		margin-bottom: 0.5rem;
		font-weight: var(--fw-semibold);
	}

	.demo-info ul {
		list-style: none;
		padding: 0;
	}

	.demo-info li {
		padding: 0.25rem 0;
		font-family: var(--font-family-alt);
		font-size: var(--fs-275);
	}

	.size-gallery,
	.button-gallery {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 2rem;
	}

	.size-demo,
	.button-demo {
		text-align: center;
		padding: 1.5rem;
		background: rgba(var(--bg-primary) / 0.02);
		border-radius: var(--bdr-radius-small);
		border: 1px solid rgba(var(--fg-text-primary) / 0.05);
	}

	.size-demo h3,
	.button-demo h3 {
		font-size: var(--fs-350);
		font-weight: var(--fw-medium);
		margin-bottom: 1rem;
		color: rgb(var(--fg-text-primary));
	}

	.tech-info h3 {
		font-size: var(--fs-400);
		font-weight: var(--fw-semibold);
		margin: 1.5rem 0 0.75rem 0;
		color: rgb(var(--fg-text-primary));
	}

	.tech-info ul {
		list-style: none;
		padding: 0;
	}

	.tech-info li {
		padding: 0.5rem 0;
		font-size: var(--fs-300);
		line-height: 1.5;
	}

	.tech-info li::before {
		content: '→ ';
		color: rgb(var(--fg-text-inverse));
		font-weight: var(--fw-bold);
	}

	/* Responsive design */
	@media (max-width: 768px) {
		.test-page {
			padding: 1rem;
		}

		.controls-grid {
			grid-template-columns: 1fr;
		}

		.size-gallery,
		.button-gallery {
			grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
			gap: 1rem;
		}

		.demo-avatar {
			padding: 2rem;
		}
	}
</style>

<script lang="ts">
	import type { GridArea } from './DialogSection.svelte';
	import CanvasAnimation from '$lib/components/CanvasAnimation.svelte';
	// Import images (adjust paths and actual images as needed)
	import p1g from '$lib/assets/exampleImage1.jpg';
	import p2g from '$lib/assets/exampleImage2.jpg';

	interface ImageObject {
		type: 'image';
		src: string;
		alt: string;
	}

	interface AnimationObject {
		type: 'animation';
		animationName: string;
		alt?: string;
	}

	type PrinciplePart = string | ImageObject | AnimationObject;

	const exampleElements: PrinciplePart[] = [
		'Freshas ',
		'design ',
		'system ',
		'strives ',
		'to ',
		{ type: 'animation', animationName: 'yellow-green-motion', alt: 'stylish motion' },
		'look ',
		'stylish, ',
		{ type: 'animation', animationName: 'yellow-green-motion', alt: 'intuitive motion' },
		'feel ',
		'intuitive ',
		'and ',
		{ type: 'animation', animationName: 'yellow-green-motion', alt: 'rapid motion' },
		'build ',
		'rapidly.' // Last word typically doesn't need a trailing space
	];

	// Props interface for the component
	interface DialogPrinciplesProps {
		elements?: PrinciplePart[];
		gridArea?: GridArea;
	}

	// Destructure props with defaults, using Svelte 5 runes
	let { elements = exampleElements, gridArea = 'body' }: DialogPrinciplesProps = $props();

	// Since CanvasAnimation handles viewport triggering internally,
	// we can simplify and rely on its built-in functionality
</script>

<div class="dialog-principles-word-wrapper" style:--grid-area={gridArea}>
	{#each elements as element (element)}
		<!-- Basic keying; consider unique IDs if elements can change/reorder -->
		{#if typeof element === 'string'}
			<span class="text-segment">{element}</span>
		{:else if element.type === 'image'}
			<img class="image-segment" src={element.src} alt={element.alt} />
		{:else if element.type === 'animation'}
			<div class="animation-segment">
				<CanvasAnimation
					animationName={element.animationName}
					size="1em"
					trigger="viewport"
					loop={true}
				>
					<img
						slot="fallback"
						src="/animations/{element.animationName}/00000.webp"
						alt={element.alt || element.animationName}
						class="fallback-image"
					/>
				</CanvasAnimation>
			</div>
		{/if}
	{/each}
</div>

<style>
	.dialog-principles-word-wrapper {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		font-size: clamp(18px, 4vw, 64px); /* Responsive font size */
		line-height: 130%; /* Adjust for overall readability and vertical rhythm */
		grid-area: var(--grid-area);
		color: rgb(var(--fg-text-primary)); /* From your original CSS */
	}

	.text-segment {
		white-space: break-spaces; /* KEY CHANGE HERE */
		font-weight: var(--fw-semibold);
	}

	.image-segment {
		width: 1em; /* Relative to the font-size of the wrapper/text */
		height: 1em; /* Maintain aspect ratio, assuming square-ish images */
		object-fit: contain; /* Ensures image scales nicely within its box */
		flex-shrink: 0; /* Prevents image from shrinking if space is tight */
		margin-right: 0.5rem;
	}

	.animation-segment {
		width: 1em; /* Same as .image-segment */
		height: 1em; /* Same as .image-segment */
		flex-shrink: 0; /* Same as .image-segment */
		margin-right: 0.5rem; /* Same as .image-segment */
		display: inline-block;
	}

	.fallback-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}

	/* Ensure parent container doesn't interfere with alpha */
	.dialog-principles-word-wrapper {
		background: transparent;
	}
</style>

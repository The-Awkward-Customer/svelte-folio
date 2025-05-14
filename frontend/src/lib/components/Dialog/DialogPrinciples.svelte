<script lang="ts">
	// Import images (adjust paths and actual images as needed)
	import p1g from '$lib/assets/exampleImage1.jpg';
	import p2g from '$lib/assets/exampleImage2.jpg';




	interface ImageObject {
		type: 'image';
		src: string;
		alt: string;
	}

	type PrinciplePart = string | ImageObject;

	const exampleElements: PrinciplePart[] = [
    'Fresha’s ', 'design ', 'system ', 'strives ', 'to ',
    { type: 'image', src: p1g, alt: 'stylish graphic' },
    'look ', 'stylish, ',
    { type: 'image', src: p2g, alt: 'intuitive graphic' },
    'feel ', 'intuitive ', 'and ',
    { type: 'image', src: p1g, alt: 'rapid graphic' }, // Re-using p1g as example
    'build ', 'rapidly.' // Last word typically doesn't need a trailing space
];

	// Props interface for the component
	interface DialogPrinciplesProps {
		elements?: PrinciplePart[];
	}

	// Destructure props with defaults, using Svelte 5 runes
	let { elements = exampleElements }: DialogPrinciplesProps = $props();
</script>

<div class="dialog-principles-word-wrapper">
	{#each elements as element (element)} <!-- Basic keying; consider unique IDs if elements can change/reorder -->
		{#if typeof element === 'string'}
			<span class="text-segment">{element}</span>
		{:else if element.type === 'image'}
			<img class="image-segment" src={element.src} alt={element.alt} />
		{/if}
	{/each}
</div>

<style>
	.dialog-principles-word-wrapper {
		display: inline-flex; 
		flex-wrap: wrap; 
		align-items: center;
		background-color: rgba(0, 0, 255, 0.1); /* Light blue with opacity for the wrapper */
		
		/* Base font size for the component, children can use 'em' units based on this */
		font-size: 40px; /* From your original component's .principle-text */
		line-height: 130%; /* Adjust for overall readability and vertical rhythm */
    grid-area: trailing; /* From your original CSS */
	}

	.text-segment {
		/* Text segments will naturally flow as flex items. */
		/* No specific display property needed, defaults to inline for span, flex item handles it. */
		background-color: rgba(173, 216, 230, 0.25); /* Lighter blue with opacity for text parts */
    white-space: break-spaces; /* KEY CHANGE HERE */

	}



	.image-segment {
		width: 1em;  /* Relative to the font-size of the wrapper/text */
		height: 1em; /* Maintain aspect ratio, assuming square-ish images */
		object-fit: contain; /* Ensures image scales nicely within its box */
		flex-shrink: 0; /* Prevents image from shrinking if space is tight */
  background-color: rgba(255, 105, 180, 0.3); /* Pink for image parts */
  margin-right: 0.5rem ;
}


</style>
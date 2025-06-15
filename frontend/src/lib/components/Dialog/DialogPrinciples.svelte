<script lang="ts">
	import { onMount } from 'svelte';
	import type { GridArea } from './DialogSection.svelte';
	// Import images (adjust paths and actual images as needed)
	import p1g from '$lib/assets/exampleImage1.jpg';
	import p2g from '$lib/assets/exampleImage2.jpg';
	const ExampleVidSpin = '/videos/ExampleVidSpin.webm';

	interface ImageObject {
		type: 'image';
		src: string;
		alt: string;
	}

	interface VideoObject {
		type: 'video';
		src: string;
		alt?: string;
	}

	type PrinciplePart = string | ImageObject | VideoObject;

	const exampleElements: PrinciplePart[] = [
		'Freshas ',
		'design ',
		'system ',
		'strives ',
		'to ',
		{ type: 'video', src: ExampleVidSpin, alt: 'stylish motion' },
		'look ',
		'stylish, ',
		{ type: 'video', src: ExampleVidSpin, alt: 'intuitive motion' },
		'feel ',
		'intuitive ',
		'and ',
		{ type: 'video', src: ExampleVidSpin, alt: 'rapid motion' },
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

	// Video management
	let videoElementsWithIndex: { video: HTMLVideoElement; index: number }[] = [];
	let wrapperElement: HTMLDivElement;
	let observer: IntersectionObserver;
	let videoIndex = 0; // Counter for video sequence

	onMount(() => {
		// Create intersection observer for viewport-based video control
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						// Play videos with staggered delay
						playVideosWithDelay();
					} else {
						// Pause all videos when component leaves viewport
						videoElementsWithIndex.forEach(({ video }) => {
							if (video && !video.paused) {
								video.pause();
							}
						});
					}
				});
			},
			{ threshold: 0.1 } // Trigger when 10% visible
		);

		if (wrapperElement) {
			observer.observe(wrapperElement);
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});

	function playVideosWithDelay() {
		videoElementsWithIndex.forEach(({ video, index }) => {
			setTimeout(() => {
				if (video && video.paused) {
					video.play().catch(() => {
						// Silently handle autoplay restrictions
					});
				}
			}, index * 200); // 0.2 seconds = 200ms delay between each video
		});
	}

	function videoAction(node: HTMLVideoElement) {
		if (node && !videoElementsWithIndex.some(({ video }) => video === node)) {
			videoElementsWithIndex.push({ video: node, index: videoIndex });
			videoIndex++;

			// Diagnostic: Log video codec info when available
			node.addEventListener('loadedmetadata', () => {
				console.log('Video loaded:', {
					src: node.src,
					videoWidth: node.videoWidth,
					videoHeight: node.videoHeight,
					duration: node.duration
				});

				// Check if browser supports alpha
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				if (ctx) {
					canvas.width = node.videoWidth;
					canvas.height = node.videoHeight;
					ctx.drawImage(node, 0, 0);
					const imageData = ctx.getImageData(0, 0, 1, 1);
					console.log('Alpha channel data available:', imageData.data[3] !== 255);
				}
			});
		}

		return {
			destroy() {
				const index = videoElementsWithIndex.findIndex(({ video }) => video === node);
				if (index > -1) {
					videoElementsWithIndex.splice(index, 1);
					// Reindex remaining videos to maintain sequential order
					videoElementsWithIndex.forEach((item, idx) => {
						item.index = idx;
					});
					videoIndex = videoElementsWithIndex.length;
				}
			}
		};
	}
</script>

<div class="dialog-principles-word-wrapper" bind:this={wrapperElement} style:--grid-area={gridArea}>
	{#each elements as element (element)}
		<!-- Basic keying; consider unique IDs if elements can change/reorder -->
		{#if typeof element === 'string'}
			<span class="text-segment">{element}</span>
		{:else if element.type === 'image'}
			<img class="image-segment" src={element.src} alt={element.alt} />
		{:else if element.type === 'video'}
			<video
				class="video-segment"
				src={element.src}
				muted
				loop
				playsinline
				preload="metadata"
				controls={false}
				title={element.alt}
				use:videoAction
			>
				<track kind="captions" />
			</video>
		{/if}
	{/each}
</div>

<style>
	.dialog-principles-word-wrapper {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		font-size: 40px; /* From your original component's .principle-text */
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

	.video-segment {
		width: 1em; /* Same as .image-segment */
		height: 1em; /* Same as .image-segment */
		object-fit: contain; /* Same as .image-segment */
		flex-shrink: 0; /* Same as .image-segment */
		margin-right: 0.5rem; /* Same as .image-segment */

		/* Ensure transparency support for WebM alpha */
		background: transparent !important;
		background-color: transparent !important;

		/* Override webkit default video controls */
		-webkit-appearance: none;
		-webkit-media-controls: none;
		-webkit-media-controls-panel: none;
		-webkit-media-controls-play-button: none;
		-webkit-media-controls-start-playback-button: none;

		/* Additional alpha support properties */
		mix-blend-mode: normal;
		isolation: auto;

		/* Ensure no border or outline interferes */
		border: none;
		outline: none;
		box-shadow: none;
	}

	.video-segment::-webkit-media-controls {
		display: none !important;
	}

	.video-segment::-webkit-media-controls-panel {
		display: none !important;
	}

	/* Ensure parent container doesn't interfere with alpha */
	.dialog-principles-word-wrapper {
		background: transparent;
	}
</style>

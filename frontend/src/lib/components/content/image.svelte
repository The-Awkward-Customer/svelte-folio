<script lang="ts">
	interface ImageProps {
		src: string;
		alt: string;
		aspectRatio?: string;
		gridArea?: string;
	}

	let { src, alt, aspectRatio = '16/9', gridArea } = $props();
</script>

<!-- Image component -->

<div class="image-container" style:aspect-ratio={aspectRatio} style:grid-area={gridArea}>
	<img {src} {alt} />
</div>

<style>
	.image-container {
		overflow: hidden; /* Ensure image doesn't overflow container */
		width: 100%; /* Or set a specific width */
		/* Aspect ratio is applied via inline style */
	}

	.image-container img {
		display: block; /* Remove extra space below image */
		width: 100%;
		height: auto;
		border-radius: var(--bdr-radius-medium);
		object-fit: cover; /* Cover the container, cropping if necessary */
	}
</style>

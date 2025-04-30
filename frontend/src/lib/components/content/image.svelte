<script lang="ts">
	export let src: string;
	export let alt: string;
	export let aspectRatio: string | undefined = undefined; // e.g., '16/9', '1/1'
</script>

<!-- Image component -->

<div class="image-container" style:aspect-ratio={aspectRatio}>
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


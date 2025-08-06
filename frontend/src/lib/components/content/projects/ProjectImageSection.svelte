<script lang="ts">
	import type { Snippet } from 'svelte';
	import placeholderImage from '$lib/assets/placeholder-image.jpg';

	// Interface for props
	interface ImageSectionProps {
		content?: Snippet;
		imageSrc?: string;
		imageAlt?: string;
	}

	let {
		content,
		imageSrc,
		imageAlt
	}: ImageSectionProps = $props();

	// Use provided props or fallback to defaults
	const displayImageSrc = imageSrc || placeholderImage;
	const displayImageAlt = imageAlt || 'Placeholder image';
</script>

<!-- Default content snippet -->
{#snippet defaultContent()}
	<img src={displayImageSrc} alt={displayImageAlt} class="image-section__image" />
{/snippet}

<section class="image-section">
	{#if content}
		{@render content()}
	{:else}
		{@render defaultContent()}
	{/if}
</section>

<style>
	.image-section {
		background: black;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 200px;
		padding: var(--space-md);
	}

	.image-section__image {
		max-width: 100%;
		height: auto;
		display: block;
	}
</style>
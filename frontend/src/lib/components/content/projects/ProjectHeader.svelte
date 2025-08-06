<script lang="ts">
	import type { Snippet } from 'svelte';
	import placeholderImage from '$lib/assets/placeholder-image.jpg';

	// Interface for props following ComponentRules.md patterns
	interface ProjectHeaderProps {
		content?: Snippet;
		imageSrc?: string;
		imageAlt?: string;
		// Video support props
		mediaType?: 'image' | 'video';
		videoSrc?: string;
		videoPoster?: string;
	}

	let {
		content,
		imageSrc,
		imageAlt,
		mediaType = 'image',
		videoSrc,
		videoPoster
	}: ProjectHeaderProps = $props();

	// Use provided props or fallback to defaults
	const displayImageSrc = imageSrc || placeholderImage;
	const displayImageAlt = imageAlt || 'Project placeholder image';
</script>

<!-- Default content snippet -->
{#snippet defaultContent()}
	<div class="project-header__media-container">
		{#if mediaType === 'video' && videoSrc}
			<video
				src={videoSrc}
				poster={videoPoster || displayImageSrc}
				controls
				class="project-header__media"
			>
				<track kind="captions" />
				<img src={displayImageSrc} alt={displayImageAlt} class="project-header__media" />
			</video>
		{:else}
			<img src={displayImageSrc} alt={displayImageAlt} class="project-header__media" />
		{/if}
	</div>
{/snippet}

<section class="project-header">
	{#if content}
		{@render content()}
	{:else}
		{@render defaultContent()}
	{/if}
</section>

<style>
	.project-header {
		display: grid;
		grid-template-columns: 1fr;
	}

	.project-header__media-container {
		display: flex;
		justify-content: center;
		aspect-ratio: 16 / 9;
	}

	.project-header__media {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>

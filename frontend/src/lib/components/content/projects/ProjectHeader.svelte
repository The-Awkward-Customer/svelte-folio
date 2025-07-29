<script lang="ts">
	import type { Snippet } from 'svelte';
	import placeholderImage from '$lib/assets/placeholder-image.jpg';
	import Subheader from '../../primatives/Subheader.svelte';

	// Interface for props following ComponentRules.md patterns
	interface ProjectBodyProps {
		leadingContent?: Snippet;
		trailingContent?: Snippet;
		content?: string;
		imageSrc?: string;
		imageAlt?: string;
	}

	let { leadingContent, trailingContent, content, imageSrc, imageAlt }: ProjectBodyProps = $props();

	// Dummy placeholder data for debugging
	const defaultContent =
		'A short description of my role in the project, helping to set the context for the project body content. What did I do, report to and hpw was it received?';
	const defaultStandfirst = 'A green field design system and multi-platform design system';

	// Use provided props or fallback to defaults
	const displayContent = content || defaultContent;
	const displayImageSrc = imageSrc || placeholderImage;
	const displayImageAlt = imageAlt || 'Project placeholder image';
</script>

<!-- leadingContent snippet -->
{#snippet defaultLeadingContent()}
	<div class="project-body__leading">
		<img src={displayImageSrc} alt={displayImageAlt} class="project-body__image" />
	</div>
{/snippet}

<!-- trailingContent snippet -->
{#snippet defaultTrailingContent()}
	<div class="project-body__trailing">
		<p class="project-standfirst">{defaultStandfirst}</p>
		<div class="project-body__content">
			<Subheader text="Project Overview" />
			<p>{displayContent}</p>
		</div>
	</div>
{/snippet}

<section class="project-body">
	<!-- Leading Content -->
	{#if leadingContent}
		{@render leadingContent()}
	{:else}
		{@render defaultLeadingContent()}
	{/if}

	<!-- Trailing Content -->
	{#if trailingContent}
		{@render trailingContent()}
	{:else}
		{@render defaultTrailingContent()}
	{/if}
</section>

<style>
	.project-body {
		display: grid;
		grid-template-columns: 1fr;
	}

	.project-body__leading {
		display: flex;
		justify-content: center;
		aspect-ratio: 16 / 9;
	}

	.project-body__image {
		width: 100%;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
		object-fit: cover;
	}

	.project-body__trailing {
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--space-lg);
		padding: var(--space-xl) var(--space-0);
	}

	.project-body__content {
		max-width: 70ch;
	}

	.project-body__content p {
		font-size: var(--fs-300);
		color: var(--fg-text-primary);
		font-weight: var(--fw-regular);
		line-height: var(--lh-body-text);
	}

	.project-standfirst {
		font-size: var(--fs-600);
		color: var(--fg-text-primary);
		font-weight: var(--fw-regular);
		font-family: var(--font-family-main);
		line-height: var(--lh-snug);
	}

	/* Desktop: 1024px+ */
	@media (min-width: 1024px) {
		.project-body {
			grid-template-columns: 1fr 1fr 2fr;
			gap: var(--space-0);
		}

		.project-body__leading {
			grid-column: 1 / 3;
		}

		.project-body__trailing {
			grid-column: 3;
			padding: var(--space-xl) var(--space-xl);
		}
	}
</style>

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
		'This project involved extensive user research, iterative design processes, and close collaboration with development teams to deliver a solution that met both user needs and business objectives. The approach focused on understanding user pain points through interviews and usability testing, followed by rapid prototyping and validation cycles.';

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
		<p class="project-date">date</p>
		<p class="project-standfirst">Standfirst</p>
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

	/* Tablet: 767px - 1024px */
	@media (min-width: 767px) {
		.project-body {
			grid-template-columns: 1fr 1fr;
		}

		.project-body__leading {
			grid-column: 1;
		}

		.project-body__trailing {
			grid-column: 2;
		}
	}

	/* Desktop: 1025px+ */
	@media (min-width: 1025px) {
		.project-body {
			grid-template-columns: 1fr 1fr 2fr;
		}

		.project-body__leading {
			grid-column: 1 / 3;
		}

		.project-body__trailing {
			grid-column: 3;
		}
	}

	.project-body__leading {
		display: flex;
		justify-content: center;
	}

	.project-body__image {
		width: 100%;
		height: auto;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-sm);
		object-fit: cover;
	}

	.project-body__trailing {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		padding: var(--space-xl);
	}

	.project-body__content {
		max-width: 70ch;
	}

	.project-body__content p {
		margin: 0 0 var(--space-md) 0;
		font-size: var(--fs-300);
		color: var(--fg-text-primary);
		font-weight: var(--fw-regular);
		line-height: var(--lh-body-text);
	}

	.project-body__content p:last-child {
		margin-bottom: 0;
	}

	.project-date {
		font-size: var(--fs-250);
		color: var(--fg-text-secondary);
		margin: 0;
		font-weight: var(--fw-medium);
		line-height: var(--lh-interface);
	}

	.project-standfirst {
		font-size: var(--fs-500);
		color: var(--fg-text-primary);
		margin: 0;
		font-weight: var(--fw-semibold);
		font-family: var(--font-family-main);
		line-height: var(--lh-heading-secondary);
	}

	/* Debug styles - remove when done */
	/* .project-body {
		box-shadow: 0 0 0 4px solid red !important;
		outline: 2px solid red !important;
	}

	.project-body__leading {
		box-shadow: 0 0 0 4px solid blue !important;
		outline: 2px solid blue !important;
	}

	.project-body__image {
		box-shadow: 0 0 0 4px solid cyan !important;
		outline: 2px solid cyan !important;
	}

	.project-body__trailing {
		box-shadow: 0 0 0 4px solid orange !important;
		outline: 2px solid orange !important;
	}

	.project-body__content {
		box-shadow: 0 0 0 4px solid purple !important;
		outline: 2px solid purple !important;
	} */
</style>

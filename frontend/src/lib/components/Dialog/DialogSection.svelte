<script lang="ts">
	import type { Snippet } from 'svelte';

	export type GridArea = 'header' | 'prefix' | 'body' | 'footer' | 'auto';

	interface SectionProps {
		id?: string;
		hasPadding: boolean;
		children?: Snippet;
	}

	let { hasPadding = true, children }: SectionProps = $props();

	/*
	 * Grid Layout with Named Areas:
	 * Mobile: Stacked vertically (header, body, prefix, footer)
	 * Desktop (896px+):
	 * - header spans full width (4 columns)
	 * - prefix takes first column, body takes remaining 3 columns
	 * - footer spans full width (4 columns)
	 *
	 * Child components should use: grid-area: header | prefix | body | footer
	 */
</script>

<section class="section-root">
	<div class="section-grid" class:has-padding={hasPadding}>
		{@render children?.()}
	</div>
</section>

<style>
	.section-root {
		display: flex;
		width: 100%;
		justify-content: center;
		align-content: center;
		color: rgb(var(--fg-text-primary));
	}

	.section-grid {
		display: grid;
		width: 100%;
		grid-template-columns: 1fr;
		grid-template-areas:
			'header'
			'body'
			'prefix'
			'footer';
		gap: 24px;
		padding-left: var(--spc-1000);
		padding-right: var(--spc-1000);
		padding-bottom: var(--spc-500);
		max-width: 1280px;
	}

	/* Visual debugging - add colored backgrounds to all grid children */
	.section-grid > :global(*:not(button)) {
		border: 1px solid rgba(173, 216, 230, 0.3);
		background-color: rgba(173, 216, 230, 0.1);
	}
	.section-grid > :global(*:not(button):nth-child(odd)) {
		border: 1px solid rgba(255, 192, 203, 0.3);
		background-color: rgba(255, 192, 203, 0.1);
	}

	.has-padding {
		padding-left: 24px;
		padding-right: 24px;
		padding-bottom: var(--spc-1000);
	}

	@media (min-width: 896px) {
		.has-padding {
			padding-left: 80px;
			padding-right: 80px;
		}

		.section-grid {
			grid-template-columns: repeat(4, 1fr);
			grid-template-areas:
				'header header header header'
				'prefix body   body   body'
				'footer footer footer footer';
			gap: 32px;
		}
	}
</style>

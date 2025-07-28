<script lang="ts">
	import Tag from './Tag.svelte';
	import type { Snippet } from 'svelte';

	type OrientationType = 'horizontal' | 'vertical';
	type AlignmentType = 'start' | 'center' | 'end';

	interface TagListProps {
		tags: string[];
		orientation?: OrientationType;
		align?: AlignmentType;
		gap?: 'xs' | 'sm' | 'md' | 'lg';
		wrap?: boolean;
		renderTag?: Snippet<[string, number]>;
	}

	let {
		tags,
		orientation = 'horizontal',
		align = 'start',
		gap = 'sm',
		wrap = true,
		renderTag
	}: TagListProps = $props();
</script>

<div
	class="tag-list tag-list--{orientation} tag-list--align-{align} tag-list--gap-{gap}"
	class:tag-list--wrap={wrap}
>
	{#each tags as tag, index}
		{#if renderTag}
			{@render renderTag(tag, index)}
		{:else}
			<Tag label={tag} />
		{/if}
	{/each}
</div>

<style>
	.tag-list {
		display: flex;
		list-style: none;
	}

	/* Orientation variants */
	.tag-list--horizontal {
		flex-direction: row;
	}

	.tag-list--vertical {
		flex-direction: column;
	}

	/* Alignment variants */
	.tag-list--align-start {
		justify-content: flex-start;
		align-items: flex-start;
	}

	.tag-list--align-center {
		justify-content: center;
		align-items: center;
	}

	.tag-list--align-end {
		justify-content: flex-end;
		align-items: flex-end;
	}

	/* Gap variants using spacing tokens */
	.tag-list--gap-xs {
		gap: var(--space-xs);
	}

	.tag-list--gap-sm {
		gap: var(--space-sm);
	}

	.tag-list--gap-md {
		gap: var(--space-md);
	}

	.tag-list--gap-lg {
		gap: var(--space-lg);
	}

	/* Wrap modifier */
	.tag-list--wrap {
		flex-wrap: wrap;
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';

	interface ProjectCardProps {
		children: Snippet;
	}

	let { children }: ProjectCardProps = $props();
</script>

<div class="project-card">
	{@render children()}
</div>

<style>
	.project-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xl);
		padding-bottom: var(--space-4xl);
	}

	/* Debug styles - remove when done */
	/* .project-card {
		box-shadow: 0 0 0 4px solid red !important;
		outline: 2px solid red !important;
	} */
</style>

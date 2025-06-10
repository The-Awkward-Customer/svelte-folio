<script lang="ts">
	import Tag from '../primatives/Tag.svelte';

	interface Props {
		title: string;
		content?: string;
		bgColor?: string;
		tag?: string;
	}

	let { title, content, bgColor = '#ffffff', tag = 'example' }: Props = $props();
</script>

<div class="text-card" style="background-color: {bgColor};">
	<div>
		<h2>{title}</h2>
		{#if content}
			<p>{content}</p>
		{/if}
	</div>
	{#if tag}
		<div class="tag-container">
			<Tag label={tag} />
		</div>
	{/if}
</div>

<style>
	.text-card {
		padding-top: var(--spc-200);
		padding-left: var(--spc-300);
		padding-right: var(--spc-300);
		padding-bottom: var(--spc-300);
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.tag-container {
		align-self: flex-start;
	}

	h2 {
		color: #333;
	}

	p {
		color: #666;
		line-height: 1.5;
	}
</style>

<script lang="ts">
	import Tag from '../primatives/Tag.svelte';

	interface Props {
		src?: string;
		bgColor?: string;
		alt?: string;
		tag?: string;
	}

	let { src, alt, bgColor = 'none', tag = 'example' }: Props = $props();
</script>

<div class="image-card">
	<img class="cover-image" {src} {alt} style="background-color: {bgColor};" />
	{#if tag}
		<div class="tag-container">
			<Tag label={tag} color="inverse" />
		</div>
	{/if}
</div>

<style>
	.image-card {
		display: flex;
		position: relative;
		padding-top: var(--spc-200);
		padding-left: var(--spc-300);
		padding-right: var(--spc-300);
		padding-bottom: var(--spc-300);
		width: 100%;
		height: 100%;
		flex-direction: column-reverse;
		justify-content: flex-end;
		align-items: flex-end;
		overflow: hidden;
		background-color: rgba(240, 248, 255, 0.041);
	}

	.cover-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.tag-container {
		position: relative;
		align-self: flex-start;
		z-index: 1;
	}
</style>

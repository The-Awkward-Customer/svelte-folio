<!-- DialogTextSection.svelte -->

<script lang="ts">
	import type { GridArea } from './DialogSection.svelte';

	interface DialogTextProps {
		title?: string;
		content?: string;
		gridArea?: GridArea;
	}

	let {
		title = '[ 1 ]',
		content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
		gridArea = 'body'
	}: DialogTextProps = $props();
</script>

<section class="dialog-text-section" style:--grid-area={gridArea}>
	<div class="dialog-text-section-content">
		<h3 class="dialog-text-section-title">{title}</h3>
		<p class="dialog-text-section-text">{content}</p>
	</div>
</section>

<style>
	.dialog-text-section {
		grid-area: var(--grid-area);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		position: relative;
	}

	.dialog-text-section-title {
		display: flex;
		font-family: var(--font-family-alt);
		font-size: var(--fs-300);
		font-weight: var(--fw-regular);
		color: rgb(var(--fg-text-primary));
		visibility: hidden;
		position: absolute;
		left: 0px;
		top: -32px;
	}

	.dialog-text-section-text {
		font-size: clamp(var(--fs-350), 4vw, var(--fs-500));
		font-weight: var(--fw-semibold);
		color: rgb(var(--fg-text-primary));
		max-width: 47ch;
		line-height: 130%;
	}

	@media (min-width: 896px) {
		.dialog-text-section-content {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			gap: var(--spc-200);
			position: relative;
		}
		.dialog-text-section-title {
			visibility: visible;
		}
	}
</style>

<script lang="ts">
	import type { WidgetPosition } from '$lib/stores/widgetManager.svelte.js';

	interface Props {
		position: WidgetPosition;
		color: string;
		number: number;
	}

	let { position, color, number }: Props = $props();

	function handleClick() {
		console.log(`Widget ${number} clicked at position (${position.x}, ${position.y})`);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			handleClick();
		}
	}
</script>

<div
	class="placeholder-widget"
	style:--widget-x="{position.x}px"
	style:--widget-y="{position.y}px"
	style:--widget-scale="{position.scale}"
	style:--widget-color="{color}"
	onclick={handleClick}
	onkeydown={handleKeydown}
	tabindex="0"
	role="button"
	aria-label="Placeholder widget {number}"
>
	<span class="widget-number">{number}</span>
</div>

<style>
	.placeholder-widget {
		position: absolute;
		top: var(--widget-y);
		left: var(--widget-x);
		width: 512px;
		height: 512px;
		transform: scale(var(--widget-scale));
		transform-origin: top left;
		background-color: var(--widget-color);
		border-radius: 8px;
		cursor: pointer;
		user-select: none;
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: system-ui, sans-serif;
		font-weight: 700;
		font-size: 48px;
		color: rgba(0, 0, 0, 0.8);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
		contain: layout style paint;
		will-change: transform;
	}

	.placeholder-widget:hover {
		transform: scale(var(--widget-scale)) translateZ(0) scale(1.05);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	}

	.placeholder-widget:focus {
		outline: 2px solid #ffffff;
		outline-offset: 2px;
	}

	.placeholder-widget:active {
		transform: scale(var(--widget-scale)) translateZ(0) scale(0.98);
	}

	.widget-number {
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	@media (prefers-reduced-motion: reduce) {
		.placeholder-widget {
			transition: none;
		}
		
		.placeholder-widget:hover {
			transform: scale(var(--widget-scale));
		}
		
		.placeholder-widget:active {
			transform: scale(var(--widget-scale));
		}
	}
</style>
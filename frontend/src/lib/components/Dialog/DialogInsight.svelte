<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '$lib/components/primatives/Icon.svelte';
	import { createThemeAwareNoiseEffect } from '$lib/utils/noiseGenerator';
	import { theme } from '$lib/theme.svelte';
	import type { GridArea } from './DialogSection.svelte';

	interface InsightData {
		insight: string;
		progress?: string;
		isComplete?: boolean;
		alt: string;
		gridArea?: GridArea;
	}

	const exampleInsightData: InsightData = {
		insight:
			'"We identified that teams has no guard rails and that we were "bleeding out" through constant contributions."',
		progress: '1/2',
		isComplete: true,
		alt: 'Reveal Insight'
	};

	let {
		insight = exampleInsightData.insight,
		progress = exampleInsightData.progress,
		isComplete = exampleInsightData.isComplete,
		alt = exampleInsightData.alt,
		gridArea = 'body'
	}: InsightData = $props();

	let isVisible: boolean = $state(false);
	let hasBeenClicked: boolean = $state(false);
	let contentWrapper: HTMLElement;

	function handleInsightClick() {
		isVisible = !isVisible;
		if (!hasBeenClicked) {
			hasBeenClicked = true;
		}
	}

	onMount(() => {
		// Initialize theme if not already done
		theme.init();
	});

	// Svelte 5 effect that runs whenever theme.current changes
	$effect(() => {
		if (contentWrapper) {
			// This will re-run automatically when theme.current changes
			// because we're accessing theme.current inside the effect
			const currentTheme = theme.current;

			// Generate noise pattern with current theme colors
			createThemeAwareNoiseEffect(contentWrapper, '--generated-noise', 100, 100, 0.08);
		}
	});
</script>

{#snippet progressFlag(progress: string, isComplete?: boolean)}
	<div class="progress-flag">
		<span>{progress}</span>
		{#if isComplete}
			<Icon name="checks_filled" fill="currentColor" />
		{/if}
	</div>
{/snippet}

{#snippet PusedoShadow()}
	<div class="pseudo-shadow"></div>
{/snippet}

<!-- {#snippet RevealOverlay()}
	<div class="reveal-overlay">
		<span>Click to reveal</span>
	</div>
{/snippet} -->

<!-- flag snippet -->

<button
	class="insight-button"
	aria-label={alt}
	onclick={handleInsightClick}
	style:--grid-area={gridArea}
>
	<div class="card-container">
		{#if progress && hasBeenClicked}
			{@render progressFlag(progress, isComplete)}
		{/if}

		<div class="content-wrapper" bind:this={contentWrapper}>
			<div class="insight-content">
				<p class="insight-text" class:visible={isVisible}>
					{insight}
				</p>
			</div>
		</div>
	</div>
	{@render PusedoShadow()}
</button>

<style>
	.insight-button {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 24px;
		border: none;
		border-radius: var(--bdr-radius-small);
		background-color: rgb(var(--color-bg-inverse));
		cursor: pointer;
		background-color: rgba(var(--bg-primary) / 0);
		width: 100%;
	}

	.card-container {
		position: relative;
		width: 100%;
		transition: all 0.2s ease-in-out;
	}

	.content-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		border-radius: var(--bdr-radius-medium);
		border: 2px solid rgba(var(--bdr-primary) / 1);
		background-color: rgba(var(--bg-page) / 1);
		gap: 24px;
		width: 100%;
		z-index: 200;
	}

	.content-wrapper::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: var(--generated-noise);
		background-size: 100px 100px;
		background-repeat: repeat;
		background-color: rgba(var(--fg-text-primary), 0.08);
		background-blend-mode: multiply;
		border-radius: var(--bdr-radius-medium);
		pointer-events: none;
		z-index: 1;
	}

	.content-wrapper > * {
		position: relative;
		z-index: 2;
	}

	.insight-button .card-container:active {
		transform: translateY(8px);
	}

	.insight-content {
		position: relative;
		width: 100%;
	}

	.insight-text {
		text-align: start;
		font-size: clamp(18px, 4vw, 48px);
		line-height: 120%;
		font-weight: var(--fw-bold);
		line-height: 130%;
		color: rgb(var(--fg-text-primary));
		padding-left: 1em;
		padding-right: 1em;
		padding-top: 0.5em;
		padding-bottom: 0.5em;
		filter: blur(12px);
		transition: filter 0.2s ease;
	}

	.insight-text.visible {
		filter: blur(0px);
	}

	.insight-button:hover .insight-text:not(.visible) {
		filter: blur(4px);
	}

	.insight-button:active .insight-text:not(.visible) {
		filter: blur(2px);
	}

	.pseudo-shadow {
		position: absolute;
		bottom: -8px;
		left: 0;
		width: 100%;
		height: 44px;
		border-radius: var(--bdr-radius-medium);
		background-color: rgb(var(--bg-primary));
		pointer-events: none;
		z-index: -2;
	}

	.progress-flag {
		position: absolute;
		top: 0px;
		right: 0;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 4px;
		padding-left: 8px;
		padding-right: 6px;
		padding-top: 6px;
		padding-bottom: 32px;
		background-color: rgb(var(--fg-positive));
		border-radius: var(--bdr-radius-small) var(--bdr-radius-small) 0px 0px;
		color: rgb(var(--bg-positive, #2a5314));
		font-size: var(--fs-240);
		font-weight: var(--fw-regular);
		z-index: 1;
		transform: translateY(-10px);
		opacity: 0;
		animation: slideInFlag 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards 0.2s;
	}

	@keyframes slideInFlag {
		0% {
			transform: translateY(-10px);
			opacity: 0;
		}
		50% {
			transform: translateY(-46px);
			opacity: 1;
		}
		100% {
			transform: translateY(-36px);
			opacity: 1;
		}
	}

	.insight-button {
		grid-area: var(--grid-area);
	}
</style>

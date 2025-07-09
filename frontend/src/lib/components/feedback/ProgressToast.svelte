<script lang="ts">
	import { onMount } from 'svelte';
	import type { DialogId } from '$lib/config/dialogRegistry.js';

	interface ProgressToastProps {
		dialogHistory: DialogId[];
		availableDialogs: readonly DialogId[];
		currentDialog: DialogId | null;
		label?: string;
		animateOnView?: boolean;
	}

	const {
		dialogHistory,
		availableDialogs,
		currentDialog,
		label = 'Progress',
		animateOnView = false
	}: ProgressToastProps = $props();

	// State for animation
	let isInView = $state(false);
	let progressContainer = $state<HTMLDivElement | undefined>(undefined);
	let observer: IntersectionObserver | undefined;

	// Track which dots have been animated
	let animatedDots = $state(new Set<DialogId>());

	// Check if a dialog has been visited
	function isVisited(dialogId: DialogId): boolean {
		return dialogHistory.includes(dialogId);
	}

	// Check if a dot should animate
	function shouldAnimate(dialogId: DialogId): boolean {
		return isInView && isVisited(dialogId) && !animatedDots.has(dialogId);
	}

	// Mark a dot as animated
	function markAnimated(dialogId: DialogId) {
		animatedDots = new Set([...animatedDots, dialogId]);
	}

	onMount(() => {
		if (animateOnView && progressContainer) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							// Add delay before showing
							setTimeout(() => {
								isInView = true;
							}, 400);
						}
					});
				},
				{
					threshold: 0.1,
					rootMargin: '0px 0px -10% 0px'
				}
			);

			observer.observe(progressContainer);
		} else if (!animateOnView) {
			// If not animating on view, show immediately with delay
			setTimeout(() => {
				isInView = true;
			}, 400);
		}

		return () => {
			if (observer) {
				observer.disconnect();
			}
		};
	});

	// Animate dots when they become visited
	$effect(() => {
		if (isInView) {
			availableDialogs.forEach((dialogId, index) => {
				if (shouldAnimate(dialogId)) {
					// Stagger the animations
					setTimeout(() => {
						markAnimated(dialogId);
					}, index * 100);
				}
			});
		}
	});
</script>

<div class="progress-toast" bind:this={progressContainer}>
	<div class="progress-content">
		<!-- <span class="progress-text">{label}</span> -->
		<div class="progress-dots">
			{#each availableDialogs as dialogId, index}
				<div
					class="progress-dot"
					class:visited={isVisited(dialogId)}
					class:current={currentDialog === dialogId}
					class:animated={animatedDots.has(dialogId)}
					style="--dot-index: {index}"
				>
					<div class="dot-inner"></div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.progress-toast {
		font-size: var(--fs-200);
		color: rgb(var(--color-txt-primary));
		padding-left: var(--spc-300);
		padding-right: var(--spc-300);
		height: 44px;
		border-radius: var(--bdr-radius-small);
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: var(--spc-200);
		background-color: rgba(var(--bg-inverse) / 0);
		min-width: 250px;
		box-shadow: inset 0 0 0 1px rgba(var(--bdr-primary) / 0);
	}

	.progress-content {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: var(--spc-300);
	}

	.progress-dots {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--spc-100);
		background-color: rgba(var(--bg-positive) / 0.8);
		padding: var(--spc-100);
		border-radius: var(--bdr-radius-pill);
	}

	.progress-dot {
		width: 16px;
		height: 8px;
		position: relative;
		border-radius: var(--bdr-radius-pill);
	}

	.dot-inner {
		width: 100%;
		height: 100%;
		border-radius: var(--bdr-radius-pill);
		background-color: rgba(var(--fg-positive) / 0.2);
		border: 1px solid rgba(var(--fg-positive) / 0.4);
		transition: all 0.3s ease-in-out;
		transform: scale(1);
	}

	/* Visited state - filled dot */
	.progress-dot.visited .dot-inner {
		background-color: rgba(var(--fg-positive) / 1);
		border-color: rgba(var(--fg-positive) / 1);
	}

	/* Current dialog - pulsing effect */
	.progress-dot.current .dot-inner {
		animation: pulse 1.5s ease-in-out infinite;
	}

	/* Animation when dot becomes visited */
	.progress-dot.visited.animated .dot-inner {
		animation: fillDot 0.4s ease-out forwards;
	}

	@keyframes fillDot {
		0% {
			transform: scale(0.8);
			opacity: 0.5;
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(1.1);
			opacity: 0.8;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	/* Mobile adjustments */
	@media (max-width: 896px) {
		/*  */
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';

	interface ProgressToastProps {
		currentProgress: number;
		totalItems: number;
		hasErrors?: boolean;
		errorCount?: number;
		label?: string;
		showProgressBar?: boolean;
		animateOnView?: boolean;
	}

	const {
		currentProgress,
		totalItems,
		hasErrors = false,
		errorCount = 0,
		label = 'Progress',
		showProgressBar = false,
		animateOnView = false
	}: ProgressToastProps = $props();

	// Derived values for display
	const progressText = $derived(`${label}: ${currentProgress}/${totalItems}`);
	const hasErrorsToShow = $derived(hasErrors && errorCount > 0);
	const progressPercentage = $derived((currentProgress / totalItems) * 100);

	// State for animation
	let isInView = $state(false);
	let progressBarContainer: HTMLDivElement | undefined;
	let observer: IntersectionObserver | undefined;

	onMount(() => {
		if (animateOnView && showProgressBar && progressBarContainer) {
			observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							// Add 0.3s delay before triggering animation
							setTimeout(() => {
								isInView = true;
							}, 400); // 400ms delay
						}
					});
				},
				{
					threshold: 0.1,
					rootMargin: '0px 0px -10% 0px'
				}
			);

			observer.observe(progressBarContainer);
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

	// Reset animation when progress resets to 0
	$effect(() => {
		if (currentProgress === 0) {
			isInView = false;
			// Trigger re-animation after a brief delay
			setTimeout(() => {
				if (animateOnView && showProgressBar) {
					isInView = true;
				}
			}, 50);
		}
	});
</script>

{#if currentProgress > 0}
	<div class="progress-toast" bind:this={progressBarContainer}>
		<div class="progress-content">
			<span class="progress-text">{progressText}</span>
			{#if hasErrorsToShow}
				<span class="error-indicator">
					({errorCount} failed)
				</span>
			{/if}
		</div>

		{#if showProgressBar}
			<div class="progress-bar-container">
				<div
					class="progress-bar"
					class:animate={isInView}
					style:--progress-width="{progressPercentage}%"
				></div>
			</div>
		{/if}
	</div>
{/if}

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
		background-color: rgba(var(--bg-inverse) / 1);
		min-width: 250px;
		box-shadow: inset 0 0 0 1px rgba(var(--bdr-primary) / 1);
	}

	.progress-content {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		flex-wrap: nowrap;
	}

	.progress-text {
		font-family: var(--font-family-alt);
		display: flex;
		font-weight: var(--fw-semibold);
		white-space: nowrap;
	}

	.error-indicator {
		color: rgba(var(--color-error), 0.8);
		font-weight: var(--fw-medium);
		font-size: var(--fs-150);
	}

	.progress-bar-container {
		width: 100%;
		height: 8px;
		background-color: rgba(var(--fg-positive) / 0.2);
		border-radius: var(--bdr-radius-small);
		overflow: hidden;
		/* Visual debugging - light blue background with opacity */
		border: 1px solid rgba(var(--bg-positive) / 1);
	}

	.progress-bar {
		height: 100%;
		background-color: rgba(var(--fg-positive) / 1);
		border-radius: var(--bdr-radius-small);
		width: 0%;
		transition: width 0.4s ease-in-out;
	}

	.progress-bar.animate {
		width: var(--progress-width);
	}
</style>

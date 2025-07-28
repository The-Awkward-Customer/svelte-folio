<script lang="ts">
	// Import the composable and types
	import { useWeather } from '$lib/composables';
	import type {
		WeatherData,
		WeatherProps,
		LoadingStateType,
		WeatherErrorTypeType
	} from '$lib/types';
	import { LoadingState, WeatherErrorType } from '$lib/types';

	// Components
	import Button from '$lib/components/actions/Button.svelte';
	import IconButton from '../actions/IconButton.svelte';
	import { Icon } from '../primatives';
	import type { IconName } from '$lib/types';

	// Debug imports
	import { weatherDebugManager } from '$lib/stores/weatherDebugManager.svelte.js';
	import WeatherDebugPanel from './WeatherDebugPanel.svelte';

	// Props - exactly the same as before
	let { class: className = '' }: WeatherProps = $props();

	// Use the weather composable - this replaces all the inline logic
	const weather = useWeather();

	// Debug integration - derived values (same as before)
	const isDebugActive = $derived(weatherDebugManager.isActive);

	// Helper function (same as before)
	function getErrorMessage(errorType: WeatherErrorTypeType): string {
		return weather.getErrorMessage(errorType);
	}
</script>

<!-- loading weatherDisplay Snippet -->
{#snippet WeatherDisplayLoading(loadingState: LoadingStateType)}
	<div class="weather-state-container loading-state">
		<div class="weather-icon-slot">
			<Icon name="gps_fix" size={24} fill="--fg-text-secondary" />
		</div>
		<div class="weather-content">
			<p class="weather-text-primary loading-text">
				{#if loadingState === LoadingState.GETTING_LOCATION}
					Sneaking…
				{:else if loadingState === LoadingState.FETCHING_WEATHER}
					Searching…
				{:else}
					Brewing tea…
				{/if}
			</p>
		</div>
	</div>
{/snippet}

<!-- successful weatherDisplay Snippet -->
{#snippet WeatherDisplaySuccess(data: WeatherData)}
	<div class="weather-state-container success-state">
		<div class="weather-icon-slot">
			<Icon name={data.weather[0].icon as IconName} size={32} fill="--fg-text-primary" />
		</div>
		<div class="weather-content">
			<p class="weather-text-primary">
				{data.weather[0].main}
			</p>
			<p class="weather-text-secondary">
				{data.name}, {data.sys.country}
			</p>
		</div>
	</div>
{/snippet}

<!-- unsuccessful weatherDisplay Snippet -->
{#snippet WeatherDisplayError(errorType: WeatherErrorTypeType)}
	<div class="weather-state-container error-state">
		<div class="weather-icon-slot">
			<Icon name="emoji_cross_eyed" size={32} fill="--fg-text-secondary" />
		</div>
		<div class="weather-content">
			<p class="weather-text-primary">Connection Issue</p>
			<p class="weather-text-secondary">{getErrorMessage(errorType)}</p>
		</div>
		<div class="weather-action-slot">
			<IconButton
				name="refresh"
				type="button"
				variant="inverse"
				alt={errorType === WeatherErrorType.LOCATION_DENIED ? 'Try Again' : 'Retry'}
				handleClick={errorType === WeatherErrorType.LOCATION_DENIED
					? weather.requestLocation
					: weather.retry}
			/>
		</div>
	</div>
{/snippet}

<div class="location-info-root {className}">
	{#if weather.loading !== LoadingState.IDLE}
		{@render WeatherDisplayLoading(weather.loading)}
	{:else if weather.data}
		{@render WeatherDisplaySuccess(weather.data)}
	{:else if weather.error}
		{@render WeatherDisplayError(weather.error)}
	{/if}
</div>

<!-- Debug Panel - only renders when debug is active -->
{#if isDebugActive}
	<WeatherDebugPanel />
{/if}

<style>
	.location-info-root {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		font-family: var(--font-family-main);
		border-radius: var(--bdr-radius-small);
		width: 100%;
		overflow: hidden;
		height: 72px;
		background-color: var(--bg-page);
		box-shadow: inset 0 0 0 1px var(--fg-text-primary);
	}

	/* Unified container for all weather states */
	.weather-state-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		min-height: 64px;
		padding: 16px;
		width: 100%;
		gap: 12px;
		transition: all 0.2s ease-in-out;
	}

	/* Icon slot - consistent sizing for all states */
	.weather-icon-slot {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	/* Content area - flexible for text content */
	.weather-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		flex-grow: 1;
		gap: 2px;
	}

	/* Action slot - for buttons in error state */
	.weather-action-slot {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	/* Typography consistency */
	.weather-text-primary {
		font-size: var(--fs-275);
		font-weight: var(--fw-semibold);
		color: var(--fg-text-primary);
		font-family: var(--font-family-main);
	}

	.weather-text-secondary {
		font-size: var(--fs-200);
		color: var(--fg-text-secondary);
		font-family: var(--font-family-main);
		margin: 0;
		line-height: 1.3;
	}

	/* State-specific styling */
	.loading-state {
		background-color: var(--bg-page);
	}

	.loading-text {
		color: var(--fg-text-secondary);
		font-family: var(--font-family-alt);
	}

	/* Loading animation for the placeholder icon */
	.loading-state .weather-icon-slot :global(svg) {
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0% {
			opacity: 0.6;
			transform: scale(1) rotate(0deg);
		}
		50% {
			opacity: 1;
			transform: scale(1.1) rotate(180deg);
		}
		100% {
			opacity: 0.6;
			transform: scale(1) rotate(360deg);
		}
	}
</style>

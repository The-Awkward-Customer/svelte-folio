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
	<div class="weather-loading-container">
		<div class="weather-display loading-state">
			<p>
				{#if loadingState === LoadingState.GETTING_LOCATION}
					Sneaking…
				{:else if loadingState === LoadingState.FETCHING_WEATHER}
					Looking out of the window…
				{:else}
					Brewing tea…
				{/if}
			</p>
		</div>
	</div>
{/snippet}

<!-- successful weatherDisplay Snippet -->
{#snippet WeatherDisplaySuccess(data: WeatherData)}
	<div class="weather-success-container">
		<div class="weather-display success-state">
			<Icon name={data.weather[0].icon as IconName} size={40} fill="--fg-text-primary" />
			<div class="weather-info">
				<p class="weather-condition">
					{data.weather[0].main}
				</p>
				<p class="weather-location">
					{data.name}, {data.sys.country}
				</p>
			</div>
		</div>
	</div>
{/snippet}

<!-- unsuccessful weatherDisplay Snippet -->
{#snippet WeatherDisplayError(errorType: WeatherErrorTypeType)}
	<div class="weather-error-root">
		<Button
			iconName="location_geo"
			as="button"
			variant="inverse"
			label={errorType === WeatherErrorType.LOCATION_DENIED ? 'Try Again' : 'Retry'}
			handleClick={errorType === WeatherErrorType.LOCATION_DENIED
				? weather.requestLocation
				: weather.retry}
		/>
		<p class="error">{getErrorMessage(errorType)}</p>
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
		justify-content: flex-start;
		align-items: flex-start;
		font-family: var(--font-family-main);
		font-size: var(--fs-275);
	}

	.weather-display {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 12px;
		padding-right: 16px;
		padding-top: 8px;
		padding-bottom: 8px;
	}

	.weather-info {
		font-size: var(--fs-300);
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		height: 44px;
		color: rgb(var(--fg-positive));
		font-family: var(--font-family-alt) !important;
	}

	.weather-success-container {
		width: 100%;
	}

	.weather-condition {
		font-weight: var(--fw-semibold);
		color: rgb(var(--fg-text-primary));
	}

	.weather-location {
		color: rgb(var(--fg-text-primary));
	}

	.weather-error-root {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		width: 100%;
		padding-bottom: 8px;
		border-radius: 4px;
	}

	.error {
		color: rgb(var(--fg-text-secondary));
	}
</style>

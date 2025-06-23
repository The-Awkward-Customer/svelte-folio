<script lang="ts">
	// TypeScript interfaces
	interface GeoLocation {
		latitude: number;
		longitude: number;
		accuracy: number;
	}

	interface IPInfo {
		loc: string;
		city?: string;
		region?: string;
		country?: string;
		[key: string]: any;
	}

	interface WeatherData {
		weather: Array<{
			main: string;
			description: string;
			icon: string;
		}>;
		name: string;
		sys: {
			country: string;
		};
		main: {
			temp: number;
			feels_like: number;
			humidity: number;
		};
	}

	interface WeatherProps {
		class?: string;
	}

	interface WeatherCache {
		data: WeatherData | null;
		timestamp: number;
	}

	// Use const objects instead of enums for Svelte compatibility
	const LoadingState = {
		IDLE: 'idle',
		GETTING_LOCATION: 'getting_location',
		FETCHING_WEATHER: 'fetching_weather'
	} as const;

	const WeatherErrorType = {
		LOCATION_DENIED: 'location_denied',
		API_ERROR: 'api_error',
		NETWORK_ERROR: 'network_error',
		NO_LOCATION: 'no_location'
	} as const;

	type LoadingStateType = (typeof LoadingState)[keyof typeof LoadingState];
	type WeatherErrorTypeType = (typeof WeatherErrorType)[keyof typeof WeatherErrorType];

	// Components
	import Button from '$lib/components/actions/Button.svelte';
	import IconButton from '../actions/IconButton.svelte';
	import { Icon } from '../primatives';
	import type { IconName } from '$lib/types';

	// Debug imports
	import { weatherDebugManager } from '$lib/stores/weatherDebugManager.svelte.js';
	import WeatherDebugPanel from './WeatherDebugPanel.svelte';

	// Constants
	const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
	const IP_INFO_API = 'https://ipinfo.io/json';
	const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
	const GEO_OPTIONS = {
		timeout: 10000,
		maximumAge: 300000, // 5 minutes
		enableHighAccuracy: false
	};

	const ERROR_MESSAGES = {
		[WeatherErrorType.LOCATION_DENIED]: 'Enable location in browser settings.',
		[WeatherErrorType.API_ERROR]: 'Location unavailable.',
		[WeatherErrorType.NETWORK_ERROR]: 'Oops, somethings broke!.',
		[WeatherErrorType.NO_LOCATION]: 'Enable location.'
	};

	// Props
	let { class: className = '' }: WeatherProps = $props();

	// Simplified state management
	let weatherState = $state<{
		data: WeatherData | null;
		loading: LoadingStateType;
		error: WeatherErrorTypeType | null;
	}>({
		data: null,
		loading: LoadingState.IDLE,
		error: null
	});

	let locationData = $state<{
		geoLocation: GeoLocation | null;
		ipInfo: IPInfo | null;
	}>({
		geoLocation: null,
		ipInfo: null
	});

	let weatherCache = $state<WeatherCache>({
		data: null,
		timestamp: 0
	});

	let initialized = $state<boolean>(false);
	let retryTimeout = $state<number>(0);

	// Debug integration
	const isDebugActive = $derived(weatherDebugManager.isActive);
	const isDebugOverride = $derived(weatherDebugManager.isOverrideMode);

	// Apply debug overrides to state when debug is active
	$effect(() => {
		if (!isDebugActive || !isDebugOverride) return;

		// Override loading state
		if (weatherDebugManager.currentForcedLoading !== null) {
			weatherState.loading = weatherDebugManager.currentForcedLoading;
			weatherState.error = null;
		}

		// Override error state
		if (weatherDebugManager.currentForcedError !== null) {
			weatherState.error = weatherDebugManager.currentForcedError;
			weatherState.loading = LoadingState.IDLE;
			weatherState.data = null;
		}

		// Override weather data
		if (weatherDebugManager.currentMockWeather !== null) {
			weatherState.data = weatherDebugManager.currentMockWeather;
			weatherState.loading = LoadingState.IDLE;
			weatherState.error = null;
		}

		// Override location data
		if (
			weatherDebugManager.currentMockLocation.geoLocation ||
			weatherDebugManager.currentMockLocation.ipInfo
		) {
			locationData.geoLocation = weatherDebugManager.currentMockLocation.geoLocation;
			locationData.ipInfo = weatherDebugManager.currentMockLocation.ipInfo;
		}
	});

	// Helper functions
	function isCacheValid(): boolean {
		return weatherCache.data !== null && Date.now() - weatherCache.timestamp < CACHE_DURATION;
	}

	function getErrorMessage(errorType: WeatherErrorTypeType): string {
		return ERROR_MESSAGES[errorType] || 'An unexpected error occurred.';
	}

	function getGeolocationErrorType(error: GeolocationPositionError): WeatherErrorTypeType {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				return WeatherErrorType.LOCATION_DENIED;
			case error.POSITION_UNAVAILABLE:
			case error.TIMEOUT:
			default:
				return WeatherErrorType.NO_LOCATION;
		}
	}

	// Main weather fetching function
	async function fetchWeatherData(): Promise<void> {
		// Check cache first
		if (isCacheValid()) {
			weatherState.data = weatherCache.data;
			weatherState.loading = LoadingState.IDLE;
			return;
		}

		weatherState.loading = LoadingState.FETCHING_WEATHER;
		weatherState.error = null;

		try {
			let lat: string | number;
			let lon: string | number;

			// Try to use precise geolocation first
			if (locationData.geoLocation) {
				lat = locationData.geoLocation.latitude;
				lon = locationData.geoLocation.longitude;
			}
			// Fall back to IP-based location if geolocation isn't available
			else if (locationData.ipInfo?.loc) {
				const [ipLat, ipLon] = locationData.ipInfo.loc.split(',');
				lat = ipLat;
				lon = ipLon;
			} else {
				throw new Error('No location data available');
			}

			// Using OpenWeatherMap API
			const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
			const response = await fetch(
				`${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
			);

			if (!response.ok) {
				throw new Error(`Weather API error: ${response.statusText}`);
			}

			const data = await response.json();

			// Update cache and state
			weatherCache.data = data;
			weatherCache.timestamp = Date.now();
			weatherState.data = data;
		} catch (error) {
			console.error('Error fetching weather:', error);
			weatherState.error =
				error instanceof Error && error.message.includes('No location')
					? WeatherErrorType.NO_LOCATION
					: WeatherErrorType.API_ERROR;
		} finally {
			weatherState.loading = LoadingState.IDLE;
		}
	}

	async function fetchIPLocation(): Promise<void> {
		try {
			const response = await fetch(IP_INFO_API);
			if (!response.ok) throw new Error('IP info fetch failed');

			locationData.ipInfo = await response.json();
			await fetchWeatherData();
		} catch (error) {
			console.error('IP info error:', error);
			weatherState.error = WeatherErrorType.NETWORK_ERROR;
			weatherState.loading = LoadingState.IDLE;
		}
	}

	function handleGeolocationSuccess(position: GeolocationPosition): void {
		locationData.geoLocation = {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
			accuracy: position.coords.accuracy
		};
		fetchWeatherData();
	}

	function handleGeolocationError(error: GeolocationPositionError): void {
		const errorType = getGeolocationErrorType(error);
		console.warn('Geolocation error:', error.message);

		// Try IP-based fallback for non-permission errors
		if (errorType !== WeatherErrorType.LOCATION_DENIED) {
			fetchIPLocation();
		} else {
			weatherState.error = errorType;
			weatherState.loading = LoadingState.IDLE;
		}
	}

	function handleLocationPermissionRequest(): void {
		if (retryTimeout) return; // Prevent rapid retries

		retryTimeout = window.setTimeout(() => (retryTimeout = 0), 2000);

		// Reset error state and try location request
		weatherState.error = null;
		weatherState.loading = LoadingState.GETTING_LOCATION;

		// Clear any existing location data to force a fresh permission request
		locationData.geoLocation = null;
		locationData.ipInfo = null;

		// Try geolocation request - this may fail silently if permission was previously denied
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				handleGeolocationSuccess,
				(error: GeolocationPositionError) => {
					// If permission is still denied, fall back to IP location
					if (error.code === error.PERMISSION_DENIED) {
						console.warn('Location permission still denied, falling back to IP location');
						fetchIPLocation();
					} else {
						handleGeolocationError(error);
					}
				},
				{
					...GEO_OPTIONS,
					maximumAge: 0 // Force fresh request
				}
			);
		} else {
			// Fallback to IP location if geolocation is not supported
			fetchIPLocation();
		}
	}

	function handleWeatherRetry(): void {
		if (retryTimeout) return; // Prevent rapid retries

		retryTimeout = window.setTimeout(() => (retryTimeout = 0), 2000);

		// Reset error state and try again
		weatherState.error = null;

		if (locationData.geoLocation || locationData.ipInfo) {
			fetchWeatherData();
		} else {
			// Try to get location again
			initializeLocation();
		}
	}

	function initializeLocation(): void {
		weatherState.loading = LoadingState.GETTING_LOCATION;

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				handleGeolocationSuccess,
				handleGeolocationError,
				GEO_OPTIONS
			);
		} else {
			fetchIPLocation();
		}
	}

	// Svelte 5 effect for initialization - runs only once
	$effect(() => {
		if (initialized) return;
		initialized = true;

		// Skip normal initialization if debug override is active
		if (isDebugActive && isDebugOverride) {
			console.log('🐛 Weather Debug: Skipping normal initialization due to debug override');
			return;
		}

		initializeLocation();
	});
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
				? handleLocationPermissionRequest
				: handleWeatherRetry}
		/>
		<p class="error">{getErrorMessage(errorType)}</p>
	</div>
{/snippet}

<div class="location-info-root {className}">
	{#if weatherState.loading !== LoadingState.IDLE}
		{@render WeatherDisplayLoading(weatherState.loading)}
	{:else if weatherState.data}
		{@render WeatherDisplaySuccess(weatherState.data)}
	{:else if weatherState.error}
		{@render WeatherDisplayError(weatherState.error)}
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

import { browser } from '$app/environment';
import type {
  WeatherData,
  WeatherState,
  WeatherCache,
  LocationData,
  GeoLocation,
  IPInfo,
  LoadingStateType,
  WeatherErrorTypeType,
} from '$lib/types/weather.js';
import {
  LoadingState,
  WeatherErrorType,
  ERROR_MESSAGES,
  WEATHER_API_BASE,
  IP_INFO_API,
  CACHE_DURATION,
  GEO_OPTIONS,
} from '$lib/types/weather.js';
import { weatherDebugManager } from '$lib';

/**
 * useWeather composable - Handles all weather-related API logic
 * Extracted from Weather.svelte component while maintaining full backwards compatibility
 */
export function useWeather() {
  // State management using Svelte 5 runes
  let weatherState = $state<WeatherState>({
    data: null,
    loading: LoadingState.IDLE,
    error: null,
  });

  let locationData = $state<LocationData>({
    geoLocation: null,
    ipInfo: null,
  });

  let weatherCache = $state<WeatherCache>({
    data: null,
    timestamp: 0,
  });

  let initialized = $state<boolean>(false);
  let retryTimeout = $state<number>(0);

  // Debug integration - derived values
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
      locationData.geoLocation =
        weatherDebugManager.currentMockLocation.geoLocation;
      locationData.ipInfo = weatherDebugManager.currentMockLocation.ipInfo;
    }
  });

  // Helper functions
  function isCacheValid(): boolean {
    return (
      weatherCache.data !== null &&
      Date.now() - weatherCache.timestamp < CACHE_DURATION
    );
  }

  function getErrorMessage(errorType: WeatherErrorTypeType): string {
    return ERROR_MESSAGES[errorType] || 'An unexpected error occurred.';
  }

  function getGeolocationErrorType(
    error: GeolocationPositionError
  ): WeatherErrorTypeType {
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
      accuracy: position.coords.accuracy,
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
            console.warn(
              'Location permission still denied, falling back to IP location'
            );
            fetchIPLocation();
          } else {
            handleGeolocationError(error);
          }
        },
        {
          ...GEO_OPTIONS,
          maximumAge: 0, // Force fresh request
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
      console.log(
        '🐛 Weather Debug: Skipping normal initialization due to debug override'
      );
      return;
    }

    initializeLocation();
  });

  // Return the public API
  return {
    // State (reactive)
    get data() {
      return weatherState.data;
    },
    get loading() {
      return weatherState.loading;
    },
    get error() {
      return weatherState.error;
    },
    get locationData() {
      return locationData;
    },

    // Actions
    retry: handleWeatherRetry,
    requestLocation: handleLocationPermissionRequest,

    // Utilities
    getErrorMessage,

    // Debug info (for development)
    get debugInfo() {
      return {
        weatherState,
        locationData,
        weatherCache,
        isDebugActive,
        isDebugOverride,
      };
    },
  };
}

// Export types for consumers
export type UseWeatherReturn = ReturnType<typeof useWeather>;

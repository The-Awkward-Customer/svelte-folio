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

  interface TimeZoneInfo {
    timezone: string;
    offset: number;
  }

  interface LanguageInfo {
    language: string;
    languages: readonly string[];
  }

  interface ScreenInfo {
    width: number;
    height: number;
    colorDepth: number;
    orientation: string;
  }

  interface LocationData {
    geoLocation: GeoLocation | null;
    ipInfo: IPInfo | null;
    timeZone: TimeZoneInfo | null;
    language: LanguageInfo | null;
    screenInfo: ScreenInfo | null;
    userAgent: string | null;
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

  // Components
  import Button from '$lib/components/actions/Button.svelte';
  import WeatherIcon from './WeatherIcon.svelte';

  // Import WeatherIconCode type
  type WeatherIconCode = 
    | '01d' | '01n' 
    | '02d' | '02n' 
    | '03d' | '03n' 
    | '04d' | '04n' 
    | '05d' | '05n' 
    | '06d' | '06n' 
    | '07d' | '07n' 
    | '08d' | '08n';

  // Props with TypeScript generics
  let { class: className = '' }: WeatherProps = $props();

  // State using Svelte 5 runes
  let locationData = $state<LocationData>({
    geoLocation: null,
    ipInfo: null,
    timeZone: null,
    language: null,
    screenInfo: null,
    userAgent: null
  });

  let weatherData = $state<WeatherData | null>(null);
  let isLoading = $state<boolean>(false);
  let weatherError = $state<string | null>(null);
  let initialized = $state<boolean>(false);

  // Functions
  function logLocationData(): void {
    console.log('User Location Data:', locationData);
    if (weatherData) {
      console.log('Weather Data:', weatherData);
    }
  }

  async function fetchWeather(): Promise<void> {
    isLoading = true;
    weatherError = null;

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
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }

      weatherData = await response.json();
      console.log('Weather Data:', weatherData);
    } catch (error) {
      console.error('Error fetching weather:', error);
      weatherError = "Looks like I can't find your location.";
    } finally {
      isLoading = false;
    }
  }

  async function fetchWeatherWithIPFallback(): Promise<void> {
    try {
      const response = await fetch('https://ipinfo.io/json');
      locationData.ipInfo = await response.json();
      // Only fetch weather after we have the IP-based location
      await fetchWeather();
    } catch (error) {
      console.log('IP info error:', error instanceof Error ? error.message : 'Unknown error');
    }
  }

  function handleGeolocationSuccess(position: GeolocationPosition): void {
    locationData.geoLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy
    };
    // Automatically fetch weather when we get geolocation
    fetchWeather();
  }

  function handleGeolocationError(error: GeolocationPositionError): void {
    console.log('Geolocation error:', error.message);
    // Try IP-based fallback
    fetchWeatherWithIPFallback();
  }

  function handleWeatherRetry(): void {
    console.log('Attempting to fetch weather data');
    fetchWeather();
  }

  // Svelte 5 effect for initialization - runs only once
  $effect(() => {
    if (initialized) return;
    
    initialized = true;
    
    // Get geolocation data
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError
      );
    } else {
      // Try IP-based fallback if geolocation isn't available
      fetchWeatherWithIPFallback();
    }

    // Get timezone info
    locationData.timeZone = {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      offset: new Date().getTimezoneOffset()
    };

    // Get language preferences
    locationData.language = {
      language: navigator.language,
      languages: navigator.languages
    };

    // Get screen info
    locationData.screenInfo = {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      orientation: window.screen.orientation.type
    };

    // Get user agent
    locationData.userAgent = navigator.userAgent;

    // Log all collected data
    logLocationData();
  });
</script>

<div class="location-info-root {className}">
  {#if isLoading}
    <div class="weather-display loading-state">
      <p>Snooping…</p>
    </div>
  {:else if weatherData}
    <div class="weather-success-container">
      <div class="weather-display success-state">
        <WeatherIcon iconCode={weatherData.weather[0].icon as WeatherIconCode} size={40} />
        <p class="weather-condition">
          {weatherData.weather[0].main}
        </p>
        <p class="weather-location">
          {weatherData.name}, {weatherData.sys.country}
        </p>
      </div>
    </div>
  {:else if weatherError}
    <div class="weather-error-root">
      <p class="error">{weatherError}</p>
      <Button 
        label="Enable Weather" 
        handleClick={handleWeatherRetry}
      />
    </div>
  {/if}
</div>

<style>
  .location-info-root {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    gap: 16px;
    height: 100px;
    font-family: var(--font-family-alt);
    font-size: var(--fs-275);
    border-bottom: 1px solid rgb(var(--color-fg-primary));
  }

  .weather-display {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    font-size: var(--fs-300);
    font-weight: var(--fw-semibold);
    color: rgb(var(--color-fg-primary));
    gap: 8px;
    padding-bottom: 12px;
  }

  .loading-state {
    padding: 8px;
    border-radius: 4px;
  }

  .success-state {
    border-radius: 4px;
  }

  .weather-success-container {
    width: 100%;
  }

  .weather-condition {
    font-weight: var(--fw-semibold);
    color: rgb(var(--color-fg-primary));
  }

  .weather-location {
    color: rgb(var(--color-fg-secondary));
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
    color: rgb(var(--color-fg-primary));
  }

  /* Mobile-first responsive design */
  @media (min-width: 896px) {
    .location-info-root {
      height: 120px;
      gap: 20px;
    }

    .weather-display {
      font-size: var(--fs-350);
      gap: 12px;
      padding-bottom: 16px;
    }

    .weather-error-root {
      padding-bottom: 12px;
    }
  }
</style>

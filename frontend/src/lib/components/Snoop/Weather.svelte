<!-- LocationInfo.svelte -->
<script>
    import { onMount } from 'svelte';

    //components 
    import Button from '$lib/components/actions/Button.svelte';
    import WeatherIcon from './WeatherIcon.svelte';


    let locationData = {
      geoLocation: null,
      ipInfo: null,
      timeZone: null,
      language: null,
      screenInfo: null,
      userAgent: null
    };
    
    let weatherData = null;
    let isLoading = false;
    let weatherError = null;
    
    function logLocationData() {
      console.log('User Location Data:', locationData);
      if (weatherData) {
        console.log('Weather Data:', weatherData);
      }
    }
    
    async function fetchWeather() {
      isLoading = true;
      weatherError = null;
      
      try {
        let lat, lon;
        
        // Try to use precise geolocation first
        if (locationData.geoLocation) {
          lat = locationData.geoLocation.latitude;
          lon = locationData.geoLocation.longitude;
        } 
        // Fall back to IP-based location if geolocation isn't available
        else if (locationData.ipInfo && locationData.ipInfo.loc) {
          const [ipLat, ipLon] = locationData.ipInfo.loc.split(',');
          lat = ipLat;
          lon = ipLon;
        } else {
          throw new Error('No location data available');
        }
        
        // Using OpenWeatherMap API (you'll need to sign up for a free API key)
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
        weatherError = "Looks like I can't find your location."
      } finally {
        isLoading = false;
      }
    }
    
    onMount(async () => {
      // Get geolocation data
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            locationData.geoLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            };
            // Automatically fetch weather when we get geolocation
            fetchWeather();
          },
          error => {
            console.log('Geolocation error:', error.message);
            // Try IP-based fallback
            fetchWeatherWithIPFallback();
          }
        );
      } else {
        // Try IP-based fallback if geolocation isn't available
        fetchWeatherWithIPFallback();
      }
      
      // Function to handle IP-based fallback
      async function fetchWeatherWithIPFallback() {
        try {
          const response = await fetch('https://ipinfo.io/json');
          locationData.ipInfo = await response.json();
          // Only fetch weather after we have the IP-based location
          fetchWeather();
        } catch (error) {
          console.log('IP info error:', error.message);
        }
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

  
  
  <div class="location-info-root">
    {#if isLoading}
        <div class="weather-display">
            <p>Snooping…</p>
        </div>
    {:else if weatherData}
    <div>
        <div class="weather-display">
            <WeatherIcon iconCode={weatherData.weather[0].icon} size={40} />
             <p>
         {weatherData.weather[0].main}
            </p>
            <p>
            {weatherData.name}, {weatherData.sys.country}
            </p>
          </div>
      </div>
    {:else if weatherError}
    <div class="weather-error-root">

        <p class="error">{weatherError}</p>

        <Button label="Enable Weather" handleClick={ () => {
          console.log('Attempting to fetch weather data');
          fetchWeather();
        }
        }/>

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
      font-size:var(--fs-300);
      font-weight: var(--fw-semibold);
      color: rgb(var(--color-fg-primary));
      gap: 8px;
      padding-bottom: 12px;
    }

    .weather-display p:nth-child(3){
     
      color:rgb(var(--color-fg-secondary))
    }
    
    img {
      vertical-align: middle;
    }
    .weather-error-root {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        width: 100%;
    }
  </style>
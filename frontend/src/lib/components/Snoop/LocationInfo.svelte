<!-- LocationInfo.svelte -->
<script>
    import { onMount } from 'svelte';
    
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
        weatherError = error.message;
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
  
  <div>
    <!-- <button on:click={logLocationData}>Log Location Data</button> -->
    <button on:click={fetchWeather} disabled={isLoading}>
      {isLoading ? 'Loading Weather...' : 'Get Weather'}
    </button>
    
    {#if weatherData}
      <div>
        <p>Weather data is available in the console</p>
        <!-- Optionally display weather info directly in the UI -->
        
        <div class="weather-display">
            <img 
              src="https://openweathermap.org/img/wn/{weatherData.weather[0].icon}@2x.png" 
              alt="{weatherData.weather[0].description}"
              width="50"
              height="50"
            />
            <p>Current weather in {weatherData.name}: {weatherData.weather[0].main}</p>
          </div>
       
      </div>
    {/if}
    
    {#if weatherError}
      <p class="error">Error: {weatherError}</p>
    {/if}
    
    <p>Location data is being collected and logged to the console.</p>
  </div>

  <style>
    .weather-display {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    img {
      vertical-align: middle;
    }
  </style>
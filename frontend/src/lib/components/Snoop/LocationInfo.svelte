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
    
    function logLocationData() {
      console.log('User Location Data:', locationData);
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
          },
          error => {
            console.log('Geolocation error:', error.message);
          }
        );
      }
      
      // Get IP-based location data
      try {
        const response = await fetch('https://ipinfo.io/json');
        locationData.ipInfo = await response.json();
      } catch (error) {
        console.log('IP info error:', error.message);
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
    <button on:click={logLocationData}>Log Location Data</button>
    <p>Location data is being collected and logged to the console.</p>
  </div>
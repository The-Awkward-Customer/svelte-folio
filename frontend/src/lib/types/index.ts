// types/index.ts

// Export all icon types
export type {
  IconName,
  IconProps,
  WeatherIconName,
  SimpleIconName
} from './icons.js';

// Export weather types
export type {
  WeatherData,
  WeatherCache,
  WeatherProps,
  WeatherState,
  GeoLocation,
  IPInfo,
  LocationData,
  LoadingStateType,
  WeatherErrorTypeType
} from './weather.js';

export {
  LoadingState,
  WeatherErrorType,
  ERROR_MESSAGES,
  WEATHER_API_BASE,
  IP_INFO_API,
  CACHE_DURATION,
  GEO_OPTIONS
} from './weather.js';

// Export debug types (re-exported from weatherDebug.ts)
export type {
  WeatherDebugState,
  MockWeatherScenario,
  MockLocationScenario
} from './weatherDebug.js';

// Usage examples:
// import type { IconName, IconProps } from '../types';
// import type { IconName, WeatherData, LocationData } from '$lib/types';
// import { LoadingState, WeatherErrorType } from '$lib/types';
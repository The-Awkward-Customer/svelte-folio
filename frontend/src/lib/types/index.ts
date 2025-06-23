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
  WeatherCondition,
  WeatherMain,
  WeatherSys,
  WeatherCache,
  WeatherServiceConfig,
  WeatherResult,
  WeatherProps,
  LoadingStateType,
  WeatherErrorTypeType
} from './weather.js';

export {
  LoadingState,
  WeatherErrorType,
  ERROR_MESSAGES
} from './weather.js';

// Export location types
export type {
  GeoLocation,
  IPInfo,
  LocationData,
  LocationServiceConfig,
  LocationResult,
  IPLocationResult,
  GeolocationOptions
} from './location.js';

export {
  DEFAULT_GEO_OPTIONS,
  DEFAULT_LOCATION_CONFIG,
  IP_INFO_API
} from './location.js';

// Export cache types
export type {
  CacheEntry,
  CacheConfig,
  CacheStats
} from './cache.js';

export {
  DEFAULT_CACHE_CONFIG,
  generateLocationCacheKey,
  generateWeatherCacheKey,
  generateIPCacheKey
} from './cache.js';

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
// Weather Debug Types - extracted from Weather.svelte component

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface IPInfo {
  loc: string;
  city?: string;
  region?: string;
  country?: string;
  [key: string]: any;
}

export interface WeatherData {
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

export interface WeatherCache {
  data: WeatherData | null;
  timestamp: number;
}

// Loading states from Weather component
export const LoadingState = {
  IDLE: 'idle',
  GETTING_LOCATION: 'getting_location',
  FETCHING_WEATHER: 'fetching_weather',
} as const;

export const WeatherErrorType = {
  LOCATION_DENIED: 'location_denied',
  API_ERROR: 'api_error',
  NETWORK_ERROR: 'network_error',
  NO_LOCATION: 'no_location',
} as const;

export type LoadingStateType = (typeof LoadingState)[keyof typeof LoadingState];
export type WeatherErrorTypeType =
  (typeof WeatherErrorType)[keyof typeof WeatherErrorType];

// Debug-specific types
export interface WeatherDebugState {
  isActive: boolean;
  overrideMode: boolean;
  mockWeatherData: WeatherData | null;
  mockLocationData: {
    geoLocation: GeoLocation | null;
    ipInfo: IPInfo | null;
  };
  forcedLoadingState: LoadingStateType | null;
  forcedErrorState: WeatherErrorTypeType | null;
  panelVisible: boolean;
}

export interface MockWeatherScenario {
  id: string;
  name: string;
  data: WeatherData;
}

export interface MockLocationScenario {
  id: string;
  name: string;
  geoLocation?: GeoLocation;
  ipInfo?: IPInfo;
}

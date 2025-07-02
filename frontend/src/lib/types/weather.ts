// Weather types extracted from Weather.svelte component

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

export interface WeatherProps {
	class?: string;
}

export interface WeatherCache {
	data: WeatherData | null;
	timestamp: number;
}

export interface LocationData {
	geoLocation: GeoLocation | null;
	ipInfo: IPInfo | null;
}

// Use const objects instead of enums for Svelte compatibility
export const LoadingState = {
	IDLE: 'idle',
	GETTING_LOCATION: 'getting_location',
	FETCHING_WEATHER: 'fetching_weather'
} as const;

export const WeatherErrorType = {
	LOCATION_DENIED: 'location_denied',
	API_ERROR: 'api_error',
	NETWORK_ERROR: 'network_error',
	NO_LOCATION: 'no_location'
} as const;

export type LoadingStateType = (typeof LoadingState)[keyof typeof LoadingState];
export type WeatherErrorTypeType = (typeof WeatherErrorType)[keyof typeof WeatherErrorType];

// Weather state interface
export interface WeatherState {
	data: WeatherData | null;
	loading: LoadingStateType;
	error: WeatherErrorTypeType | null;
}

// Constants
export const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';
export const IP_INFO_API = 'https://ipinfo.io/json';
export const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
export const GEO_OPTIONS = {
	timeout: 10000,
	maximumAge: 300000, // 5 minutes
	enableHighAccuracy: false
};

export const ERROR_MESSAGES = {
	[WeatherErrorType.LOCATION_DENIED]: 'Let me in!',
	[WeatherErrorType.API_ERROR]: 'Sh*t broke…',
	[WeatherErrorType.NETWORK_ERROR]: 'No interwebs…',
	[WeatherErrorType.NO_LOCATION]: 'On the moon?'
};
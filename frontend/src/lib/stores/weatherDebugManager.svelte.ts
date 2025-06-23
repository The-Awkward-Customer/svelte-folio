import { browser } from '$app/environment';
import type {
	WeatherData,
	GeoLocation,
	IPInfo,
	LoadingStateType,
	WeatherErrorTypeType,
	WeatherDebugState,
	MockWeatherScenario,
	MockLocationScenario
} from '../types/weatherDebug.js';

// Mock data scenarios
export const MOCK_WEATHER_SCENARIOS: MockWeatherScenario[] = [
	{
		id: 'sunny-london',
		name: 'Sunny in London',
		data: {
			weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
			name: 'London',
			sys: { country: 'GB' },
			main: { temp: 22, feels_like: 24, humidity: 45 }
		}
	},
	{
		id: 'rainy-paris',
		name: 'Rainy in Paris',
		data: {
			weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
			name: 'Paris',
			sys: { country: 'FR' },
			main: { temp: 15, feels_like: 13, humidity: 78 }
		}
	},
	{
		id: 'snowy-moscow',
		name: 'Snowy in Moscow',
		data: {
			weather: [{ main: 'Snow', description: 'light snow', icon: '13d' }],
			name: 'Moscow',
			sys: { country: 'RU' },
			main: { temp: -2, feels_like: -5, humidity: 85 }
		}
	},
	{
		id: 'cloudy-berlin',
		name: 'Cloudy in Berlin',
		data: {
			weather: [{ main: 'Clouds', description: 'overcast clouds', icon: '04d' }],
			name: 'Berlin',
			sys: { country: 'DE' },
			main: { temp: 18, feels_like: 17, humidity: 62 }
		}
	},
	{
		id: 'stormy-miami',
		name: 'Stormy in Miami',
		data: {
			weather: [{ main: 'Thunderstorm', description: 'thunderstorm with rain', icon: '11d' }],
			name: 'Miami',
			sys: { country: 'US' },
			main: { temp: 25, feels_like: 28, humidity: 88 }
		}
	}
];

export const MOCK_LOCATION_SCENARIOS: MockLocationScenario[] = [
	{
		id: 'gps-high-accuracy',
		name: 'GPS (High Accuracy)',
		geoLocation: {
			latitude: 51.5074,
			longitude: -0.1278,
			accuracy: 10
		}
	},
	{
		id: 'gps-low-accuracy',
		name: 'GPS (Low Accuracy)',
		geoLocation: {
			latitude: 48.8566,
			longitude: 2.3522,
			accuracy: 1000
		}
	},
	{
		id: 'ip-location',
		name: 'IP Location',
		ipInfo: {
			loc: '52.5200,13.4050',
			city: 'Berlin',
			region: 'Berlin',
			country: 'DE'
		}
	},
	{
		id: 'no-location',
		name: 'No Location Available'
	}
];

// Create weather debug manager using Svelte 5 runes
function createWeatherDebugManager() {
	// Check if debug mode is active via URL parameter
	function checkDebugActive(): boolean {
		if (!browser || !import.meta.env.DEV) return false;
		
		try {
			const urlParams = new URLSearchParams(window.location.search);
			return urlParams.get('debug') === 'weather';
		} catch {
			return false;
		}
	}

	// Initialize state
	let state = $state<WeatherDebugState>({
		isActive: checkDebugActive(),
		overrideMode: false,
		mockWeatherData: null,
		mockLocationData: {
			geoLocation: null,
			ipInfo: null
		},
		forcedLoadingState: null,
		forcedErrorState: null,
		panelVisible: checkDebugActive()
	});

	// Derived values
	const isActive = $derived(state.isActive);
	const isOverrideMode = $derived(state.overrideMode);
	const currentMockWeather = $derived(state.mockWeatherData);
	const currentMockLocation = $derived(state.mockLocationData);
	const currentForcedLoading = $derived(state.forcedLoadingState);
	const currentForcedError = $derived(state.forcedErrorState);
	const isPanelVisible = $derived(state.panelVisible);

	// Actions
	const actions = {
		// Panel control
		togglePanel(): void {
			if (!state.isActive) return;
			state.panelVisible = !state.panelVisible;
		},

		showPanel(): void {
			if (!state.isActive) return;
			state.panelVisible = true;
		},

		hidePanel(): void {
			state.panelVisible = false;
		},

		// Override mode control
		enableOverrideMode(): void {
			if (!state.isActive) return;
			state.overrideMode = true;
			console.log('🐛 Weather Debug: Override mode enabled');
		},

		disableOverrideMode(): void {
			state.overrideMode = false;
			state.mockWeatherData = null;
			state.mockLocationData = { geoLocation: null, ipInfo: null };
			state.forcedLoadingState = null;
			state.forcedErrorState = null;
			console.log('🐛 Weather Debug: Override mode disabled');
		},

		// Loading state control
		setLoadingState(loadingState: LoadingStateType | null): void {
			if (!state.isActive) return;
			state.forcedLoadingState = loadingState;
			state.forcedErrorState = null; // Clear error when setting loading
			if (loadingState) {
				actions.enableOverrideMode();
				console.log(`🐛 Weather Debug: Forced loading state to "${loadingState}"`);
			}
		},

		// Error state control
		setErrorState(errorState: WeatherErrorTypeType | null): void {
			if (!state.isActive) return;
			state.forcedErrorState = errorState;
			state.forcedLoadingState = null; // Clear loading when setting error
			if (errorState) {
				actions.enableOverrideMode();
				console.log(`🐛 Weather Debug: Forced error state to "${errorState}"`);
			}
		},

		// Mock data injection
		injectMockWeatherData(scenario: MockWeatherScenario | null): void {
			if (!state.isActive) return;
			state.mockWeatherData = scenario?.data || null;
			if (scenario) {
				actions.enableOverrideMode();
				state.forcedLoadingState = null;
				state.forcedErrorState = null;
				console.log(`🐛 Weather Debug: Injected mock weather data for "${scenario.name}"`);
			}
		},

		injectMockLocationData(scenario: MockLocationScenario | null): void {
			if (!state.isActive) return;
			if (scenario) {
				state.mockLocationData = {
					geoLocation: scenario.geoLocation || null,
					ipInfo: scenario.ipInfo || null
				};
				actions.enableOverrideMode();
				console.log(`🐛 Weather Debug: Injected mock location data for "${scenario.name}"`);
			} else {
				state.mockLocationData = { geoLocation: null, ipInfo: null };
			}
		},

		// Component control
		resetComponentState(): void {
			if (!state.isActive) return;
			actions.disableOverrideMode();
			console.log('🐛 Weather Debug: Component state reset');
		},

		// Utility functions
		getScenarioById(id: string, type: 'weather' | 'location'): MockWeatherScenario | MockLocationScenario | null {
			if (type === 'weather') {
				return MOCK_WEATHER_SCENARIOS.find(s => s.id === id) || null;
			} else {
				return MOCK_LOCATION_SCENARIOS.find(s => s.id === id) || null;
			}
		},

		// Debug info
		getDebugInfo(): object {
			return {
				isActive: state.isActive,
				overrideMode: state.overrideMode,
				forcedLoadingState: state.forcedLoadingState,
				forcedErrorState: state.forcedErrorState,
				hasMockWeather: !!state.mockWeatherData,
				hasMockLocation: !!(state.mockLocationData.geoLocation || state.mockLocationData.ipInfo),
				panelVisible: state.panelVisible
			};
		}
	};

	// Initialize debug mode if active
	if (browser && state.isActive) {
		console.log('🐛 Weather Debug: Debug mode activated via ?debug=weather');
		
		// Expose debug functions to window for console access
		(window as any).__weatherDebug = {
			...actions,
			getState: () => state,
			getInfo: actions.getDebugInfo,
			scenarios: {
				weather: MOCK_WEATHER_SCENARIOS,
				location: MOCK_LOCATION_SCENARIOS
			}
		};
	}

	return {
		// State getters
		get isActive() { return isActive; },
		get isOverrideMode() { return isOverrideMode; },
		get currentMockWeather() { return currentMockWeather; },
		get currentMockLocation() { return currentMockLocation; },
		get currentForcedLoading() { return currentForcedLoading; },
		get currentForcedError() { return currentForcedError; },
		get isPanelVisible() { return isPanelVisible; },
		get state() { return state; },

		// Actions
		...actions,

		// Constants
		MOCK_WEATHER_SCENARIOS,
		MOCK_LOCATION_SCENARIOS
	};
}

export const weatherDebugManager = createWeatherDebugManager();

// Type for accessing the manager
export type WeatherDebugManager = typeof weatherDebugManager;
// icon types

// Weather icon codes
export type IconName = 
// Weather Icons
    | '01d' | '01n' // Clear Sky
    | '02d' | '02n' // Fewd Clouds
    | '03d' | '03n' // Scattered Clouds
    | '04d' | '04n' // Broken Clouds
    | '09d' | '09n' // Shower Rain
    | '10d' | '10n' // Rain
    | '11d' | '11n' // Thunderstorm
    | '13d' | '13n' // Snow
    | '50d' | '50n' // Mist

// Generic Icons
    | 'placeholder'
    | 'plus'
    | 'close'
    | 'checks_filled'
    | 'diamond_filled'




export interface IconProps {
    name: IconName;
    alt?: string;
    size?: number;
    fill?: string;
    class?:string;
}

// Helper type guards for better development experience
export type WeatherIconName = Extract<IconName, `${string}d` | `${string}n`>;
export type SimpleIconName = Exclude<IconName, WeatherIconName>;

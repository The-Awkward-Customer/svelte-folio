// icon types

// Weather icon codes
export type IconName = 
// Weather Icons
    | '01d' | '01n' 
    | '02d' | '02n' 
    | '03d' | '03n' 
    | '04d' | '04n' 
    | '05d' | '05n' 
    | '06d' | '06n' 
    | '07d' | '07n' 
    | '08d' | '08n'

// Generic Icons
    | 'placeholder'
    | 'close';



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
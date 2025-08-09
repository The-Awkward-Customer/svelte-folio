<!-- Docs: ../../../../docs/integrations/weather_api_separation_plan.md -->
<script lang="ts">
  type WeatherIconCode = 
    | '01d' | '01n' 
    | '02d' | '02n' 
    | '03d' | '03n' 
    | '04d' | '04n' 
    | '05d' | '05n' 
    | '06d' | '06n' 
    | '07d' | '07n' 
    | '08d' | '08n';

  interface Props {
    iconCode: WeatherIconCode;
    size?: number;
    class?: string;
    color?: string;
  }

  let { iconCode, size = 24, class: className = '' }: Props = $props();
  
  // Icon mapping
  const iconMap: Record<WeatherIconCode, string> = {
    '01d': '01d',
    '01n': '01n', 
    '02d': '02d',
    '02n': '02n',
    '03d': '03d',
    '03n': '03n',
    '04d': '04d',
    '04n': '04n',
    '05d': '05d',
    '05n': '05n',
    '06d': '06d',
    '06n': '06n',
    '07d': '07d',
    '07n': '07n',
    '08d': '08d',
    '08n': '08n'
  };
  
  const iconName = $derived(iconMap[iconCode] || 'unknown');

</script>

<img 
  src="/icons/weather/{iconName}.svg" 
  alt="Weather: {iconName}"
  width={size}
  height={size}
  class={className}
  color={`rgb(var(--fg-text-primary))`}
/>

<style>

</style>

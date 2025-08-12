declare module '*.svg?component' {
  import type { ComponentType } from 'svelte';
  const component: ComponentType;
  export default component;
}

<!-- MobileNavigationOverlay.svelte -->
<script lang="ts">
    import { fade } from 'svelte/transition';
  
    interface MobileNavigationOverlayProps {
      opacity?: number;
      color?: string;
      closeOnClick?: boolean;
      transitionDuration?: number;
      class?: string;
      style?: string;
      close?: () => void;
    }
  
    // Define props using $props() in Svelte 5
    const { 
      opacity = 0.5,
      color = '#000',
      closeOnClick = true,
      transitionDuration = 200,
      class: class$ = '',
      style = '',
      close
    } = $props();
  
    function handleClick() {
      if (closeOnClick && close) {
        close();
      }
    }
  </script>
  
  <div
    role="dialog"
    aria-modal="true"
    on:click={handleClick}
    on:keydown
    class="fixed inset-0 z-40 {class$}"
    transition:fade={{ duration: transitionDuration }}
    style="background-color: {color}; opacity: {opacity}; {style}"
  >
  </div>
  
  <style>
    div {
      -webkit-tap-highlight-color: transparent;
    }
  </style>
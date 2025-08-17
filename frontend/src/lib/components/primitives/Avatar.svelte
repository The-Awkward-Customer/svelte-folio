<!-- Docs: ../../../../docs/components/avatar/Avatar-Component-Implementation-Plan.md -->
<script lang="ts">
  import Ani_me from '$lib/assets/Ani_me.png';
  import { onMount } from 'svelte';
  import {
    createGlitchAnimation,
    type GlitchController,
    type GlitchOptions,
  } from '$lib/animations/gsap/glitchAnimations.js';

  // Enhanced TypeScript interface for Avatar props
  type BaseAvatarProps = {
    size?: 'xs' | 'sm' | 'md' | 'lg';
    content?: string;
    alt?: string;
    class?: string;
    isLoading?: boolean;
    glitchRate?: number; // Delay between glitch cycles in seconds
    glitchIntensity?: number; // Intensity of the glitch effect (0.5-2)
  };

  type AvatarProps = BaseAvatarProps &
    (
      | {
          isButton: true;
          handleClick: () => void;
          disabled?: boolean;
        }
      | {
          isButton?: false;
          handleClick?: never;
          disabled?: never;
        }
    );

  // Props with discriminated union
  let props: AvatarProps = $props();

  const {
    size = 'md',
    content = Ani_me,
    alt = 'Avatar',
    class: className = '',
    isButton = false,
    isLoading = false,
    glitchRate = 2,
    glitchIntensity = 1,
  } = props;

  // Refs
  let avatarRef: HTMLElement | undefined = $state();
  let glitchController: GlitchController | null = null;

  // Check for reduced motion preference
  const prefersReducedMotion = $derived(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Compute classes - access props directly for reactivity
  const classes = $derived(
    [
      'avatar',
      `avatar-${size}`,
      isButton && 'avatar-button',
      props.isLoading && 'glitch-active',
      className,
    ]
      .filter(Boolean)
      .join(' ')
  );

  // Handle click for button variant
  function handleClick() {
    if (isButton && props.handleClick && !props.disabled) {
      props.handleClick();
    }

    // Note: Interactive glitch burst removed in simplified version
  }

  // Enhanced lifecycle management
  $effect(() => {
    // Access props directly to ensure reactivity tracking
    const currentIsLoading = props.isLoading;
    const currentGlitchRate = props.glitchRate || glitchRate;
    const currentIntensity = props.glitchIntensity || glitchIntensity;

    if (!avatarRef) {
      return;
    }

    if (currentIsLoading) {
      // Use a small delay to ensure DOM elements are rendered
      const timeoutId = setTimeout(() => {
        // Create glitch controller if it doesn't exist and avatarRef is available
        if (!glitchController && avatarRef) {
          const options: GlitchOptions = {
            rate: currentGlitchRate,
            intensity: currentIntensity,
            respectMotion: true,
          };

          glitchController = createGlitchAnimation(avatarRef, options);
        }

        // Start animation (simplified version doesn't have updateOptions)
        if (glitchController) {
          glitchController.start();
        }
      }, 10); // Small delay to ensure DOM is updated

      // Cleanup timeout if component unmounts or isLoading changes
      return () => clearTimeout(timeoutId);
    } else {
      if (glitchController) {
        // Stop animation when not loading
        glitchController.stop();
      }
    }
  });

  onMount(() => {
    return () => {
      // Cleanup on unmount
      if (glitchController) {
        glitchController.destroy();
        glitchController = null;
      }
    };
  });
</script>

{#if isButton}
  <button
    bind:this={avatarRef}
    class={classes}
    onclick={handleClick}
    disabled={props.disabled}
    aria-label={alt}
    aria-busy={isLoading}
  >
    <span
      class="avatar-image"
      style="background-image: url({content});"
      role="img"
      aria-label={alt}
    ></span>

    {#if isLoading}
      <!-- True RGB Channel Layers for Enhanced Glitch Effect -->
      <span
        class="glitch-red"
        style="background-image: url({content});"
        aria-hidden="true"
      ></span>
      <span
        class="glitch-green"
        style="background-image: url({content});"
        aria-hidden="true"
      ></span>
      <span
        class="glitch-blue"
        style="background-image: url({content});"
        aria-hidden="true"
      ></span>

      <!-- Scanline Overlay -->
      <span class="glitch-scanlines" aria-hidden="true"></span>
    {/if}
  </button>
{:else}
  <div bind:this={avatarRef} class={classes} aria-busy={isLoading}>
    <span
      class="avatar-image"
      style="background-image: url({content});"
      role="img"
      aria-label={alt}
    ></span>

    {#if isLoading}
      <!-- True RGB Channel Layers for Enhanced Glitch Effect -->
      <span
        class="glitch-red"
        style="background-image: url({content});"
        aria-hidden="true"
      ></span>
      <span
        class="glitch-green"
        style="background-image: url({content});"
        aria-hidden="true"
      ></span>
      <span
        class="glitch-blue"
        style="background-image: url({content});"
        aria-hidden="true"
      ></span>

      <!-- Scanline Overlay -->
      <span class="glitch-scanlines" aria-hidden="true"></span>
    {/if}
  </div>
{/if}

<style>
  .avatar {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(var(--bg-page) / 0);
    border: none;
    border-radius: var(--bdr-radius-small);
    padding: 4px;
    box-shadow: inset 0 0 0 1px rgba(var(--fg-text-primary) / 1);
    container-type: inline-size;
    transition: var(--transition-fast);
    isolation: isolate; /* Create stacking context for blend modes */
  }

  .avatar-image {
    display: flex;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: top;
    background-repeat: no-repeat;
    border-radius: var(--bdr-radius-tiny);
    transition: var(--transition-fast);
    position: relative;
    z-index: 1;
    will-change: transform, filter;
  }

  .glitch-active .avatar-image {
    will-change: transform, filter;
  }

  /* True RGB Channel Layers */
  .glitch-red,
  .glitch-green,
  .glitch-blue {
    position: absolute;
    top: 4px; /* Account for avatar padding */
    left: 4px;
    right: 4px;
    bottom: 4px;
    background-size: cover;
    background-position: top;
    background-repeat: no-repeat;
    border-radius: var(--bdr-radius-tiny);
    pointer-events: none;
    opacity: 0;
    will-change: transform, opacity;
    transform: translateZ(0); /* Hardware acceleration */
    backface-visibility: hidden;
  }

  /* RGB Channel color filtering for authentic separation */
  .glitch-red {
    filter: sepia(1) saturate(10) hue-rotate(-60deg) brightness(1.2)
      contrast(1.5);
    mix-blend-mode: screen;
    z-index: 3;
  }

  .glitch-green {
    filter: sepia(1) saturate(10) hue-rotate(60deg) brightness(1.1)
      contrast(1.3);
    mix-blend-mode: screen;
    z-index: 2;
  }

  .glitch-blue {
    filter: sepia(1) saturate(10) hue-rotate(180deg) brightness(1.3)
      contrast(1.4);
    mix-blend-mode: screen;
    z-index: 4;
  }

  /* Enhanced Scanline Overlay */
  .glitch-scanlines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.05) 2px,
      rgba(255, 255, 255, 0.05) 4px
    );
    border-radius: var(--bdr-radius-small);
    pointer-events: none;
    opacity: 0;
    z-index: 10;
    will-change: opacity;
    transform: translateZ(0);
  }

  /* Reduced motion fallback */
  @media (prefers-reduced-motion: reduce) {
    .glitch-red,
    .glitch-green,
    .glitch-blue,
    .glitch-scanlines {
      display: none !important;
    }

    .glitch-active .avatar-image {
      animation: glitch-pulse 2s ease-in-out infinite;
    }

    @keyframes glitch-pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.8;
      }
    }
  }

  /* Size variants with consistent aspect ratio (4:5 from original) */
  .avatar-xs {
    width: clamp(24px, 10vw, 80px);
    aspect-ratio: 4 / 5;
  }

  .avatar-sm {
    width: clamp(40px, 15vw, 120px);
    aspect-ratio: 4 / 5;
  }

  .avatar-md {
    width: clamp(60px, 20vw, 180px); /* Current ChatTrigger size */
    aspect-ratio: 4 / 5;
  }

  .avatar-lg {
    width: clamp(80px, 25vw, 240px);
    aspect-ratio: 4 / 5;
  }

  /* Button-specific styles */
  .avatar-button {
    cursor: pointer;
  }

  .avatar-button:hover:not(.glitch-active) .avatar-image {
    transform: scale(0.98);
  }

  .avatar-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .avatar-button:disabled:hover .avatar-image {
    transform: none;
  }

  /* Focus states using design system variables */
  .avatar-button:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  /* Hardware acceleration for all glitch elements */
  .glitch-active,
  .glitch-active .avatar-image,
  .glitch-red,
  .glitch-green,
  .glitch-blue,
  .glitch-scanlines {
    transform: translateZ(0);
    backface-visibility: hidden;
  }
</style>

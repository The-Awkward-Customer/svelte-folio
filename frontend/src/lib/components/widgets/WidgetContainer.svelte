<script lang="ts">
  import { onMount } from "svelte";
  import { gsap } from "gsap";
  import { widgetManager } from "$lib/stores/widgetManager.svelte.js";
  import PlaceholderWidget from "./PlaceholderWidget.svelte";

  interface Props {
    widgetCount?: number;
  }

  let { widgetCount = 5 }: Props = $props();

  // Widget graphics for placeholders
  const widgetGraphics = [
    "/src/lib/assets/widgetGraphics/article.png",
    "/src/lib/assets/widgetGraphics/compass.png", 
    "/src/lib/assets/widgetGraphics/cv.png",
    "/src/lib/assets/widgetGraphics/liveChat.png",
    "/src/lib/assets/widgetGraphics/weatherWidget.png",
  ];

  let containerElement: HTMLElement;

  function animateWidgetEntrance(element: HTMLElement, index: number) {
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      // Skip animation for users who prefer reduced motion
      gsap.set(element, { opacity: 1 });
      return;
    }

    // Get the final scale from the widget's CSS custom properties
    const computedStyle = getComputedStyle(element);
    const finalScale =
      parseFloat(computedStyle.getPropertyValue("--widget-scale")) || 1;

    // Create individual offset for each widget with consistent distance
    const offsetDistance = 100; // Consistent offset distance for all widgets
    const angle = index * 137.5 * (Math.PI / 180); // Golden angle for natural distribution

    // Calculate offset from final position
    const offsetX = Math.cos(angle) * offsetDistance;
    const offsetY = Math.sin(angle) * offsetDistance;

    // Set initial state - offset from final position
    gsap.set(element, {
      x: offsetX,
      y: offsetY,
      scale: 0.6 * finalScale,
      opacity: 0,
    });

    // Animate to final position
    gsap.to(element, {
      x: 0,
      y: 0,
      scale: finalScale,
      opacity: 1,
      duration: 0.2,
      delay: index * 0.15, // Slightly longer stagger
      ease: "expo.inOut",
      onComplete: () => {
        // Clear transform after animation for better performance
        gsap.set(element, { clearProps: "transform" });
      },
    });
  }

  function initializeWidgets() {
    widgetManager.initialize(widgetCount);
  }

  function animateWidgetsIn() {
    if (!containerElement) return;

    // Find all widget elements
    const widgetElements = containerElement.querySelectorAll(
      ".placeholder-widget",
    );

    widgetElements.forEach((element, index) => {
      animateWidgetEntrance(element as HTMLElement, index);
    });
  }

  // Initialize widgets when component mounts
  onMount(() => {
    widgetManager.setupEffects();
    initializeWidgets();

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      animateWidgetsIn();
    }, 100);
  });

  // Get widgets as array for rendering
  let positionsArray = $derived(Array.from(widgetManager.positions.entries()));
</script>

<div
  bind:this={containerElement}
  class="widget-container"
  aria-label="Interactive widget display"
>
  {#each positionsArray as [, position], index}
    <PlaceholderWidget
      {position}
      graphic={widgetGraphics[index % widgetGraphics.length]}
      number={index + 1}
    />
  {/each}
</div>

<style>
  .widget-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 998;
    contain: layout;
  }

  .widget-container :global(.placeholder-widget) {
    pointer-events: auto;
  }
</style>

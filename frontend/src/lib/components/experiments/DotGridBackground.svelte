<script lang="ts">
  import { onMount } from "svelte";
  import { themeManager } from "$lib/stores/themeManager.svelte";
  import { mouseManager } from "$lib/stores/mouseManager.svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  // Grid Pattern Configuration
  // Controls the density and appearance of the dot grid
  const dotSpacing = 20; // Distance between dot centers (pixels) - smaller = denser grid
  const dotRadius = 1; // Size of each dot (pixels) - temporarily increased for debugging
  const highlightDistance = 180; // Cursor influence radius (pixels) - larger = wider effect area

  // Opacity Configuration - using design system values
  const baseOpacity = 0.2; // Base dot opacity (temporarily increased for debugging)
  const maxOpacity = 1.0; // Maximum dot opacity

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    resize();
    draw();

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw();
    });
    resizeObserver.observe(canvas.parentElement!);

    return () => {
      resizeObserver.disconnect();
    };
  });

  function resize() {
    const parent = canvas.parentElement!;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function draw() {
    if (!ctx || !canvas) return;

    const { width, height } = canvas.getBoundingClientRect();
    const isDark = themeManager.appliedTheme === "dark";

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Theme Detection
    // Uses theme manager to determine current theme for color selection

    // Grid Layout Calculation
    // Calculate starting offset to center the dot grid within the canvas
    // This ensures dots are evenly distributed with equal margins on all sides
    const offsetX = (width % dotSpacing) / 2; // Horizontal centering offset
    const offsetY = (height % dotSpacing) / 2; // Vertical centering offset

    // Dot Generation Loop
    // Iterates through grid positions, creating dots at regular intervals
    // x and y represent the pixel coordinates of each dot's center
    let dotCount = 0;
    for (let x = offsetX; x < width; x += dotSpacing) {
      // Horizontal grid positions
      for (let y = offsetY; y < height; y += dotSpacing) {
        // Vertical grid positions
        dotCount++;
        const distance = $mouseManager.isActive
          ? Math.sqrt((x - $mouseManager.x) ** 2 + (y - $mouseManager.y) ** 2)
          : highlightDistance + 1;

        let alpha = baseOpacity; // Base opacity using design system

        if (distance <= highlightDistance) {
          // Calculate radial opacity increase based on distance from cursor
          const intensity = 1 - distance / highlightDistance;
          alpha = baseOpacity + (maxOpacity - baseOpacity) * intensity; // Configurable range
        }

        // Dot Rendering
        // Using hardcoded colors that match the design system primary text colors
        // Light theme: rgba(38, 39, 45) - matches --fg-text-primary
        // Dark theme: rgba(255, 255, 255) - matches --fg-text-inverse

        const finalColor = isDark
          ? `rgba(255, 255, 255, ${alpha})` // White dots for dark theme
          : `rgba(38, 39, 45, ${alpha})`; // Dark dots for light theme (primary text color)

        ctx.fillStyle = finalColor;

        // Draw individual dot as a filled circle
        ctx.beginPath();
        ctx.arc(x, y, dotRadius, 0, Math.PI * 2); // Circle at (x,y) with dotRadius size
        ctx.fill();
      }
    }
  }

  // Reactive draw when theme or mouse position changes
  $: if (ctx) {
    draw();
  }

  // Reactive draw on mouse movement
  $: if (ctx && $mouseManager) {
    draw();
  }
</script>

<div class="dot-grid-container" role="presentation">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .dot-grid-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    /* Use semantic z-index for background elements */
    z-index: -2; /* Background layer - consider using --z-background when available */
  }

  canvas {
    /* No background color set - canvas is transparent by default */
    /* This allows the underlying page background to show through */
    /* Only the dots themselves are rendered on the canvas */
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

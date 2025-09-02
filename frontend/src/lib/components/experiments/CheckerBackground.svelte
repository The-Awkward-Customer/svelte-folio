<script lang="ts">
  import { onMount } from "svelte";
  import { themeManager } from "$lib/stores/themeManager.svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  // Checkerboard Configuration
  const squareSize = 8; // Size of each checker square
  const opacity = 0.02; // Fixed opacity for all squares

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

    // Calculate grid dimensions
    const cols = Math.ceil(width / squareSize);
    const rows = Math.ceil(height / squareSize);

    // Center the pattern
    const offsetX = (width - cols * squareSize) / 2;
    const offsetY = (height - rows * squareSize) / 2;

    // Set fill color based on theme
    const fillColor = isDark
      ? `rgba(255, 255, 255, ${opacity})`
      : `rgba(38, 39, 45, ${opacity})`;

    ctx.fillStyle = fillColor;

    // Draw checkerboard
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        // Only draw alternating squares (checkerboard pattern)
        if ((col + row) % 2 === 0) {
          const x = offsetX + col * squareSize;
          const y = offsetY + row * squareSize;
          ctx.fillRect(x, y, squareSize, squareSize);
        }
      }
    }
  }

  // Reactive draw when theme changes
  $effect(() => {
    if (ctx) draw();
  });
</script>

<div class="checkerboard-container" role="presentation">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .checkerboard-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: -2;
  }

  canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>

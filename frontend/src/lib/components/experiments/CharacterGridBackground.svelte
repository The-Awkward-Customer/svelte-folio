<script lang="ts">
  import { onMount } from "svelte";
  import { themeManager } from "$lib/stores/themeManager.svelte";
  import { mouseManager } from "$lib/stores/mouseManager.svelte";

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;

  // Grid Pattern Configuration
  const dotSpacing = 20;
  const highlightDistance = 180;

  // Opacity Configuration
  const baseOpacity = 0.2;
  const maxOpacity = 1.0;

  // Character set for random generation
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Store characters for each grid position to maintain consistency
  let gridCharacters: string[][] = [];

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    resize();
    generateGridCharacters();
    draw();

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      resize();
      generateGridCharacters();
      draw();
    });
    resizeObserver.observe(canvas.parentElement!);

    return () => {
      resizeObserver.disconnect();
    };
  });

  function generateGridCharacters() {
    if (!canvas) return;
    
    const { width, height } = canvas.getBoundingClientRect();
    const offsetX = (width % dotSpacing) / 2;
    const offsetY = (height % dotSpacing) / 2;
    
    gridCharacters = [];
    
    let colIndex = 0;
    for (let x = offsetX; x < width; x += dotSpacing) {
      gridCharacters[colIndex] = [];
      let rowIndex = 0;
      for (let y = offsetY; y < height; y += dotSpacing) {
        const randomChar = characters[Math.floor(Math.random() * characters.length)];
        gridCharacters[colIndex][rowIndex] = randomChar;
        rowIndex++;
      }
      colIndex++;
    }
  }

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
    if (!ctx || !canvas || gridCharacters.length === 0) return;

    const { width, height } = canvas.getBoundingClientRect();
    const isDark = themeManager.appliedTheme === "dark";
    

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set font to Geist Mono
    ctx.font = "12px 'Geist Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const offsetX = (width % dotSpacing) / 2;
    const offsetY = (height % dotSpacing) / 2;

    let colIndex = 0;
    for (let x = offsetX; x < width; x += dotSpacing) {
      let rowIndex = 0;
      for (let y = offsetY; y < height; y += dotSpacing) {
        if (gridCharacters[colIndex] && gridCharacters[colIndex][rowIndex]) {
          const distance = $mouseManager.isActive
            ? Math.sqrt((x - $mouseManager.x) ** 2 + (y - $mouseManager.y) ** 2)
            : highlightDistance + 1;

          let alpha = baseOpacity;


          if (distance <= highlightDistance) {
            const intensity = 1 - distance / highlightDistance;
            alpha = baseOpacity + (maxOpacity - baseOpacity) * intensity;
          }

          const finalColor = isDark
            ? `rgba(255, 255, 255, ${alpha})`
            : `rgba(38, 39, 45, ${alpha})`;

          ctx.fillStyle = finalColor;
          ctx.fillText(gridCharacters[colIndex][rowIndex], x, y);
        }
        rowIndex++;
      }
      colIndex++;
    }
  }

  // Reactive draw when theme or mouse position changes
  $: if (ctx) {
    draw();
  }

  // Reactive draw on mouse movement
  $: $mouseManager, ctx && draw();
</script>

<div class="character-grid-container" role="presentation">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .character-grid-container {
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
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let animationFrame: number;
  let drops: Drop[] = [];

  class Ripple {
    x: number;
    y: number;
    size: number;
    maxSize: number;
    opacity: number;
    growthSpeed: number;

    constructor(x: number, y: number, initialSize: number) {
      this.x = x;
      this.y = y;
      this.size = initialSize;
      this.maxSize = 40 + Math.random() * 40;
      this.opacity = 0.8;
      this.growthSpeed = 0.4 + Math.random() * 0.4;
    }

    update(): boolean {
      this.size += this.growthSpeed;
      this.opacity = 0.8 * (1 - this.size / this.maxSize);
      return this.opacity > 0 && this.size < this.maxSize;
    }

    draw(context: CanvasRenderingContext2D): void {
      context.strokeStyle = `rgba(1, 8, 28, ${this.opacity})`;
      context.lineWidth = 1;
      context.beginPath();
      context.rect(
        this.x - this.size / 2,
        this.y - this.size / 2,
        this.size,
        this.size
      );
      context.stroke();
    }
  }

  class Drop {
    x: number;
    y: number;
    size: number;
    opacity: number;
    fadeSpeed: number;
    ripple: Ripple | null;

    constructor() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.size = 4 + Math.random() * 2;
      this.opacity = 1;
      this.fadeSpeed = 0.5;
      this.ripple = null;

      setTimeout(() => {
        this.ripple = new Ripple(
          this.x + this.size / 2,
          this.y + this.size / 2,
          this.size
        );
      }, 50);
    }

    update(): boolean {
      this.opacity -= this.fadeSpeed * 0.01;

      if (this.ripple && !this.ripple.update()) {
        this.ripple = null;
      }

      return this.opacity > 0;
    }

    draw(context: CanvasRenderingContext2D): void {
      context.fillStyle = `rgba(1, 8, 28, ${this.opacity})`;
      context.fillRect(this.x, this.y, this.size, this.size);

      if (this.ripple) {
        this.ripple.draw(context);
      }
    }
  }

  function animate(): void {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drops = drops.filter((drop) => {
      const isAlive = drop.update();
      if (isAlive && ctx) {
        drop.draw(ctx);
      }
      return isAlive;
    });

    animationFrame = requestAnimationFrame(animate);
  }

  function addDrop(): void {
    drops.push(new Drop());

    const delay = 300 + Math.random() * 700;
    setTimeout(addDrop, delay);
  }

  onMount(() => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }

    animate();
    addDrop();

    const handleResize = (): void => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  onDestroy(() => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });
</script>

<canvas
  bind:this={canvas}
  style="position: fixed; top: 0; left: 0; pointer-events: none; z-index: -1;"
></canvas>

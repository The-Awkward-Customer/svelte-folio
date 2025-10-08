<script lang="ts">
  import type { Snippet } from "svelte";
  import { onMount } from "svelte";

  interface Props {
    children: Snippet;
    borderWidth?: number;
    animationDuration?: number;
    threshold?: number;
    gradient?: string;
  }

  let {
    children,
    borderWidth = 1,
    animationDuration = 8,
    threshold = 0.1,
    gradient = `conic-gradient(
      from var(--gradient-angle, 0deg),
      #161616 0%,
      #161616 33.33%,
      #c679c4 40%,
      #fa3d1d 45%,
      #ffc800 50%,
      #e1e1e1 55%,
      #3b58e7 60%,
      rgba(255, 255, 255, 0) 66%,
      #161616 100%
    )`,
  }: Props = $props();

  let element: HTMLDivElement;
  let isInViewport = $state(false);

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewport = entry.isIntersecting;
        });
      },
      { threshold },
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  });
</script>

<div
  bind:this={element}
  class="animated-border"
  class:animated-border--active={isInViewport}
  style:--border-width="{borderWidth}px"
  style:--animation-duration="{animationDuration}s"
  style:--gradient={gradient}
>
  {@render children()}
</div>

<style>
  .animated-border {
    position: relative;
  }

  .animated-border::before {
    content: "";
    position: absolute;
    inset: calc(var(--border-width, 1px) * -1);
    border-radius: inherit;
    padding: var(--border-width, 1px);
    background: var(--gradient);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .animated-border--active::before {
    opacity: 1;
    animation: rotate-border var(--animation-duration, 8s) linear infinite;
  }

  @keyframes rotate-border {
    0% {
      --gradient-angle: 0deg;
    }
    100% {
      --gradient-angle: 360deg;
    }
  }

  @property --gradient-angle {
    syntax: "<angle>";
    initial-value: 0deg;
    inherits: false;
  }
</style>

<script lang="ts">
  import { onMount } from "svelte";
  import { shuffleText } from "$lib/animations/gsap";

  interface FooterTitleProps {
    enableShuffleAnimation?: boolean;
    shuffleOptions?: {
      duration?: number;
      iterations?: number;
      stagger?: number;
      delay?: number;
    };
  }

  let {
    enableShuffleAnimation = true,
    shuffleOptions = {
      duration: 0.8,
      iterations: 3,
      stagger: 0.05,
      delay: 0.1,
    },
  }: FooterTitleProps = $props();

  // Reference to the animated span element
  let animatedSpan: HTMLElement;

  onMount(() => {
    if (enableShuffleAnimation && animatedSpan) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        shuffleText(animatedSpan, "product designer", shuffleOptions);
      }, 50);
    }
  });
</script>

<h2 class="footer-title-root">
  <span class="title-line name">peter abbott</span>
  <span class="title-line role" bind:this={animatedSpan}>product designer</span>
</h2>

<style>
  .footer-title-root {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    font-size: var(--fs-xxlarge-clamped);
    font-weight: var(--fw-semibold);
    color: var(--text-primary-muted);
    text-transform: uppercase;
    text-align: start;
  }

  .title-line {
    display: block;
    line-height: 1.1;
  }

  .title-line:nth-child(2) {
    color: var(--text-primary-default);
  }
</style>

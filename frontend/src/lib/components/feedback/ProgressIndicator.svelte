<!-- ProgressIndicator.svelte -->

<!-- requirements -->

<!-- set the total step to 3
 for each totalstep create a indicator and bridge 
 if the active step is equal to the step number, the indicator should be active and the bridge should be active
 if the active step is not equal to the step number, the indicator should be inactive and the bridge should be inactive
 -->



<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  // Props
  export let totalSteps = 3;
  export let activeStep = 1;

  // Validate total steps
  $: if (totalSteps > 3) totalSteps = 3;
  $: if (totalSteps < 1) totalSteps = 1;

  // Component state
  let mounted = false;
  let prefersReducedMotion = false;
  let isInView = false;
  let containerRef: HTMLElement;

  onMount(() => {
    if (browser) {
      prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            isInView = true;
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(containerRef);
      return () => observer.disconnect();
    }
  });
</script>

<div
  class="progress-container"
  bind:this={containerRef}
  role="progressbar"
  aria-label="Portfolio section progress"
  aria-valuemin="1"
  aria-valuemax={totalSteps}
  aria-valuenow={activeStep}
>
  {#each Array(totalSteps) as _, index}
    {@const stepNumber = index + 1}
    <div 
      class="indicator"
      class:active={stepNumber === activeStep && isInView}
      class:animated={!prefersReducedMotion}
      style="transition-delay: {stepNumber * 0.3}s"
    >
      <span class="bracket-left">[</span>
      <span class="step-number">{stepNumber}</span>
      <span class="bracket-right">]</span>
    </div>
    <div 
      class="bridge"
      class:active={stepNumber === activeStep && isInView}
      class:animated={!prefersReducedMotion}
      style="transition-delay: {stepNumber * 0.3}s"
    >
    </div>
  {/each}
</div>

<style>
  .progress-container {
    display: -webkit-flex;
    display: flex;
    -webkit-flex-direction: row;
    flex-direction: row;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: flex-start;
    gap: 0;
    width: 100%;
  }

  .indicator {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    background-color: rgb(var(--color-bg-page));
    color: var(--fg-text-muted, #666);
    opacity: 0.5;
    font-size: var(--fs-300);
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    transition-property: color, opacity;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  .indicator.active {
    color: var(--fg-text, #000);
    opacity: 1;
  }

  .bridge {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 16px; /* Don't grow, don't shrink, fixed width */
    height: 1px;
    background-color: rgb(var(--color-bdr-muted));
    transition-property: flex-basis, background-color;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  .bridge.active {
    flex: 1 0 auto; /* Grow to fill available space */
    background-color: rgb(var(--color-bdr-primary));
  }

  .indicator.animated,
  .bridge.animated {
    transition-property: all;
    transition-duration: 0.3s;
    transition-timing-function: ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .indicator, .bridge {
      transition: none;
    }
  }

  .bracket-left, .bracket-right, .step-number {
    font-family: var(--font-family-alt);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-weight: 400;
  }

  .step-number {
    padding: 0 0.2rem;
  }
</style>






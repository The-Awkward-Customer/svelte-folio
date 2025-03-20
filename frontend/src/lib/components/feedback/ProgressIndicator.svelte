<!-- ProgressIndicator.svelte -->

<!-- requirements -->

<script>
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

  onMount(() => {
    if (browser) {
      prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      mounted = true;
    }
  });
</script>

<div
  class="progress-container"
  role="progressbar"
  aria-label="Portfolio section progress"
  aria-valuemin="1"
  aria-valuemax={totalSteps}
  aria-valuenow={activeStep}
>
  {#each Array(totalSteps) as _, index}
    {@const stepNumber = index + 1}
    {#if index > 0}
      <div   class="bridge"
      class:active={stepNumber <= activeStep}
      class:animated={mounted && !prefersReducedMotion}>
    </div>
    {/if}
    <div 
      class="indicator"
      class:active={stepNumber <= activeStep}
      class:animated={mounted && !prefersReducedMotion}
    >
      <span class="bracket-left">[</span>
      <span class="step-number">{stepNumber}</span>
      <span class="bracket-right">]</span>
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
    justify-content: center;
    gap: 0;
    width: 100%;
  }

  .indicator {
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    color: var(--fg-text-muted, #666);
    opacity: 0.5;
    font-size: var(--fs-300);
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  .indicator.active {
    color: var(--fg-text, #000);
    opacity: 1;
  }

  .bridge {
    display: -webkit-flex;
    display: flex;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-flex: 1 0 0;
    flex: 1 0 0;
    position: relative;
    height: 2px;
    background-color: var(--color-bdr-muted);
  }

  .bridge.active {
    background-color: var(--color-bdr-primary);
  }

  .indicator.animated {
    -webkit-transition: color 0.3s ease, opacity 0.3s ease;
    transition: color 0.3s ease, opacity 0.3s ease;
  }

  .bridge.animated {
    -webkit-transition: background-color 0.3s ease, opacity 0.3s ease;
    transition: background-color 0.3s ease, opacity 0.3s ease;
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






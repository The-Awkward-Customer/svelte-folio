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
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0;
    width: 100%;
    height: 200px
  }

  .indicator {
    display: flex;
    align-items: center;
    color: var(--fg-text-muted, #666);
    opacity: 0.5;
    font-family: var(--font-family-alt);
    font-size: var(--fs-);
  }

  .indicator.active {
    color: var(--fg-text, #000);
    opacity: 1;
  }

  .bridge {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1 0 0;
    position: relative;
    height: 2px;
    background-color: var(--color-bdr-muted);
  }

  .bridge.active {
    background-color: var(--color-bdr-primary);
    opacity: 1;
  }

  .indicator.animated {
    transition: color 0.3s ease, opacity 0.3s ease;
  }

  .bridge.animated {
    transition: background-color 0.3s ease, opacity 0.3s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .indicator, .bridge {
      transition: none;
    }
  }

  .bracket-left, .bracket-right {
    font-family: var(--font-family-alt);
  }

  .step-number {
    margin: 0 0.2rem;
  }
</style>






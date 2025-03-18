<!-- SimpleContentSection.svelte -->


<script lang="ts">
  interface Props {
    title: string;
    paragraph: string;
    activeStep: number;
  }

  export let title: Props['title'];
  export let paragraph: Props['paragraph'];
  export let activeStep: Props['activeStep'];

  const totalSteps = 3;
</script>

<section class="section-root">
  <div class="content-container">
    <!-- Progress Indicator -->
    <div class="progress-indicator">
      {#each Array(totalSteps) as _, i}
        {#if i > 0}
          <div class="bridge">
            <div class="bridge-line" class:active={i < activeStep}></div>
          </div>
        {/if}
        <div class="indicator" class:active={i + 1 <= activeStep}>
          <span class="bracket-left">[</span>
          <span class="number">{i + 1}</span>
          <span class="bracket-right">]</span>
        </div>
      {/each}
    </div>

    <h2>{title}</h2>
    <p>{paragraph}</p>
  </div>

  <!-- Slot for child content -->
  <slot />
</section>

<style>
  .section-root {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
    width: 100%;
    max-width: 767px;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 16px;
    gap: 20px;
    width: 100%;
  }

  .progress-indicator {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2px;
    width: 100%;
    height: 18px;
  }

  .indicator {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2px;
    height: 18px;
    font-family: 'Geist Mono';
    font-size: 16px;
    line-height: 110%;
    color: #70717D;
    opacity: 0.5;
  }

  .indicator.active {
    color: #26272D;
    opacity: 1;
  }

  .bridge {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .bridge-line {
    width: 100%;
    height: 1px;
    background: #70717D;
    opacity: 0.5;
  }

  .bridge-line.active {
    background: #26272D;
    opacity: 1;
  }

  h2 {
    font-family: 'Geist';
    font-weight: 500;
    font-size: 20px;
    line-height: 120%;
    color: #26272D;
    width: 100%;
  }

  p {
    font-family: 'Geist';
    font-weight: 400;
    font-size: 16px;
    line-height: 120%;
    color: #26272D;
    width: 100%;
  }

  @media (min-width: 768px) {
    .section-root {
      max-width: none;
    }
  }
</style>

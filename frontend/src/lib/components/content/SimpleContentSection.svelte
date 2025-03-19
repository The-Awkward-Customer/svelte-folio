<!-- SimpleContentSection.svelte -->


<script lang="ts">
  import ProgressIndicator from '$lib/components/feedback/ProgressIndicator.svelte';

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
    <ProgressIndicator {activeStep} {totalSteps} />
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
    max-width: none;
    background-color: rgb(94, 180, 255);
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    box-sizing: border-box;
    padding: 0 16px;
  }

  h2 {
    font-family: var(--font-family-main);
    font-weight: 500;
    font-size: 20px;
    line-height: 120%;
    color: #26272D;

  }

  p {
    font-family: var(--font-family-main);
    font-weight: 400;
    font-size: 16px;
    line-height: 120%;
    color: #26272D;

  }

  @media (min-width: 896px) {
    .section-root {
      max-width: 767px;
    }
  }
</style>

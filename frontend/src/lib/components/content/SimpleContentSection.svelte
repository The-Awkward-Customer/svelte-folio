<!-- SimpleContentSection.svelte -->

<script lang="ts">
  interface Props {
    title: string;
    paragraph: string;
  }

  export let title: Props['title'];
  export let paragraph: Props['paragraph'];
</script>

<section class="section-root">
  <div class="content">
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
    gap: var(--spc-400);
    width: 100%;
    padding: var(--spc-500) 0;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--spc-200);
    padding: 0 16px;
    width: 100%;
  }

  h2 {
    font-family: var(--font-family-main);
    font-weight: 500;
    font-size: 20px;
    line-height: 120%;
    color: #26272D;
    margin: 0;
  }

  p {
    font-family: var(--font-family-main);
    font-weight: 400;
    font-size: 16px;
    line-height: 120%;
    color: #26272D;
    margin: 0;
  }

  @media (min-width: 896px) {
    .section-root {
      max-width: 767px;
    }
  }
</style>

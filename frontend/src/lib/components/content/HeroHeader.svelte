<!-- HeroHeader.svelte -->

<script lang="ts">
  // Props for customizable text content
  export let sideNote = "Available for new projects and collaborations.";
  export let mainTitle = "PETER ABBOTT. PRODUCT DESIGNER";
  export let description = "Hello, welcome to the grey area. Here you will find a collection of my work and thoughts gathered from over a decade of experience working as a product designer.";
  export let subDescription = "Most recently I built and led the Design System team at Fresha, a platform for booking and managing beauty and wellness appointments. I've also worked for a range of other companies, including Shell, Suzuki and more…";

  import SideNote from './SideNote.svelte';
</script>

<section class="hero-header">
  <div class="content">

    
    <h1>{mainTitle}</h1>

    <div class="description">
      <p class="main-description">{description}</p>
      <p class="sub-description">{subDescription}</p>
    </div>
    <SideNote text={sideNote} />
  </div>
</section>

<style>
  .hero-header {
    padding-top: var(--spc-800);
    padding-right: var(--spc-400);
    padding-bottom: var(--spc-800);
    padding-left: var(--spc-400);
    width: 100%;
    margin-top: -8px;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 100%;
  }

  h1 {
    font-family: var(--font-family-main);
    font-weight: 700;
    font-size: 32px;
    line-height: 110%;
    color: rgb(var(--color-txt-primary));
    margin: 0;
  }

  .description {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    font-family: var(--font-family-main);
    color: rgb(var(--color-txt-secondary));
    font-weight: var(--fw-medium);
  }

  .main-description,
  .sub-description {
    font-size: var(--fs-400);
    line-height: 130%;
    margin: 0;
  }

  .sub-description {
    color: rgb(var(--color-txt-primary));
  }

  /* Desktop styles */
  @media (min-width: 896px) {
    .hero-header {
      padding-top: 20vh ;
    padding-right: var(--spc-400);
    padding-bottom: var(--spc-800);
    padding-left: var(--spc-400);
    }

    h1 {
      font-size: 48px;
    }


  .main-description,
  .sub-description {
    font-size: var(--fs-400);
  }
  }
</style>

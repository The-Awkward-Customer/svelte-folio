<!-- HeroHeader.svelte -->

<script lang="ts">
  // Props for customizable text content
  export let sideNote = "These case studies have been recorded for easy viewing.";
  export let mainTitle = "the";
  export let description = "I work closely startups and established organisations to deliver high impact, high return products.";
  export let subDescription = "I do this exactly in three ways.";
</script>

<section class="hero-header">
  <div class="hero-content">
    <div class="content-wrapper">
      <div class="page-details">
        <div class="side-note">
          <p>{sideNote}</p>
        </div>
      </div>

      <div class="title-section">
        <div class="title-wrapper">
          <h1>{mainTitle}</h1>
        </div>
      </div>

      <div class="description-section">
        <p class="main-description">{description}</p>
        <p class="sub-description">{subDescription}</p>
      </div>
    </div>
  </div>
</section>

<style>
  /* Mobile-first base styles */
  .hero-header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 32px 24px 64px;
    gap: 24px;
    width: 767px;
    min-width: 360px;
    max-width: 767px;
    height: 403px;
    flex: 1 0 auto;
  }

  .hero-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    gap: 28px;
    width: 719px;
    max-width: 767px;
    height: 307px;
    flex: 1 0 auto;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    gap: 32px;
    width: 719px;
    height: 307px;
    flex: 1 0 auto;
  }

  .page-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0;
    width: 719px;
    height: 42px;
    align-self: stretch;
  }

  .side-note {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0 8px;
    width: 128px;
    max-width: 128px;
    height: 42px;
    border-right: 1px solid #989CB8;
    align-self: stretch;
  }

  .side-note p {
    width: 112px;
    height: 42px;
    font-family: 'Geist', sans-serif;
    font-size: 12px;
    line-height: 120%;
    text-align: right;
    color: #70717D;
    margin: 0;
  }

  .title-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    width: 719px;
    height: 105px;
    align-self: stretch;
  }

  .title-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    gap: 8px;
    width: 719px;
    height: 105px;
    align-self: stretch;
  }

  h1 {
    width: 719px;
    height: 105px;
    font-family: 'Geist', sans-serif;
    font-weight: 700;
    font-size: 32px;
    line-height: 110%;
    color: #26272D;
    margin: 0;
    flex-grow: 1;
  }

  .description-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    gap: 20px;
    width: 372px;
    max-width: 372px;
    height: 96px;
    align-self: stretch;
  }

  .main-description {
    width: 372px;
    height: 57px;
    font-family: 'Geist', sans-serif;
    font-size: 16px;
    line-height: 120%;
    color: #26272D;
    margin: 0;
  }

  .sub-description {
    width: 372px;
    height: 19px;
    font-family: 'Geist', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 120%;
    color: #26272D;
    margin: 0;
  }

  /* Desktop styles (min-width: 768px) */
  @media (min-width: 768px) {
    .hero-header {
      padding: 40px 0;
      width: 568px;
      max-width: 568px;
      height: 437px;
    }

    .hero-content {
      padding: 0 20px;
      width: 568px;
      max-width: 568px;
      height: 357px;
    }

    .content-wrapper {
      gap: 24px;
      width: 528px;
      height: 357px;
    }

    .page-details {
      width: 528px;
    }

    .title-section {
      width: 528px;
      height: 159px;
    }

    .title-wrapper {
      width: 528px;
      height: 159px;
    }

    h1 {
      width: 528px;
      height: 159px;
      font-size: 48px;
    }

    .description-section {
      gap: 32px;
      height: 108px;
    }
  }
</style>

<!-- HeroHeader.svelte -->

<script lang="ts">
  // Props for customizable text content
  export let sideNote = "These case studies have been recorded for easy viewing.";
  export let mainTitle = "PETER ABBOTT";
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
    width: 100%;
    max-width: 100%;
    height: 403px;
    flex: 1 0 auto;
  }

  .hero-content {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    gap: 28px;
    width: 100%;
    max-width: 100%;
    height: 307px;
    flex: 1 0 auto;
  }

  .content-wrapper {
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0;
    gap: 32px;
    width: 100%;
    height: 307px;
    flex: 1 0 auto;
  }

  .page-details {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    height: 42px;
    align-self: stretch;
    text-align: right;
  }

  .side-note {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0 8px;
    width: 100%;
    height: 42px;
    border-right: 1px solid #989CB8;
    align-self: flex-end;
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
    height: 105px;
    align-self: stretch;
  }

  .title-wrapper {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    gap: 8px;
    height: 105px;
    align-self: stretch;
  }

  h1 {
    width: 100%;
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
    width: 100%;
    max-width: 372px;
    height: auto;
    min-height: 96px;
    align-self: stretch;
  }

  .main-description {
    width: 100%;
    max-width: 372px;
    height: auto;
    min-height: 57px;
    font-family: 'Geist', sans-serif;
    font-size: 16px;
    line-height: 120%;
    color: #26272D;
    margin: 0;
  }

  .sub-description {
    width: 100%;
    max-width: 372px;
    height: auto;
    min-height: 19px;
    font-family: 'Geist', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 120%;
    color: #26272D;
    margin: 0;
  }

  /* Desktop styles (min-width: 768px) */
  @media (min-width: 896px) {
    .hero-header {
      padding: 40px 24px;
      width: 100%;
    }

    .hero-content {
      width: 100%;
      max-width: 100%;
    }

    h1 {
      width: 528px;
      height: 159px;
      font-size: 48px;
    }

  }
</style>

<!-- HeroTitle.Svelte -->

<script lang=ts>


    let title: String = "Hero Title";
</script>

<h1 class="hero-title">Peter Abbott, <br> <span class="profession">Product Design.</span></h1>

<style>
    .hero-title {
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        font-family: var(--font-family-main);
        font-size: var(--fs-600);
        font-weight: 700;
        color: rgb(var(--color-txt-primary));
        width: 100%;
    }

    .profession {
        color: rgb(var(--color-txt-primary)); 
    }

    /* Desktop styles */
  @media (min-width: 896px) {
    .hero-title {
        font-size: var(--fs-800);
    }
  }
</style>

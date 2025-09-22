<script lang="ts">
  import { WidgetContainer } from "$lib/components/widgets";
</script>

<svelte:head>
  <title>Peter Abbott - Interactive Designer & Developer</title>
  <meta
    name="description"
    content="Interactive designer and frontend developer based in Madrid. Available for UI/UX design, development, and consulting projects in Q3 2025."
  />
</svelte:head>

<!-- <WidgetContainer /> -->

<section id="introduction" class="section section-introduction">
  <p>Introduction</p>
</section>

<section id="work" class="section section-work">
  <p>Work</p>
</section>

<section id="articles" class="section section-articles">
  <p>Articles</p>
</section>

<style>
  .section {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .section p {
    font-size: 2rem;
    font-weight: bold;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .section-introduction {
    background-color: #ff6b6b;
  }

  .section-work {
    background-color: #4ecdc4;
  }

  .section-articles {
    background-color: #45b7d1;
  }
</style>

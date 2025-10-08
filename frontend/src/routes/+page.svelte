<script lang="ts">
  import { WidgetContainer } from "$lib/components/widgets";
  import { Section } from "$lib/components/primitives";
  import { AnimatedTextPath } from "$lib/components/graphics";
</script>

<svelte:head>
  <title>Peter Abbott - Interactive Designer & Developer</title>
  <meta
    name="description"
    content="Interactive designer and frontend developer based in Madrid. Available for UI/UX design, development, and consulting projects in Q3 2025."
  />
</svelte:head>

{#snippet CardHeader(title: string)}
  <div class="card-header_root">
    <h3 class="headline-display">
      {title}
    </h3>
    <span class="card-header_graphic"></span>
  </div>
{/snippet}

<Section id="introduction">
  {#snippet main()}
    <p>Introduction</p>
  {/snippet}
</Section>

<Section id="work">
  {#snippet main()}
    <p>work</p>
  {/snippet}
</Section>

<Section id="articles">
  {#snippet main()}
    <p>Articles</p>
  {/snippet}
</Section>

<style>
  .card-header_root {
    display: flex;
    position: relative;
    width: 100%;

    padding: var(--padding-xl) var(--padding-xl);

    color: var(--fg-primary-default);
  }

  .card-header_graphic {
    display: block;
    position: absolute;
    top: -50px;
    right: 10%;
    width: 100px;
    height: 100px;
    background-color: rgba(137, 43, 226, 0.21);
  }
</style>

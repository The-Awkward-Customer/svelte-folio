<script lang="ts">
  import type { GridArea } from './Section.svelte';

  interface ImageProps {
    src: string;
    alt: string;
    aspectRatio?: string;
    gridArea?: GridArea;
  }

  let {
    src,
    alt,
    aspectRatio = '16/9',
    gridArea = 'body',
  }: ImageProps = $props();
</script>

<!-- Dialog Image component -->

<div
  class="image-container"
  style:aspect-ratio={aspectRatio}
  style:--grid-area={gridArea}
>
  <img {src} {alt} />
</div>

<style>
  .image-container {
    grid-area: var(--grid-area);
    overflow: hidden;
    width: 100%;
    background-color: rgba(
      255,
      192,
      203,
      0.1
    ); /* Pink background for debugging */
    border: 1px solid rgba(255, 192, 203, 0.3);
  }

  .image-container img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--bdr-radius-medium);
    object-fit: cover;
  }
</style>

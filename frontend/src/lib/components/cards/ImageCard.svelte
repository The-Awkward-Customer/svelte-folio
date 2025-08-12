<script lang="ts">
  interface Props {
    src?: string;
    alt?: string;
    tag?: string;
  }

  let { src, alt, tag = 'example' }: Props = $props();
</script>

<div class="image-card">
  <img class="cover-image" {src} {alt} />
</div>

<style>
  .image-card {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: block;
  }

  .cover-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-width: 100%;
    min-height: 100%;
    display: block;
  }
</style>

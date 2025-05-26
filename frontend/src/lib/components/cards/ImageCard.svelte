<script lang="ts">
  interface Props {
    src: string;
    alt: string;
    title?: string;
  }
  
  let { src, alt, title }: Props = $props();
</script>

<div class="image-card">
  <img {src} {alt} />
  {#if title}
    <div class="overlay">
      <h3>{title}</h3>
    </div>
  {/if}
</div>

<style>
  .image-card {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: #f0f0f0;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.7));
    padding: 1rem;
    color: white;
  }
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
  }
</style>
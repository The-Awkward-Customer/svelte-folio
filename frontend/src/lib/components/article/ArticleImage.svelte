<script lang="ts">
  interface Props {
    src?: string;
    alt?: string;
    caption?: string;
    width?: "full" | "half";
    alignment?: "left" | "right" | "center";
  }

  let {
    src = "",
    alt = "",
    caption = "",
    width = "full",
    alignment = "center",
  }: Props = $props();
</script>

ad
<figure
  class="article-image-root article-image-root--{width}-width article-image-root--align-{alignment}"
>
  {#if src}
    <img {src} {alt} loading="lazy" />
  {:else}
    <div class="article-image-placeholder">
      <span>Image Placeholder</span>
      <small>{width} width, {alignment} aligned</small>
    </div>
  {/if}

  {#if caption}
    <figcaption class="article-image-caption text-caption">
      {caption}
    </figcaption>
  {/if}
</figure>

<style>
  .article-image-root {
    margin: 2rem 0;
    position: relative;
  }

  .article-image-root--full-width {
    width: 100%;
  }

  .article-image-root--half-width {
    width: 50%;
  }

  .article-image-root--align-left {
    text-align: left;
    margin-right: auto;
  }

  .article-image-root--align-right {
    text-align: right;
    margin-left: auto;
  }

  .article-image-root--align-center {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }

  img {
    width: 100%;
    height: auto;
    border-radius: var(--border-radius-sm);
    aspect-ratio: 16 / 9;
    object-fit: cover;
  }

  .article-image-placeholder {
    background: rgba(255, 0, 234, 0.07);
    background-size: 20px 20px;
    background-position:
      0 0,
      0 10px,
      10px -10px,
      -10px 0px;
    border: 0.5px dashed #f700ff;
    border-radius: 8px;
    padding: 3rem 2rem;
    text-align: center;
    color: #666;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    aspect-ratio: 16 / 9;
  }

  .article-image-placeholder span {
    font-size: 1.125rem;
    font-weight: 500;
  }

  .article-image-placeholder small {
    font-size: 0.875rem;
    opacity: 0.7;
  }

  .article-image-caption {
    margin-top: 0.75rem;
    color: var(--fg-primary-muted);
    text-align: center;
    padding: 0 1rem;
  }
</style>

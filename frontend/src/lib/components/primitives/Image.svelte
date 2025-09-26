<script lang="ts">
  interface Props {
    src?: string;
    alt: string;
    class?: string;
    width?: number;
    height?: number;
    loading?: "eager" | "lazy";
    objectFit?: "cover" | "contain" | "fill" | "scale-down" | "none";
    borderRadius?: "none" | "sm" | "md" | "lg" | "pill";
    placeholder?: boolean;
    placeholderText?: string;
    placeholderSubtext?: string;
  }

  let {
    src,
    alt,
    class: className = "",
    width,
    height,
    loading = "lazy",
    objectFit = "cover",
    borderRadius = "none",
    placeholder = false,
    placeholderText = "Image Placeholder",
    placeholderSubtext = "",
  }: Props = $props();

  const borderRadiusClass = $derived(() => {
    switch (borderRadius) {
      case "sm":
        return "image--radius-sm";
      case "md":
        return "image--radius-md";
      case "lg":
        return "image--radius-lg";
      case "pill":
        return "image--radius-pill";
      default:
        return "";
    }
  });

  const objectFitClass = $derived(() => {
    switch (objectFit) {
      case "contain":
        return "image--contain";
      case "fill":
        return "image--fill";
      case "scale-down":
        return "image--scale-down";
      case "none":
        return "image--none";
      default:
        return "image--cover";
    }
  });

  const classes = $derived(
    ["image", borderRadiusClass(), objectFitClass(), className]
      .filter(Boolean)
      .join(" "),
  );
</script>

{#if src && !placeholder}
  <img
    {src}
    {alt}
    {width}
    {height}
    {loading}
    class={classes}
  />
{:else}
  <div class="image-placeholder {borderRadiusClass()} {className}">
    <span class="image-placeholder__text">{placeholderText}</span>
    {#if placeholderSubtext}
      <small class="image-placeholder__subtext">{placeholderSubtext}</small>
    {/if}
  </div>
{/if}

<style>
  .image {
    display: block;
    max-width: 100%;
    height: auto;
  }

  /* Object fit variants */
  .image--cover {
    object-fit: cover;
  }

  .image--contain {
    object-fit: contain;
  }

  .image--fill {
    object-fit: fill;
  }

  .image--scale-down {
    object-fit: scale-down;
  }

  .image--none {
    object-fit: none;
  }

  /* Border radius variants */
  .image--radius-sm {
    border-radius: var(--border-radius-sm);
  }

  .image--radius-md {
    border-radius: var(--border-radius-md);
  }

  .image--radius-lg {
    border-radius: var(--border-radius-lg);
  }

  .image--radius-pill {
    border-radius: var(--border-radius-pill);
  }

  /* Placeholder styles */
  .image-placeholder {
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
    max-width: 100%;
    height: auto;
  }

  .image-placeholder__text {
    font-size: 1.125rem;
    font-weight: 500;
  }

  .image-placeholder__subtext {
    font-size: 0.875rem;
    opacity: 0.7;
  }
</style>
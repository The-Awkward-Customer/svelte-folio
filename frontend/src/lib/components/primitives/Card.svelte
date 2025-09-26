<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    alignment?: "left" | "center" | "right";
    children?: Snippet;
  }

  let { alignment = "left", children }: Props = $props();

  const alignmentClass = $derived(() => {
    switch (alignment) {
      case "center":
        return "card--center";
      case "right":
        return "card--right";
      default:
        return "card--left";
    }
  });

  const classes = $derived(
    ["card", alignmentClass()].filter(Boolean).join(" "),
  );
</script>

<div class={classes}>
  {@render children?.()}
</div>

<style>
  .card {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius-lg);
    background-color: var(--surface-neutral-reading);
  }

  .card--left {
    align-items: flex-start;
  }

  .card--center {
    align-items: center;
  }

  .card--right {
    align-items: flex-end;
  }
</style>

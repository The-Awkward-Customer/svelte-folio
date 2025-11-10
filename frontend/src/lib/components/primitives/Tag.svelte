<script lang="ts">
  interface Props {
    label: string;
    variant?: "primary" | "inverse";
  }

  let { label, variant = "primary" }: Props = $props();
</script>

<span class="tag tag--{variant}">
  {label}
</span>

<style>
  .tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--padding-xs) var(--padding-md);
    font-size: var(--text-sm);
    font-weight: var(--font-weight-semibold);
    font-family: var(--font-family-main);
    border-radius: var(--border-radius-pill);
    white-space: nowrap;
  }

  .tag--primary {
    background-color: transparent;
    color: var(--fg-text-primary);
    box-shadow: 0 0 0 1px currentColor;
  }

  .tag--inverse {
    background-color: transparent;
    color: var(--fg-text-inverse);
    box-shadow: 0 0 0 1px currentColor;
  }
</style>

<script lang="ts">
  interface Props {
    label: string;
    variant?: 'primary' | 'inverse';
  }

  let { label, variant = 'primary' }: Props = $props();
</script>

<span class="tag tag--{variant}">
  {label}
</span>

<style>
  .tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-xs) var(--space-md);
    font-size: var(--fs-350);
    font-weight: var(--fw-semibold);
    border-radius: var(--bdr-radius-pill);
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

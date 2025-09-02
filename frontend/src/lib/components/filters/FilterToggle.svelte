<script lang="ts">
  interface Props {
    label: string;
    active: boolean;
    onclick: () => void;
  }

  let { label, active, onclick }: Props = $props();
</script>

<button class="filter-toggle text-button-sm" class:active {onclick}>
  {label}
</button>

<style>
  .filter-toggle {
    display: inline-flex;
    align-items: center;
    height: var(--size-touch-utility);
    padding: var(--padding-none) var(--padding-small-relaxed);
    font-weight: var(--fw-semibold);
    border-radius: var(--border-radius-pill);
    border: none;
    background-color: var(--bg-ghost-default);
    color: var(--fg-text-primary);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .filter-toggle:hover {
    background-color: var(--bg-ghost-hover);
  }

  .filter-toggle.active {
    background-color: var(--bg-primary-default);
    color: var(--fg-text-inverse);
  }

  .filter-toggle.active:hover {
    background-color: var(--bg-primary-hover);
  }
</style>

<script lang="ts">
  interface Props {
    label: string;
    active: boolean;
    onclick: () => void;
  }

  let { label, active, onclick }: Props = $props();
</script>

<button class="filter-toggle" class:active {onclick}>
  {label}
</button>

<style>
  .filter-toggle {
    display: inline-flex;
    align-items: center;
    padding: 6px 10px;
    font-weight: var(--fw-semibold);
    border-radius: var(--bdr-radius-small);
    border: none;
    box-shadow: inset 0 0px 0px 1px var(--bg-primary);
    background-color: var(--bg-pae);
    color: var(--fg-text-primary);
    cursor: pointer;
    white-space: nowrap;
    user-select: none;
    font-family: var(--font-family-main);
    font-size: var(--fs-350);
    text-transform: capitalize;
    transition: all 0.2s ease-in-out;
  }

  .filter-toggle:hover {
    box-shadow: inset 0 0px 0px 2px var(--bg-primary);
  }

  .filter-toggle.active {
    box-shadow: inset 0 0px 0px 4px var(--bg-primary);
    background-color: var(--bg-primary);
    color: var(--fg-text-inverse);
  }

  .filter-toggle.active:hover {
    box-shadow: inset 0 0px 0px 2px var(--bg-primary);
  }
</style>

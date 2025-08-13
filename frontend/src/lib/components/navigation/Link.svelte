<!-- Link component -->

<script lang="ts">
  export let href: string;
  export let active: boolean = false;
  export let disabled: boolean = false;

  // Ensure href always starts with "/"
  $: normalizedHref = href.startsWith('/') ? href : `/${href}`;
</script>

<a
  href={normalizedHref}
  class="link"
  class:primary={active}
  class:secondary={!active}
  class:disabled
  on:click={disabled ? (e) => e.preventDefault() : undefined}
>
  <slot />
</a>

<style>
  .link {
    display: inline-flex;
    padding: 0.5rem 1rem;
    text-decoration: none;
    border-radius: 0.25rem;
    transition: all 0.2s ease-in-out;
  }

  .primary {
    background-color: var(--primary-color, #3b82f6);
    color: white;
  }

  .primary:hover:not(.disabled) {
    background-color: var(--primary-hover-color, #2563eb);
  }

  .secondary {
    background-color: transparent;
    color: var(--text-color, #374151);
  }

  .secondary:hover:not(.disabled) {
    background-color: var(--secondary-hover-color, #f3f4f6);
  }

  .disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .link:active:not(.disabled) {
    transform: scale(0.98);
  }
</style>

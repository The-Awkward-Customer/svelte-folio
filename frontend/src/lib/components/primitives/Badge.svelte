<script lang="ts">
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { bounceOut } from "svelte/easing";

  interface Props {
    pulse?: boolean;
    class?: string;
  }

  let { pulse = false, class: className = "" }: Props = $props();
  let mounted = $state(false);

  const classes = $derived(
    ["badge", pulse && "badge--pulse", className].filter(Boolean).join(" "),
  );

  onMount(() => {
    setTimeout(() => {
      mounted = true;
    }, 1000);
  });
</script>

{#if mounted}
  <span
    class={classes}
    role="status"
    aria-label="Status badge"
    in:scale={{ duration: 800, start: 0, easing: bounceOut }}
  ></span>
{/if}

<style>
  .badge {
    position: absolute;
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: var(--border-radius-pill);
    border: 2px solid var(--surface-neutral-reading);
    background-color: var(--fg-text-danger);
    top: 0px;
    right: 0px;
  }

  /* Pulse animation */
  .badge--pulse {
    animation: scale 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes scale {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .badge--pulse {
      animation: none;
    }
  }
</style>

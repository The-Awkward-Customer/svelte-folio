<script lang="ts">
  let { label = 'Click me', onClick = () => {} } = $props();
  let clicked = $state(0);

  function handleClick() {
    onClick();
    clicked++;
  }
</script>

<button
  class="gem-button"
  style="background-color: rgba(255, 192, 203, 0.5);"
  onclick={handleClick}
>
  {label}
  {clicked}
</button>

<style>
  .gem-button {
    /* mobile-first styles */
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    border: none;
    background-color: rgba(135, 206, 250, 0.5); /* Light blue with opacity */
    color: white;
    cursor: pointer;
    font-size: 1rem;
  }

  @media (min-width: 896px) {
    .gem-button {
      font-size: 1.25rem;
      padding: 0.75rem 1.5rem;
    }
  }
</style>

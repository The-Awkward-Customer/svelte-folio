<script lang="ts">
  import Anim_me from "$lib/assets/Ani_me.png";
  import { Badge } from "$lib/components/primitives";

  interface ChatTriggerProps {
    handleClick?: () => void;
    onMouseEnter?: () => void;
    shouldShowIndicator?: boolean;
  }

  let {
    handleClick = defaultClickHandler,
    onMouseEnter = handleMouseEnter,
    shouldShowIndicator = true,
  }: ChatTriggerProps = $props();

  // Default handler if none provided
  function defaultClickHandler() {
    console.log("Chat trigger clicked - no handler provided");
  }

  function handleMouseEnter() {
    console.log("Mouse entered chat trigger");
  }
</script>

<button
  class="chat-trigger"
  onclick={handleClick}
  aria-label="Chat with Peter Abbott"
  onmouseenter={onMouseEnter}
>
  <img src={Anim_me} alt="Peter Abbott" class="profile-image" />
  {#if shouldShowIndicator}
    <Badge class="chat-indicator" pulse />
  {/if}
</button>

<style>
  .chat-trigger {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 62px;
    height: 62px;
    background-color: var(--bg-page);
    border: none;
    border-radius: var(--border-radius-pill);
    cursor: pointer;
    padding: 4px;
    box-shadow: inset 0 0 0 1px var(--fg-text-primary);
    container-type: inline-size;
  }

  .profile-image {
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius-pill);
    object-fit: cover;
  }
</style>

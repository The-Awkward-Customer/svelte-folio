<!-- ScrambledText.svelte -->
<script lang="ts">
  export let text = 'This is placeholder text';
  let displayedText = '';

  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  function scrambleText() {
    const finalText = text;
    const iterations = 4; // Number of cycles before settling
    let currentIteration = 0;

    const interval = setInterval(() => {
      if (currentIteration >= iterations) {
        displayedText = finalText;
        clearInterval(interval);
        return;
      }

      let newText = '';
      for (let i = 0; i < finalText.length; i++) {
        if (finalText[i] === ' ') {
          newText += ' ';
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      displayedText = newText;
      currentIteration++;
    }, 64); // Update every 64ms
  }

  import { onMount } from 'svelte';
  onMount(() => {
    scrambleText();
  });
</script>

<div class="side-note">
  <p>{displayedText}</p>
</div>

<style>
  .side-note {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    align-self: flex-start;
  }

  .side-note p {
    width: 200px;
    font-family: var(--font-family-alt);
    font-size: 12px;
    line-height: 120%;
    text-align: left;
    padding-left: var(--spc-100);
    color: #70717d;
    border-left: 1px solid #989cb8;
  }
</style>

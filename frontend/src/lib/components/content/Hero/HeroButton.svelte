<!-- HeroButton.svelte -->

<script lang="ts">
        interface ButtonProps {
        onClick?: () => void;
        label?: string;
    }
    export let onClick: ButtonProps['onClick'] = () => {};
    export let label: string = "Placeholder Button Text";
</script>
  
<div class="hero-button-root">
    <p class="hero-button-label">{label}</p>
<button 
    on:click={onClick}
    class="hero-button"
    aria-label={label}
></button>
</div>
  
<style>
    .hero-button-root {
        position: relative;
        display: inline-block;
        vertical-align: baseline;
    }

    .hero-button-label {
        position: relative;
        z-index: 2;
        margin: 0;
        padding: 2px 0;
        color: rgb(var(--color-txt-primary));
        pointer-events: none; /* Allow clicks to pass through to button */
    }

   .hero-button {
    position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgb(var(--color-bg-inverse) / var(--opacity-invisible));
        border: none;
        border-radius: var(--bdr-radius-tiny);
        padding: 0;
        z-index: 1;
        /* Add horizontal padding */
        box-sizing: border-box;
        margin: 0 -4px;
        width: calc(100% + 8px);
   }

   .hero-button:hover { 
    background-color: rgb(var(--color-bg-inverse) / var(--opacity-hover));
   }

   .hero-button:active { 
    background-color: rgb(var(--color-bg-inverse) / var(--opacity-active));
   }
</style>
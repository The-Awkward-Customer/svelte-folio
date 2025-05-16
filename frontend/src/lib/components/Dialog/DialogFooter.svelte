<!-- DialogHeader.svelte -->

<script lang="ts">
import { dialogManager } from '$lib/stores/dialogManager';

interface DialogFooterProps{
    label?: string
}

let { label="Click me"} : DialogFooterProps = $props(); 

function closeDialog() {
        console.log("closed Dialog")
        dialogManager.closeDialog();
    }

</script>

<div class="footer-section-root">
         <button type="button" onclick={closeDialog}>{label}</button>
</div>


<style>

    .footer-section-root{
        display: flex;
    width: 100%;
    justify-content: center;
    align-content: center;
    background-color: aqua;
    grid-area:  trailing ;
    }

    button{
        width: 100%;
        font-family:var(--font-family-main);
        font-size: 24px;
        padding-top: var(--spc-300);
        padding-bottom: var(--spc-300);
        color: white;
        background-color: rgb(var(--color-bg-inverse));
        border-radius:var(--bdr-radius-medium);
        border: none;
    }

</style>


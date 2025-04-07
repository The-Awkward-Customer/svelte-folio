<!-- DialogHeader.svelte -->

<script lang="ts">

    import { dialogManager } from '$lib/stores/dialogManager';
    import Button from '$lib/components/actions/Button.svelte';

    interface $$Props {
        title: string;
    }

    function closeDialog() {
        dialogManager.closeDialog();
    }

    export let title: $$Props['title'] = 'Dialog Title';

</script>

<div class="dialog-header">
    <h2 class="dialog-title">{title}</h2>
    <p class="dialog-read-time"> 2mins read</p>
    <Button variant="primary" on:click={closeDialog}>Close</Button>
</div>

<style>
    .dialog-header {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: 1fr;
        width: 100%;
        padding: var(--spc-800);
        justify-content: space-between;
        align-items: center;
        border-radius: var(--bdr-radius-large);
        background-color: rgb(var(--color-bg-inverse));
    }

    .dialog-title{
        display: flex;
        justify-content: flex-start;
        font-size: var(--fs-200);
        font-weight: var(--fw-super);
        width: 100%;
        color: rgb(var(--color-txt-inverse));
    }

    .dialog-read-time{
        display: flex;
        justify-content:center;
        font-size: var(--fs-200);
        color: rgb(var(--color-txt-inverse));
    }

</style>


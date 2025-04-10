<!-- DialogHeader.svelte -->

<script lang="ts">

    import { dialogManager } from '$lib/stores/dialogManager';
    import Button from '$lib/components/actions/Button.svelte';

    interface $$Props {
        focus: string;
    }

    function closeDialog() {
        dialogManager.closeDialog();
    }

    export let focus: $$Props['focus'] = 'Design Systems | Product Design | Team Leadership';

</script>

<div class="dialog-header">
    <h2 class="dialog-title">{focus}</h2>
    <Button variant="primary" on:click={closeDialog}>Close</Button>
</div>

<style>
    .dialog-header {
        display: grid;
        grid-template-columns: 1fr auto;
        grid-template-rows: 1fr;
        width: 100%;
        padding: var(--spc-1000);
        justify-content: space-between;
        align-items: center;
        border-radius: var(--bdr-radius-large);
    }

    .dialog-title{
        display: flex;
        justify-content: flex-start;
        font-size: var(--fs-200);
        font-weight: var(--fw-medium);
        width: 100%;
        color: rgb(var(--color-txt-muted));
    }

    @media (max-width: 768px) {
        .dialog-title{
            font-size: var(--fs-100);
        }
    }

</style>


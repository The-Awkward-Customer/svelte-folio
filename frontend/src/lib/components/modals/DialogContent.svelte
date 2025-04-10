<!-- DialogContent.svelte -->

<script lang="ts">
</script>


<div class="dialog-content">

    <h3 class="dialog-title">Fresha</h3>
    <p class="dialog-intro">In my time at Fresha I founded and lead a multidisciplinary team to designers and impliment a design system across web and iOS and Android platforms. </p>
</div>

<style>
    .dialog-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: var(--spc-800);
        width: 100%;
        height: fit-content;
        padding: var(--spc-1000);
        border-bottom: 1px solid rgb(var(--color-bdr-muted));
    }

    .dialog-title{
        display: flex;
        font-size: var(--fs-900);
        font-weight: var(--fw-bold);
        color: rgb(var(--color-txt-primary));
    }

    .dialog-intro{
        display: flex;
        font-weight: var(--fw-regular);
        color: rgb(var(--color-txt-primary));
        font-size: var(--fs-700);
    }
</style>

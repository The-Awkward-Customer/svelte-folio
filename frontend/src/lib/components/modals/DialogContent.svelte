<!-- DialogContent.svelte -->

<script lang="ts">
</script>


<div class="dialog-content">
    <h3 class="dialog-title">Fresha</h3>
    <p class="dialog-intro">In my time at Fresha I founded and led a multidisciplinary team to designers and impliment a design system across web and iOS and Android platforms. </p>
</div>

<style>
    .dialog-content {
        position: relative;
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: var(--spc-800);
        width: 100%;
        height: fit-content;
        padding-left: var(--spc-1000);
        padding-right: var(--spc-1000);
        padding-top: 224px;
        padding-bottom: var(--spc-1000);
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
        border-bottom: 1px solid rgb(var(--color-bdr-primary));
        padding-bottom: var(--spc-800);
    }
</style>

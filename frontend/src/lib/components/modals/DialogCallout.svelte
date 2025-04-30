<!-- DialogCallout.svelte -->

<script lang="ts">
</script>

<section class="dialog-callout-section">
    <div class="dialog-callout">
    <p class="dialog-callout-text">Some text explaining the corresponding image</p>
    </div>
</section>

<style>
    .dialog-callout-section {
        display: flex;
        justify-content: center;
        background-color:rgba(var(--color-dev-pink) / 0.5); 
        padding-top: var(--spc-400);
        padding-bottom: var(--spc-400);
        padding-left: var(--spc-400);
        padding-right: var(--spc-400);
    }

    .dialog-callout {
        display: flex;
        justify-content: center; 
        width: 100%;
        padding-top: var(--spc-1000);
        padding-bottom: var(--spc-1000);
        padding-left: var(--spc-1000);
        padding-right: var(--spc-1000);
        border-radius: var(--bdr-radius-medium);
        cursor:grab;
    }

    .dialog-callout-text {
        font-size: var(--fs-400);
        font-weight: var(--fw-regular);
        color: rgb(var(--color-txt-primary));
    }
</style>
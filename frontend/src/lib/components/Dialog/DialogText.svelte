<!-- DialogTextSection.svelte -->

<script lang="ts">


    interface DialogTextProps {
        title?: string;
        content?: string;
    }

    

    let {
        title = "Placeholder",
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    } : DialogTextProps = $props();

</script>

<section class="dialog-text-section">
    <div class="dialog-text-section-content">
        <h3 class="dialog-text-section-title">{title}</h3>
        <p class="dialog-text-section-text">{content}</p>
    </div>
</section>

<style>

    .dialog-text-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .dialog-text-section-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: var(--spc-400);
    }


    .dialog-text-section-title {
        display: flex;
        font-size: var(--fs-500);
        font-weight: var(--fw-semibold);
        color: rgb(var(--color-txt-primary));
    }


    .dialog-text-section-text {
        font-size: var(--fs-500);
        font-weight: var(--fw-regular);
        color: rgb(var(--color-txt-secondary));
        max-width: 47ch;
        line-height: 130%
    }
</style>
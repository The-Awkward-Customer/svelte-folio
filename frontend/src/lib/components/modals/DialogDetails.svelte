<!-- DialogDetails.svelte -->

<script lang="ts">

</script>

<div class="dialog-details">
<div class="dialog-details-item">
    <p class="dialog-details-label">Year</p>
    <p class="dialog-details-value">2020-2023</p>
</div>
<div class="dialog-details-item">
    <p class="dialog-details-label">Role</p>
    <p class="dialog-details-value">Lead Product Designer</p>
</div>
<div class="dialog-details-item">
    <p class="dialog-details-label">Contents</p>
    <ul class="dialog-details-list">
        <li class="dialog-details-list-item">Impact</li>
        <li class="dialog-details-list-item">Approach</li>
        <li class="dialog-details-list-item">Pixels</li>
        <li class="dialog-details-list-item">Learnings</li>
    </ul>
</div>
</div>

<style>
    .dialog-details {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        width: 100%;
        gap: var(--spc-1100);
        padding-left: var(--spc-1000);
        padding-right: var(--spc-1000);
        padding-top: var(--spc-1000);
    }

    .dialog-details-item {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: var(--spc-200);
    }

    .dialog-details-label {
        font-weight: var(--fw-bold);
        color: rgb(var(--color-txt-primary));

    }

    .dialog-details-value {
        font-size: var(--fs-500);
        font-weight: var(--fw-regular);
        color: rgb(var(--color-txt-primary));
    }

    .dialog-details-list {
        display: flex;
        flex-direction: column;
        gap: var(--spc-100);
        padding-left: 0;
        list-style: none;
        font-size: var(--fs-500);
    }

    .dialog-details-list-item {
        font-weight: var(--fw-regular);
        color: rgb(var(--color-txt-primary));
        position: relative;
        padding-left: var(--spc-400);
    }

    .dialog-details-list-item::before {
        content: "–";
        color: rgb(var(--color-txt-primary));
        position: absolute;
        left: 0;
    }
</style>
<!-- DialogSection.svelte -->

<script lang="ts">
</script>

<div class="dialog-section">
    <slot>
        <div class="dialog-section-item">
            <p>Hello</p>
        </div>
    </slot>
</div>

<style>
    .dialog-section {
        display: flex;
        width: 100%;
        height: 2000px;
        background-color: rgba(var(--color-dev-pink) / 0.1);
    }

    .dialog-section-item {
        display: flex;
    }
</style>
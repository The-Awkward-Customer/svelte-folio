<!-- DialogContent.svelte -->

<script lang="ts">
</script>


<div class="dialog-content">
    <slot></slot>
</div>

<style>
    .dialog-content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: rgba(55, 0, 255, 0.073);
    }
</style>

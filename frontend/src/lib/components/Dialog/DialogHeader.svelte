<!-- DialogHeader.svelte -->

<script lang="ts">
  import { dialogManager } from '$lib';
  import IconButton from '../actions/IconButton.svelte';

  function closeDialog() {
    dialogManager.closeDialog();
  }
</script>

<div class="dialog-header">
  <IconButton name="close" handleClick={closeDialog} />
</div>

<style>
  .dialog-header {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding-left: var(--spc-1000);
    padding-right: var(--spc-200);
    padding-bottom: var(--spc-200);
    padding-top: var(--spc-200);
    justify-content: flex-end;
    align-items: center;
  }
</style>

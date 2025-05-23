<script lang="ts">

import type { Snippet } from 'svelte';


interface TopNavProps{
    children? : Snippet
}

let { children }: TopNavProps = $props();


</script>

<nav>
    {@render children?.()}
</nav>

<style>
nav{
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    max-width: 1024px;
    padding-top: 12px;
    padding-bottom: 12px;
}

</style>
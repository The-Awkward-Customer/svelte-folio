<script lang="ts">
    export type VariantOptions = 'header' | 'subtitle' | 'image';

    interface DialogTitleProps {
        title?: string;
        subcopy?:string
    }


    let { title="TITLE", subcopy } : DialogTitleProps = $props();
</script>


<div>
<h1>{title}</h1>
{#if subcopy}
    <p>{subcopy}</p>
{/if}
</div>

<style>

h1{
    font-size: var(--fs-700);
    color:blue;
}

p{
    font-size: var(--fs-200);
}

</style>
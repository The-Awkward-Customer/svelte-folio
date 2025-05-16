<script lang="ts">
    export type VariantOptions = 'header' | 'subtitle' | 'image';

    interface DialogTitleProps {
        title?: string;
        subcopy?:string
    }


    let { title="TITLE", subcopy } : DialogTitleProps = $props();
</script>


<section>
<h1>{title}</h1>
{#if subcopy}
    <p>{subcopy}</p>
{/if}
</section>

<style>


h1{
    font-size: var(--fs-800);
    color: var(--color-bg-primary);
    padding-bottom: var(--spc-300);
    font-weight: var(--fw-bold);
}

p{
    font-size: var(--fs-600);
    line-height: 120%;
}

</style>
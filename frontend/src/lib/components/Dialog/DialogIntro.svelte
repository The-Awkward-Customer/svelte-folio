<script lang="ts">
    export type VariantOptions = 'header' | 'subtitle' | 'image';

    interface DialogTitleProps {
        introText?: string;
    }


    let { introText="TITLE" } : DialogTitleProps = $props();
</script>


<div class="dialog-intro-root">
 <p>{introText}<p>
</div>


<style>

.dialog-intro-root{
    grid-area: trailing;
}

p{
    font-size: var(--fs-700);
    font-weight: var(--fw-medium);
    line-height: 120%;
    padding-bottom: var(--spc-400) ;
}

</style>
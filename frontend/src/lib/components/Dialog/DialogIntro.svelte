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
    border-bottom: 1px black solid;
    grid-area: trailing;
}

p{
    font-size: 32px;
    font-weight: var(--fw-regular);
    line-height: 130%;
    padding-bottom: var(--spc-400) ;
}

</style>
<!-- DialogImageSection.svelte -->

<script lang="ts">
    import Image from '$lib/components/content/image.svelte';
    import placeholderImage from '$lib/assets/placeholder-image.jpg';
</script>

<div class="dialog-section">
     <p class="text">Some text explaining the corresponding image</p>
    <Image src={placeholderImage} alt="Random image" aspectRatio="16/9" />
</div>

<style>
    .dialog-section {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: var(--spc-800);
        width: 100%;
        height: auto;
        padding-left: var(--spc-1000);
        padding-right: var(--spc-1000);
        padding-top: var(--spc-800);
        padding-bottom: var(--spc-800);
    }
    

    .text {
        font-size: var(--fs-400);
        font-weight: var(--fw-regular);
        color: rgb(var(--color-txt-secondary));
    }
</style>
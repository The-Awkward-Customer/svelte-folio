<script lang="ts">
    export type VariantOptions = 'header' | 'subtitle' | 'image';

    interface DialogPrefixProps {
        variant?: VariantOptions;
        text?: string;
        src?: string;
        alt?: string;
        aspectRatio?: string;
    }


    let { variant = "header", text = "Replace me", src, alt, aspectRatio = "16/9"} : DialogPrefixProps = $props();
</script>

{#if variant === 'header'}
    <h2>{text}</h2>
{:else if variant === 'subtitle'}
    <h3>{text}</h3>
{:else if variant === 'image'}
    <div class="image-container">
        <img {src} {alt} style:aspect-ratio={aspectRatio} />
    </div>
{/if}


<style>

h2,h3,div{
    grid-area: leading;
}

h3{
    font-size: var(--fs-400);
    font-weight: var(--fw-medium);
    color: rgb(var(--color-fg-secondary));
}

.image-container {
		overflow: hidden; /* Ensure image doesn't overflow container */
        width: 80%;
	}

	.image-container img {
		display: block; /* Remove extra space below image */
		height: auto;
        border-radius: var(--bdr-radius-medium);
		object-fit: cover; /* Cover the container, cropping if necessary */
	}
</style>
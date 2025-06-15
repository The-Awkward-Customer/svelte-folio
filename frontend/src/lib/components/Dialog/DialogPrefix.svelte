<script lang="ts">
	export type VariantOptions = 'header' | 'subtitle' | 'image';

	interface DialogPrefixProps {
		variant?: VariantOptions;
		text?: string;
		src?: string;
		alt?: string;
		aspectRatio?: string;
	}

	let {
		variant = 'header',
		text = 'Replace me',
		src,
		alt,
		aspectRatio = '1/1'
	}: DialogPrefixProps = $props();
</script>

<div class="prefix-root">
	{#if variant === 'header'}
		<h2>{text}</h2>
	{:else if variant === 'subtitle'}
		<p>{text}</p>
	{:else if variant === 'image'}
		<div class="image-container">
			<img {src} {alt} style:aspect-ratio={aspectRatio} />
		</div>
	{/if}
</div>

<style>
	.prefix-root {
		grid-area: prefix;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		width: 100%;
		min-height: fit-content;
		flex-shrink: 0;
	}

	h2,
	h3,
	div {
		color: rgb(var(--fg-text-primary));
	}

	h2 {
		font-size: clamp(1.5rem, 4vw, 2.5rem);
		font-weight: var(--fw-bold, 700);
		text-align: start;
		flex-shrink: 0;
	}

	p {
		font-size: clamp(var(--fs-250), 3vw, var(--fs-400));
		font-weight: var(--fw-regular);
		text-align: start;
		line-height: 130%;
		flex-shrink: 0;
	}

	.image-container {
		overflow: hidden; /* Ensure image doesn't overflow container */
		width: 100%;
		max-width: 200px;
		aspect-ratio: 1 / 1; /* Enforce square container */
		flex-shrink: 0;
		flex-grow: 0; /* Prevent stretching */
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.image-container img {
		display: block; /* Remove extra space below image */
		width: 100%;
		height: 100%;
		border-radius: var(--bdr-radius-medium);
		object-fit: cover; /* Cover the container, cropping if necessary */
	}

	/* Hide image variant on devices smaller than 869px (mobile-first approach) */
	.prefix-root:has(.image-container) {
		display: none;
	}

	/* Show image variant on devices 869px and larger */
	@media (min-width: 869px) {
		.prefix-root:has(.image-container) {
			display: flex;
		}
	}
</style>

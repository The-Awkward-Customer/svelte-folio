<script lang="ts">
	// Interface for props
	interface ProjectFooterProps {
		FooterString?: string;
	}

	let placeholderText =
		'“Even though we achieved 900% sales growth validating product-market fit, we had an unsustainable business model in a crowded market space. Having identified macro and micro market inflection points we decided to extract our accrued capital and move on to the next venture.”';

	let { FooterString = placeholderText }: ProjectFooterProps = $props();
</script>

<p class="project-footer">{FooterString}</p>

<style>
	.project-footer {
		color: var(--fg-text-primary);
		font-size: var(--fs-large-clamped);
		font-weight: var(--fw-semibold);
		line-height: var(--lh-normal);
	}

	/* Debug styles - remove when done */
	/* .project-footer {
		box-shadow: 0 0 0 4px solid red !important;
		outline: 2px solid red !important;
	} */
</style>

<!-- Callout.svelte -->

<script lang="ts">
	let calloutText: String = 'Available';
</script>

<div class="callout-root">
	<div class="callout-Indicator"></div>
	<p class="callout-text">{calloutText}</p>
</div>

<style>
	.callout-root {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: var(--spc-75);
		padding-top: var(--spc-75);
		padding-bottom: var(--spc-75);
		padding-left: var(--spc-50);
	}

	.callout-text {
		font-family: var(--font-family-main);
		font-size: var(0--fs-tiny-clamped);
		font-weight: var(--fw-medium);
		color: rgb(var(--color-txt-muted));
	}

	.callout-Indicator {
		border-radius: var(--bdr-radius-pill);
		width: 12px;
		height: 12px;
		border: 1.5px solid rgb(var(--color-bdr-muted));
		box-shadow: inset 0 0 0 2px white;
		background-color: rgb(143, 239, 0);
	}
</style>

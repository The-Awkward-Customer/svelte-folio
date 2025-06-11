<script lang="ts">
	type TagColor = 'currentColor' | string;

	interface Props {
		label: string;
		beforeColor?: TagColor;
	}

	let { label, beforeColor = 'currentColor' }: Props = $props();
</script>

<span class="tag" style="--before-color: {beforeColor}">
	{label}
</span>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding-right: 2px;
		padding-top: 3px;
		padding-bottom: 4px;
		font-size: var(--fs-250);
		font-weight: var(--fw-semibold);
		text-transform: uppercase;
		background-color: rgba(0, 0, 0, 0);
		color: rgb(var(--fg-text-inverse));
		border-bottom: 1px solid rgba(0, 0, 0, 0.5);
		white-space: nowrap;
	}

	.tag::before {
		content: '';
		display: inline-block;
		width: 0.6em;
		height: 0.6em;
		background: var(--before-color, currentColor);
		border-radius: 2px;
		margin-right: 3px;
		vertical-align: middle;
	}
</style>

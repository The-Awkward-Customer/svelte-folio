<script lang="ts">
	type ColorType = 'primary' | 'inverse';

	interface Props {
		label: string;
		color?: ColorType;
	}

	let { label, color = 'primary' }: Props = $props();
</script>

<span class="tag-root tag-{color}">
	{label}
</span>

<style>
	.tag-root {
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
		white-space: nowrap;
	}

	.tag-root::before {
		content: '';
		display: inline-block;
		width: 0.6em;
		height: 0.6em;
		background: currentColor;
		border-radius: 2px;
		margin-right: 3px;
		vertical-align: middle;
	}

	/* Primary variant (default) */
	.tag-primary {
		color: rgb(var(--fg-text-primary));
		border-bottom: 1px solid rgb(var(--fg-text-primary));
	}

	/* Inverse variant */
	.tag-inverse {
		color: rgb(var(--fg-text-inverse));
		border-bottom: 1px solid rgb(var(--fg-text-inverse));
	}
</style>

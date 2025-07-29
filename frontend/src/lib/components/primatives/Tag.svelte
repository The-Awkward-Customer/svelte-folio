<script lang="ts">
	interface Props {
		label: string;
	}

	let { label }: Props = $props();
</script>

<span class="tag">
	{label}
</span>

<style>
	.tag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-sm) var(--space-md);
		font-size: var(--fs-275);
		font-weight: var(--fw-semibold);
		background-color: var(--bg-primary);
		color: var(--fg-text-inverse);
		border-radius: var(--bdr-radius-tiny);
		white-space: nowrap;
	}
</style>

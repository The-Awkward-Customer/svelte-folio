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
		display: inline-block;
		padding: 4px 8px;
		font-size: var(--fs-250);
		font-weight: var(--fw-semibold);
		text-transform: capitalize;
		border-radius: var(--bdr-radius-tiny);
		background-color: rgba(0, 0, 0, 1);
		border: 1px solid black;
		color: rgb(var(--fg-text-primary));
		border: 1px solid rgba(59, 130, 246, 0.2);
		white-space: nowrap;
	}
</style>

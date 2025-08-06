<script lang="ts">
	interface SubheaderProps {
		text: string;
		color?: 'primary' | 'inverse';
	}

	let { text, color = 'primary' }: SubheaderProps = $props();
</script>

<h2 class="subheader {color}">
	{text}
</h2>

<style>
	.subheader {
		font-family: var(--font-family-main);
		font-size: var(--fs-xlarge-clamped);
		font-weight: var(--fw-semibold);
	}

	.subheader.primary {
		color: var(--fg-text-primary);
	}

	.subheader.inverse {
		color: var(--fg-text-inverse);
	}
</style>

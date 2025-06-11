<script lang="ts">
	import type { handle } from '../../../hooks.server';

	// Props interface

	type buttonVariants = 'ghost' | 'strong';

	type buttonRole = 'button' | 'submit' | 'reset';

	interface ButtonProps {
		variant?: buttonVariants;
		type?: buttonRole;
		disabled?: boolean;
		// ariaLabel?: string; // Combine with label
		label: string;
		handleClick: () => void;
	}

	let { label = 'Replace me', variant = 'ghost', handleClick }: ButtonProps = $props();
</script>

<span class="btn-root">
	<button class={` btn ${variant} `} aria-label={label} onclick={handleClick}>
		<span class="btn-layout">
			<span class="middle">{label}</span>
		</span>
	</button>
</span>

<style>
	.btn {
		border: none;
		border-radius: var(--bdr-radius-small);
		font-weight: var(--fw-semibold);
		height: 44px;
		padding-left: 8px;
		padding-right: 8px;
	}

	.ghost {
		background-color: rgb(255, 255, 255);
	}

	.ghost:hover {
		background-color: rgb(218, 218, 225);
	}

	.ghost:active {
		background-color: rgb(184, 185, 187);
	}

	.btn-layout {
		display: inline-grid;
		grid-template-columns: auto;
		grid-template-rows: 1fr;
		gap: 4px;
		padding-left: 12px;
		padding-top: 8px;
		padding-right: 12px;
		padding-bottom: 8px;
	}
</style>

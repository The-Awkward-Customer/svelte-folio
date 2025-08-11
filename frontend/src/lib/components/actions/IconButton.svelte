<script lang="ts">
import { Icon } from '../primitives';
	import type { IconName } from '../../types/icons.js';

	// Props interface
	type buttonVariants = 'inverse' | 'primary';
	type buttonRole = 'button' | 'submit' | 'reset';

	interface IconButtonProps {
		name: IconName;
		variant?: buttonVariants;
		type?: buttonRole;
		disabled?: boolean;
		isLoading?: boolean;
		alt?: string;
		size?: number;
		fill?: string;
		handleClick: () => void;
	}

	let {
		name = '01n',
		variant = 'inverse',
		type = 'button',
		disabled = false,
		isLoading = false,
		alt = '',
		size = 32,
		handleClick
	}: IconButtonProps = $props();

	// Compute fill based on variant
	const computedFill = $derived(variant === 'primary' ? '--fg-text-primary' : '--fg-text-inverse');
</script>

<span class="btn-root">
	<button class={`btn ${variant}`} aria-label={alt || name} {type} disabled={disabled || isLoading} onclick={handleClick}>
		{#if isLoading}
			<Icon name="refresh" alt="Loading" {size} fill={computedFill} class="loading-icon" />
		{:else}
			<Icon {name} {alt} {size} fill={computedFill} />
		{/if}
	</button>
</span>

<style>
	.btn {
		border: none;
		border-radius: var(--bdr-radius-small);
		font-weight: var(--fw-semibold);
		height: 44px;
		width: 44px;
		transition: all 0.2s ease-in-out;
	}

	/* Target the icon inside the button */
	.btn :global(.icon) {
		transition: transform 0.2s ease-in-out;
		transition-delay: 0.2ms;
	}

	.inverse {
		background-color: var(--bg-primary);
		box-shadow: inset 0 0px 0px 1px var(--bg-primary);
	}

	.inverse:hover {
		transform: scale(1.05);
	}

	.inverse:hover :global(.icon) {
		transform: scale(1.2); /* Scale icon slightly more than button */
	}

	.inverse:active {
		transform: scale(0.95);
	}

	.primary {
		background-color: var(--bg-page);
		box-shadow: inset 0 0px 0px 1px var(--bg-inverse);
	}

	.primary:hover {
		transform: scale(1.05);
	}

	.primary:hover :global(.icon) {
		transform: scale(1.2);
	}

	.primary:active {
		transform: scale(0.95);
	}

	/* Loading icon styles */
	.btn :global(.loading-icon) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Disabled state */
	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn:disabled:hover {
		transform: none;
	}

	.btn:disabled:hover :global(.icon) {
		transform: none;
	}
</style>

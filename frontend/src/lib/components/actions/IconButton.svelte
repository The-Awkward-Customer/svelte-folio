<script lang="ts">
	import Icon from '../primatives/Icon.svelte';
	import type { IconName } from '../../types/icons.js';

	// Props interface
	type buttonVariants = 'inverse' | 'primary';
	type buttonRole = 'button' | 'submit' | 'reset';

	interface IconButtonProps {
		name: IconName;
		variant?: buttonVariants;
		type?: buttonRole;
		disabled?: boolean;
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
		alt = '',
		size = 32,
		handleClick
	}: IconButtonProps = $props();

	// Compute fill based on variant
	const computedFill = $derived(variant === 'primary' ? '--fg-text-primary' : '--fg-text-inverse');
</script>

<span class="btn-root">
	<button class={`btn ${variant}`} aria-label={alt || name} {type} {disabled} onclick={handleClick}>
		<Icon {name} {alt} {size} fill={computedFill} />
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
		background-color: rgba(var(--bg-primary) / 1);
		box-shadow: inset 0 0px 0px 1px rgba(var(--bg-primary) / 1);
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
		background-color: rgba(var(--bg-page) / 1);
		box-shadow: inset 0 0px 0px 1px rgba(var(--bg-inverse) / 1);
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
</style>

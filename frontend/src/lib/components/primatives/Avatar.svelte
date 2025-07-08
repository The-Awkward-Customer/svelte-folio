<script lang="ts">
	import Ani_me from '$lib/assets/Ani_me.png';

	// TypeScript interface for Avatar props
	type BaseAvatarProps = {
		size?: 'xs' | 'sm' | 'md' | 'lg';
		content?: string;
		alt?: string;
		class?: string;
	};

	type AvatarProps = BaseAvatarProps &
		(
			| {
					isButton: true;
					handleClick: () => void;
					disabled?: boolean;
			  }
			| {
					isButton?: false;
					handleClick?: never;
					disabled?: never;
			  }
		);

	// Props with discriminated union
	let props: AvatarProps = $props();

	const {
		size = 'md',
		content = Ani_me,
		alt = 'Avatar',
		class: className = '',
		isButton = false
	} = props;

	// Compute classes
	const classes = $derived(
		['avatar', `avatar-${size}`, isButton && 'avatar-button', className].filter(Boolean).join(' ')
	);

	// Handle click for button variant
	function handleClick() {
		if (isButton && props.handleClick && !props.disabled) {
			props.handleClick();
		}
	}
</script>

{#if isButton}
	<button class={classes} onclick={handleClick} disabled={props.disabled} aria-label={alt}>
		<span class="avatar-image" style="background-image: url({content})" role="img" aria-label={alt}
		></span>
	</button>
{:else}
	<div class={classes}>
		<span class="avatar-image" style="background-image: url({content})" role="img" aria-label={alt}
		></span>
	</div>
{/if}

<style>
	.avatar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(var(--bg-page) / 0);
		border: none;
		border-radius: var(--bdr-radius-small);
		padding: 4px;
		box-shadow: inset 0 0 0 1px rgba(var(--fg-text-primary) / 1);
		container-type: inline-size;
		transition: var(--transition-fast);
	}

	.avatar-image {
		display: flex;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: top;
		background-repeat: no-repeat;
		border-radius: var(--bdr-radius-tiny);
		transition: var(--transition-fast);
	}

	/* Size variants with consistent aspect ratio (4:5 from original) */
	.avatar-xs {
		width: clamp(24px, 10vw, 80px);
		aspect-ratio: 4 / 5;
	}

	.avatar-sm {
		width: clamp(40px, 15vw, 120px);
		aspect-ratio: 4 / 5;
	}

	.avatar-md {
		width: clamp(60px, 20vw, 180px); /* Current ChatTrigger size */
		aspect-ratio: 4 / 5;
	}

	.avatar-lg {
		width: clamp(80px, 25vw, 240px);
		aspect-ratio: 4 / 5;
	}

	/* Button-specific styles */
	.avatar-button {
		cursor: pointer;
	}

	.avatar-button:hover .avatar-image {
		transform: scale(0.98);
	}

	.avatar-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.avatar-button:disabled:hover .avatar-image {
		transform: none;
	}

	/* Focus states using design system variables */
	.avatar-button:focus-visible {
		outline: var(--focus-ring-width) solid var(--focus-ring-color);
		outline-offset: var(--focus-ring-offset);
	}
</style>

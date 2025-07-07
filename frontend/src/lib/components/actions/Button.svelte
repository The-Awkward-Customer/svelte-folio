<script lang="ts">
	import Icon from '../primatives/Icon.svelte';
	import type { IconName } from '../../types/icons.js';

	type ButtonVariants = 'inverse' | 'primary';
	type ButtonRole = 'button' | 'submit' | 'reset';

	type CommonProps = {
		variant?: ButtonVariants;
		label: string;
		disabled?: boolean;
		iconName?: IconName;
		fullWidth?: boolean;
	};

	type ButtonProps<T extends 'button' | 'link'> = CommonProps &
		(T extends 'button'
			? {
					as: 'button';
					type?: ButtonRole;
					handleClick: () => void;
				}
			: {
					as: 'link';
					href: string;
					target?: '_blank' | '_self' | '_parent' | '_top';
					rel?: string;
					handleClick?: never;
				});

	let props: ButtonProps<'button'> | ButtonProps<'link'> = $props();

	const {
		label = 'Replace me',
		variant = 'inverse',
		as,
		disabled,
		iconName,
		fullWidth = false
	} = props;

	const iconFillColor = $derived(variant === 'inverse' ? '--fg-text-inverse' : '--fg-text-primary');
</script>

{#if as === 'button'}
	{@const buttonProps = props as ButtonProps<'button'>}
	<button
		class={`btn ${variant}`}
		class:full-width={fullWidth}
		class:has-icon={iconName}
		aria-label={label}
		type={buttonProps.type || 'button'}
		{disabled}
		onclick={buttonProps.handleClick}
	>
		<span class="btn-layout">
			{#if iconName}
				<Icon name={iconName} size={24} fill={iconFillColor} />
			{/if}
			<span class="middle">{label}</span>
		</span>
	</button>
{:else}
	{@const linkProps = props as ButtonProps<'link'>}
	<a
		class={`btn ${variant}`}
		class:full-width={fullWidth}
		class:has-icon={iconName}
		aria-label={label}
		href={linkProps.href}
		target={linkProps.target}
		rel={linkProps.rel}
	>
		<span class="btn-layout">
			{#if iconName}
				<Icon name={iconName} size={24} fill={iconFillColor} />
			{/if}
			<span class="middle">{label}</span>
		</span>
	</a>
{/if}

<style>
	.btn {
		border: none;
		border-radius: var(--bdr-radius-small);
		font-weight: var(--fw-semibold);
		font-size: var(--fs-300);
		height: 44px;
		padding-left: 8px;
		padding-right: 8px;
		/* Ensure anchor elements look identical to buttons */
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: inherit;
		width: fit-content;
		min-width: max-content;
		flex-shrink: 0;
	}

	.inverse {
		background-color: rgba(var(--bg-primary) / 1);
		box-shadow: inset 0 0px 0px 1px rgba(var(--bg-primary) / 1);
		color: rgb(var(--fg-text-inverse));
	}

	.inverse:hover {
		background-color: rgba(var(--bg-primary) / 0.9);
	}

	.inverse:active {
		background-color: rgba(var(--bg-primary) / 0.8);
	}

	.primary {
		background-color: rgba(var(--bg-page) / 1);
		box-shadow: inset 0 0px 0px 1px rgba(var(--bg-inverse) / 1);
		color: rgb(var(--fg-text-primary));
	}

	.primary:hover {
		background-color: rgba(var(--bg-page) / 0.9);
	}

	.primary:active {
		background-color: rgba(var(--bg-page) / 0.8);
	}

	.full-width {
		display: inline-flex;
		width: 100%;
	}

	.btn-layout {
		display: flex;
		width: 100%;
		align-items: center;
		justify-content: center;
		gap: 6px;
		padding-left: 12px;
		padding-top: 8px;
		padding-right: 12px;
		padding-bottom: 8px;
	}

	.has-icon {
		padding-left: 6px;
	}
</style>

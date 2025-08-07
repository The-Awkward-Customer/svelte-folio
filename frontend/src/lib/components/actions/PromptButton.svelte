<script lang="ts">
	interface PromptButtonProps {
		prompt: string;
		onClick: (prompt: string) => void;
		variant?: 'default' | 'secondary';
		disabled?: boolean;
	}

	let { prompt, onClick, variant = 'default', disabled = false }: PromptButtonProps = $props();

	function handleClick() {
		if (!disabled) {
			onClick(prompt);
		}
	}
</script>

<button
	class="prompt-btn prompt-btn--{variant}"
	class:prompt-btn--disabled={disabled}
	onclick={handleClick}
	{disabled}
	aria-label="Ask: {prompt}"
>
	{prompt}
</button>

<style>
	.prompt-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 0.75rem;
		border-radius: var(--bdr-radius-pill);
		font-size: var(--fs-300);
		font-weight: var(--fw-medium);
		line-height: 1.2;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
		border: 1px solid transparent;
		background: transparent;
		position: relative;
		overflow: hidden;
		min-height: 36px;
		flex-shrink: 0;
		font-family: var(--font-family-main);
	}

	.prompt-btn--default {
		color: var(--fg-text-primary-60);
		border-color: var(--fg-text-primary-40);
	}

	.prompt-btn--default:hover:not(.prompt-btn--disabled) {
		color: var(--fg-text-primary);
		border-color: var(--fg-text-primary-60);
	}

	.prompt-btn--default:active:not(.prompt-btn--disabled) {
		color: var(--fg-text-primary-20);
		border-color: var(--fg-text-primary-20);
	}

	.prompt-btn--secondary {
		background-color: var(--bg-secondary, var(--bg-page));
		color: var(--fg-text-secondary, var(--fg-text-primary));
		border-color: var(--border-secondary, var(--fg-text-primary-30));
	}

	.prompt-btn--secondary:hover:not(.prompt-btn--disabled) {
		background-color: var(--bg-secondary-hover, var(--bg-primary));
		color: var(--fg-text-inverse);
		border-color: var(--bg-primary);
	}

	.prompt-btn--disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none !important;
		box-shadow: none !important;
	}

	/* Focus states for accessibility */
	.prompt-btn:focus-visible {
		outline: 2px solid var(--focus-ring-color, var(--bg-primary));
		outline-offset: 2px;
	}
</style>

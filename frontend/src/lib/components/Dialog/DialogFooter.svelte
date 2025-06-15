<!-- DialogFooter.svelte -->

<script lang="ts">
	import { dialogManager } from '$lib/stores/dialogManager';
	import type { GridArea } from './DialogSection.svelte';
	import Button from '../actions/Button.svelte';

	interface DialogFooterProps {
		label?: string;
		gridArea?: GridArea;
		variant?: 'ghost' | 'strong';
	}

	const {
		label = 'Close Dialog',
		gridArea = 'footer',
		variant = 'strong'
	}: DialogFooterProps = $props();

	function closeDialog() {
		console.log('closed Dialog');
		dialogManager.closeDialog();
	}
</script>

<div class="footer-section-root" style:--grid-area={gridArea}>
	<Button
		as="link"
		label="View Graphics"
		iconName="placeholder"
		variant="inverse"
		href="/graphics"
	/>
	<Button as="button" {label} variant="inverse" handleClick={closeDialog} fullWidth={true} />
</div>

<style>
	.footer-section-root {
		display: flex;
		flex-direction: column;
		width: 100%;
		justify-content: center;
		align-items: stretch;
		gap: 1rem;
		/* Visual debugging - pink background with opacity */
		background-color: rgba(255, 192, 203, 0.3);
		border: 2px solid rgba(255, 192, 203, 0.6);
		grid-area: var(--grid-area);
		/* Mobile first - base padding */
		padding-top: var(--spc-300);
		padding-bottom: var(--spc-300);
		padding-left: var(--spc-400);
		padding-right: var(--spc-400);
	}

	/* Desktop breakpoint at 896px */
	@media (min-width: 896px) {
		.footer-section-root {
			flex-direction: row;
			padding-top: var(--spc-400);
			padding-bottom: var(--spc-400);
			padding-left: var(--spc-500);
			padding-right: var(--spc-500);
		}

		.footer-section-root :global(.full-width) {
			flex: 1;
		}
	}
</style>

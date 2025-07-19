<script lang="ts">
	let P: string = 'Graphics Page';
	console.log(`${P} rendered!`);

	export interface GridItem {
		readonly id: string;
		readonly component: any;
		readonly size: '2-2' | '4-2';
		readonly props?: Record<string, any>;
	}

	interface Props {
		items: readonly GridItem[];
		columns?: number;
	}

	let { items, columns = 4 }: Props = $props();

	const sizeMap = {
		'2-2': { cols: 2, rows: 2 }, // large square
		'4-2': { cols: 4, rows: 2 } // large rectangle
	} as const;
</script>

<div class="grid" style="--columns: {columns}">
	{#each items as item (item.id)}
		<div
			class="grid-item"
			class:desktop-spans={true}
			data-flip-id={item.id}
			data-grid-size={item.size}
			style="
				--grid-cols: {sizeMap[item.size].cols};
				--grid-rows: {sizeMap[item.size].rows};
			"
		>
			{#if item.component}
				{@const Component = item.component}
				<Component {...item.props ?? {}} />
			{/if}
		</div>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-auto-rows: 1fr;
		gap: 0.5rem;
		grid-auto-flow: row dense;
		padding-top: var(--spc-700);
		padding-bottom: var(--spc-1000);
	}

	.grid-item {
		border-radius: var(--bdr-radius-small);
		overflow: hidden;
	}

	/* Mobile masonry - items span based on their size but in 2 columns */
	.grid-item.desktop-spans {
		grid-column: span min(var(--grid-cols), 2);
		grid-row: span var(--grid-rows);
	}

	/* Force square aspect ratio for 2-2 items */
	.grid-item[data-grid-size="2-2"] {
		aspect-ratio: 1 / 1;
	}

	/* Desktop breakpoint - 4+ columns */
	@media (min-width: 896px) {
		.grid {
			grid-template-columns: repeat(var(--columns), 1fr);
		}

		.grid-item.desktop-spans {
			grid-column: span var(--grid-cols);
			grid-row: span var(--grid-rows);
		}
	}
</style>

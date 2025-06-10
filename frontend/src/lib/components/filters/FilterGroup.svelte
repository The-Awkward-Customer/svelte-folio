<script lang="ts">
	import FilterToggle from './FilterToggle.svelte';

	interface Props {
		filters: readonly string[];
		activeFilters?: Record<string, boolean>;
		onFilterChange?: (activeFilters: Record<string, boolean>) => void;
	}

	let { filters, activeFilters = $bindable(), onFilterChange }: Props = $props();

	// Initialize all filters as active by default
	if (!activeFilters || Object.keys(activeFilters).length === 0) {
		activeFilters = Object.fromEntries(filters.map((filter) => [filter, true]));
	}

	function toggleFilter(filter: string) {
		if (activeFilters) {
			activeFilters = {
				...activeFilters,
				[filter]: !activeFilters[filter]
			};
			onFilterChange?.(activeFilters);
		}
	}
</script>

<div class="filter-group">
	{#each filters as filter}
		<FilterToggle
			label={filter}
			active={activeFilters?.[filter] ?? false}
			onclick={() => toggleFilter(filter)}
		/>
	{/each}
</div>

<style>
	.filter-group {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	@media (max-width: 640px) {
		.filter-group {
			overflow-x: auto;
			flex-wrap: wrap;
			padding-bottom: 1.5rem;
			scrollbar-width: none;
			-ms-overflow-style: none;
		}

		.filter-group::-webkit-scrollbar {
			display: none;
		}
	}
</style>

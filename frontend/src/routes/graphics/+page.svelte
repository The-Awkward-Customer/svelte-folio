<!-- Graphics +page -->
<script lang="ts">
	import GridLayout from '$lib/components/grids/GridLayout.svelte';
	import { TextCard, ImageCard } from '$lib/components/cards';
	import FilterGroup from '$lib/components/filters/FilterGroup.svelte';
	import { shuffleArray } from '$lib/utils/shuffle.js';

	let P: string = 'GRAPHICS';
	console.log(`${P} rendered!`);

	import exampleImageOne from '$lib/assets/exampleImage1.png';

	const allGridItems = [
		{
			id: '1',
			component: TextCard,
			size: '2-2',
			props: {
				title: 'Large square',
				content: 'This is a demo of our grid layout system!',
				bgColor: '#e3f2fd',
				tag: 'Layout'
			}
		},
		{
			id: '2',
			component: TextCard,
			size: '1-1',
			props: {
				title: 'Small Square',
				content: 'This is a demo of our grid layout system!',
				bgColor: '#f3e5f5',
				tag: 'Typography'
			}
		},
		{
			id: '3',
			component: TextCard,
			size: '1-1',
			props: {
				title: 'Interactive Demo',
				content: 'This is a demo of our grid layout system!',
				bgColor: '#e8f5e8',
				tag: 'Interactive'
			}
		},
		{
			id: '4',
			component: TextCard,
			size: '2-1',
			props: {
				title: 'Small Rectangle',
				content: 'This is a demo of our grid layout system!',
				bgColor: '#fff3e0',
				tag: 'Layout'
			}
		},
		{
			id: '5',
			component: TextCard,
			size: '4-2',
			props: {
				title: 'Featured Project',
				content: 'This is a demo of our grid layout system!',
				bgColor: '#fce4ec',
				tag: 'Featured'
			}
		},
		{
			id: '6',
			component: TextCard,
			size: '1-1',
			props: {
				title: 'Experimental',
				content: 'Testing new concepts and ideas!',
				bgColor: '#f1f8e9',
				tag: 'Experimental'
			}
		},
		{
			id: '7',
			component: TextCard,
			size: '2-2',
			props: {
				title: 'Large square',
				content: 'This is a demo of our grid layout system!',
				bgColor: '#e3f2fd',
				tag: 'Layout'
			}
		},
		{
			id: '8',
			component: TextCard,
			size: '1-1',
			props: {
				title: 'Small Square',
				content: 'This is a demo of our grid layout system!',
				bgColor: '#f3e5f5',
				tag: 'Typography'
			}
		},
		{
			id: '9',
			component: TextCard,
			size: '1-1',
			props: {
				title: 'Interactive Demo',
				content: 'This is a demo of our grid layout system!',
				bgColor: '#e8f5e8',
				tag: 'Interactive'
			}
		},
		{
			id: '10',
			component: TextCard,
			size: '2-1',
			props: {
				title: 'Small Rectangle',
				content: 'This is a demo of our grid layout system!',
				bgColor: '#fff3e0',
				tag: 'Layout'
			}
		},
		{
			id: '11',
			component: TextCard,
			size: '4-2',
			props: {
				title: 'Featured Project',
				content: 'This is a demo of our grid layout system!',
				bgColor: '#fce4ec',
				tag: 'Featured'
			}
		},
		{
			id: '12',
			component: TextCard,
			size: '1-1',
			props: {
				title: 'Experimental',
				content: 'Testing new concepts and ideas!',
				bgColor: '#f1f8e9',
				tag: 'Experimental'
			}
		},
		{
			id: '13',
			component: ImageCard,
			size: '1-1',
			props: {
				src: exampleImageOne,
				bgColor: '#FFFFFF',
				tag: 'UI'
			}
		},
		{
			id: '14',
			component: ImageCard,
			size: '2-2',
			props: {
				src: exampleImageOne,
				bgColor: '#F4F4F4',
				tag: 'UI'
			}
		}
	] as const;

	// Initialize shuffled items as state to avoid SSR hydration mismatch
	let shuffledGridItems = $state([...allGridItems]);

	// Shuffle on client-side only to prevent hydration mismatch
	$effect(() => {
		shuffledGridItems = shuffleArray(allGridItems);
	});

	// Extract unique filter categories reactively
	const filterCategories = $derived([...new Set(shuffledGridItems.map((item) => item.props.tag))]);

	// Reactive filter state
	let activeFilters = $state<Record<string, boolean>>({});

	// Filtered grid items based on active filters
	const filteredGridItems = $derived(
		shuffledGridItems.filter((item) => activeFilters[item.props.tag] ?? true)
	);
</script>

<section>
	<div class="header-root">
		<div class="row-wrapper">
			<p>2016-2025</p>
		</div>
		<p>An assorted collection of graphical artefacts from various projects over the years.</p>
	</div>

	<!-- Filter Controls -->
	<FilterGroup filters={filterCategories} bind:activeFilters />

	<!-- Filtered Grid -->
	<GridLayout items={filteredGridItems} columns={4} />
</section>

<style>
	.header-root {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		padding-top: 64px;
		padding-bottom: 2em;
		max-width: 64ch;
	}

	.row-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		gap: 12px;
		font-weight: var(--fw-semibold);
	}

	p {
		color: rgb(var(--fg-text-primary));
		font-size: clamp(18px, 4vw, 24px);
	}

	p:nth-child(2) {
		color: rgb(var(--fg-text-secondary));
	}

	@media (min-width: 896px) {
		.row-wrapper {
			flex-direction: row;
		}
	}
</style>

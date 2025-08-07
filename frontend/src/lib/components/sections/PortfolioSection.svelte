<script lang="ts">
	import GridLayout from '$lib/components/grids/GridLayout.svelte';
	import { TextCard, ImageCard, VideoCard } from '$lib/components/cards';
	import FilterGroup from '$lib/components/filters/FilterGroup.svelte';
	import { shuffleArray } from '$lib/utils/shuffle.js';

	let P: string = 'GRAPHICS';
	console.log(`${P} rendered!`);

	// Import all illustration images
	import illustration1 from '$lib/assets/Illustrations/g_001.png';
	import illustration2 from '$lib/assets/Illustrations/g_002.png';
	import illustration3 from '$lib/assets/Illustrations/g_003.png';
	import illustration4 from '$lib/assets/Illustrations/g_004.png';
	import illustration5 from '$lib/assets/Illustrations/g_005.png';
	import illustration6 from '$lib/assets/Illustrations/g_006.png';
	import illustration7 from '$lib/assets/Illustrations/g_007.png';
	import illustration8 from '$lib/assets/Illustrations/g_008.png';
	import illustration9 from '$lib/assets/Illustrations/g_009.png';
	import illustration10 from '$lib/assets/Illustrations/g_010.png';
	import illustration11 from '$lib/assets/Illustrations/g_011.png';
	import illustration12 from '$lib/assets/Illustrations/g_012.png';
	import illustration13 from '$lib/assets/Illustrations/g_013.png';
	import illustration14 from '$lib/assets/Illustrations/g_014.png';
	import illustration15 from '$lib/assets/Illustrations/g_015.png';
	import illustration16 from '$lib/assets/Illustrations/g_016.png';
	import illustration17 from '$lib/assets/Illustrations/g_017.png';

	const ExampleVid = '/videos/ExampleVid.webm';

	const allGridItems = [
		{
			id: '4',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration1,
				tag: 'Illustration'
			}
		},
		{
			id: '6',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration2,
				tag: 'Illustration'
			}
		},
		{
			id: '7',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration3,
				tag: 'Illustration'
			}
		},
		{
			id: '8',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration4,
				tag: 'Illustration'
			}
		},
		{
			id: '9',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration5,
				tag: 'Illustration'
			}
		},
		{
			id: '10',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration6,
				tag: 'UI'
			}
		},
		{
			id: '12',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration7,
				tag: 'UI'
			}
		},
		{
			id: '13',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration8,
				tag: 'Illustration'
			}
		},
		{
			id: '14',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration9,
				tag: 'Illustration'
			}
		},
		{
			id: '15',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration10,
				tag: 'Illustration'
			}
		},
		{
			id: '16',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration11,
				tag: 'Illustration'
			}
		},
		{
			id: '17',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration12,
				tag: 'Illustration'
			}
		},
		{
			id: '18',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration13,
				tag: 'Ceramics'
			}
		},
		{
			id: '19',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration14,
				tag: 'Branding'
			}
		},
		{
			id: '20',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration15,
				tag: 'Branding'
			}
		},
		{
			id: '21',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration16,
				tag: 'Illustration'
			}
		},
		{
			id: '22',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration17,
				tag: 'Ceramics'
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

<section id="portfolio" class="portfolio-section">
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
	.portfolio-section {
		padding: 24px 24px;
		/* min-height: 100vh; */
		scroll-margin-top: 100px;
	}

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
		color: var(--fg-text-primary);
		font-size: clamp(18px, 4vw, 24px);
	}

	p:nth-child(2) {
		color: var(--fg-text-secondary);
	}

	@media (min-width: 896px) {
		.row-wrapper {
			flex-direction: row;
		}
	}
</style>

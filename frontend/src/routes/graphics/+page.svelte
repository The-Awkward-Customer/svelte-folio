<!-- Graphics +page -->
<script lang="ts">
	import GridLayout from '$lib/components/grids/GridLayout.svelte';
	import { TextCard, ImageCard, VideoCard } from '$lib/components/cards';
	import FilterGroup from '$lib/components/filters/FilterGroup.svelte';
	import { shuffleArray } from '$lib/utils/shuffle.js';
	import { dialogManager } from '$lib/stores/dialogManager.svelte.js';
	import DialogRoot from '$lib/components/Dialog/DialogRoot.svelte';

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
	const ExampleVid = '/videos/ExampleVid.webm';

	const allGridItems = [
		{
			id: '1',
			component: VideoCard,
			size: '2-2',
			props: {
				src: ExampleVid,
				bgColor: '#e3f2fd',
				tag: 'Motion'
			}
		},
		{
			id: '2',
			component: VideoCard,
			size: '2-2',
			props: {
				src: ExampleVid,
				bgColor: '#e3f2fd',
				tag: 'Motion'
			}
		},
		{
			id: '3',
			component: VideoCard,
			size: '2-2',
			props: {
				src: ExampleVid,
				bgColor: '#e3f2fd',
				tag: 'Motion'
			}
		},
		{
			id: '4',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration1,
				tag: 'Design'
			}
		},
		{
			id: '5',
			component: TextCard,
			size: '4-2',
			props: {
				title: 'Fresha Case Study',
				content: 'This is a demo of our grid layout system!',
				bgColor: '--brand-fresha-accent',
				tag: 'Case Study',
				button: 'primary',
				handleClick: openFreshaDialog
			}
		},
		{
			id: '6',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration2,
				tag: 'Design'
			}
		},
		{
			id: '7',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration3,
				tag: 'Design'
			}
		},
		{
			id: '8',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration4,
				tag: 'Design'
			}
		},
		{
			id: '9',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration5,
				tag: 'Design'
			}
		},
		{
			id: '10',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration6,
				tag: 'Design'
			}
		},
		{
			id: '11',
			component: TextCard,
			size: '4-2',
			props: {
				title: 'Test Dialog',
				content: 'This is a demo of our grid layout system!',
				bgColor: '--bg-primary',
				tag: 'Case Study',
				button: 'primary',
				handleClick: openThirdDialog
			}
		},
		{
			id: '12',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration7,
				tag: 'Design'
			}
		},
		{
			id: '13',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration8,
				tag: 'Design'
			}
		},
		{
			id: '14',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration9,
				tag: 'Design'
			}
		},
		{
			id: '15',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration10,
				tag: 'Design'
			}
		},
		{
			id: '16',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration11,
				tag: 'Design'
			}
		},
		{
			id: '17',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration12,
				tag: 'Design'
			}
		},
		{
			id: '18',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration13,
				tag: 'Design'
			}
		},
		{
			id: '19',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration14,
				tag: 'Design'
			}
		},
		{
			id: '20',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration15,
				tag: 'Design'
			}
		},
		{
			id: '21',
			component: ImageCard,
			size: '2-2',
			props: {
				src: illustration16,
				tag: 'Design'
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

	// Dialog functions
	function openFreshaDialog() {
		dialogManager.showDialog('fresha');
	}
	function openThirdDialog() {
		dialogManager.showDialog('testThree');
	}
</script>

<svelte:head>
	<title>Graphics & Portfolio - Peter Abbott</title>
	<meta
		name="description"
		content="An assorted collection of graphical artefacts from various design and development projects spanning 2016-2025. UI/UX design, motion graphics, and case studies."
	/>
</svelte:head>

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

<!-- Dialog Root - handles all dialog rendering -->
<DialogRoot />

<style>
	section {
		padding-left: 24px;
		padding-right: 24px;
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

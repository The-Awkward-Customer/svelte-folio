<script lang="ts">
	let helloWorld: string = 'Hello world';
	console.log(helloWorld);

	// components
	import { page } from '$app/stores';
	import { dialogManager } from '$lib/stores/dialogManager.svelte.js';
	import Accordian from '$lib/components/accordian/Accordian.svelte';
	import { Introduction, Experience, Process } from '$lib/components/accordian/accordionItems';

	//Page Content
	let HeroIntroText: string =
		'Currently based in sunny Madrid, and available for new projects in Q3 2025.';

	$: currentPath = $page.url.pathname;
</script>

<svelte:head>
	<title>Peter Abbott - Interactive Designer & Developer</title>
	<meta
		name="description"
		content="Interactive designer and frontend developer based in Madrid. Available for UI/UX design, development, and consulting projects in Q3 2025."
	/>
</svelte:head>

<ol>
	<!-- Test with direct color first -->
	<!-- <div>
		<h1 class="hero-title">I do…</h1>
	</div> -->

	<Accordian number="1" label="Clear" suffix="Design">
		<Introduction />
	</Accordian>

	<Accordian number="2" label="scalable" suffix="Engineering">
		<Experience />
	</Accordian>

	<Accordian number="3" label="Considered" suffix="Strategy">
		<Process />
	</Accordian>
</ol>

<style>
	h1 {
		font-weight: var(--fw-semibold);
		font-size: var(--fs-hero-clamped);
		margin-bottom: 1em;
		color: rgb(var(--fg-text-primary)); /* Pink with opacity */
		max-width: 26ch;
		line-height: 110%; /* Tight line height for better readability */
	}
</style>

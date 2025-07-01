<script lang="ts">
	let helloWorld: string = 'Hello world';
	console.log(helloWorld);

	// components
	import { page } from '$app/stores';
	import AnimatedTextPath from '$lib/components/AnimatedTextPath.svelte';

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

<AnimatedTextPath
	texts={['LETS COOK', 'LETS BUILD', 'LETS CREATE']}
	speed={50}
	pathWildness={0.7}
	showPath={true}
	pathStyle={{
		strokeColor: '#000000',
		strokeWidth: 60,
		opacity: 1
	}}
	textStyle={{
		font: 'bold 24px sans-serif',
		size: 24,
		color: '#FFFFFF'
	}}
/>

<style>
</style>

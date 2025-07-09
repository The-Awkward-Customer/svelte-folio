<script lang="ts">
	let helloWorld: string = 'Hello world';
	console.log(helloWorld);

	// components
	import { page } from '$app/stores';
	import AnimatedTextPath from '$lib/components/AnimatedTextPath.svelte';

	// Vibrant color pairs for AnimatedTextPath
	const colorPairs = [
		{ background: '#0066FF', foreground: '#FFFF00' }, // Electric Blue & Bright Yellow
		{ background: '#FF1493', foreground: '#32FF32' }, // Hot Pink & Lime Green
		{ background: '#FF4500', foreground: '#9932CC' }, // Orange & Purple
		{ background: '#00FFFF', foreground: '#FF00FF' }, // Cyan & Magenta
		{ background: '#50C878', foreground: '#FFD700' } // Emerald & Gold
	];

	// Randomly select a color pair on component mount
	const selectedColorPair = colorPairs[Math.floor(Math.random() * colorPairs.length)];

	//arrary of pairs
	const selectedColorPairs = Array.from({ length: 2 }, () => {
		return colorPairs[Math.floor(Math.random() * colorPairs.length)];
	});

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
	texts={['HALLO •', ' HEJ •', 'HOLA •', 'HELLO •', 'WELCOME •', 'こんにちは •']}
	speed={70}
	pathWildness={0.9}
	showPath={true}
	pathStyle={{
		strokeColor: selectedColorPairs[0].background,
		strokeWidth: 80,
		opacity: 1
	}}
	textStyle={{
		font: 'bold 28px sans-serif',
		size: 24,
		color: selectedColorPairs[0].foreground
	}}
/>

<AnimatedTextPath
	texts={['LETS COOK –', ' WHY NOT TRY?', 'LETS CREATE //', 'LETS MAKE //', 'LETS EXPLORE //']}
	speed={100}
	pathWildness={0.9}
	showPath={true}
	pathStyle={{
		strokeColor: selectedColorPairs[1].background,
		strokeWidth: 80,
		opacity: 1
	}}
	textStyle={{
		font: 'bold 28px sans-serif',
		size: 24,
		color: selectedColorPairs[1].foreground
	}}
/>

<style>
</style>

<script>
	import '../app.css';

	import Footer from '$lib/components/Footer/Footer.svelte';
	import TopNav from '$lib/components/topNav/TopNav.svelte';

	import { onMount } from 'svelte';
	import { theme } from '$lib/theme.svelte';

	onMount(() => {
		console.log('About to call theme.init()');
		theme.init();
		console.log('After theme.init(), current theme is:', theme.current);
	});

	let { children } = $props();
</script>

<TopNav></TopNav>

<main>
	{@render children()}
</main>

<Footer />

<style>
	main {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		justify-content: flex-start;
		width: 100%;
		background-color: rgba(255, 192, 203, 0);
	}
</style>

<script>
	import '../app.css';

	import Footer from '$lib/components/Footer/Footer.svelte';
	import TopNav from '$lib/components/topNav/TopNav.svelte';

	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import { theme } from '$lib/theme.svelte';
	import { themeManager } from '$lib/stores/themeManager.svelte';

	onMount(() => {
		console.log('About to call theme.init()');
		theme.init();
		console.log('After theme.init(), current theme is:', theme.current);
		
		// Initialize the new theme manager
		// It initializes itself in the constructor, but we can ensure it's ready
		console.log('Theme manager initialized with state:', themeManager.current);
	});
	
	// Clear brand colors when navigating away from experience page
	beforeNavigate(({ from, to }) => {
		// If we're navigating away from experience page, clear brand
		if (from?.url.pathname === '/experience' && to?.url.pathname !== '/experience') {
			themeManager.clearBrand();
		}
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
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	
	import HeroSection from '$lib/components/sections/HeroSection.svelte';
	import ExperienceSection from '$lib/components/sections/ExperienceSection.svelte';
	import PortfolioSection from '$lib/components/sections/PortfolioSection.svelte';
	import { navigationStore } from '$lib/stores/navigationStore.svelte';

	$: currentPath = $page.url.pathname;

	// Handle initial hash navigation on page load
	onMount(() => {
		const hash = window.location.hash;
		if (hash) {
			// Small delay to ensure page is rendered
			setTimeout(() => {
				const element = document.getElementById(hash.slice(1));
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
				}
			}, 100);
		}

		// Set up intersection observer for section tracking
		const sections = ['hero', 'experience', 'portfolio'];
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					navigationStore.activeSection = entry.target.id;
				}
			});
		}, { threshold: 0.5 });
		
		sections.forEach(id => {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		});

		// Cleanup
		return () => {
			observer.disconnect();
		};
	});
</script>

<svelte:head>
	<title>Peter Abbott - Interactive Designer & Developer</title>
	<meta
		name="description"
		content="Interactive designer and frontend developer based in Madrid. Available for UI/UX design, development, and consulting projects in Q3 2025."
	/>
</svelte:head>

<main>
	<HeroSection />
	<ExperienceSection />
	<PortfolioSection />
</main>

<style>
	main {
		scroll-behavior: smooth;
	}
</style>

<script lang="ts">
	let helloWorld: string = 'Hello world';
	console.log(helloWorld);

	// components
	import { page } from '$app/stores';
	import { dialogManager } from '$lib/stores/dialogManager';
	import Accordian from '$lib/components/accordian/Accordian.svelte';
	import { Introduction, Experience, Process } from '$lib/components/accordian/accordionItems';

	//Page Content
	let HeroIntroText: string =
		'Currently based in sunny Madrid, and available for new projects in Q3 2025.';

	function openTheDialog() {
		console.log('Opening dialog...');
		dialogManager.showDialog('mainPageDialog', { message: 'Hello from the page!' });
	}

	function openFreshaDialog() {
		dialogManager.showDialog('freshaDialog');
	}
	function openShellDialog() {
		dialogManager.showDialog('shellDialog');
	}

	$: currentPath = $page.url.pathname;
</script>

<ol>
	<!-- Test with direct color first -->

	<Accordian number="1" label="Start here">
		<Introduction />
	</Accordian>

	<Accordian number="2" label="Experience">
		<Experience />
	</Accordian>

	<Accordian number="3" label="How I work">
		<Process />
	</Accordian>
</ol>

<style>
	/* Empty */
</style>

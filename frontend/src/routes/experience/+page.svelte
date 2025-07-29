<script lang="ts">
	import { onDestroy } from 'svelte';
	import Accordian from '$lib/components/accordian/Accordian.svelte';
	import AccordionList from '$lib/components/accordian/AccordionList.svelte';
	import { themeManager } from '$lib/stores/themeManager.svelte';
	import {
		ProjectCard,
		ProjectHeader,
		ProjectBody,
		ProjectFooter
	} from '$lib/components/content/projects';
	
	// Clear any active brand when leaving the page
	onDestroy(() => {
		themeManager.clearBrand();
	});
</script>

<AccordionList>
	<Accordian label="godesk" suffix="Co-Founding Designer" brand="godesk">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="fresha" suffix="Design System Lead" brand="fresha">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="jio" suffix="Senior Product Designer" brand="jio">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="ikea" suffix="Creative Director" brand="ikea">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="warhammer" suffix="Product Designer" brand="warhammer">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>
</AccordionList>

<style>
</style>

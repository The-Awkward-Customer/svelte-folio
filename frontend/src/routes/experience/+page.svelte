<script lang="ts">
	import Accordian from '$lib/components/accordian/Accordian.svelte';
	import AccordionList from '$lib/components/accordian/AccordionList.svelte';
	import { ProjectCard, ProjectHeader, ProjectBody, ProjectFooter } from '$lib/components/content/projects';
</script>

<AccordionList>
	<Accordian label="godesk" suffix="Co-Founding Designer">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="fresha" suffix="Design System Lead">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="jio" suffix="Senior Product Designer">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="ikea" suffix="Creative Director">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="warhammer" suffix="Product Designer">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="godesk" suffix="Co-Founding Designer">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="fresha" suffix="Design System Lead">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="jio" suffix="Senior Product Designer">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="ikea" suffix="Creative Director">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader />
				<ProjectBody />
				<ProjectFooter />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="warhammer" suffix="Product Designer">
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

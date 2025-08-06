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
	import { experienceData } from '$lib/data/experienceData';

	// Clear any active theme overrides when leaving the page
	onDestroy(() => {
		themeManager.clearBrandThemeOverride();
		themeManager.clearBrand();
	});
</script>

<AccordionList>
	<Accordian label="godesk" suffix="Co-Founding Designer" brand="godesk" themeOverride="light">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					imageSrc={experienceData.godesk.header.imageSrc}
					imageAlt={experienceData.godesk.header.imageAlt}
				/>
				<ProjectBody
					problemStatement={experienceData.godesk.body.problemStatement}
					impact={experienceData.godesk.body.impact}
					teamMembers={experienceData.godesk.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.godesk.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="fresha" suffix="Design System Lead" brand="fresha" themeOverride="light">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					imageSrc={experienceData.fresha.header.imageSrc}
					imageAlt={experienceData.fresha.header.imageAlt}
				/>
				<ProjectBody
					problemStatement={experienceData.fresha.body.problemStatement}
					impact={experienceData.fresha.body.impact}
					teamMembers={experienceData.fresha.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.fresha.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="jio" suffix="Senior Product Designer" brand="jio">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					imageSrc={experienceData.jio.header.imageSrc}
					imageAlt={experienceData.jio.header.imageAlt}
				/>
				<ProjectBody
					problemStatement={experienceData.jio.body.problemStatement}
					impact={experienceData.jio.body.impact}
					teamMembers={experienceData.jio.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.jio.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="ikea" suffix="Creative Director" brand="ikea">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					imageSrc={experienceData.ikea.header.imageSrc}
					imageAlt={experienceData.ikea.header.imageAlt}
					mediaType={experienceData.ikea.header.mediaType}
					videoSrc={experienceData.ikea.header.videoSrc}
					videoPoster={experienceData.ikea.header.videoPoster}
				/>
				<ProjectBody
					problemStatement={experienceData.ikea.body.problemStatement}
					impact={experienceData.ikea.body.impact}
					teamMembers={experienceData.ikea.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.ikea.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="warhammer" suffix="Product Designer" brand="warhammer">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					imageSrc={experienceData.warhammer.header.imageSrc}
					imageAlt={experienceData.warhammer.header.imageAlt}
					mediaType={experienceData.warhammer.header.mediaType}
					videoSrc={experienceData.warhammer.header.videoSrc}
					videoPoster={experienceData.warhammer.header.videoPoster}
				/>
				<ProjectBody
					problemStatement={experienceData.warhammer.body.problemStatement}
					impact={experienceData.warhammer.body.impact}
					teamMembers={experienceData.warhammer.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.warhammer.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<!-- <Accordian label="shell" suffix="Digital Innovation Designer" brand="shell">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					outcome={experienceData.shell.header.outcome}
					imageSrc={experienceData.shell.header.imageSrc}
					imageAlt={experienceData.shell.header.imageAlt}
				/>
				<ProjectBody
					problemStatement={experienceData.shell.body.problemStatement}
					impact={experienceData.shell.body.impact}
					teamMembers={experienceData.shell.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.shell.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian> -->

	<!-- <Accordian label="suzuki" suffix="Lead Digital Designer" brand="suzuki">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					outcome={experienceData.suzuki.header.outcome}
					imageSrc={experienceData.suzuki.header.imageSrc}
					imageAlt={experienceData.suzuki.header.imageAlt}
				/>
				<ProjectBody
					problemStatement={experienceData.suzuki.body.problemStatement}
					impact={experienceData.suzuki.body.impact}
					teamMembers={experienceData.suzuki.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.suzuki.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian> -->

	<!-- <Accordian label="tsb" suffix="Head of Digital Banking UX" brand="tsb">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					outcome={experienceData.tsb.header.outcome}
					imageSrc={experienceData.tsb.header.imageSrc}
					imageAlt={experienceData.tsb.header.imageAlt}
				/>
				<ProjectBody
					problemStatement={experienceData.tsb.body.problemStatement}
					impact={experienceData.tsb.body.impact}
					teamMembers={experienceData.tsb.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.tsb.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian> -->
</AccordionList>

<style>
</style>

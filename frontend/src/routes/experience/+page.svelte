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

	// Clear any active brand when leaving the page
	onDestroy(() => {
		themeManager.clearBrand();
	});
</script>

<AccordionList>
	<Accordian label="godesk" suffix="Co-Founding Designer" brand="godesk">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					content={experienceData.godesk.header.content}
					imageSrc={experienceData.godesk.header.imageSrc}
					imageAlt={experienceData.godesk.header.imageAlt}
					standfirst={experienceData.godesk.header.standfirst}
				/>
				<ProjectBody
					impact={experienceData.godesk.body.impact}
					teamMembers={experienceData.godesk.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.godesk.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="fresha" suffix="Design System Lead" brand="fresha">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					content={experienceData.fresha.header.content}
					imageSrc={experienceData.fresha.header.imageSrc}
					imageAlt={experienceData.fresha.header.imageAlt}
					standfirst={experienceData.fresha.header.standfirst}
				/>
				<ProjectBody
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
					content={experienceData.jio.header.content}
					imageSrc={experienceData.jio.header.imageSrc}
					imageAlt={experienceData.jio.header.imageAlt}
					standfirst={experienceData.jio.header.standfirst}
				/>
				<ProjectBody
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
					content={experienceData.ikea.header.content}
					imageSrc={experienceData.ikea.header.imageSrc}
					imageAlt={experienceData.ikea.header.imageAlt}
					standfirst={experienceData.ikea.header.standfirst}
					mediaType={experienceData.ikea.header.mediaType}
					videoSrc={experienceData.ikea.header.videoSrc}
					videoPoster={experienceData.ikea.header.videoPoster}
				/>
				<ProjectBody
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
					content={experienceData.warhammer.header.content}
					imageSrc={experienceData.warhammer.header.imageSrc}
					imageAlt={experienceData.warhammer.header.imageAlt}
					standfirst={experienceData.warhammer.header.standfirst}
					mediaType={experienceData.warhammer.header.mediaType}
					videoSrc={experienceData.warhammer.header.videoSrc}
					videoPoster={experienceData.warhammer.header.videoPoster}
				/>
				<ProjectBody
					impact={experienceData.warhammer.body.impact}
					teamMembers={experienceData.warhammer.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.warhammer.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="shell" suffix="Digital Innovation Designer" brand="shell">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					content={experienceData.shell.header.content}
					imageSrc={experienceData.shell.header.imageSrc}
					imageAlt={experienceData.shell.header.imageAlt}
					standfirst={experienceData.shell.header.standfirst}
				/>
				<ProjectBody
					impact={experienceData.shell.body.impact}
					teamMembers={experienceData.shell.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.shell.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="suzuki" suffix="Lead Digital Designer" brand="suzuki">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					content={experienceData.suzuki.header.content}
					imageSrc={experienceData.suzuki.header.imageSrc}
					imageAlt={experienceData.suzuki.header.imageAlt}
					standfirst={experienceData.suzuki.header.standfirst}
				/>
				<ProjectBody
					impact={experienceData.suzuki.body.impact}
					teamMembers={experienceData.suzuki.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.suzuki.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian>

	<Accordian label="tsb" suffix="Head of Digital Banking UX" brand="tsb">
		<ProjectCard>
			{#snippet children()}
				<ProjectHeader
					content={experienceData.tsb.header.content}
					imageSrc={experienceData.tsb.header.imageSrc}
					imageAlt={experienceData.tsb.header.imageAlt}
					standfirst={experienceData.tsb.header.standfirst}
				/>
				<ProjectBody
					impact={experienceData.tsb.body.impact}
					teamMembers={experienceData.tsb.body.teamMembers}
				/>
				<ProjectFooter FooterString={experienceData.tsb.footer.footerString} />
			{/snippet}
		</ProjectCard>
	</Accordian>

</AccordionList>

<style>
</style>

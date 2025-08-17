<script lang="ts">
  import { onDestroy } from 'svelte';
  import { Accordion } from '$lib/components/accordion';
  import { AccordionList } from '$lib/components/accordion';
  import { themeManager } from '$lib';
  import {
    ProjectCard,
    ProjectHeader,
    ProjectBody,
    ProjectFooter,
  } from '$lib/features/site/projects';
  import { experienceData } from '$lib/data/experienceData';

  // Clear any active theme overrides when leaving the page
  onDestroy(() => {
    themeManager.clearBrandThemeOverride();
    themeManager.clearBrand();
  });
</script>

<AccordionList>
  <Accordion
    label="godesk"
    suffix="Co-Founding Designer"
    brand="godesk"
    themeOverride="light"
  >
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
        <ProjectFooter
          FooterString={experienceData.godesk.footer.footerString}
        />
      {/snippet}
    </ProjectCard>
  </Accordion>

  <Accordion
    label="fresha"
    suffix="Design System Lead"
    brand="fresha"
    themeOverride="dark"
  >
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
        <ProjectFooter
          FooterString={experienceData.fresha.footer.footerString}
        />
      {/snippet}
    </ProjectCard>
  </Accordion>

  <Accordion
    label="jio"
    suffix="Senior Product Designer"
    brand="jio"
    themeOverride="dark"
  >
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
  </Accordion>

  <Accordion
    label="ikea"
    suffix="Creative Director"
    brand="ikea"
    themeOverride="light"
  >
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
  </Accordion>

  <Accordion label="warhammer" suffix="Product Designer" brand="warhammer">
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
        <ProjectFooter
          FooterString={experienceData.warhammer.footer.footerString}
        />
      {/snippet}
    </ProjectCard>
  </Accordion>
</AccordionList>

<style>
</style>

<!-- DialogDetails.svelte -->

<script lang="ts">
  import type { GridArea } from './Section.svelte';

  const defaultSections = ['Intro', 'Body', 'Insights', 'Conclussion'];

  interface ProjectDetail {
    title: string;
    details: string;
  }

  const defaultDetails: ProjectDetail[] = [
    { title: 'Company', details: 'Fresha' },
    { title: 'Date', details: '2020-2023' },
  ];

  interface DialogDetailsProps {
    sections?: string[]; // array of strings
    projectDetails?: ProjectDetail[]; // array of objects
    gridArea?: GridArea;
  }

  let {
    projectDetails = defaultDetails,
    sections = defaultSections,
    gridArea = 'header',
  }: DialogDetailsProps = $props();
</script>

<!-- block scoped properties define the shape of the data -->
{#snippet ProjectDetailsBlock(param1: string, param2: string)}
  <div class="layout">
    <span class="title">{param1}</span>
    <span>{param2}</span>
  </div>
{/snippet}

{#snippet Team()}
  <div class="layout">
    <span class="title">Team</span>
    <ul>
      {#each sections as section}
        <li>
          {#if section.includes(' - ')}
            {@const [name, role] = section.split(' - ')}
            <span class="name">{name}</span>
            <span class="dash"> – </span>
            <span class="role">{role}</span>
          {:else}
            {section}
          {/if}
        </li>
      {/each}
    </ul>
  </div>
{/snippet}

<div class="dialog-details" style:--grid-area={gridArea}>
  {#each projectDetails as detail}
    {@render ProjectDetailsBlock(detail.title, detail.details)}
  {/each}
  {@render Team()}
</div>

<style>
  .dialog-details {
    grid-area: var(--grid-area);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: var(--spc-500);
    font-size: var(--fs-400);
  }

  .layout {
    display: inline-flex;
    width: 100%;
    flex-flow: column;
    gap: var(--spc-200);
  }

  .title {
    font-family: var(--font-family-alt);
    font-size: var(--fs-300);
    font-weight: var(--fw-regular);
    color: rgba(var(--color-txt-primary));
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px; /* Space between title text and line */
  }

  .title::after {
    content: '';
    display: block;
    width: 100%; /* Fixed width for the line */
    height: 1px; /* Thinner line for better aesthetics */
    background: currentColor;
  }

  span {
    font-weight: var(--fw-semibold);
    color: rgb(var(--color-txt-primary));
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--spc-100);
    padding-left: 0;
    list-style: none;
  }

  li {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    font-weight: var(--fw-medium);
    color: rgb(var(--color-txt-primary));
    position: relative;
    padding-left: var(--spc-75);
  }

  li::before {
    content: '';
    display: inline-block;
    width: 0.6em;
    height: 0.6em;
    background: var(--before-color, currentColor);
    border-radius: 2px;
    margin-right: 6px;
    vertical-align: middle;
  }

  .name {
    font-weight: var(--fw-medium); /* Keep current medium weight for names */
  }

  .role {
    font-weight: var(--fw-regular); /* Regular weight for roles */
  }

  .name,
  .role,
  .dash,
  li {
    white-space: nowrap;
  }

  .dash {
    font-weight: var(--fw-regular);
    color: rgb(var(--color-txt-primary));
    margin: 0 2px;
  }

  @media (min-width: 896px) {
    .dialog-details {
      flex-direction: row;
    }
  }
</style>

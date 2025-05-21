<!-- DialogDetails.svelte -->

<script lang="ts">


const defaultSections = ["Intro", "Body", "Insights", "Conclussion"]

interface ProjectDetail{
    title:string;
    details:string;
}

const defaultDetails: ProjectDetail[] = [
    {title: "Role", details: 'Design Lead'},
    {title: "Date", details: '2020-2023'}
]

interface DialogDetailsProps{
    sections?:string[]; // array of strings
    projectDetails?: ProjectDetail[]; // array of objects
}



let {projectDetails=defaultDetails, sections=defaultSections} : DialogDetailsProps = $props();

</script>

<!-- block scoped properties define the shape of the data -->
{#snippet ProjectDetailsBlock(param1:string ,param2:string)} 
<div class="layout">
<span class="title">{param1}</span>
<span>{param2}</span>
</div>
{/snippet}


{#snippet ProjectSections()}
<div class="layout">
    <span class="title">Contents</span>
    <ul>
        {#each sections as sections}
           <li>{sections}</li> 
        {/each}
    </ul>
</div>
{/snippet}



<div class="dialog-details">
    {#each  projectDetails as detail}
    {@render ProjectDetailsBlock(detail.title, detail.details)}
    {/each}
    {@render ProjectSections()}
</div>


<style>
    .dialog-details {
        grid-area: trailing ;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--spc-500);
        font-size: var(--fs-400);
    }

    .layout{
        display: flex;
        flex-flow: column;
        gap: var(--spc-100);
    }


   .title {
        font-weight: var(--fw-bold);
        color: rgb(var(--color-txt-primary));

    }

   span {
        font-weight: var(--fw-medium);
        color: rgb(var(--color-txt-primary));
    }

    ul {
        display: flex;
        flex-direction: column;
        gap: var(--spc-100);
        padding-left: 0;
        list-style: none;
    }

   li{
        font-weight: var(--fw-medium);
        color: rgb(var(--color-txt-primary));
        position: relative;
        padding-left: var(--spc-400);
    }

  li:before {
        content: "–";
        color: rgb(var(--color-txt-primary));
        position: absolute;
        left: 0;
    }
</style>
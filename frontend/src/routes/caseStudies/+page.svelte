<script lang="ts">
    let pageTitle: string = "Case Studies";
    console.log(pageTitle);
    // imports
    import { page } from "$app/stores";
    import BasicLayout from "$lib/components/layout/BasicLayout.svelte";
    import TopBar from "$lib/components/navigation/TopBar.svelte";
    import LinkList from "$lib/components/actions/LinkList.svelte";
    import SideBar from "$lib/components/navigation/SideBar.svelte";
    import VideoTile from "$lib/components/media/VideoTile.svelte";
    $: currentPath = $page.url.pathname;
</script>



<main class="main-root">
<BasicLayout>
 <TopBar slot="top-bar" />

<SideBar slot="side-nav">
    <LinkList
        routes={[
          { path: '/', label: 'Home' },
          { path: '/caseStudies', label: 'case studies' },
          { path: '/visualDesign', label: 'visual design' },
        ]}
        vertical={true}
        ariaLabel="Main Navigation"
     />

 </SideBar>


 <div slot="main">

<p>Case Studies</p>


<VideoTile 
    videoId="dQw4w9WgXcQ"
    subject="TUTORIAL"
    duration="3 MINUTES"
    title="Getting Started with Svelte Components"
/>

</div>
</BasicLayout>


</main>

<style>   

.main-root {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: var(--color-bg-primary);
    overflow-x: hidden;
}

</style>
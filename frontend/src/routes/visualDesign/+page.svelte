<script lang="ts">
    let pageTitle: string = "Visual Design";
    console.log(pageTitle);
    // imports
    import { page } from "$app/stores";
    import BasicLayout from "$lib/components/layout/BasicLayout.svelte";
    import TopBar from "$lib/components/navigation/TopBar.svelte";
    import LinkList from "$lib/components/actions/LinkList.svelte";
    import HeroHeader from "$lib/components/content/HeroHeader.svelte";
    import SideBar from "$lib/components/navigation/SideBar.svelte";
    import SimpleContentSection from "$lib/components/content/SimpleContentSection.svelte";
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
        showBorder={true}
        ariaLabel="Main Navigation"
     />

 </SideBar>


 <div slot="main">

<HeroHeader/>


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
<script lang="ts">
    let helloWorld: string = "Hello world";
    console.log(helloWorld);
    // imports
    import { page } from "$app/stores";
    import BasicLayout from "$lib/components/layout/BasicLayout.svelte";
    import TopBar from "$lib/components/navigation/TopBar.svelte";
    import LinkList from "$lib/components/actions/LinkList.svelte";
    import HeroHeader from "$lib/components/content/HeroHeader.svelte";
    import SideBar from "$lib/components/navigation/SideBar.svelte";
    import ProgressIndicator from "$lib/components/feedback/ProgressIndicator.svelte";
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
          { path: '/about', label: 'About' },
          { path: '/contact', label: 'Contact', disabled: true }
        ]}
        vertical={true}
        showBorder={true}
        ariaLabel="Main Navigation"
     />

 </SideBar>


 <div slot="main">

<HeroHeader/>

<SimpleContentSection 
    title="Getting Started" 
    paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation." 
    activeStep={1} 
/>

<SimpleContentSection 
    title="Key Features" 
    paragraph="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident." 
    activeStep={2} 
/>

<SimpleContentSection 
    title="Next Steps" 
    paragraph="Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis." 
    activeStep={3} 
/>

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
    width: 100vw;
    background-color: var(--color-bg-primary);
}

</style>
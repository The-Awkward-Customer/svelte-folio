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
    import RainDrops from "$lib/components/Marginalia/RainDrops.svelte";
    $: currentPath = $page.url.pathname;
</script>

<main class="main-root">
<BasicLayout>
    <TopBar slot="top-bar" />

    <SideBar slot="side-nav">
        <LinkList
            routes={[
                { path: '/', label: 'Welcome' },
                { path: '/caseStudies', label: 'case studies' },
                { path: '/visualDesign', label: 'visual design' },
            ]}
            vertical={true}
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
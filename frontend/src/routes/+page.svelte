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
 
<HeroHeader slot="main"/>
</BasicLayout>

</main>

<style>   

.main-root {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    background-color: rgb(154, 154, 154);
}
</style>
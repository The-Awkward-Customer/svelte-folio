<script lang="ts">
    let helloWorld: string = "Hello world";
    console.log(helloWorld);


    // components
    import { page } from "$app/stores";
    import BasicLayout from "$lib/components/layout/BasicLayout.svelte";
    import TopBar from "$lib/components/navigation/TopBar.svelte";
    import LinkList from "$lib/components/actions/LinkList.svelte";
    import SideBar from "$lib/components/navigation/SideBar.svelte";
    import { HeroRoot, HeroTitle, HeroIntro, HeroButton } from "$lib/components/content/Hero";
    import Callout from "$lib/components/feedback/Callout.svelte";
    //Icons
    import IconRefresh from "$lib/components/primatives/IconRefresh.svelte";
    import { dialogManager } from '$lib/stores/dialogManager';
    import DialogRoot from '$lib/components/modals/DialogRoot.svelte';

    function handleClick() {
        // This is not being called
        console.log('hero button clicked!!');
    }

    function openTheDialog() {
        console.log('Opening dialog...');
        dialogManager.showDialog('mainPageDialog', { message: 'Hello from the page!' });
    }

    $: currentPath = $page.url.pathname;
</script>

<DialogRoot />

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
        <HeroRoot>
            <Callout />
            <HeroTitle />
            <HeroIntro>High growth, high impact solutions using design, technology and data.</HeroIntro>
            <HeroIntro color="secondary">
                Trigger the dialog with this button: 
                <HeroButton on:click={openTheDialog} label="open dialog" /> 
                and this is the rest of the text.
            </HeroIntro>
        </HeroRoot>
    </div>
</BasicLayout>
</main>

<style>   
.main-root {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: var(--color-bg-primary);
    overflow-x: hidden;
}


</style>
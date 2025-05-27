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
    import { dialogManager } from '$lib/stores/dialogManager';
    import DialogRoot from '$lib/components/Dialog/DialogRoot.svelte';
    import IntroText from "$lib/components/content/IntroText.svelte";
    import Accordian from "$lib/components/accordian/Accordian.svelte";
    import TestComp from "$lib/components/gsap/TestComp.svelte";

    //Page Content
    let HeroIntroText: string = "Currently based in sunny Madrid, and available for new projects in Q3 2025.";


    function openTheDialog() {
        console.log('Opening dialog...');
        dialogManager.showDialog('mainPageDialog', { message: 'Hello from the page!' });
    }

    function openFreshaDialog() {
        dialogManager.showDialog('freshaDialog')
    }
    function openShellDialog() {
        dialogManager.showDialog('shellDialog')
    }

    $: currentPath = $page.url.pathname;
</script>

<TestComp/>

<ol>
<Accordian number="1"  label="Start here" >
    <IntroText/>
</Accordian>

<Accordian number="2"  label="Experience">
    <IntroText/>
</Accordian>

<Accordian number="3"  label="How I work">
    <IntroText/>
</Accordian>
</ol>

<style>   


</style>
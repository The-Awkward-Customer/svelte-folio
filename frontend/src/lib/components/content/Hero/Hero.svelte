<!-- Hero.svelte -->

<script lang="ts">
    import Callout from '$lib/components/feedback/Callout.svelte';
    import HeroTitle from '$lib/components/content/Hero/HeroTitle.svelte';
    import HeroIntro from '$lib/components/content/Hero/HeroIntro.svelte';
    import HeroButton from '$lib/components/content/Hero/HeroButton.svelte';

    function handleClick() {
        console.log('hero button clicked');
    }
</script>

<div class="hero-root">
    <Callout />
    <HeroTitle />
    <HeroIntro color="secondary">High growth, high impact solutions using design, technology and data.</HeroIntro>
    <HeroIntro>some simple text for now <HeroButton onClick={handleClick} label="click me"/> and this is the rest. </HeroIntro> 
    
</div>

<style>
    .hero-root {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        /* background-color: rgba(255, 192, 203, 0.107); */
        padding-top: 20vh ;
        padding-bottom: var(--spc-800);
        padding-left: var(--padding-mobile-default);
        padding-right: var(--padding-mobile-default);
    }

    @media (min-width: 896px) {
        .hero-root {
            background-color: rgba(0, 0, 255, 0.074);
            padding-top: 20vh ;
            padding-left: var(--padding-mobile-default);
            padding-right: var(--padding-mobile-default);
          
        }
    }
</style>

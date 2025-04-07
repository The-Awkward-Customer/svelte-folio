<!-- Hero.svelte -->

<script lang="ts">
    import Callout from '$lib/components/feedback/Callout.svelte';
    import HeroTitle from '$lib/components/content/Hero/HeroTitle.svelte';
    import HeroIntro from '$lib/components/content/Hero/HeroIntro.svelte';
    import HeroButton from '$lib/components/content/Hero/HeroButton.svelte';

</script>

<section class="hero-root">
    <slot></slot>
</section>

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
            padding-top: 146px ;
            padding-left: var(--padding-mobile-default);
            padding-right: var(--padding-mobile-default);
          
        }
    }
</style>

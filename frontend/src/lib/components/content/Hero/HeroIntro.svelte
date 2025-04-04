<!-- HeroIntro.svelte -->

<script lang="ts">

    interface $$Props {
        color?: 'primary' | 'secondary';
    }

    export let color: $$Props['color'] = 'primary';
</script>

<div class="hero-intro" class:primary={color === 'primary'} class:secondary={color === 'secondary'}>
    <slot>
        I am placeholder copy.
    </slot>
</div>

<style>
    .hero-intro {
        display: block;
        align-items: flex-start;
        font-family: var(--font-family-main);
        font-size: var(--fs-300);
        font-weight: var(--fw-medium);
        padding-top: var(--spc-500);
    }


    .hero-intro.primary {
        color: rgb(var(--color-txt-primary));
    }

    .hero-intro.secondary {
        color: rgb(var(--color-txt-secondary));
    }
</style>
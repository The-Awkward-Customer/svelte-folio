<script lang="ts">
    import { getContext } from 'svelte';
    import { fade } from 'svelte/transition';
    import LinkList from "$lib/components/actions/LinkList.svelte";

    interface MobileNavigationContext {
        isOpen: { subscribe: (callback: (value: boolean) => void) => () => void };
        close: () => void;
        zIndexBase: number;
    }

    interface MobileNavigationMenuProps {
        class?: string;
        style?: string;
        transitionDuration?: number;
    }

    const { 
        class: class$ = '',
        style = '',
        transitionDuration = 200
    } = $props();

    // Get context from parent
    const { isOpen, close, zIndexBase } = getContext<MobileNavigationContext>('mobile-nav');

    // Compute z-index based on base
    const zIndex = $derived(zIndexBase + 1);

    // Compute classes
    const classes = $derived(`
        mobile-nav-menu
        ${class$}
    `.trim());
</script>

{#if $isOpen}
    <div 
        class={classes}
        style="z-index: {zIndex}; {style}"
        role="dialog"
        aria-modal="true"
        transition:fade={{ duration: transitionDuration }}
    >
        <LinkList
            routes={[
                { path: '/', label: 'Home' },
                { path: '/caseStudies', label: 'case studies' },
                { path: '/visualDesign', label: 'visual design' },
            ]}
            vertical={true}
            showBorder={true}
            ariaLabel="Mobile Navigation"
        />
    </div>
{/if}

<style>
    .mobile-nav-menu {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 400px;
        background-color: white;
        box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>

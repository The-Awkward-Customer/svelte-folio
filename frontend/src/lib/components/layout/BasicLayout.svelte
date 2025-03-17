<script lang="ts">
    // Import Svelte's built-in stores - similar to React context but simpler
    import { page } from '$app/stores';
    // Similar to React's useEffect hook, but used differently in Svelte
    import { onMount } from 'svelte';
    //import global css
    import '../../../app.css'
    // $: is Svelte's reactive declaration - any time $page.url.pathname changes,
    // currentPath will be updated automatically (similar to React's useMemo)
    // The $ prefix before page means "subscribe to this store" (Svelte-specific)
    $: currentPath = $page.url.pathname;
    
    // Regular variable declaration - in Svelte, these are reactive by default
    // Unlike React's useState, you directly assign to variables to update them
    let width = 0;
    
    interface $$Slots {
        'top-bar': {};
        'side-nav': {};
        'main': {};
    }
    
    // Similar to React's useEffect with an empty dependency array
    // This runs once when the component mounts
    onMount(() => {
        // Set initial width
        width = window.innerWidth;
        
        // Define resize handler
        const handleResize = () => {
            // In Svelte, this direct assignment is enough to trigger reactivity
            // No need for setState like in React
            width = window.innerWidth;
        };
        
        window.addEventListener('resize', handleResize);
        
        // Return a cleanup function (like in React's useEffect)
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    });
    
    // More reactive declarations - these automatically update when width changes
    // Similar to React's useMemo but with cleaner syntax
    $: isMobile = width < 768;
    $: isDesktop = width >= 768;
</script>

<!-- In Svelte, this is just HTML with some extras - no need to return JSX -->
<div class="basic-layout-root">
    <!-- Conditional rendering in Svelte uses {#if}, {/if} blocks instead of the ternary operator in React -->
    {#if isMobile || !isDesktop}
        <div class="basic-layout-top-bar">
            <!-- Svelte uses <slot> for React's children concept, but with named slots -->
            <!-- This is like React's props.children but more powerful -->
            <slot name="top-bar">
                <!-- Default fallback content if nothing is provided to this slot -->
                <p>Default Top Bar Content</p>
            </slot>
        </div>
    {/if}
    
    {#if isDesktop}
        <div class="basic-layout-side-nav">
            <slot name="side-nav">
                <p>Default Side Nav Content</p>
            </slot>
        </div>
    {/if}
    
    <div class="basic-layout-main">
        <slot name="main">
            <p>Default Main Content</p>
        </slot>
    </div>
</div>

<!-- In Svelte, styles are scoped to the component by default -->
<!-- No need for CSS-in-JS libraries or styled-components -->
<style>
    .basic-layout-root {
        display: grid;
        height: 100%;
        width: 100%;
        background-color: var(--color-primary);
        max-width: 1200px;
        margin: 0 auto;
    }
    
    /* Regular CSS @media queries work directly in Svelte components */
    @media (max-width: 767px) {
        .basic-layout-root {
            grid-template-columns: 1fr;
            grid-template-rows: 88px 1fr;
            /* CSS grid template areas for layout */
            grid-template-areas:
                "top-bar"
                "main";
                background-color: red;
        }
        
        /* This class won't apply on mobile due to the conditional rendering in the template */
        /* But this is a failsafe to ensure it's hidden if it somehow did render */
        .basic-layout-side-nav {
            display: none;
        }
    }
    
    @media (min-width: 768px) {
        .basic-layout-root {
            grid-template-columns: 200px 1fr;
            grid-template-rows: 1fr;
            grid-template-areas:
                "side-nav main";
                background-color:blue;
        }
        
        /* Same failsafe for the top bar on desktop */
        .basic-layout-top-bar {
            display: none;
        }
    }
    
    /* These classes assign elements to the named grid areas */
    .basic-layout-top-bar {
        grid-area: top-bar;
        display: inline-flex;
        align-items: center;
        width: 100%;
        height: fit-content;
        background-color: rgba(0, 0, 255, 0.204);
    }
    
    .basic-layout-side-nav {
        grid-area: side-nav;
        height: 100%;
        width: 200px;
        background-color: rgba(255, 0, 0, 0.21);
    }
    
    .basic-layout-main {
        grid-area: main;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 128, 0, 0.228);
    }
</style>
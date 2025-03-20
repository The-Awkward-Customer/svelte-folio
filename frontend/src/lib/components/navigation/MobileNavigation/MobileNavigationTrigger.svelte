<script lang="ts">
    import Button from '$lib/components/actions/Button.svelte';
    import { getContext } from 'svelte';

    interface MobileNavigationContext {
        isOpen: { subscribe: (callback: (value: boolean) => void) => () => void };
        toggle: () => void;
    }

    interface MobileNavigationTriggerProps {
        label?: string;
        icon?: string;
        variant?: 'primary' | 'secondary';
        size?: 'sm' | 'md' | 'lg';
        iconPosition?: 'left' | 'right';
        hideLabel?: boolean;
        class?: string;
    }

    const { 
        label = 'Menu',
        icon = '☰',
        variant = 'primary' as const,
        size = 'md' as const,
        iconPosition = 'left' as const,
        hideLabel = false,
        class: class$ = ''
    } = $props();

    // Get context from parent
    const { isOpen, toggle } = getContext<MobileNavigationContext>('mobile-nav');

    // Simple counter for unique IDs
    const menuId = `mobile-nav-${Math.random().toString(36).slice(2, 7)}`;

    // Compute classes
    const classes = $derived(`
        mobile-nav-trigger
        icon-${iconPosition}
        ${class$}
    `.trim());
</script>

<Button
    {variant}
    {size}
    class={classes}
    ariaLabel={hideLabel ? label : undefined}
    ariaControls={menuId}
    ariaExpanded={$isOpen}
    on:click={toggle}
>
    {#if iconPosition === 'left' && icon}
        <span class="icon">{icon}</span>
    {/if}
    
    {#if !hideLabel}
        <span class="label">{label}</span>
    {/if}

    {#if iconPosition === 'right' && icon}
        <span class="icon">{icon}</span>
    {/if}
</Button>

<style>
    .mobile-nav-trigger {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
    }

    .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .icon-right {
        flex-direction: row-reverse;
    }
</style>

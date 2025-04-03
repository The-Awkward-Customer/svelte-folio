<script lang="ts">
    // Props interface
    interface ButtonProps {
        variant: 'primary' | 'secondary' | 'primary-icon' | 'secondary-icon';
        size?: 'sm' | 'md' | 'lg';
        type?: 'button' | 'submit' | 'reset';
        disabled?: boolean;
        ariaLabel?: string;
        ariaControls?: string;
        ariaExpanded?: boolean;
    }

    // Props with defaults
    export let variant: ButtonProps['variant'] = 'primary';
    export let size: ButtonProps['size'] = 'md';
    export let type: ButtonProps['type'] = 'button';
    export let disabled: ButtonProps['disabled'] = false;
    export let ariaLabel: ButtonProps['ariaLabel'] = undefined;
    export let ariaControls: ButtonProps['ariaControls'] = undefined;
    export let ariaExpanded: ButtonProps['ariaExpanded'] = undefined;
    
    // Compute classes and determine if it's an icon variant
    $: isIconVariant = variant.includes('icon');
    $: baseVariant = isIconVariant ? variant.replace('-icon', '') : variant;
    $: componentClasses = `
      btn 
      btn-${baseVariant}
      ${isIconVariant ? 'btn-icon' : ''}
      btn-${size}
    `.trim();
  </script>
  
  <button
    {type}
    class={componentClasses}
    {disabled}
    aria-label={ariaLabel}
    aria-controls={ariaControls}
    aria-expanded={ariaExpanded}
    on:click
    {...$$restProps}
  >
    {#if isIconVariant}
        <slot />
    {:else}
        <span class="btn-text">
            <slot />
        </span>
    {/if}
  </button>
  
  <style>
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: var(--bdr-radius-pill);
      cursor: pointer;
      font-family: inherit;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
      position: relative;
      /* Ensure button is visible and interactive */
      z-index: 1;
      visibility: visible;
      opacity: 1;
      font-family: var(--font-family-main);
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      /* Even when disabled, keep some visual feedback */
      pointer-events: none;
    }
    
    /* Focus visible styles */
    .btn:focus {
      /* Add this to ensure focus ring shows */
      outline: revert;
    }
    
    .btn:focus-visible {
      outline: none !important;
      /* Make focus ring more prominent and force it with !important */
      box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.8) !important;
      z-index: 2;
    }

    /* Primary variant focus - white ring for better contrast on dark background */
    .btn-primary:focus-visible {
      box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.9) !important;
    }
    
    /* Variants */
    .btn-primary {
      background-color: rgba(var(--color-bg-inverse) / var(--opacity-invisible));
      color: var(--color-text-primary);
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: rgb(var(--color-bg-inverse) / var(--opacity-hover));
    }

    .btn-primary:active:not(:disabled) {
      background-color: rgb(var(--color-bg-inverse) / var(--opacity-active));
    }
    
    .btn-secondary {
      background-color: #ff1414;
      color: #333;
    }
    
    .btn-secondary:hover:not(:disabled) {
      background-color: #e0e0e0;
    }
    
    /* Sizes */
    .btn-sm {
      font-size: 0.875rem;
      padding: 0.25rem 0.5rem;
      height: 2rem;
      font-size: var(--fs-250);
      font-weight: var(--fw-medium);
    }
    
    .btn-md {
      font-size: 1rem;
      padding: 0.5rem 1rem;
      height: 2.5rem;
      font-size: var(--fs-300);
      font-weight: var(--fw-medium);
    }
    
    .btn-lg {
      font-size: 1.125rem;
      padding: 0.75rem 1.5rem;
      height: 3rem;
      font-size: var(--fs-400);
      font-weight: var(--fw-medium);
    }

    /* Icon variant styles */
    .btn-icon {
        padding: 0;
        aspect-ratio: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .btn-icon.btn-sm {
        width: 2rem;
    }
    
    .btn-icon.btn-md {
        width: 2.5rem;
    }
    
    .btn-icon.btn-lg {
        width: 3rem;
    }
  </style>
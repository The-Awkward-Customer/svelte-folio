<script lang="ts">
    // Props interface
    interface ButtonProps {
        variant?: 'primary' | 'secondary';
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
    
    // Compute classes based on props
    $: componentClasses = `
      btn 
      btn-${variant} 
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
    <span class="btn-text">
      <slot />
    </span>
  </button>
  
  <style>
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-family: inherit;
      font-weight: 500;
      text-decoration: none;
      transition: background-color 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    /* Variants */
    .btn-primary {
      background-color: #3949ab;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background-color: #303f9f;
    }
    
    .btn-secondary {
      background-color: #f5f5f5;
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
    }
    
    .btn-md {
      font-size: 1rem;
      padding: 0.5rem 1rem;
      height: 2.5rem;
    }
    
    .btn-lg {
      font-size: 1.125rem;
      padding: 0.75rem 1.5rem;
      height: 3rem;
    }
  </style>
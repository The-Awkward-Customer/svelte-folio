<script lang="ts">
  import type { IconProps, IconName } from '../../types/icons.js';

  let { 
    name, 
    alt = '', 
    size = 24,
    fill = '--fg-text-primary',
    class: className = ''
  }: IconProps = $props();

  // Inline SVG registry - no external dependencies
  const iconRegistry: Record<IconName, string> = {
    // Weather Icons - Day versions
    '01d': `<g>
      <circle cx="12" cy="12" r="4"/>
      <path d="m12 2-1-1h2l-1 1m-7 9-1-1v2l1-1m14 0 1-1v2l-1-1m-7 7 1 1h-2l1-1"/>
      <path d="m20.2 7.8-1.4-1.4m-12.4 0L4.8 7.8m0 8.4 1.4 1.4m12.4 0 1.4-1.4"/>
    </g>`,
    
    // Weather Icons - Night versions
    '01n': `<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,
    
    '02d': `<g>
      <path d="M17.5 18H9a4 4 0 1 1 0-8 5.5 5.5 0 1 1 8.5 6z"/>
      <path d="M19 8a2 2 0 0 0 0-4m0 4a2 2 0 0 1 0-4m0 4h1m-1 0v1"/>
    </g>`,
    
    '02n': `<g>
      <path d="M17.5 18H9a4 4 0 1 1 0-8 5.5 5.5 0 1 1 8.5 6z"/>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" opacity="0.7"/>
    </g>`,
    
    '03d': `<path d="M17.5 19H5a4 4 0 1 1 1-7.9 7 7 0 1 1 11.5 7.9z"/>`,
    '03n': `<path d="M17.5 19H5a4 4 0 1 1 1-7.9 7 7 0 1 1 11.5 7.9z"/>`,
    
    '04d': `<g>
      <path d="M17.5 21H5a4 4 0 1 1 1-7.9"/>
      <path d="M22 17.5a2.5 2.5 0 0 0-2.5-2.5c-.5 0-1 .2-1.4.5"/>
    </g>`,
    '04n': `<g>
      <path d="M17.5 21H5a4 4 0 1 1 1-7.9"/>
      <path d="M22 17.5a2.5 2.5 0 0 0-2.5-2.5c-.5 0-1 .2-1.4.5"/>
    </g>`,
    
    '05d': `<g>
      <path d="M17.5 19H5a4 4 0 1 1 1-7.9 7 7 0 1 1 11.5 7.9z"/>
      <path d="m8 19 1 3-1-3m4 0 1 3-1-3m4 0 1 3-1-3"/>
    </g>`,
    '05n': `<g>
      <path d="M17.5 19H5a4 4 0 1 1 1-7.9 7 7 0 1 1 11.5 7.9z"/>
      <path d="m8 19 1 3-1-3m4 0 1 3-1-3m4 0 1 3-1-3"/>
    </g>`,
    
    '06d': `<g>
      <path d="M17.5 19H5a4 4 0 1 1 1-7.9 7 7 0 1 1 11.5 7.9z"/>
      <path d="m8 19 1 3-1-3m4 0 1 3-1-3m4 0 1 3-1-3"/>
    </g>`,
    '06n': `<g>
      <path d="M17.5 19H5a4 4 0 1 1 1-7.9 7 7 0 1 1 11.5 7.9z"/>
      <path d="m8 19 1 3-1-3m4 0 1 3-1-3m4 0 1 3-1-3"/>
    </g>`,
    
    '07d': `<g>
      <path d="M17.5 19H5a4 4 0 1 1 1-7.9 7 7 0 1 1 11.5 7.9z"/>
      <path d="m13 16-6 6h4l-2 4 6-6h-4l2-4z"/>
    </g>`,
    '07n': `<g>
      <path d="M17.5 19H5a4 4 0 1 1 1-7.9 7 7 0 1 1 11.5 7.9z"/>
      <path d="m13 16-6 6h4l-2 4 6-6h-4l2-4z"/>
    </g>`,
    
    '08d': `<g>
      <path d="M17.5 19H5a4 4 0 1 1 1-7.9 7 7 0 1 1 11.5 7.9z"/>
      <path d="m8 19 1 1-1 1m0-2-1 1 1 1m4-2 1 1-1 1m0-2-1 1 1 1m4-2 1 1-1 1m0-2-1 1 1 1"/>
    </g>`,
    '08n': `<g>
      <path d="M17.5 19H5a4 4 0 1 1 1-7.9 7 7 0 1 1 11.5 7.9z"/>
      <path d="m8 19 1 1-1 1m0-2-1 1 1 1m4-2 1 1-1 1m0-2-1 1 1 1m4-2 1 1-1 1m0-2-1 1 1 1"/>
    </g>`,
    
    // Simple UI Icons
    placeholder: `<g>
      <path d="M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM4.5 19.5V5.56031L18.4397 19.5H4.5ZM5.56031 4.5H19.5V18.4406L5.56031 4.5Z"/>
    </g>`,

    //  placeholder:`
    // <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    // <path d="M19.5 3H4.5C4.10218 3 3.72064 3.15804 3.43934 3.43934C3.15804 3.72064 3 4.10218 3 4.5V19.5C3 19.8978 3.15804 20.2794 3.43934 20.5607C3.72064 20.842 4.10218 21 4.5 21H19.5C19.8978 21 20.2794 20.842 20.5607 20.5607C20.842 20.2794 21 19.8978 21 19.5V4.5C21 4.10218 20.842 3.72064 20.5607 3.43934C20.2794 3.15804 19.8978 3 19.5 3ZM4.5 19.5V5.56031L18.4397 19.5H4.5ZM5.56031 4.5H19.5V18.4406L5.56031 4.5Z" fill="#26272D"/>
    // </svg>`

    
    close: `<g>
      <path d="m18 6-12 12"/>
      <path d="m6 6 12 12"/>
    </g>`,
    
  };

  const iconContent = $derived(iconRegistry[name] || '');
  
  // Handle CSS custom properties for fill/stroke
  const normalizedFill = $derived(fill?.startsWith('--') ? `rgb(var(${fill}))` : fill);
</script>

{#if iconContent}
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={normalizedFill}
    class="icon {className}"
    role="img"
    aria-label={alt || name}
  >
    {@html iconContent}
  </svg>
{:else}
  <div class="icon-missing" style="width: 24px; height: 24px;">
    <span>!</span>
  </div>
{/if}

<style>
  .icon {
    display: inline-block;
    vertical-align: middle;
    flex-shrink: 0;
  }
  
  .icon-missing {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #f3f4f6;
    border: 1px dashed #d1d5db;
    border-radius: 4px;
    color: #6b7280;
    font-size: 10px;
    font-weight: bold;
  }
</style>
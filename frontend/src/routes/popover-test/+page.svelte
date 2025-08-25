<script lang="ts">
  import { Popover } from '$lib/components/popover';
</script>

<svelte:head>
  <title>Popover Component Test</title>
</svelte:head>

<div class="test-page">
  <header class="page-header">
    <h1>🪟 Popover Component Test</h1>
    <p>Hover on desktop, click on mobile - opinionated design</p>
  </header>


  <!-- Test Grid -->
  <div class="test-grid">
    <!-- Default behavior -->
    <div class="test-card">
      <h3>Default Behavior</h3>
      <p>Hover on desktop (150ms), tap on mobile</p>
      
      <Popover
        id="hover-basic"
      >
        {#snippet trigger()}
          <button class="trigger-button">Hover Me</button>
        {/snippet}
        
        {#snippet content()}
          <div class="popover-menu">
            <h4>User Menu</h4>
            <ul>
              <li><button>👤 Profile</button></li>
              <li><button>⚙️ Settings</button></li>
              <li><button>📊 Analytics</button></li>
              <li><button>🚪 Logout</button></li>
            </ul>
          </div>
        {/snippet}
      </Popover>
    </div>

    <!-- Top position -->
    <div class="test-card">
      <h3>Top Position</h3>
      <p>Hover on desktop, tap on mobile - positioned above</p>
      
      <Popover
        id="top-position"
        position="top"
      >
        {#snippet trigger()}
          <button class="trigger-button">Top Popover</button>
        {/snippet}
        
        {#snippet content()}
          <div class="popover-content">
            <p>✨ This popover toggles on click!</p>
            <button>Action Button</button>
          </div>
        {/snippet}
      </Popover>
    </div>

    <!-- Right position -->
    <div class="test-card">
      <h3>Right Position</h3>
      <p>Positioned to the right of trigger</p>
      
      <Popover
        id="right-position"
        position="right"
      >
        {#snippet trigger()}
          <button class="trigger-button">Right Popover</button>
        {/snippet}
        
        {#snippet content()}
          <div class="popover-content">
            <p>👉 From the right!</p>
            <button>Action Button</button>
          </div>
        {/snippet}
      </Popover>
    </div>

    <!-- Left position -->
    <div class="test-card">
      <h3>Left Position</h3>
      <p>Positioned to the left of trigger</p>
      
      <Popover
        id="left-position"
        position="left"
      >
        {#snippet trigger()}
          <button class="trigger-button">Left Popover</button>
        {/snippet}
        
        {#snippet content()}
          <div class="popover-content">
            <p>👈 From the left!</p>
            <p>Smart positioning</p>
          </div>
        {/snippet}
      </Popover>
    </div>

    <!-- Rich content -->
    <div class="test-card">
      <h3>Rich Interactive Content</h3>
      <p>Forms and buttons work in hover mode</p>
      
      <Popover
        id="rich-content"
        position="bottom"
      >
        {#snippet trigger()}
          <button class="trigger-button">Rich Content</button>
        {/snippet}
        
        {#snippet content()}
          <div class="popover-form">
            <h4>Quick Form</h4>
            <div class="form-group">
              <label for="name">Name:</label>
              <input id="name" type="text" placeholder="Enter your name" />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div class="form-actions">
              <button class="primary">Submit</button>
              <button class="secondary">Cancel</button>
            </div>
          </div>
        {/snippet}
      </Popover>
    </div>

    <!-- No outside click -->
    <div class="test-card">
      <h3>Bottom Position (Default)</h3>
      <p>Standard bottom positioning with consistent timing</p>
      
      <Popover
        id="bottom-position"
        position="bottom"
      >
        {#snippet trigger()}
          <button class="trigger-button">Bottom Popover</button>
        {/snippet}
        
        {#snippet content()}
          <div class="popover-content">
            <p>⬇️ Standard positioning</p>
            <p>Consistent 150ms delay for all popovers</p>
          </div>
        {/snippet}
      </Popover>
    </div>
  </div>

  <!-- Instructions -->
  <div class="instructions">
    <h3>🧪 Testing Instructions</h3>
    <ul>
      <li><strong>Desktop:</strong> Hover to show/hide with consistent 150ms delay</li>
      <li><strong>Mobile:</strong> Tap to toggle - shows as bottom sheet regardless of desktop settings</li>
      <li><strong>Positioning:</strong> Smart positioning that flips to opposite side if doesn't fit in viewport</li>
      <li><strong>Content Interaction:</strong> On desktop, mouse can move into popover content without closing</li>
      <li><strong>Keyboard:</strong> Tab focuses triggers, Enter/Space works on mobile, Escape closes on both</li>
      <li><strong>Responsive:</strong> Automatically switches behavior at 768px breakpoint</li>
      <li><strong>Scroll Following:</strong> Desktop popovers follow their triggers during scroll</li>
    </ul>
  </div>
</div>

<style>
  .test-page {
    min-height: 100vh;
    padding: var(--spacing-grouped);
    font-family: var(--font-family-main);
    background: var(--bg-page);
    color: var(--fg-text-primary);
  }

  .page-header {
    text-align: center;
    margin-bottom: var(--spacing-separated);
  }

  .page-header h1 {
    font-size: var(--fs-700);
    font-weight: 700;
    margin-bottom: var(--spacing-related);
    color: var(--fg-text-primary);
  }

  .page-header p {
    font-size: var(--fs-350);
    color: var(--fg-text-secondary);
    max-width: 600px;
    margin: 0 auto;
  }


  .test-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-grouped);
    margin-bottom: var(--spacing-separated);
  }

  .test-card {
    background: var(--bg-page);
    border: 1px solid var(--fg-text-muted-40);
    border-radius: var(--border-radius-card);
    padding: var(--spacing-grouped);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .test-card h3 {
    margin: 0 0 var(--spacing-related) 0;
    font-size: var(--fs-400);
    color: var(--fg-text-primary);
  }

  .test-card p {
    margin: 0 0 var(--spacing-grouped-relaxed) 0;
    color: var(--fg-text-secondary);
    font-size: var(--fs-275);
  }

  .trigger-button {
    background: var(--bg-primary);
    color: var(--fg-text-inverse);
    border: 1px solid var(--bg-primary);
    border-radius: var(--border-radius-card);
    padding: var(--spacing-related) var(--spacing-grouped);
    font-family: var(--font-family-main);
    font-size: var(--fs-300);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    min-width: 120px;
  }

  .trigger-button:hover {
    background: var(--fg-text-primary-90);
    border-color: var(--fg-text-primary-90);
  }

  .trigger-button:active {
    transform: translateY(1px);
  }

  .trigger-button:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring-color);
    outline-offset: var(--focus-ring-offset);
  }

  /* Popover content styles */
  .popover-menu h4 {
    margin: 0 0 var(--spacing-related) 0;
    color: var(--fg-text-primary);
    font-size: var(--fs-350);
  }

  .popover-menu ul {
    list-style: none;
    padding: 0;
    margin: 0;
    min-width: 180px;
  }

  .popover-menu li {
    margin-bottom: var(--spacing-related-dense);
  }

  .popover-menu button,
  .popover-content button {
    width: 100%;
    padding: var(--spacing-related) var(--spacing-related-relaxed);
    border: 1px solid var(--fg-text-muted-40);
    border-radius: 4px;
    background: var(--bg-page);
    color: var(--fg-text-primary);
    cursor: pointer;
    font-size: var(--fs-275);
    transition: all 0.2s ease;
    text-align: left;
  }

  .popover-menu button:hover,
  .popover-content button:hover {
    background: var(--fg-text-primary-10);
    border-color: var(--fg-text-primary-60);
  }

  .popover-content {
    min-width: 200px;
  }

  .popover-content p {
    margin: 0 0 var(--spacing-related) 0;
    color: var(--fg-text-primary);
    font-size: var(--fs-275);
    line-height: 1.4;
  }

  .popover-form h4 {
    margin: 0 0 var(--spacing-related-relaxed) 0;
    color: var(--fg-text-primary);
    font-size: var(--fs-350);
  }

  .form-group {
    margin-bottom: var(--spacing-related-relaxed);
  }

  .form-group label {
    display: block;
    margin-bottom: var(--spacing-related-dense);
    color: var(--fg-text-primary);
    font-size: var(--fs-275);
    font-weight: 500;
  }

  .form-group input {
    width: 100%;
    padding: var(--spacing-related) var(--spacing-related-relaxed);
    border: 1px solid var(--fg-text-muted-40);
    border-radius: 4px;
    background: var(--bg-page);
    color: var(--fg-text-primary);
    font-size: var(--fs-275);
    font-family: var(--font-family-main);
  }

  .form-group input:focus {
    outline: none;
    border-color: var(--bg-primary);
    box-shadow: 0 0 0 2px var(--bg-primary-20);
  }

  .form-actions {
    display: flex;
    gap: var(--spacing-related);
    margin-top: var(--spacing-grouped);
  }

  .form-actions button {
    flex: 1;
    padding: var(--spacing-related) var(--spacing-related-relaxed);
    border: 1px solid;
    border-radius: 4px;
    cursor: pointer;
    font-size: var(--fs-275);
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .form-actions button.primary {
    background: var(--bg-primary);
    border-color: var(--bg-primary);
    color: var(--fg-text-inverse);
  }

  .form-actions button.primary:hover {
    background: var(--fg-text-primary-90);
    border-color: var(--fg-text-primary-90);
  }

  .form-actions button.secondary {
    background: var(--bg-page);
    border-color: var(--fg-text-muted-40);
    color: var(--fg-text-primary);
  }

  .form-actions button.secondary:hover {
    background: var(--fg-text-primary-10);
    border-color: var(--fg-text-primary-60);
  }

  .instructions {
    background: var(--fg-text-primary-10);
    border-radius: var(--border-radius-card);
    padding: var(--spacing-grouped);
  }

  .instructions h3 {
    margin: 0 0 var(--spacing-related-relaxed) 0;
    color: var(--fg-text-primary);
    font-size: var(--fs-400);
  }

  .instructions ul {
    margin: 0;
    padding-left: var(--spacing-grouped);
  }

  .instructions li {
    margin-bottom: var(--spacing-related);
    color: var(--fg-text-primary);
    font-size: var(--fs-275);
    line-height: 1.5;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .test-grid {
      grid-template-columns: 1fr;
      gap: var(--spacing-related-relaxed);
    }
    
    .test-page {
      padding: var(--spacing-related-relaxed);
    }

    .page-header h1 {
      font-size: var(--fs-600);
    }
  }
</style>
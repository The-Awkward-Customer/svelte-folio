<script lang="ts">
  import { PopoverUnified } from '$lib/components/popover';

  let consoleOutput = $state<string[]>([]);

  function addToConsole(message: string) {
    consoleOutput = [...consoleOutput, `${new Date().toLocaleTimeString()}: ${message}`];
  }

  function handleOpen(id: string) {
    addToConsole(`Popover '${id}' opened`);
  }

  function handleClose(id: string) {
    addToConsole(`Popover '${id}' closed`);
  }

  function clearConsole() {
    consoleOutput = [];
  }
</script>

<svelte:head>
  <title>Popover Component Test</title>
</svelte:head>

<div class="test-page">
  <header class="page-header">
    <h1>🪟 Popover Component Test</h1>
    <p>Testing the single-component popover with responsive behavior</p>
  </header>

  <!-- Console Output -->
  <div class="console">
    <div class="console-header">
      <h3>📋 Event Console</h3>
      <button onclick={clearConsole} class="clear-btn">Clear</button>
    </div>
    <div class="console-output">
      {#each consoleOutput as message}
        <div class="console-line">{message}</div>
      {/each}
      {#if consoleOutput.length === 0}
        <div class="console-line empty">No events yet...</div>
      {/if}
    </div>
  </div>

  <!-- Test Grid -->
  <div class="test-grid">
    <!-- Basic popover -->
    <div class="test-card">
      <h3>Basic Menu (Bottom)</h3>
      <p>Standard popover with menu items</p>
      
      <PopoverUnified
        id="basic-unified"
        onOpen={() => handleOpen('basic')}
        onClose={() => handleClose('basic')}
      >
        {#snippet trigger()}
          <button class="trigger-button">Open Menu</button>
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
      </PopoverUnified>
    </div>

    <!-- Top position -->
    <div class="test-card">
      <h3>Top Position</h3>
      <p>Popover appearing above trigger</p>
      
      <PopoverUnified
        id="top-unified"
        position="top"
        onOpen={() => handleOpen('top')}
        onClose={() => handleClose('top')}
      >
        {#snippet trigger()}
          <button class="trigger-button">Top Popover</button>
        {/snippet}
        
        {#snippet content()}
          <div class="popover-content">
            <p>✨ This popover appears above the trigger!</p>
            <button>Action Button</button>
          </div>
        {/snippet}
      </PopoverUnified>
    </div>

    <!-- Right position -->
    <div class="test-card">
      <h3>Right Position</h3>
      <p>Slides in from the right</p>
      
      <PopoverUnified
        id="right-unified"
        position="right"
        onOpen={() => handleOpen('right')}
        onClose={() => handleClose('right')}
      >
        {#snippet trigger()}
          <button class="trigger-button">Right Popover</button>
        {/snippet}
        
        {#snippet content()}
          <div class="popover-content">
            <p>👉 From the right!</p>
            <button>Close Me</button>
          </div>
        {/snippet}
      </PopoverUnified>
    </div>

    <!-- Left position -->
    <div class="test-card">
      <h3>Left Position</h3>
      <p>Slides in from the left</p>
      
      <PopoverUnified
        id="left-unified"
        position="left"
        onOpen={() => handleOpen('left')}
        onClose={() => handleClose('left')}
      >
        {#snippet trigger()}
          <button class="trigger-button">Left Popover</button>
        {/snippet}
        
        {#snippet content()}
          <div class="popover-content">
            <p>👈 From the left!</p>
            <button>Close Me</button>
          </div>
        {/snippet}
      </PopoverUnified>
    </div>

    <!-- Complex content -->
    <div class="test-card">
      <h3>Rich Content</h3>
      <p>Complex interactive content</p>
      
      <PopoverUnified
        id="rich-unified"
        position="bottom"
        onOpen={() => handleOpen('rich')}
        onClose={() => handleClose('rich')}
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
      </PopoverUnified>
    </div>

    <!-- No outside click -->
    <div class="test-card">
      <h3>No Outside Click</h3>
      <p>Must close with button or Escape</p>
      
      <PopoverUnified
        id="no-outside-unified"
        position="bottom"
        closeOnOutsideClick={false}
        onOpen={() => handleOpen('no-outside')}
        onClose={() => handleClose('no-outside')}
      >
        {#snippet trigger()}
          <button class="trigger-button">Persistent Popover</button>
        {/snippet}
        
        {#snippet content()}
          <div class="popover-content">
            <p>🔒 Click outside won't close this!</p>
            <p>Use Escape or the button below.</p>
            <button onclick={() => import('$lib/components/popover').then(m => m.popoverManager.close('no-outside-unified'))}>
              Close Me
            </button>
          </div>
        {/snippet}
      </PopoverUnified>
    </div>
  </div>

  <!-- Instructions -->
  <div class="instructions">
    <h3>🧪 Testing Instructions</h3>
    <ul>
      <li><strong>Desktop:</strong> Popovers appear positioned relative to trigger with smooth animations</li>
      <li><strong>Mobile:</strong> Popovers show as bottom sheets with swipe handle</li>
      <li><strong>Reopen Test:</strong> Open and close each popover multiple times to test for bugs</li>
      <li><strong>Keyboard:</strong> Use Tab to navigate, Enter/Space to trigger, Escape to close</li>
      <li><strong>Scroll Test:</strong> Open popover, then scroll page - desktop popovers should follow trigger</li>
      <li><strong>Resize Test:</strong> Open popover, resize window - should adapt mobile/desktop behavior</li>
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

  .console {
    background: var(--bg-primary);
    border-radius: var(--border-radius-card);
    margin-bottom: var(--spacing-separated);
    overflow: hidden;
  }

  .console-header {
    background: var(--fg-text-primary);
    color: var(--bg-page);
    padding: var(--spacing-related-relaxed);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .console-header h3 {
    margin: 0;
    font-size: var(--fs-300);
  }

  .clear-btn {
    background: var(--fg-text-danger);
    color: white;
    border: none;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: var(--fs-250);
    cursor: pointer;
  }

  .console-output {
    padding: var(--spacing-related-relaxed);
    font-family: var(--font-family-alt);
    font-size: var(--fs-275);
    max-height: 200px;
    overflow-y: auto;
    background: var(--fg-text-primary);
    color: var(--bg-page);
  }

  .console-line {
    padding: 2px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .console-line.empty {
    color: rgba(255, 255, 255, 0.5);
    font-style: italic;
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
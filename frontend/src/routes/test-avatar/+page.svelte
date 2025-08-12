<script lang="ts">
  import { Avatar } from '$lib/components/primitives';

  function handleAvatarClick() {
    console.log('Avatar button clicked!');
    alert('Avatar clicked!');
  }

  function handleDisabledClick() {
    console.log('This should not be called when disabled');
  }
</script>

<svelte:head>
  <title>Avatar Component Test</title>
</svelte:head>

<main class="test-page">
  <h1>Avatar Component Test</h1>

  <section class="test-section">
    <h2>Basic Avatars (Non-button)</h2>
    <div class="avatar-grid">
      <div class="avatar-demo">
        <Avatar size="xs" alt="Extra small avatar" />
        <p>Extra Small (xs)</p>
      </div>
      <div class="avatar-demo">
        <Avatar size="sm" alt="Small avatar" />
        <p>Small (sm)</p>
      </div>
      <div class="avatar-demo">
        <Avatar size="md" alt="Medium avatar" />
        <p>Medium (md) - Default</p>
      </div>
      <div class="avatar-demo">
        <Avatar size="lg" alt="Large avatar" />
        <p>Large (lg)</p>
      </div>
    </div>
  </section>

  <section class="test-section">
    <h2>Button Avatars</h2>
    <div class="avatar-grid">
      <div class="avatar-demo">
        <Avatar
          isButton={true}
          size="xs"
          handleClick={handleAvatarClick}
          alt="Extra small clickable avatar"
        />
        <p>Extra Small Button</p>
      </div>
      <div class="avatar-demo">
        <Avatar
          isButton={true}
          size="sm"
          handleClick={handleAvatarClick}
          alt="Small clickable avatar"
        />
        <p>Small Button</p>
      </div>
      <div class="avatar-demo">
        <Avatar
          isButton={true}
          size="md"
          handleClick={handleAvatarClick}
          alt="Medium clickable avatar"
        />
        <p>Medium Button</p>
      </div>
      <div class="avatar-demo">
        <Avatar
          isButton={true}
          size="lg"
          handleClick={handleAvatarClick}
          alt="Large clickable avatar"
        />
        <p>Large Button</p>
      </div>
    </div>
  </section>

  <section class="test-section">
    <h2>Disabled Button Avatar</h2>
    <div class="avatar-grid">
      <div class="avatar-demo">
        <Avatar
          isButton={true}
          size="md"
          handleClick={handleDisabledClick}
          disabled={true}
          alt="Disabled avatar button"
        />
        <p>Disabled Button</p>
      </div>
    </div>
  </section>

  <section class="test-section">
    <h2>Custom Class Example</h2>
    <div class="avatar-grid">
      <div class="avatar-demo">
        <Avatar
          size="md"
          class="custom-border"
          alt="Avatar with custom styling"
        />
        <p>Custom Border</p>
      </div>
    </div>
  </section>

  <section class="test-section">
    <h2>Accessibility Test</h2>
    <div class="avatar-grid">
      <div class="avatar-demo">
        <Avatar
          isButton={true}
          size="md"
          handleClick={handleAvatarClick}
          alt="Chat with Peter Abbott - Test accessibility"
        />
        <p>Focus with Tab key to test focus ring</p>
      </div>
    </div>
  </section>
</main>

<style>
  .test-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spc-400);
    font-family: var(--font-family-primary);
  }

  h1 {
    color: rgb(var(--fg-text-primary));
    font-size: var(--fs-600);
    margin-bottom: var(--spc-600);
    text-align: center;
  }

  h2 {
    color: rgb(var(--fg-text-primary));
    font-size: var(--fs-400);
    margin-bottom: var(--spc-400);
    border-bottom: 1px solid rgba(var(--fg-text-primary) / 0.2);
    padding-bottom: var(--spc-200);
  }

  .test-section {
    margin-bottom: var(--spc-800);
  }

  .avatar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spc-400);
    align-items: start;
  }

  .avatar-demo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spc-200);
    padding: var(--spc-300);
    border: 1px solid rgba(var(--fg-text-primary) / 0.1);
    border-radius: var(--bdr-radius-small);
    background-color: rgba(var(--bg-secondary) / 0.5);
  }

  .avatar-demo p {
    color: rgb(var(--fg-text-secondary));
    font-size: var(--fs-200);
    text-align: center;
    margin: 0;
  }

  /* Custom styling example */
  :global(.custom-border) {
    border: 3px solid rgb(var(--accent-primary)) !important;
    box-shadow: 0 0 0 2px rgba(var(--accent-primary) / 0.2) !important;
  }
</style>

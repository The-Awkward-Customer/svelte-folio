<script lang="ts">
  import { Avatar } from '$lib/components/primitives';
  import { Button } from '$lib/components/actions';
  import Ani_me from '$lib/assets/Ani_me.png';

  // Simplified test state - focus on loading and glitch animation
  let isLoading = $state(true);
  let glitchIntensity = $state(1);

  function toggleLoading() {
    console.log('🔄 toggleLoading called, current isLoading:', isLoading);
    isLoading = !isLoading;
    console.log('🔄 toggleLoading finished, new isLoading:', isLoading);
  }

  function cycleIntensity() {
    const intensities = [0.5, 1, 1.5, 2];
    const currentIndex = intensities.indexOf(glitchIntensity);
    glitchIntensity = intensities[(currentIndex + 1) % intensities.length];
  }
</script>

<svelte:head>
  <title>Avatar Glitch Animation Test</title>
  <meta
    name="description"
    content="Simplified test page for Avatar component glitch animations"
  />
</svelte:head>

<main class="test-page">
  <header class="test-header">
    <h1>Avatar Glitch Animation Test</h1>
    <p>
      Testing the Avatar component loading state and GSAP-powered glitch
      animations
    </p>
  </header>

  <section class="controls-section">
    <h2>Controls</h2>
    <div class="controls-grid">
      <Button
        as="button"
        variant={isLoading ? 'primary' : 'inverse'}
        label={isLoading ? 'Stop Loading' : 'Start Loading'}
        handleClick={toggleLoading}
      />

      <Button
        as="button"
        variant="inverse"
        label={`Intensity: ${glitchIntensity}x`}
        handleClick={cycleIntensity}
      />
    </div>
  </section>

  <section class="demo-section">
    <h2>Main Demo Avatar</h2>
    <div class="demo-avatar">
      <Avatar
        size="lg"
        content={Ani_me}
        alt="Test Avatar"
        {isLoading}
        glitchRate={2}
        {glitchIntensity}
      />
    </div>

    <div class="demo-info">
      <p><strong>Current State:</strong></p>
      <ul>
        <li>Loading: {isLoading ? 'Yes' : 'No'}</li>
        <li>Glitch Intensity: {glitchIntensity}x</li>
        <li>Animation: {isLoading ? 'Active' : 'Stopped'}</li>
      </ul>
    </div>
  </section>

  <section class="variants-section">
    <h2>Intensity Comparison</h2>
    <div class="variants-grid">
      <div class="variant-demo">
        <h3>Subtle (0.5x)</h3>
        <Avatar
          size="md"
          content={Ani_me}
          alt="Subtle Glitch Avatar"
          isLoading={true}
          glitchRate={3}
          glitchIntensity={0.5}
        />
        <p>Minimal displacement</p>
      </div>

      <div class="variant-demo">
        <h3>Normal (1x)</h3>
        <Avatar
          size="md"
          content={Ani_me}
          alt="Normal Glitch Avatar"
          isLoading={true}
          glitchRate={2}
          glitchIntensity={1}
        />
        <p>Balanced effect</p>
      </div>

      <div class="variant-demo">
        <h3>Strong (1.5x)</h3>
        <Avatar
          size="md"
          content={Ani_me}
          alt="Strong Glitch Avatar"
          isLoading={true}
          glitchRate={1.5}
          glitchIntensity={1.5}
        />
        <p>Enhanced displacement</p>
      </div>

      <div class="variant-demo">
        <h3>Intense (2x)</h3>
        <Avatar
          size="md"
          content={Ani_me}
          alt="Intense Glitch Avatar"
          isLoading={true}
          glitchRate={1}
          glitchIntensity={2}
        />
        <p>Maximum displacement</p>
      </div>
    </div>
  </section>

  <section class="interactive-section">
    <h2>Interactive Test</h2>
    <div class="interactive-demo">
      <Avatar
        size="md"
        content={Ani_me}
        alt="Interactive Avatar"
        {isLoading}
        {glitchIntensity}
        isButton={true}
        handleClick={() => console.log('Avatar clicked!')}
      />
      <p>Click the avatar above (interactive features simplified)</p>
    </div>
  </section>
</main>

<style>
  .test-page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    font-family: var(--font-family-main);
    color: rgb(var(--fg-text-primary));
    background: rgb(var(--bg-page));
    min-height: 100vh;
  }

  .test-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .test-header h1 {
    font-size: var(--fs-800);
    font-weight: var(--fw-bold);
    margin-bottom: 1rem;
    color: rgb(var(--fg-text-primary));
  }

  .test-header p {
    font-size: var(--fs-400);
    color: rgb(var(--fg-text-inverse));
    max-width: 600px;
    margin: 0 auto;
  }

  .controls-section,
  .demo-section,
  .variants-section,
  .interactive-section {
    margin-bottom: 3rem;
    padding: 2rem;
    background: rgba(var(--bg-inverse) / 0.02);
    border-radius: var(--bdr-radius-medium);
    border: 1px solid rgba(var(--fg-text-primary) / 0.1);
  }

  .controls-section h2,
  .demo-section h2,
  .variants-section h2,
  .interactive-section h2 {
    font-size: var(--fs-600);
    font-weight: var(--fw-semibold);
    margin-bottom: 1.5rem;
    color: rgb(var(--fg-text-primary));
  }

  .controls-grid {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .demo-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3rem;
    background: rgba(var(--bg-primary) / 0.05);
    border-radius: var(--bdr-radius-small);
    margin-bottom: 1.5rem;
  }

  .demo-info {
    background: rgba(var(--bg-primary) / 0.02);
    padding: 1rem;
    border-radius: var(--bdr-radius-small);
    border-left: 4px solid rgb(var(--fg-text-primary));
  }

  .demo-info p {
    margin-bottom: 0.5rem;
    font-weight: var(--fw-semibold);
  }

  .demo-info ul {
    list-style: none;
    padding: 0;
  }

  .demo-info li {
    padding: 0.25rem 0;
    font-family: var(--font-family-alt);
    font-size: var(--fs-300);
  }

  .variants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 2rem;
  }

  .variant-demo {
    text-align: center;
    padding: 1.5rem;
    background: rgba(var(--bg-primary) / 0.02);
    border-radius: var(--bdr-radius-small);
    border: 1px solid rgba(var(--fg-text-primary) / 0.05);
  }

  .variant-demo h3 {
    font-size: var(--fs-400);
    font-weight: var(--fw-medium);
    margin-bottom: 1rem;
    color: rgb(var(--fg-text-primary));
  }

  .variant-demo p {
    font-size: var(--fs-275);
    color: rgb(var(--fg-text-inverse));
    margin-top: 1rem;
  }

  .interactive-demo {
    text-align: center;
    padding: 2rem;
    background: rgba(var(--bg-primary) / 0.05);
    border-radius: var(--bdr-radius-small);
  }

  .interactive-demo p {
    margin-top: 1rem;
    font-size: var(--fs-300);
    color: rgb(var(--fg-text-inverse));
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .test-page {
      padding: 1rem;
    }

    .controls-grid {
      flex-direction: column;
    }

    .variants-grid {
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .demo-avatar,
    .interactive-demo {
      padding: 2rem;
    }
  }
</style>

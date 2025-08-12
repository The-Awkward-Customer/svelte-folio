<script lang="ts">
  import { onMount } from 'svelte';
  import { shuffleText } from '$lib/animations/gsap/textAnimations.js';
  import type { IconName } from '$lib/types/icons.js';

  import Icon from '$lib/components/primitives/Icon.svelte';

  // Text content for animations
  const heroTitle = "Let's work together";
  const heroDescription =
    "I'm currently based in sunny Madrid and available for new projects in Q4 2025. Whether you need UI/UX design, frontend development, or design consulting, I'd love to hear about your project.";

  // Email for contact
  const email = 'abbottsayshi@gmail.com';

  // Element references
  let heroTitleElement: HTMLElement | undefined;

  // State for copy feedback
  let feedbackIcon: IconName | '' = '';
  let iconTimeout: NodeJS.Timeout;

  // Copy to clipboard function
  async function copyEmailToClipboard() {
    try {
      await navigator.clipboard.writeText(email);
      feedbackIcon = 'checks_filled';

      // Clear feedback after 2 seconds
      clearTimeout(iconTimeout);
      iconTimeout = setTimeout(() => {
        feedbackIcon = '';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy email: ', err);
      feedbackIcon = 'emoji_cross_eyed';

      // Clear feedback after 2 seconds
      clearTimeout(iconTimeout);
      iconTimeout = setTimeout(() => {
        feedbackIcon = '';
      }, 2000);
    }
  }

  // Trigger animations when component mounts
  onMount(() => {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      // Animate hero title
      if (heroTitleElement) {
        shuffleText(heroTitleElement, heroTitle, {
          duration: 0.3,
          iterations: 3,
          stagger: 0.08,
          delay: 0.2,
        });
      }
    }, 100);
  });
</script>

<svelte:head>
  <title>Contact - Peter Abbott</title>
  <meta
    name="description"
    content="Get in touch for design and development projects. Based in Madrid, available for new projects Q3 2025."
  />
</svelte:head>

<div class="contact-page">
  <!-- Hero Section -->
  <section class="hero-section">
    <div class="hero-content">
      <h1 bind:this={heroTitleElement}>{heroTitle}</h1>
      <p class="hero-description">
        {heroDescription}
      </p>

      <!-- Email with copy to clipboard -->
      <div class="email-container">
        <button
          class="email-button"
          on:click={copyEmailToClipboard}
          aria-label="Copy email to clipboard"
        >
          <span class="email-text">{email}</span>
          {#if feedbackIcon}
            <Icon
              name={feedbackIcon}
              size={24}
              class="copy-feedback"
              fill="--fg-positive"
            />
          {/if}
        </button>
      </div>
    </div>
  </section>
</div>

<style>
  .contact-page {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: var(--spc-1200);
    width: 100%;
    padding-top: var(--spc-1000);
    padding-bottom: var(--spc-1000);
    padding-left: 24px;
    padding-right: 24px;
    text-align: left;
  }

  /* Hero Section */
  .hero-section {
    display: flex;
    flex-direction: column;
    gap: var(--spc-800);
  }

  .hero-content h1 {
    font-size: var(--fs-large-clamped);
    font-weight: var(--fw-bold);
    color: rgb(var(--fg-text-primary));
    line-height: 1.1;
    padding-bottom: 0.5em;
  }

  .hero-description {
    max-width: 600px;
    font-size: var(--fs-tiny-clamped);
    color: rgb(var(--fg-text-secondary));
    line-height: 130%;
    /* Ensure text wraps properly during animation */
    word-wrap: break-word;
    white-space: normal;
  }

  /* Email Section */
  .email-container {
    padding-top: var(--spc-600);
  }

  .email-button {
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: var(--spc-200);
    border-radius: var(--bdr-radius-small);
    transition: all 0.2s ease;
  }

  .email-button:hover {
    transform: translateY(-1px);
  }

  .email-button:active {
    transform: translateY(0);
  }

  .email-text {
    color: rgb(var(--fg-text-primary));
    font-size: var(--fs-300);
    font-family: var(--font-family-alt);
    font-weight: var(--fw-bold);
    transition: all 0.2s ease;
  }

  .email-button:hover .email-text {
    color: rgb(var(--fg-positive));
  }

  :global(.copy-feedback) {
    opacity: 0;
    animation: fadeInOut 2s ease forwards;
  }

  :global(.copy-feedback svg) {
    fill: rgb(var(--fg-positive));
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(4px);
    }
    20%,
    80% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
</style>

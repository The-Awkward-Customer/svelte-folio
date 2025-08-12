<script lang="ts">
  import { page } from '$app/stores';
  import Button from '$lib/components/actions/Button.svelte';
  import TextCard from '$lib/components/cards/TextCard.svelte';

  // Get error details from the page store
  $: error = $page.error;
  $: status = $page.status;

  // Determine error message based on status
  $: errorMessage = getErrorMessage(status);

  function getErrorMessage(status: number): string {
    switch (status) {
      case 404:
        return "The page you're looking for doesn't exist.";
      case 500:
        return 'Something went wrong on our end.';
      case 403:
        return "You don't have permission to access this page.";
      default:
        return 'An unexpected error occurred.';
    }
  }

  // Navigation helpers
  function goHome() {
    window.location.href = '/';
  }

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  }

  function goToGraphics() {
    window.location.href = '/graphics';
  }

  function goToContact() {
    window.location.href = '/contact';
  }
</script>

<svelte:head>
  <title>{status} Error - Peter Abbott</title>
  <meta
    name="description"
    content="Page not found. Return to the homepage or explore other sections of Peter Abbott's portfolio."
  />
</svelte:head>
<div class="error-page">
  <!-- Error Page Wrapper -->
  <div class="error-card">
    <section class="error-hero">
      <div class="error-content">
        <h2 class="error-title">
          {#if status === 404}
            ¯\\_(ツ)_/¯
          {:else if status === 500}
            (╯°□°)╯︵ ┻━┻
          {:else if status === 403}
            ಠ_ಠ
          {:else}
            ¯\\(°_o)/¯
          {/if}
        </h2>
        <p class="error-description">{errorMessage}</p>
      </div>
      <h1 class="error-code">{status}</h1>
    </section>
  </div>

  <Button
    as="button"
    label="Go Home"
    variant="inverse"
    handleClick={goHome}
    type="button"
    fullWidth={true}
  />
</div>

<!-- Quick Actions -->
<!-- <section class="quick-actions">
		<h3>What would you like to do?</h3>

		<div class="action-buttons">
			<Button as="button" label="Go Home" variant="primary" handleClick={goHome} fullWidth={true} />

			<Button as="button" label="Go Back" variant="inverse" handleClick={goBack} fullWidth={true} />
		</div>
	</section> -->

<!-- Helpful Links -->
<!-- <section class="helpful-links">
		<h3>Or explore these sections</h3>

		<div class="link-cards">
			<div class="link-card">
				<TextCard
					title="Portfolio"
					content="View my design and development work from 2016-2025"
					bgColor="rgba(241, 114, 255, 0.1)"
					tag="graphics"
					button="primary"
					handleClick={goToGraphics}
				/>
			</div>

			<div class="link-card">
				<TextCard
					title="Get in Touch"
					content="Available for new projects in Q3 2025"
					bgColor="rgba(105, 80, 243, 0.1)"
					tag="contact"
					button="primary"
					handleClick={goToContact}
				/>
			</div>
		</div> -->
<!-- </section> -->

<!-- Error Details (for development) -->
<!-- {#if error && typeof error === 'object' && 'message' in error}
		<section class="error-details">
			<details>
				<summary>Error Details (Development)</summary>
				<pre>{JSON.stringify(error, null, 2)}</pre>
			</details>
		</section>
	{/if} -->
<!-- </div> -->

<style>
  /* DEBUG BORDERS - Remove these when layout is finalized */
  /* .error-page {
		border: 3px solid rgba(241, 114, 255, 0.8) !important;
	}

	.error-hero {
		border: 2px dashed rgba(105, 80, 243, 0.8) !important;
	}

	.error-content {
		border: 2px dotted rgba(34, 197, 94, 0.8) !important;
	}

	.error-code {
		border: 1px solid rgba(249, 115, 22, 0.8) !important;
	}

	.error-title {
		border: 1px solid rgba(239, 68, 68, 0.8) !important;
	}

	.error-description {
		border: 1px solid rgba(168, 85, 247, 0.8) !important;
	} */
  /* END DEBUG BORDERS */

  .error-page {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spc-200);
  }

  .error-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: var(--spc-1000);
    width: 100%;
    padding: var(--spc-600);
    background-color: rgb(var(--bg-primary));
    color: rgb(var(--fg-text-primary));
    border-radius: var(--bdr-radius-small);
    height: 100%;
  }

  .error-hero {
    display: flex;
    flex-direction: column;
    gap: var(--spc-800);
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
  }

  .error-content {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  /* Error text styles - shared properties */
  .error-code,
  .error-title,
  .error-description {
    color: rgb(var(--fg-text-inverse));
    line-height: 1.2;
  }

  .error-code {
    font-size: clamp(var(--fs-500), 15vw, var(--fs-1500));
    font-weight: var(--fw-bold);
    line-height: 1;
    text-align: right;
  }

  .error-title {
    font-size: var(--fs-350);
    font-weight: var(--fw-semibold);
    white-space: nowrap;
  }

  .error-description {
    font-family: var(--font-family-alt);
    font-size: var(--fs-250);
    text-align: right;
    max-width: 24ch;
  }

  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: var(--spc-600);
    align-items: center;
    text-align: center;
  }

  .quick-actions h3 {
    font-size: var(--fs-500);
    font-weight: var(--fw-semibold);
    color: rgb(var(--fg-text-primary));
  }

  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spc-400);
    width: 100%;
    max-width: 300px;
  }

  /* Helpful Links */
  .helpful-links {
    display: flex;
    flex-direction: column;
    gap: var(--spc-600);
    align-items: center;
    text-align: center;
  }

  .helpful-links h3 {
    font-size: var(--fs-500);
    font-weight: var(--fw-semibold);
    color: rgb(var(--fg-text-primary));
  }

  .link-cards {
    display: flex;
    flex-direction: column;
    gap: var(--spc-500);
    width: 100%;
    max-width: 600px;
  }

  .link-card {
    min-height: 140px;
  }

  /* Error Details */
  .error-details {
    background-color: rgba(var(--bg-component), 0.1);
    border-radius: var(--bdr-radius-medium);
    padding: var(--spc-500);
    margin-top: var(--spc-800);
  }

  .error-details summary {
    font-size: var(--fs-300);
    font-weight: var(--fw-medium);
    color: rgb(var(--fg-text-secondary));
    cursor: pointer;
    padding: var(--spc-200);
  }

  .error-details pre {
    font-family: var(--font-family-mono);
    font-size: var(--fs-250);
    color: rgb(var(--fg-text-secondary));
    background-color: rgba(var(--bg-component), 0.1);
    padding: var(--spc-400);
    border-radius: var(--bdr-radius-small);
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* Desktop Breakpoint */
  /* @media (min-width: 896px) {
		.error-hero {
			flex-direction: row;
			text-align: left;
			justify-content: space-between;
			align-items: center;
		}

		.error-content {
			flex: 1;
		}

		.error-visual {
			flex-shrink: 0;
		}

		.action-buttons {
			flex-direction: row;
			max-width: 500px;
		}

		.link-cards {
			flex-direction: row;
			max-width: none;
		}

		.link-card {
			flex: 1;
		}
	} */
</style>

<script lang="ts">
  import { fly } from "svelte/transition";
  import FooterTitle from "./FooterTitle.svelte";
  import { Weather } from "$lib/components/snoop";

  let CopyRight: string = "© 2025 by Peter Abbott";
  let TechStack: string =
    "This website is built with Svelte and hosted on Vercel and uses your IP address to gather but not store Location Information.";

  interface FooterProps {
    enableShuffleAnimation?: boolean;
  }

  let { enableShuffleAnimation = true }: FooterProps = $props();
</script>

{#snippet Languages()}
  <div class="languages-list">
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.25 9.13289L12.3089 11.25H10.1911L10.6383 10.357L11.25 9.13289ZM15.75 3.375V14.625C15.75 14.9234 15.6315 15.2095 15.4205 15.4205C15.2095 15.6315 14.9234 15.75 14.625 15.75H3.375C3.07663 15.75 2.79048 15.6315 2.5795 15.4205C2.36853 15.2095 2.25 14.9234 2.25 14.625V3.375C2.25 3.07663 2.36853 2.79048 2.5795 2.5795C2.79048 2.36853 3.07663 2.25 3.375 2.25H14.625C14.9234 2.25 15.2095 2.36853 15.4205 2.5795C15.6315 2.79048 15.75 3.07663 15.75 3.375ZM14.5659 13.2483L11.7534 7.62328C11.7068 7.52968 11.635 7.45093 11.546 7.39589C11.4571 7.34085 11.3546 7.31169 11.25 7.31169C11.1454 7.31169 11.0429 7.34085 10.954 7.39589C10.865 7.45093 10.7932 7.52968 10.7466 7.62328L9.81984 9.47813C9.22372 9.36137 8.6584 9.12192 8.15977 8.775C8.93695 7.89513 9.41783 6.79317 9.53438 5.625H10.6875C10.8367 5.625 10.9798 5.56574 11.0852 5.46025C11.1907 5.35476 11.25 5.21168 11.25 5.0625C11.25 4.91332 11.1907 4.77024 11.0852 4.66475C10.9798 4.55926 10.8367 4.5 10.6875 4.5H7.875V3.9375C7.875 3.78832 7.81574 3.64524 7.71025 3.53975C7.60476 3.43426 7.46168 3.375 7.3125 3.375C7.16332 3.375 7.02024 3.43426 6.91475 3.53975C6.80926 3.64524 6.75 3.78832 6.75 3.9375V4.5H3.9375C3.78832 4.5 3.64524 4.55926 3.53975 4.66475C3.43426 4.77024 3.375 4.91332 3.375 5.0625C3.375 5.21168 3.43426 5.35476 3.53975 5.46025C3.64524 5.56574 3.78832 5.625 3.9375 5.625H8.40094C8.28935 6.51253 7.91468 7.34636 7.32516 8.01914C7.07541 7.72759 6.86284 7.40614 6.69234 7.06219C6.62326 6.93336 6.50673 6.83649 6.36746 6.79209C6.22818 6.7477 6.07709 6.75927 5.94619 6.82435C5.8153 6.88943 5.71488 7.00291 5.66621 7.14076C5.61755 7.2786 5.62445 7.42997 5.68547 7.56281C5.90076 7.99695 6.17008 8.40211 6.48703 8.76867C5.73783 9.28668 4.84834 9.56363 3.9375 9.5625C3.78832 9.5625 3.64524 9.62176 3.53975 9.72725C3.43426 9.83274 3.375 9.97582 3.375 10.125C3.375 10.2742 3.43426 10.4173 3.53975 10.5227C3.64524 10.6282 3.78832 10.6875 3.9375 10.6875C5.15864 10.6888 6.34667 10.2905 7.32023 9.55336C7.90932 10.0036 8.58325 10.3303 9.30164 10.5138L7.93406 13.2483C7.8673 13.3818 7.85632 13.5364 7.90352 13.678C7.95073 13.8196 8.05226 13.9367 8.18578 14.0034C8.3193 14.0702 8.47387 14.0812 8.61549 14.034C8.75711 13.9868 8.87418 13.8852 8.94094 13.7517L9.62859 12.375H12.8714L13.5591 13.7517C13.5921 13.8178 13.6379 13.8768 13.6937 13.9252C13.7496 13.9736 13.8144 14.0106 13.8845 14.034C13.9546 14.0574 14.0287 14.0667 14.1024 14.0614C14.1761 14.0562 14.2481 14.0365 14.3142 14.0034C14.3803 13.9704 14.4393 13.9246 14.4877 13.8688C14.5361 13.8129 14.5731 13.7481 14.5965 13.678C14.6199 13.6079 14.6292 13.5338 14.6239 13.4601C14.6187 13.3864 14.599 13.3144 14.5659 13.2483Z"
        fill="rgb(var(--fg-text-primary))"
      />
    </svg>

    <ul>
      <li>English</li>
    </ul>
  </div>
{/snippet}

{#snippet Details()}
  <div class="details">
    <p>{CopyRight}</p>
    <p>{TechStack}</p>
  </div>
{/snippet}

{#snippet Title()}
  <FooterTitle {enableShuffleAnimation} />
{/snippet}

<footer>
  {@render Title()}
  <div class="trailing-slot">
    <Weather />
    <div class="footer-details-wrapper">
      {@render Details()}
    </div>
  </div>
</footer>

<style>
  /* root */
  footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    grid-template-rows: 1fr auto;
    gap: 2em;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
    padding-top: 16px;
    width: 100%;
  }

  .trailing-slot {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 0.4em;
    max-width: 1024px;
  }

  .footer-details-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 1em;
    border-radius: var(--bdr-radius-small);
    box-shadow: inset 0 0 0 1px var(--fg-text-primary-40);
    padding: 16px;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    font-size: var(--fs-250);
    color: var(--fg-text-secondary);
    max-width: 64ch;
  }

  .languages-list {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 0.5em;
    font-size: var(--fs-250);
    color: rgb(var(--fg-text-secondary));
  }

  .languages-list ul {
    display: inline-flex;
    flex-direction: row;
    list-style: none;
    gap: 0.5em;
  }
</style>

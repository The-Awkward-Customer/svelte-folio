<script lang="ts">
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { shuffleText } from '$lib/animations/gsap';
	// import { openAccordions, toggleAccordion } from "$lib/stores/accordianManager.svelte.";
	// import { derived, fromStore } from "svelte/store";

	import {
		createAccordionState,
		toggleAccordion,
		registerAccordion
	} from '$lib/stores/accordianManager.svelte.';

	interface AccordianProps {
		children?: any;
		number: string;
		label: string;
		suffix: string;
		enableShuffleAnimation?: boolean;
	}

	let {
		children,
		number = '1',
		label = 'Replace me',
		suffix = 'test',
		enableShuffleAnimation = true
	}: AccordianProps = $props();

	const accordionState = $state(createAccordionState());
	let labelElement: HTMLElement | undefined;

	registerAccordion(accordionState);

	// Trigger animation when component mounts
	onMount(() => {
		if (enableShuffleAnimation) {
			// Use setTimeout to ensure DOM is ready
			setTimeout(() => {
				if (labelElement) {
					shuffleText(labelElement, label, {
						duration: 0.8,
						iterations: 3,
						stagger: 0.05,
						delay: 0.1
					});
				}
			}, 50);
		}
	});

	function handleClick() {
		toggleAccordion(accordionState);
	}
</script>

{#snippet prefixCheck()}
	<svg width="44" height="32" viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg">
		<circle cx="16" cy="16" r="16" fill="rgb(var(--bg-positive))" />
		<path
			d="M23.1837 11.1867C23.3494 11.3518 23.4809 11.5481 23.5707 11.7642C23.6604 11.9803 23.7066 12.2119 23.7066 12.4459C23.7066 12.6799 23.6604 12.9116 23.5707 13.1277C23.4809 13.3438 23.3494 13.54 23.1837 13.7052L14.8874 22.0015C14.7222 22.1672 14.526 22.2987 14.3099 22.3884C14.0938 22.4782 13.8621 22.5244 13.6282 22.5244C13.3942 22.5244 13.1625 22.4782 12.9464 22.3884C12.7303 22.2987 12.5341 22.1672 12.3689 22.0015L8.81334 18.4459C8.64797 18.2806 8.51679 18.0842 8.4273 17.8682C8.3378 17.6521 8.29174 17.4205 8.29174 17.1867C8.29174 16.9528 8.3378 16.7212 8.4273 16.5052C8.51679 16.2891 8.64797 16.0928 8.81334 15.9274C8.97871 15.762 9.17503 15.6309 9.39109 15.5414C9.60716 15.4519 9.83873 15.4058 10.0726 15.4058C10.3065 15.4058 10.538 15.4519 10.7541 15.5414C10.9702 15.6309 11.1665 15.762 11.3319 15.9274L13.6296 18.2222L20.6682 11.1822C20.8335 11.0172 21.0299 10.8864 21.2458 10.7974C21.4618 10.7083 21.6932 10.6626 21.9269 10.663C22.1605 10.6635 22.3917 10.7099 22.6074 10.7998C22.8231 10.8896 23.0189 11.0211 23.1837 11.1867ZM32 16C32 19.1645 31.0616 22.2579 29.3035 24.8891C27.5454 27.5203 25.0466 29.5711 22.1229 30.7821C19.1993 31.9931 15.9823 32.3099 12.8786 31.6926C9.77486 31.0752 6.92394 29.5513 4.6863 27.3137C2.44866 25.0761 0.924806 22.2251 0.307443 19.1214C-0.309921 16.0177 0.00693258 12.8007 1.21793 9.87706C2.42894 6.95345 4.4797 4.45459 7.11088 2.69649C9.74207 0.938384 12.8355 0 16 0C20.242 0.00470552 24.309 1.69193 27.3085 4.69149C30.3081 7.69105 31.9953 11.758 32 16ZM28.4444 16C28.4444 13.5387 27.7146 11.1327 26.3472 9.08624C24.9798 7.03976 23.0362 5.44472 20.7623 4.50283C18.4884 3.56094 15.9862 3.3145 13.5722 3.79467C11.1582 4.27484 8.94084 5.46006 7.20045 7.20045C5.46007 8.94083 4.27485 11.1582 3.79468 13.5722C3.31451 15.9862 3.56095 18.4884 4.50284 20.7623C5.44473 23.0362 7.03976 24.9798 9.08624 26.3472C11.1327 27.7146 13.5387 28.4444 16 28.4444C19.2994 28.4409 22.4626 27.1287 24.7957 24.7956C27.1287 22.4626 28.4409 19.2994 28.4444 16Z"
			fill="rgb(var(--fg-positive))"
		/>
	</svg>
{/snippet}

<div class="wrapper">
	<button onclick={handleClick} aria-label={label}>
		{#if accordionState.hasBeenOpened}
			{@render prefixCheck()}
		{:else}
			<span>0{number}. </span>
		{/if}
		<div class="label">
			<span bind:this={labelElement}>{label}</span>
			<span>{suffix}</span>
		</div>
	</button>

	{#if accordionState.isOpen}
		<div class="details" transition:slide>
			{#if children}
				{@render children?.()}
			{:else}
				<p>child</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
	}

	button {
		-webkit-appearance: none;
		appearance: none;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		gap: 0.5em;
		width: 100%;
		padding-top: 0.5em;
		padding-bottom: 0.5em;
		border: none;
		font-size: var(--fs-large-clamped);
		font-weight: var(--fw-semibold);
		color: rgb(var(--fg-text-primary));
		background-color: rgba(var(--bg-page) / 0);
		border-bottom: 1px solid rgb(var(--bdr-primary));
		margin-bottom: 0.5em;
	}

	svg {
		width: 1.5em; /* Scales with font-size */
		height: auto;
	}

	.label {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: baseline;
		flex-grow: 1;
	}

	/* first child */
	.label span:first-child {
		text-transform: uppercase;
	}

	button:hover {
		color: rgba(var(--fg-text-primary) / 0.8);
	}
	button:active {
		color: rgba(var(--fg-text-primary) / 0.6);
	}

	.details {
		padding-bottom: 1em;
		max-width: 64ch;
	}

	/* GSAP character animation styles */
	:global(.gsap-char) {
		display: inline-block;
		position: relative;
	}

	:global(.gsap-space) {
		display: inline-block;
	}
</style>

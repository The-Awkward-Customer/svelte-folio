<script lang="ts">
	import type { Snippet } from 'svelte';

	import LinkList from '../navigation/LinkList.svelte';
	import ChatTrigger from './ChatTrigger.svelte';
	import QAChat from '../chat/QAChat.svelte';
	import Button from '../actions/Button.svelte';
	import Weather from '../Snoop/Weather.svelte';
	import { navigationStore } from '$lib/stores/navigationStore.svelte';

	interface LinkItem {
		label: string;
		href: string;
	}

	interface LinkListArray {
		list?: LinkItem[];
	}

	let listData: LinkItem[] = [
		{ label: 'Index', href: '#hero' },
		{ label: 'Experience', href: '#experience' },
		{ label: 'Graphics', href: '#portfolio' }
	];

	interface TopNavProps {
		children?: Snippet;
	}

	let { list = listData, children }: LinkListArray & TopNavProps = $props();

	// Chat state management
	let isChatOpen = $state(false);

	function openChat() {
		isChatOpen = true;
	}

	function closeChat() {
		isChatOpen = false;
	}
</script>

<nav>
	<div class="left-wrapper">
		<div class="left">
			<ChatTrigger handleClick={openChat} />
			<div class="name-and-links">
				<p>Peter Abbott</p>
				<LinkList {list} activeSection={navigationStore.activeSection} />
			</div>
		</div>
	</div>
	<div class="right">
		<Weather />
	</div>
</nav>

<!-- Chat Component -->
<QAChat bind:isOpen={isChatOpen} on:close={closeChat} />

<style>
	nav {
		display: inline-flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		padding-top: var(--padding-page-default);
		padding-left: var(--padding-page-default);
		padding-right: var(--padding-page-default);
		padding-bottom: var(--space-5xl);
		gap: var(--space-xl);
	}

	.left-wrapper {
		display: flex;
		justify-content: flex-start;
	}

	.left {
		display: flex;
		align-items: center;
		gap: var(--space-xl);
	}

	.name-and-links {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.5em;
	}

	.right {
		display: flex;
		align-items: center;
	}

	p {
		font-size: var(--fs-300);
		font-weight: var(--fw-semibold);
		color: var(--fg-text-primary);
	}

	@media (min-width: 896px) {
		nav {
			flex-direction: row;

			align-items: center;
		}
	}
</style>

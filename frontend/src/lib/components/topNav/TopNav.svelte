<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	import LinkList from '../navigation/LinkList.svelte';
	import ChatTrigger from './ChatTrigger.svelte';
	import QAChat from '../chat/QAChat.svelte';

	interface LinkItem {
		label: string;
		href: string;
	}

	interface LinkListArray {
		list?: LinkItem[];
	}

	let listData: LinkItem[] = [
		{ label: 'Index', href: '/' },
		{ label: 'Graphics', href: '/graphics' },
		{ label: 'Services', href: '/services' }
	];

	interface TopNavProps {
		children?: Snippet;
	}

	let { list = listData, children }: LinkListArray & TopNavProps = $props();

	// Pages where chat trigger should be hidden
	const hideChatOnPages = ['/graphics', '/services', '/about'];

	// Derived value to determine if chat should be shown
	const showChat = $derived(!hideChatOnPages.includes($page.url.pathname));

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
	<div>
		<p>Peter Abbott</p>
		<LinkList {list} />
	</div>
	{#if showChat}
		<ChatTrigger handleClick={openChat} />
	{/if}
</nav>

<!-- Chat Component -->
<QAChat bind:isOpen={isChatOpen} on:close={closeChat} />

<style>
	nav {
		display: inline-flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-start;
		width: 100%;
		padding-top: 24px;
		padding-left: 24px;
		padding-right: 24px;
		padding-bottom: 12px;
		gap: 1em;
	}

	div {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		gap: 0.5em;
	}

	p {
		font-size: var(--fs-300);
		font-weight: var(--fw-semibold);
		color: rgb(var(--fg-text-primary));
	}

	@media (min-width: 896px) {
		nav {
			flex-direction: row;
		}
	}
</style>

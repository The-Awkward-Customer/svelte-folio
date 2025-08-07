<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';

	import LinkList from '../navigation/LinkList.svelte';
	import ChatTrigger from './ChatTrigger.svelte';
	import QAChat from '../chat/QAChat.svelte';
	import Button from '../actions/Button.svelte';
	import { chatStore } from '$lib/stores/chatStore.svelte.js';

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
		{ label: 'Experience', href: '/experience' }
	];

	interface TopNavProps {
		children?: Snippet;
	}

	let { list = listData, children }: LinkListArray & TopNavProps = $props();

	// Chat state management through store
	function openChat() {
		chatStore.openChat();
	}

	function closeChat() {
		chatStore.closeChat();
	}
</script>

<nav>
	<div class="left-wrapper">
		<div class="left">
			<ChatTrigger handleClick={openChat} shouldShowIndicator={chatStore.shouldShowIndicator} />
			<div class="name-and-links">
				<p>Peter Abbott</p>
				<LinkList {list} />
			</div>
		</div>
	</div>
	<div class="right">
		<Button
			as="link"
			href="/documents/Peter_Abbott_CV_04:08:25.pdf"
			target="_blank"
			rel="noopener noreferrer"
			label="Download CV"
			variant="inverse"
		/>
	</div>
</nav>

<!-- Chat Component -->
<QAChat isOpen={chatStore.isOpen} on:close={closeChat} />

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

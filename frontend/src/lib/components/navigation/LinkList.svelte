<script lang="ts">
	import { page } from '$app/stores';

	interface LinkItem {
		label: string;
		href: string;
	}

	interface LinkListProps {
		list?: LinkItem[];
	}

	let defaultListData: LinkItem[] = [
		{ label: 'Index', href: '/' },
		{ label: 'Graphics', href: '/graphics' }
	];

	let { list = defaultListData }: LinkListProps = $props();

	function getNavClasses(href: string): string {
		const isActive =
			href === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(href);

		return `nav-link ${isActive ? 'active' : ''}`;
	}
</script>

<ul>
	{#each list as item}
		<a class={getNavClasses(item.href)} href={item.href}>{item.label}</a>
	{/each}
</ul>

<style>
	ul {
		display: flex;
		flex-direction: row;
		gap: 0.5em;
		font-size: clamp(16px, 4vw, 24px);
		font-weight: var(--fw-semibold);
	}

	.nav-link {
		color: var(--fg-text-primary-60);
		text-decoration: none;
	}

	.nav-link:hover {
		color: var(--fg-text-primary);
	}

	.nav-link.active {
		color: var(--fg-text-primary);
	}
</style>

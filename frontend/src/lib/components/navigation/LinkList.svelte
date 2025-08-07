<script lang="ts">
	import { page } from '$app/stores';

	interface LinkItem {
		label: string;
		href: string;
	}

	interface LinkListProps {
		list?: LinkItem[];
		activeSection?: string;
	}

	let defaultListData: LinkItem[] = [
		{ label: 'Index', href: '#hero' },
		{ label: 'Graphics', href: '#portfolio' }
	];

	let { list = defaultListData, activeSection = 'hero' }: LinkListProps = $props();

	function handleAnchorClick(event: MouseEvent, href: string) {
		if (href.startsWith('#')) {
			event.preventDefault();
			const sectionId = href.slice(1);
			const element = document.getElementById(sectionId);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
				// Update URL without page reload
				history.pushState(null, '', href);
			}
		}
	}

	function getNavClasses(href: string): string {
		if (href.startsWith('#')) {
			const sectionId = href.slice(1);
			return `nav-link ${activeSection === sectionId ? 'active' : ''}`;
		}
		// Fallback for non-anchor links
		const isActive = href === '/' ? $page.url.pathname === '/' : $page.url.pathname.startsWith(href);
		return `nav-link ${isActive ? 'active' : ''}`;
	}
</script>

<ul>
	{#each list as item}
		<a 
			class={getNavClasses(item.href)} 
			href={item.href}
			onclick={(e) => handleAnchorClick(e, item.href)}
		>
			{item.label}
		</a>
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

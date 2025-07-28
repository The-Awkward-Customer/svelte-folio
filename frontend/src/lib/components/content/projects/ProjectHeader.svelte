<script lang="ts">
	import Subheader from '../../primatives/Subheader.svelte';
	import TagList from '../../primatives/TagList.svelte';
	import List from '../../primatives/List.svelte';

	// Interface for props
	interface ProjectHeaderProps {
		children?: any;
		impact?: {
			title: string;
			content: string;
		};
		categories?: {
			title: string;
			tags: string[];
		};
		teamMembers?: {
			title: string;
			members: { name: string; role: string }[];
		};
	}

	let { children, impact, categories, teamMembers }: ProjectHeaderProps = $props();

	// Dummy placeholder data for debugging
	const defaultImpact = {
		title: 'Impact',
		content: '10X revenue growth to $300+ MRR'
	};

	const defaultCategories = {
		title: 'Categories',
		tags: ['UX Design', 'Product Strategy', 'User Research', 'Prototyping', 'Design System']
	};

	const defaultTeamMembers = {
		title: 'Team Members',
		members: [
			{ name: 'Sarah Chen', role: 'Lead Designer' },
			{ name: 'Marcus Rodriguez', role: 'Frontend Developer' }
		]
	};

	// Use provided props or fallback to defaults for debugging
	const impactData = impact || defaultImpact;
	const categoriesData = categories || defaultCategories;
	const teamMembersData = teamMembers || defaultTeamMembers;
</script>

<!-- header Impact snippet -->
{#snippet headerImpact()}
	<div class="header-card-root impact">
		<Subheader text={impactData.title} color="inverse" />
		<p class="impact-text">{impactData.content}</p>
	</div>
{/snippet}

<!-- header Categories snippet -->
{#snippet headerCategories()}
	<div class="header-card-root categories">
		<Subheader text={categoriesData.title} />
		<div class="categories-content">
			<TagList tags={categoriesData.tags} />
		</div>
	</div>
{/snippet}

<!-- header Team Members snippet -->
{#snippet headerTeamMembers()}
	<div class="header-card-root team">
		<Subheader text={teamMembersData.title} />
		<List items={teamMembersData.members} dual />
	</div>
{/snippet}

<section class="project-header">
	<!-- Header Impact -->
	<div class="header-card-root impact">
		<Subheader text={impactData.title} color="inverse" />
		<p class="impact-text">{impactData.content}</p>
	</div>

	<!-- Header Categories -->
	<div class="header-card-root categories">
		<Subheader text={categoriesData.title} />
		<div class="categories-content">
			<TagList tags={categoriesData.tags} />
		</div>
	</div>

	<!-- Header Team Members -->
	<div class="header-card-root team">
		<Subheader text={teamMembersData.title} />
		<List items={teamMembersData.members} dual />
	</div>
</section>

<style>
	.project-header {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto auto auto;
	}

	/* Tablet: 767px - 1024px */
	@media (min-width: 767px) {
		.project-header {
			grid-template-columns: 1fr 1fr;
			grid-template-rows: auto auto;
		}

		.header-card-root.impact {
			grid-column: 1;
			grid-row: 1;
		}

		.header-card-root.categories {
			grid-column: 2;
			grid-row: 1;
		}

		.header-card-root.team {
			grid-column: 1 / -1;
			grid-row: 2;
		}
	}

	/* Desktop: 1025px+ */
	@media (min-width: 1025px) {
		.project-header {
			grid-template-columns: 1fr 1fr 2fr;
			grid-template-rows: auto;
		}

		.header-card-root.impact {
			grid-column: auto;
			grid-row: auto;
		}

		.header-card-root.categories {
			grid-column: auto;
			grid-row: auto;
		}

		.header-card-root.team {
			grid-column: auto;
			grid-row: auto;
		}
	}

	.header-card-root {
		background: rgb(var(--bg-surface));
		border: 1px solid rgb(var(--border-primary));
		border-radius: var(--radius-md);
		padding: var(--space-xl);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		transition: box-shadow 0.2s ease;
		color: var(--fg-text-primary);
	}

	.header-card-root.impact {
		background-color: var(--bg-primary);
		color: var(--fg-text-inverse);
	}

	.impact-text {
		font-size: var(--fs-large-clamped);
		font-weight: var(--fw-bold);
		line-height: var(--lh-snug);
		max-width: var(--width-prose-sm);
	}

	.team-member {
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.team-member__name {
		font-size: var(--fs-300);
		font-weight: var(--fw-semibold);
		color: var(--fg-text-primary);
		font-family: var(--font-family-main);
	}

	.team-member__role {
		font-size: var(--fs-275);
		color: var(--fg-text-secondary);
		font-family: var(--font-family-main);
		line-height: var(--lh-interface);
	}

	/* Debug styles - remove when done */
	/* .project-header {
		box-shadow: 0 0 0 4px solid red !important;
		outline: 2px solid red !important;
	}

	.header-card-root {
		box-shadow: 0 0 0 4px solid blue !important;
		outline: 2px solid blue !important;
	}

	.header-card-root.impact {
		box-shadow: 0 0 0 4px solid green !important;
		outline: 2px solid green !important;
	}

	.header-card-root.categories {
		box-shadow: 0 0 0 4px solid orange !important;
		outline: 2px solid orange !important;
	}

	.header-card-root.team {
		box-shadow: 0 0 0 4px solid purple !important;
		outline: 2px solid purple !important;
	} */
</style>

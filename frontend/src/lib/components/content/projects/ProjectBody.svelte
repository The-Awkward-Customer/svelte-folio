<script lang="ts">
	import List from '../../primatives/List.svelte';
	import { Subheader } from '$lib/components/primatives';

	// Interface for props
	interface ProjectHeaderProps {
		impact?: {
			title: string;
			content: string;
		};
		teamMembers?: {
			title: string;
			members: { name: string; role: string }[];
		};
	}

	let { impact, teamMembers }: ProjectHeaderProps = $props();

	// Dummy placeholder data for debugging
	const defaultImpact = {
		title: 'Impact',
		content: '10X revenue growth to $300+ MRR'
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
	const teamMembersData = teamMembers || defaultTeamMembers;
</script>

<!-- header Impact snippet -->
{#snippet headerImpact()}
	<div class="header-card-root impact">
		<!-- <Subheader text={impactData.title} color="inverse" /> -->
		<p class="impact-text">{impactData.content}</p>
	</div>
{/snippet}

<!-- header Team Members snippet -->
{#snippet headerTeamMembers()}
	<div class="header-card-root team">
		<Subheader text="Team" />
		<List items={teamMembersData.members} itemFormat="structured" />
	</div>
{/snippet}

<section class="project-header">
	{@render headerImpact()}
	{@render headerTeamMembers()}
</section>

<style>
	/* Mobile First - Default styles */
	.project-header {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
	}

	.header-card-root {
		background: rgb(var(--bg-surface));
		border: 1px solid rgb(var(--border-primary));
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		justify-content: center;
		transition: box-shadow 0.2s ease;
		color: var(--fg-text-primary);
		padding: var(--space-0) var(--space-xl);
		border-left: 1px solid var(--fg-text-primary);
	}

	.header-card-root.impact {
		color: var(--fg-text-primary);
	}

	.impact-text {
		font-size: var(--fs-small-clamped);
		font-weight: var(--fw-bold);
		line-height: var(--lh-snug);
		max-width: var(--width-prose-sm);
	}

	/* Desktop: 1024px+ */
	@media (min-width: 1024px) {
		.project-header {
			grid-template-columns: 1fr 1fr 2fr;
		}

		.header-card-root.impact {
			grid-column: 1 / 3;
		}

		.header-card-root.team {
			grid-column: 3;
		}
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


	.header-card-root.team {
		box-shadow: 0 0 0 4px solid purple !important;
		outline: 2px solid purple !important;
	} */
</style>

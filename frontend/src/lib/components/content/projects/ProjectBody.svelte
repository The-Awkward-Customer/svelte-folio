<script lang="ts">
	import List from '../../primatives/List.svelte';
	import { Subheader } from '$lib/components/primatives';

	// Interface for props
	interface ProjectBodyProps {
		impact?: {
			title: string;
			content: string[];
		};
		teamMembers?: {
			title: string;
			members: { name: string; role: string }[];
		};
	}

	let { impact, teamMembers }: ProjectBodyProps = $props();

	// Dummy placeholder data for debugging
	const defaultImpact = {
		title: 'Impact',
		content: [
			'10X revenue growth to $300+ MRR',
			'Launched 3 new product features',
			'Expanded to 5 new markets'
		]
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

<!-- body Impact snippet -->
{#snippet bodyImpact()}
	<div class="body-card-root impact">
		<Subheader text={impactData.title} />
		<ul class="impact-list">
			{#each impactData.content as item}
				<li class="impact-text">{item}</li>
			{/each}
		</ul>
	</div>
{/snippet}

<!-- body Team Members snippet -->
{#snippet bodyTeamMembers()}
	<div class="body-card-root team">
		<Subheader text="Team" />
		<List items={teamMembersData.members} itemFormat="structured" />
	</div>
{/snippet}

<section class="project-body">
	{@render bodyImpact()}
	{@render bodyTeamMembers()}
</section>

<style>
	/* Mobile First - Default styles */
	.project-body {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-xl);
	}

	.body-card-root {
		background: rgb(var(--bg-surface));
		border: 1px solid rgb(var(--border-primary));
		border-radius: var(--radius-md);
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		transition: box-shadow 0.2s ease;
		color: var(--fg-text-primary);
		padding: var(--space-0) var(--space-xl);
		border-left: 1px solid var(--fg-text-primary);
	}

	.body-card-root.impact {
		color: var(--fg-text-primary);
	}

	.impact-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.impact-text {
		font-size: var(--fs-tiny-clamped);
		font-weight: var(--fw-bold);
		line-height: var(--lh-snug);
		max-width: var(--width-prose-sm);
	}

	/* Desktop: 1024px+ */
	@media (min-width: 1024px) {
		.project-body {
			grid-template-columns: 1fr 1fr 2fr;
		}

		.body-card-root.impact {
			grid-column: 1 / 3;
		}

		.body-card-root.team {
			grid-column: 3;
		}
	}

	/* Debug styles - remove when done */
	/* .project-body {
		box-shadow: 0 0 0 4px solid red !important;
		outline: 2px solid red !important;
	}

	.body-card-root {
		box-shadow: 0 0 0 4px solid blue !important;
		outline: 2px solid blue !important;
	}

	.body-card-root.impact {
		box-shadow: 0 0 0 4px solid green !important;
		outline: 2px solid green !important;
	}


	.body-card-root.team {
		box-shadow: 0 0 0 4px solid purple !important;
		outline: 2px solid purple !important;
	} */
</style>

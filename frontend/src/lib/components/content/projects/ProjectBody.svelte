<script lang="ts">
import { Subheader, Tag, List } from '$lib/components/primitives';

	// Interface for props
	interface ProjectBodyProps {
		problemStatement?: {
			title: string;
			content: string;
		};
		impact?: {
			title: string;
			content: string[];
		};
		teamMembers?: {
			title: string;
			members: { name: string; role: string }[];
		};
	}

	let { problemStatement, impact, teamMembers }: ProjectBodyProps = $props();

	// Dummy placeholder data for debugging
	const defaultProblemStatement = {
		title: 'Problem space',
		content: 'The "Blue collar" SME market was overserved by bloated existing solutions.'
	};

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
	const problemStatementData = problemStatement || defaultProblemStatement;
	const impactData = impact || defaultImpact;
	const teamMembersData = teamMembers || defaultTeamMembers;
</script>

<!-- body Problem Statement snippet -->
{#snippet bodyProblemStatement()}
	<div class="body-card-root problem-statement">
		<div class="prefix">
			<Tag label="01" />
			<Subheader text={problemStatementData.title} />
		</div>
		<div class="body">
			<p class="problem-statement-text">{problemStatementData.content}</p>
		</div>
	</div>
{/snippet}

<!-- body Impact snippet -->
{#snippet bodyImpact()}
	<div class="body-card-root impact">
		<div class="prefix">
			<Tag label="02" />
			<Subheader text={impactData.title} />
		</div>
		<div class="body">
			<List items={impactData.content} type="bullet" emphasis="strong" />
		</div>
	</div>
{/snippet}

<!-- body Team Members snippet -->
{#snippet bodyTeamMembers()}
	<div class="body-card-root team">
		<div class="prefix">
			<Tag label="03" />
			<Subheader text="Team" />
		</div>
		<div class="body">
			<List items={teamMembersData.members} itemFormat="structured" />
		</div>
	</div>
{/snippet}

<section class="project-body">
	{@render bodyProblemStatement()}
	{@render bodyImpact()}
	{@render bodyTeamMembers()}
</section>

<style>
	/* Mobile First - Default styles */
	.project-body {
		display: grid;
		grid-template-columns: 1fr;
		/* gap: var(--space-lg); */
	}

	.body-card-root {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		font-size: var(--fs-xxlarge-clamped);
		padding-top: 0.5em;
		padding-bottom: 0.5em;
	}

	.body-card-root.problem-statement,
	.body-card-root.impact {
		color: var(--fg-text-primary);
	}

	.problem-statement-text {
		font-weight: var(--fw-medium);
		line-height: var(--lh-snug);
		max-width: var(--width-prose-sm);
	}

	.prefix {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
		padding-top: var(--space-lg);
		padding-bottom: var(--space-lg);
	}

	.body {
		/* border-bottom: 1px solid currentColor; */
		padding-bottom: var(--space-sm);
		width: 100%;
		flex: 1;
	}

	/* Desktop Breakpoint */
	@media (min-width: 1024px) {
		.body-card-root {
			flex-direction: row;
			gap: 1em;
		}

		.prefix {
			flex-direction: column;
			align-items: flex-start;
			width: 164px;
		}
	}
</style>

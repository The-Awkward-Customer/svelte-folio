<script lang="ts">
	interface ListProps {
		items?: string[] | { name: string; role: string }[];
		itemFormat?: 'string' | 'structured';
		type?: 'plain' | 'bullet' | 'number' | 'custom';
		emphasis?: 'normal' | 'strong';
		customStyle?: string;
	}

	let {
		items = [
			'John Smith – Developer',
			'Sarah Johnson – Designer',
			'Mike Chen – Product Manager',
			'Emily Davis – QA Engineer',
			'Alex Rodriguez – DevOps'
		],
		itemFormat = 'string',
		type = 'plain',
		emphasis = 'normal',
		customStyle
	}: ListProps = $props();
</script>

<ul
	class="list list--{type} list--{emphasis}"
	style={type === 'custom' && customStyle ? `list-style: ${customStyle}` : undefined}
>
	{#each items as item}
		<li class="list__item list__item--{itemFormat}">
			{#if itemFormat === 'structured' && typeof item === 'object'}
				<span class="list__item-name list__item-name--{emphasis}">{item.name}</span>
				<span class="list__item-separator">–</span>
				<span class="list__item-role">{item.role}</span>
			{:else}
				{item}
			{/if}
		</li>
	{/each}
</ul>

<style>
	.list {
		display: flex;
		flex-direction: column;
		padding: 0;
		gap: var(--space-sm);
	}

	.list--plain {
		list-style: none;
	}

	.list--bullet {
		list-style: disc;
		padding-left: 0.8em;
	}

	.list--number {
		list-style: decimal;
		padding-left: 1.5em;
	}

	.list--custom {
		padding-left: 1.5em;
	}

	.list__item--structured {
		display: flex;
		align-items: baseline;
		gap: 0.25em;
	}

	.list__item-name {
		white-space: nowrap;
		color: var(--fg-text-primary);
	}

	.list__item-separator {
		color: var(--fg-text-primary-80);
		white-space: nowrap;
	}

	.list__item-role {
		font-weight: var(--fw-regular);
		color: var(--fg-text-primary-80);
		white-space: nowrap;
	}

	.list--normal .list__item:not(.list__item--structured) {
		font-weight: var(--fw-medium, 500);
	}

	.list--strong .list__item:not(.list__item--structured) {
		font-weight: var(--fw-bold, 700);
	}

	.list--strong .list__item {
		line-height: var(--lh-snug);
		max-width: var(--width-prose-sm);
	}

	.list__item-name--normal {
		font-weight: var(--fw-medium, 500);
	}

	.list__item-name--strong {
		font-weight: var(--fw-bold, 700);
	}
</style>

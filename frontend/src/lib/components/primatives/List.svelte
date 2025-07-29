<script lang="ts">
	interface ListProps {
		items?: string[] | { name: string; role: string }[];
		itemFormat?: 'string' | 'structured';
		type?: 'plain' | 'bullet' | 'number' | 'custom';
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
		customStyle
	}: ListProps = $props();
</script>

<ul
	class="list list--{type}"
	style={type === 'custom' && customStyle ? `list-style: ${customStyle}` : undefined}
>
	{#each items as item}
		<li class="list__item list__item--{itemFormat}">
			{#if itemFormat === 'structured' && typeof item === 'object'}
				<span class="list__item-name">{item.name}</span>
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
		padding: 0;
	}

	.list--plain {
		list-style: none;
	}

	.list--bullet {
		list-style: disc;
		padding-left: 1.5em;
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
		font-weight: 500;
		white-space: nowrap;
	}

	.list__item-separator {
		color: var(--fg-text-secondary, #666);
		white-space: nowrap;
	}

	.list__item-role {
		color: var(--fg-text-secondary, #666);
		white-space: nowrap;
	}
</style>

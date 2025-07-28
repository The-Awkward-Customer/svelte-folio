<script lang="ts">
	interface ListProps {
		items?: string[] | { name: string; role: string }[];
		dual?: boolean;
		type?: 'plain' | 'bullet' | 'number' | 'custom';
		customStyle?: string;
	}

	let { items = [
		"John Smith – Developer",
		"Sarah Johnson – Designer", 
		"Mike Chen – Product Manager",
		"Emily Davis – QA Engineer",
		"Alex Rodriguez – DevOps"
	], dual = false, type = 'plain', customStyle }: ListProps = $props();
</script>

<ul class="list list--{type}" style={type === 'custom' && customStyle ? `list-style: ${customStyle}` : undefined}>
	{#each items as item}
		<li>
			{#if dual && typeof item === 'object'}
				{item.name} – {item.role}
			{:else}
				{item}
			{/if}
		</li>
	{/each}
</ul>

<style>
	.list {
		margin: 0;
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
</style>

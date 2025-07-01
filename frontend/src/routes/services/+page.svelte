<script lang="ts">
	import Accordian from '$lib/components/accordian/Accordian.svelte';
	import { Introduction, Experience, Process } from '$lib/components/accordian/accordionItems';
</script>

<Accordian number="1" label="Clear" suffix="Design">
	<Introduction />
</Accordian>

<Accordian number="2" label="Modular" suffix="Engineering">
	<Experience />
</Accordian>

<Accordian number="3" label="Elegant" suffix="Strategy">
	<Process />
</Accordian>

<style>
</style>

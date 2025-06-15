<script lang="ts">
	import Button from '$lib/components/actions/Button.svelte';

	function handleButtonClick() {
		alert('Button clicked!');
	}
</script>

<div class="test-container">
	<h1>Button Component Test</h1>

	<section class="test-section">
		<h2>Button Variants</h2>

		<div class="button-group">
			<Button
				as="button"
				label="inverse Button"
				variant="inverse"
				handleClick={handleButtonClick}
			/>

			<Button as="button" label="Strong Button" variant="primary" handleClick={handleButtonClick} />

			<Button
				as="button"
				label="Submit Button"
				variant="inverse"
				type="submit"
				handleClick={handleButtonClick}
			/>

			<Button
				as="button"
				label="Disabled Button"
				variant="primary"
				disabled={true}
				handleClick={handleButtonClick}
			/>
		</div>
	</section>

	<section class="test-section">
		<h2>Buttons with Icons</h2>

		<div class="button-group">
			<Button
				as="button"
				label="Save"
				iconName="checksfilled"
				variant="inverse"
				handleClick={handleButtonClick}
			/>

			<Button
				as="button"
				label="Close"
				iconName="close"
				variant="inverse"
				handleClick={handleButtonClick}
			/>

			<Button
				as="button"
				label="Add Item"
				iconName="plus"
				variant="inverse"
				handleClick={handleButtonClick}
			/>
		</div>
	</section>

	<section class="test-section">
		<h2>Link Variants</h2>

		<div class="button-group">
			<Button as="link" label="Internal Link" variant="inverse" href="/graphics" />

			<Button
				as="link"
				label="External Link"
				variant="inverse"
				href="https://example.com"
				target="_blank"
				rel="noopener noreferrer"
			/>

			<Button as="link" label="Same Tab Link" variant="inverse" href="/graphics" target="_self" />
		</div>
	</section>

	<section class="test-section">
		<h2>Links with Icons</h2>

		<div class="button-group">
			<Button
				as="link"
				label="View Graphics"
				iconName="placeholder"
				variant="primary"
				href="/graphics"
			/>

			<Button as="link" label="Close Dialog" iconName="close" variant="inverse" href="/" />
		</div>
	</section>

	<section class="test-section">
		<h2>Full Width Buttons</h2>

		<div class="button-group">
			<Button
				as="button"
				label="Full Width Ghost Button"
				variant="inverse"
				fullWidth={true}
				handleClick={handleButtonClick}
			/>

			<Button
				as="button"
				label="Full Width Strong Button"
				variant="primary"
				fullWidth={true}
				handleClick={handleButtonClick}
			/>

			<Button
				as="button"
				label="Full Width with Icon"
				iconName="checksfilled"
				variant="primary"
				fullWidth={true}
				handleClick={handleButtonClick}
			/>
		</div>
	</section>

	<section class="test-section">
		<h2>Full Width Links</h2>

		<div class="button-group">
			<Button
				as="link"
				label="Full Width Link"
				variant="inverse"
				fullWidth={true}
				href="/graphics"
			/>

			<Button
				as="link"
				label="Full Width Link with Icon"
				iconName="placeholder"
				variant="primary"
				fullWidth={true}
				href="/graphics"
			/>
		</div>
	</section>
</div>

<style>
	.test-container {
		padding: 2rem;
		max-width: 800px;
		margin: 0 auto;
	}

	.test-section {
		margin-bottom: 3rem;
		padding: 1.5rem;
		background-color: rgba(173, 216, 230, 0.1);
		border-radius: 8px;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	h1 {
		color: rgba(255, 20, 147, 0.8);
		margin-bottom: 2rem;
	}

	h2 {
		color: rgba(30, 144, 255, 0.8);
		margin-bottom: 1rem;
	}
</style>

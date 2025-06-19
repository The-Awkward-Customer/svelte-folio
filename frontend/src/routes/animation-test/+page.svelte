<script lang="ts">
	import CanvasAnimation from '$lib/components/CanvasAnimation.svelte';
</script>

<div class="container">
	<h1>Animation Test Page</h1>

	<section>
		<h2>Auto-playing Animation</h2>
		<CanvasAnimation
			animationName="yellow-green-motion"
			size="200px"
			trigger="auto"
			delay={0}
			loop={true}
		>
			<div slot="loading">Loading yellow-green motion...</div>
			<div slot="fallback">Static yellow-green motion fallback</div>
		</CanvasAnimation>
	</section>

	<section>
		<h2>Hover-triggered Animation</h2>
		<CanvasAnimation animationName="yellow-green-motion" size="300px" trigger="hover" loop={true}>
			<div slot="loading">Loading yellow-green motion...</div>
			<div slot="fallback">Static yellow-green motion fallback</div>
		</CanvasAnimation>
	</section>

	<section>
		<h2>Click-triggered Animation</h2>
		<CanvasAnimation animationName="yellow-green-motion" size="600px" trigger="click" loop={true}>
			<div slot="loading">Loading yellow-green motion...</div>
			<div slot="fallback">Static yellow-green motion fallback</div>
		</CanvasAnimation>
	</section>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	section {
		margin-bottom: 4rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 2rem;
		color: rgba(255, 192, 203, 0.8); /* Pink with opacity */
	}

	h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
		color: rgba(173, 216, 230, 0.8); /* Light blue with opacity */
	}

	/* Mobile-first approach */
	@media (min-width: 896px) {
		.container {
			padding: 4rem;
		}

		section {
			margin-bottom: 6rem;
		}
	}
</style>

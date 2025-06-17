<script lang="ts">
	import Button from '$lib/components/actions/Button.svelte';
	import TextCard from '$lib/components/cards/TextCard.svelte';

	// Contact form state
	let formData = $state({
		name: '',
		email: '',
		company: '',
		message: '',
		projectType: 'design',
		budget: 'under-10k'
	});

	let isSubmitting = $state(false);
	let submitMessage = $state('');

	// Contact information
	const contactInfo = {
		email: 'hello@peterabbott.design',
		phone: '+34 123 456 789',
		location: 'Madrid, Spain',
		availability: 'Available for new projects Q3 2025',
		timezone: 'CET (UTC+1)'
	};

	// Social links
	const socialLinks = [
		{ name: 'LinkedIn', url: 'https://linkedin.com/in/peterabbott', icon: 'placeholder' },
		{ name: 'Twitter', url: 'https://twitter.com/peterabbott', icon: 'placeholder' },
		{ name: 'Dribbble', url: 'https://dribbble.com/peterabbott', icon: 'placeholder' },
		{ name: 'GitHub', url: 'https://github.com/peterabbott', icon: 'placeholder' }
	];

	// Project types
	const projectTypes = [
		{ value: 'design', label: 'UI/UX Design' },
		{ value: 'development', label: 'Frontend Development' },
		{ value: 'consulting', label: 'Design Consulting' },
		{ value: 'workshop', label: 'Workshop/Training' },
		{ value: 'other', label: 'Other' }
	];

	// Budget ranges
	const budgetRanges = [
		{ value: 'under-10k', label: 'Under €10k' },
		{ value: '10k-25k', label: '€10k - €25k' },
		{ value: '25k-50k', label: '€25k - €50k' },
		{ value: '50k-plus', label: '€50k+' },
		{ value: 'discuss', label: "Let's discuss" }
	];

	// Form submission handler
	async function handleSubmit() {
		isSubmitting = true;
		submitMessage = '';

		// Simulate form submission
		try {
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Reset form
			formData = {
				name: '',
				email: '',
				company: '',
				message: '',
				projectType: 'design',
				budget: 'under-10k'
			};

			submitMessage = "Thanks for reaching out! I'll get back to you within 24 hours.";
		} catch (error) {
			submitMessage = 'Something went wrong. Please try again or email me directly.';
		} finally {
			isSubmitting = false;
		}
	}

	// Card click handlers
	function handleEmailClick() {
		window.location.href = `mailto:${contactInfo.email}`;
	}

	function handlePhoneClick() {
		window.location.href = `tel:${contactInfo.phone}`;
	}

	function handleLocationClick() {
		window.open('https://maps.google.com/?q=Madrid,Spain', '_blank');
	}

	function handleSocialClick(url: string) {
		return () => window.open(url, '_blank');
	}
</script>

<svelte:head>
	<title>Contact - Peter Abbott</title>
	<meta
		name="description"
		content="Get in touch for design and development projects. Based in Madrid, available for new projects Q3 2025."
	/>
</svelte:head>

<div class="contact-page">
	<!-- Hero Section -->
	<section class="hero-section">
		<div class="hero-content">
			<h1>Let's work together</h1>
			<p class="hero-description">
				I'm currently based in sunny Madrid and available for new projects in Q3 2025. Whether you
				need UI/UX design, frontend development, or design consulting, I'd love to hear about your
				project.
			</p>
		</div>
	</section>
</div>

<style>
	.contact-page {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		gap: var(--spc-1200);
		width: 100%;
		padding-bottom: var(--spc-1000);
		text-align: left;
	}

	/* Hero Section */
	.hero-section {
		display: flex;
		flex-direction: column;
		gap: var(--spc-800);
	}

	.hero-content h1 {
		font-size: var(--fs-800);
		font-weight: var(--fw-bold);
		color: rgb(var(--fg-text-primary));
		line-height: 1.1;
	}

	.hero-description {
		font-size: var(--fs-400);
		color: rgb(var(--fg-text-secondary));
		line-height: 1.6;
		max-width: 600px;
	}
</style>

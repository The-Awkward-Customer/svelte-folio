<script lang="ts">
	import {
		DialogSection,
		DialogText,
		DialogAnimatedBackground,
		DialogDetails,
		DialogFooter,
		DialogHeader,
		DialogInsight,
		DialogIntro,
		DialogPrefix,
		DialogPrinciples,
		DialogTitle,
	} from './index';
	import DialogImage from './DialogImage.svelte';

	// Images
	import placeholder1x1 from '$lib/assets/example1x1.png';
	import placeholder16x9 from '$lib/assets/example16x9.png';

	const freshaData = {
		title: {
			title: 'DialogTwo',
			subcopy: 'Empowering health and beauty for everyone',
			introText:
				'During my time at Fresha, I founded and led a multidisciplinary team of designers and engineers to develop a design system across Web, iOS, and Android platforms. This resulted in a best-in-class user experience and highly automated system that catalyzed rapid global growth.'
		},

		details: {
			Team: ['Peter Abbott - Team Lead', 'Matt Berchoux - Designer'],
			projectDetails: [
				{ title: 'Company', details: 'Fresha' },
				{ title: 'Date', details: '2020-2023' }
			]
		},

		journey: {
			title: 'Challenge',
			content:
				'1000+ components in the code base and no source of truth was resulting in a confusing design and develop experience. I was brought in to analysis the depth and breadth of the problem and, enable teams to work more efficiently and effectively as the company scaled globally.'
		},

		graphicOne: {
			prefixVariant: 'subtitle',
			prefixText: 'Flexible component composition is key.',
			alt: 'placeholder alt text'
		},

		graphicTwo: {
			prefixVariant: 'subtitle',
			prefixText: 'Flexible component composition is key.',
			alt: 'placeholder alt text'
		},

		bigGraphic: {
			image: { placeholder16x9 },
			alt: 'placeholder alt text'
		},

		principles: {
			prefixVariant: 'header',
			prefixText: 'Principles'
		},

		insightOne: {
			alt: 'placeholder alt text',
			insightText:
				'dummy insight data about something insightfull and interesting to do with the case study.'
		}
	};

	let scrollWrapperElement: HTMLDivElement; // Reference to the scroll wrapper
	let currentScrollTop = 0; // Track scroll position
</script>

<DialogHeader />

<!-- <DialogAnimatedBackground scrollPosition={currentScrollTop}/> -->

<div
	class="dialog-root-scroll-wrapper"
	bind:this={scrollWrapperElement}
	on:scroll={() => (currentScrollTop = scrollWrapperElement.scrollTop)}
>
	<DialogSection id="title" hasPadding={true}>
		<DialogTitle title={freshaData.title.title} subcopy={freshaData.title.subcopy} />
		<DialogIntro introText={freshaData.title.introText} gridArea="footer" />
	</DialogSection>

	<DialogSection id="details" hasPadding={true}>
		<DialogDetails
			projectDetails={freshaData.details.projectDetails}
			sections={freshaData.details.Team}
		/>
	</DialogSection>

	<DialogSection id="journey" hasPadding={true}>
		<DialogPrefix variant="image" src={placeholder1x1} alt="This is an image" />
		<DialogText title={freshaData.journey.title} content={freshaData.journey.content} />
	</DialogSection>

	<DialogSection id="insight one" hasPadding={true}>
		<DialogInsight insight={freshaData.insightOne.insightText} alt={freshaData.insightOne.alt} />
	</DialogSection>

	<DialogSection id="graphic one" hasPadding={true}>
		<DialogPrefix variant="subtitle" text={freshaData.graphicOne.prefixText} />
		<DialogImage src={placeholder16x9} alt={freshaData.graphicOne.alt} />
	</DialogSection>

	<DialogSection id="graphic two" hasPadding={true}>
		<DialogPrefix variant="subtitle" text="flexible component composition is key." />
		<DialogImage src={placeholder16x9} alt="placeholder" />
	</DialogSection>

	<DialogSection id="big graphic" hasPadding={true}>
		<DialogImage src={placeholder16x9} alt="placeholder" />
	</DialogSection>

	<DialogSection id="principles" hasPadding={true}>
		<DialogPrefix variant="header" text="Principles" />
		<DialogPrinciples />
	</DialogSection>

	<DialogSection id="insight one" hasPadding={true}>
		<DialogInsight insight={freshaData.insightOne.insightText} alt={freshaData.insightOne.alt} />
	</DialogSection>

	<DialogSection hasPadding={true}>
		<DialogFooter />
	</DialogSection>
</div>

<style>
	.dialog-root-scroll-wrapper {
		width: 100%;
		overflow-y: auto; /* Enable vertical scrolling for content */
		scrollbar-width: none;
		padding-top: 124px;
	}
</style>

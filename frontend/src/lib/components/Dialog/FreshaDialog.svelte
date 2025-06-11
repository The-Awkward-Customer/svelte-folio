<script lang="ts">

    import { DialogSection,DialogText, DialogAnimatedBackground, DialogDetails, DialogFooter, DialogHeader, DialogInsight, DialogIntro, DialogPrefix, DialogPrinciples, DialogTitle, FreshaDialog } from './index'
    import Image from '../content/image.svelte';

    


  // Images
    import placeholder from "$lib/assets/placeholder-image.jpg"

    const freshaData = {
    title:{
    title: "Fresha",
    subcopy: "Empowering health and beauty for everyone",
    introText: "During my time at Fresha, I founded and led a multidisciplinary team of designers and engineers to develop a design system across Web, iOS, and Android platforms. This resulted in a best-in-class user experience and highly automated system that catalyzed rapid global growth.",
    },

    details:{
    projectSections: ["Overview", "Key challenges"],
    projectDetails: [
        { title: "Role", details: "Lead Product Designer" },
        { title: "Date", details: "2020-2023" }
    ]
    },

    overview:{
        alt:"placeholder alt text",
        overviewText:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },

    graphicOne:{
        prefixVariant:"subtitle",
        prefixText:"Flexible component composition is key.",
        alt:"placeholder alt text"
    },

     graphicTwo:{
        prefixVariant:"subtitle",
        prefixText:"Flexible component composition is key.",
        alt:"placeholder alt text"
    },

    bigGraphic:{
        image:{placeholder},
        alt:"placeholder alt text"
    },

    principles:{
        prefixVariant:"header",
        prefixText:"Principles"
    },

    insightOne:{
        insightLabel: "Insight dummy",
        insightNumber: "01",
        insightText:"dummy insight data about something insightfull and interesting to do with the case study"
    },
};



        let scrollWrapperElement: HTMLDivElement; // Reference to the scroll wrapper
        let currentScrollTop = 0; // Track scroll position
</script>

            
            <DialogHeader />
            
            <DialogAnimatedBackground scrollPosition={currentScrollTop}/>

            <div 
            class="dialog-root-scroll-wrapper" 
            bind:this={scrollWrapperElement} 
            on:scroll={() => currentScrollTop = scrollWrapperElement.scrollTop}
        >

            <DialogSection id="title" hasPadding={true}>
                <DialogTitle title="{freshaData.title.title}" subcopy={freshaData.title.subcopy}/>
                <DialogIntro introText={freshaData.title.introText}/>
            </DialogSection>

            <DialogSection id="details" hasPadding={true}>
                <DialogDetails projectDetails={freshaData.details.projectDetails} sections={freshaData.details.projectSections} />
            </DialogSection>

            <DialogSection id="overview" hasPadding={true}>
                <DialogPrefix variant="image" src={placeholder} alt="This is an image" aspectRatio="1/1" />
                <DialogText/>
            </DialogSection>

            <DialogSection id="graphic one" hasPadding={true}>
                <DialogPrefix variant="subtitle" text={freshaData.graphicOne.prefixText}/>
                <Image src={placeholder} alt={freshaData.graphicOne.alt}/>
            </DialogSection>
            
            <DialogSection id="graphic two" hasPadding={true}>
                <DialogPrefix variant="subtitle" text="flexible component composition is key."/>
                <Image src={placeholder} alt="placeholder"/>
            </DialogSection>

            <DialogSection id="big graphic" hasPadding={true} variant="full-width">
                <Image src={placeholder} alt="placeholder"/>
            </DialogSection>

            <DialogSection id="principles" hasPadding={true}>
                <DialogPrefix variant="header" text="Principles"/>
                <DialogPrinciples/>
            </DialogSection>

            <DialogSection id="insight one" hasPadding={true}>
                <DialogInsight label={freshaData.insightOne.insightLabel} number={freshaData.insightOne.insightNumber} insight={freshaData.insightOne.insightText}/>
            </DialogSection>


            <DialogSection hasPadding={true} variant="full-width">
                 <DialogFooter/>   
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
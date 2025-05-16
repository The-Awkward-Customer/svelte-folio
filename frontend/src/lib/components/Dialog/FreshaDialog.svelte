<script lang="ts">

    import { DialogSection,DialogText, DialogAnimatedBackground, DialogDetails, DialogFooter, DialogHeader, DialogInsight, DialogIntro, DialogPrefix, DialogPrinciples, DialogTitle } from './index'
    import Image from '../content/image.svelte';



  // Images
    import placeholder from "$lib/assets/placeholder-image.jpg"


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

            <DialogSection hasPadding={true}>
                <DialogTitle title="FRESHA" subcopy="Helping health and beauty businesses succeed."/>
                <DialogIntro introText="In my time at Fresha I founded and led a multidisciplinary team to designers and impliment a design system across web and iOS and Android platforms."/>
            </DialogSection>

            <DialogSection hasPadding={true}>
                <DialogDetails/>
            </DialogSection>

            <DialogSection hasPadding={true}>
                <DialogPrefix variant="image" src={placeholder} alt="This is an image" aspectRatio="1/1" />
                <DialogText/>
            </DialogSection>

            <DialogSection hasPadding={true}>
                <DialogPrefix variant="subtitle" text="flexible component composition is key."/>
                <Image src={placeholder} alt="placeholder"/>
            </DialogSection>
            
            <DialogSection hasPadding={true}>
                <DialogPrefix variant="subtitle" text="flexible component composition is key."/>
                <Image src={placeholder} alt="placeholder"/>
            </DialogSection>

            <DialogSection hasPadding={true} variant="full-width">
                <Image src={placeholder} alt="placeholder"/>
            </DialogSection>

            <DialogSection hasPadding={true}>
                <DialogPrefix variant="header" text="Principles"/>
                <DialogPrinciples/>
            </DialogSection>

            <DialogSection hasPadding={true}>
                <DialogInsight/>
            </DialogSection>



            <DialogSection hasPadding={true}>
                 <DialogPrefix variant="image" src={placeholder} alt="This is an image" aspectRatio="1/1" />
                <Image src={placeholder} alt="placeholder"/>   
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
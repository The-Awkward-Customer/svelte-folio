<script lang="ts">

    interface DialogPrinciplesProps{

    }


    // const defaultSections = ["intro", "body", "insights", "conclussion"]

    // interface ProjectDetail{
    // title:string;
    // details:string;
    // }

    // const defaultDetails: ProjectDetail[] = [
    // {title: "Example One", details: '2020-2023'},
    // {title: "Example Two", details: '2020-2023'}
    // ]

    // interface DialogDetailsProps{
    // projectSections?:string[]; // array of strings
    // projectDetails?: ProjectDetail[]; // array of objects
    // }   



    // Psuedo API:
    // let defaultPrinciples: Principles[] =[
    //     { princpleOne: "Introduction", princpleOneGraphic: ""}
    //     ]

        // example object

        // import image
        import principleOneGraphic from "$lib/assets/exampleImage1.jpg"
        import principleTwoGraphic from "$lib/assets/exampleImage2.jpg"
        // Declare the image as a variable
        let p1g = principleOneGraphic
        let p2g = principleTwoGraphic

        // First we need to define the shape of the object with it's own interface
        interface PrinciplesObject{
        text:string
        graphic: string
        }
        
        // how can "pass" a variable into my object
        const defaultPrinciples: PrinciplesObject[] =[
        { text: "principleOne", graphic: p1g}, 
        { text: "principleTwo", graphic: p2g} 
        ]

        interface PrinciplesProps{
            principles?: PrinciplesObject[];
        }
        
        //destructured properties
        let { principles=defaultPrinciples } : PrinciplesProps = $props();


</script>




{#snippet Principle(param1:string, param2:string)}
    <p>Hello!</p>
    <span>{param1}</span>
    <img src={param2} alt={param1}/>
{/snippet}


<div class="dialog-princples">
    {#each  principles as principle}
    {@render Principle(principle.text, principle.graphic)}
    {/each}
</div>






<style>
    .dialog-princples{
        grid-area: trailing;
        font-size: 24px;
        line-height: 120%;
        font-weight: 700;
    }
    .dialog-princples, img{
        width: 24px;
        height: 24px;
        aspect-ratio: 1/1;
    }

</style>
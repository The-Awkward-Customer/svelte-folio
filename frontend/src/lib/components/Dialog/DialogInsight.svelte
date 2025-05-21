<!-- DialogHeader.svelte -->

<script lang="ts">

    // import { insightManager } from '$lib/stores/where'; // TODO


    interface InsightData{
       number:string
       label: string
       insight: string

    }

    const exampleInsightData : InsightData = {
      number: "01",
      label: 'Example insight',
      insight: '“We identified that teams has no guard rails and that we were “bleeding out” through constant contributions.”'
    }

    interface InsightButton{
        data?: InsightData
    }

    let { label=exampleInsightData.label, number=exampleInsightData.number, insight=exampleInsightData.insight } : InsightData = $props();

    let isVisible: boolean = $state(false)

    function handleInsightClick() {
        isVisible = !isVisible
        console.log(`the value is: ${isVisible}`)
    }

    

</script>



<button aria-label={label} onclick={handleInsightClick}>
    <div class="insight-header">
        <p>{label}</p>
        <p>{number}</p>
    </div>
    <span style={`filter: blur(${isVisible ? '0px' : '6px' });`}>
        {insight}
    </span>

</button>

<style>

button{
    display: flex;
    flex-direction: column;
    padding: 24px;
    gap: 24px;
    border-radius: var(--bdr-radius-large);
    border: 1px solid rgb(197, 197, 198) ;
    grid-area: trailing;
    background-color: var(--color-bg-primary);
    cursor: pointer;
}

button > span{
    text-align: start;
    font-size: 28px;
    line-height: 120%;
    font-weight: var(--fw-medium);
    color: var(--color-fg-primary);
}


.insight-header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-weight: var(--fw-bold);
}


</style>
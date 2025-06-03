<script lang="ts">

let P : string = "Grapics Page"
console.log(`${P} rendered!`)


export interface GridItem{
readonly id: string;
readonly component: any;
readonly size: '1-1' | '2-1'| '1-2' | '2-2'
readonly props?: Record<string, any>
}

interface Props {
items: readonly GridItem[];
columns?: number;
}

let {items, columns=4} : Props = $props();

const sizeMap = {
    '1-1': { cols: 1, rows: 1 },
    '2-1': { cols: 2, rows: 1 },
    '1-2': { cols: 1, rows: 2 },
    '2-2': { cols: 2, rows: 2 }
  } as const;

</script>

<div class="grid" style="--columns: {columns}">
    {#each items as item}
        {@const Component = item.component}
        <div
            class="grid-item"
            style="
                grid-column: span {sizeMap[item.size].cols};
                grid-row: span {sizeMap[item.size].rows};
                "
        >
            <Component {...(item.props || {})}/>
        </div>
    {/each}

</div>


<style>
    .grid{
        display: grid;
        grid-template-columns: repeat(1fr, 1fr);
        gap: 0.5rem;
        grid-auto-flow: row dense;
    }

    .grid-item {
        border-radius: var(--bdr-radius-small);
        min-height: 124px;
        overflow: hidden;
    }

 @media (min-width: 896px){
    .grid{
        grid-template-columns: repeat(var(--columns), 1fr);
    }

 }
</style>
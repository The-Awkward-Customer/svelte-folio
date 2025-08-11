<script lang='ts'>

    let P1 : string = "Most Recently I was the Cofound designer at GoDesk, before which I led the Design System team at Fresha."
    let P2 : string = "I also have work as contracting and with agencies."
    let P3 : string = "Currently Available for work in Q3-2025"

</script>


<div>
    <p>{P1}</p>
    <p>{P2}</p>
    <p class="p-3">{P3}</p>
    </div>


<style>

    div{
        display: inline-flex;
        flex-direction: column;
        font-size: clamp(18px, 4vw, 28px);
        gap: 0.5em;
        padding-left: 2em;
        color: rgb(var(--fg-text-primary));
    }

    .p-3{
        color:rgb(var(--fg-positive));
        font-weight: var(--fw-regular);
    }

</style>

<script lang='ts'>
    let P1 : string = "I create products and services that resonate with people through simple, considered, engaging design."
    let P2 : string = "currently obsessed with Human ←→ Machine design relationships"

</script>


<div>
    <p>{P1}</p>
    <p>{P2}</p>
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

    p{
        font-weight: var(--fw-medium);
    }

</style>


<script lang="ts">

</script>

<div>
    <p>The correct way to handle shared state with $state in a separate module is to export an object containing the state properties and then mutate those properties, not reassign the exported state variable itself. </p>
</div>

<style>
    div{
        display: inline-flex;
        flex-direction: column;
        background-color: rgba(255, 192, 203, 0.20);
        border: 1px, solid, pink;
        max-width: 64ch;
    }
    p{
        font-size: clamp(18px, 4vw, 28px);
        font-weight: var(--fs-semibold);
        padding-left: 2em;
    }
</style>
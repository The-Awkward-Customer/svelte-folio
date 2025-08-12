<script lang="ts">
  let P1: string =
    'I don’t have one way of working but if I did it would probably look something like this:';
  let P2: string =
    'Problem definition → Exploration → Prototype → Asses → Deliver → Repeat';
</script>

<div>
  <p>{P1}</p>
  <p>{P2}</p>
</div>

<style>
  div {
    display: inline-flex;
    flex-direction: column;
    font-size: clamp(18px, 4vw, 28px);
    gap: 0.5em;
    padding-left: 2em;
    color: rgb(var(--fg-text-primary));
  }
</style>

<script lang="ts">
  import FooterTitle from "./FooterTitle.svelte";

  interface FooterProps {
    enableShuffleAnimation?: boolean;
  }

  let { enableShuffleAnimation = true }: FooterProps = $props();
</script>

<footer>
  <FooterTitle {enableShuffleAnimation} />
</footer>

<style>
  /* root */
  footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    grid-template-rows: 1fr auto;
    gap: 2em;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
    padding-top: 16px;
    width: 100%;
  }
</style>

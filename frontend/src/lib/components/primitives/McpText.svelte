<script lang="ts">
  // Using TypeScript and Svelte 5.0.0 runes syntax
  interface Props {
    text?: string;
  }

  let { text = 'Hello' }: Props = $props();
</script>

<div class="mcp-text" data-name="MCP_TEXT_COMP">
  <div class="flex-container">
    <div class="content-box">
      <div class="text-content">
        <p>{text}</p>
      </div>
    </div>
  </div>
</div>

<style>
  .mcp-text {
    /* Using pink with opacity for visibility */
    background-color: rgba(166, 12, 12, 0.8);
    position: relative;
    width: 100%;
    height: 100%;
  }

  .flex-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
  }

  .content-box {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    gap: 0.625rem;
    align-items: center;
    justify-content: center;
    padding-inline: 1rem;
    padding-block: 1rem;
    position: relative;
    width: 100%;
    height: 100%;
  }

  /* Mobile-first approach with min-width breakpoint */
  @media (min-width: 896px) {
    .content-box {
      padding-inline: 12.188rem;
      padding-block: 4.813rem;
    }
  }

  .text-content {
    font-family: 'Geist Mono', monospace;
    font-weight: 500;
    line-height: normal;
    font-style: normal;
    position: relative;
    flex-shrink: 0;
    color: #ffffff;
    font-size: 1rem;
    text-align: left;
    white-space: pre;
  }
</style>

<script lang="ts">
  interface Props {
    title: string;
    content?: string;
    bgColor?: string;
  }
  
  let { title, content, bgColor = '#ffffff' }: Props = $props();
</script>

<div class="text-card" style="background-color: {bgColor}">
  <h2>{title}</h2>
  {#if content}
    <p>{content}</p>
  {/if}
</div>

<style>
  .text-card {
    padding: 1.5rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  h2 {
    margin: 0 0 1rem 0;
    color: #333;
  }
  
  p {
    margin: 0;
    color: #666;
    line-height: 1.5;
  }
</style>
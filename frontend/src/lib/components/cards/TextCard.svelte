<script lang="ts">
  import Tag from '../primitives/Tag.svelte';
  import IconButton from '../actions/IconButton.svelte';

  type ButtonTypes = 'primary' | 'inverse';

  interface Props {
    title: string;
    content?: string;
    bgColor?: string; // Pass CSS custom property name (e.g., '--primary-color')
    tag?: string;
    button: ButtonTypes;
    handleClick?: () => void;
  }

  let {
    title,
    content,
    bgColor = '--bg-primary',
    tag = 'example',
    button = 'primary',
    handleClick = DoThing,
  }: Props = $props();

  // Automatically wrap bgColor in rgb(var()) if it starts with '--'
  const computedBgColor = $derived(
    bgColor?.startsWith('--')
      ? `rgb(var(${bgColor}))`
      : bgColor || 'rgb(var(--color-surface))'
  );

  function DoThing() {
    console.log('button clicked');
  }
</script>

<div class="text-card" style="background-color: {computedBgColor};">
  <div>
    <h2>{title}</h2>
    {#if content}
      <p>{content}</p>
    {/if}
  </div>

  <div class="tag-container">
    {#if tag}
      <div class="tag-container">
        <Tag label={tag} color="inverse" />
      </div>
    {/if}
    <IconButton variant={button} name="plus" {handleClick} />
  </div>
</div>

<style>
  .text-card {
    display: flex;
    flex-direction: column-reverse;
    justify-content: space-between;
    padding-top: var(--spc-200);
    padding-left: var(--spc-300);
    padding-right: var(--spc-300);
    padding-bottom: var(--spc-300);
    width: 100%;
    height: 100%;
  }

  .tag-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  h2 {
    color: rgb(var(--color-txt-primary));
  }

  p {
    color: rgb(var(--color-txt-primary));
  }
</style>

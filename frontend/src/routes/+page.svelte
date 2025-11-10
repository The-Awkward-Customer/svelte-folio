<script lang="ts">
  import ChatTrigger from "$lib/components/navigation/ChatTrigger.svelte";
  import { QAChat } from "$lib/components/chat";
  import { chatStore } from "$lib/stores/chatStore.svelte.js";
  import AnimatedTextPath from "$lib/components/graphics/AnimatedTextPath.svelte";

  function handleChatTriggerClick() {
    chatStore.openChat();
  }
</script>

<svelte:head>
  <title>Peter Abbott - Interactive Designer & Developer</title>
  <meta
    name="description"
    content="Interactive designer and frontend developer based in Madrid. Available for UI/UX design, development, and consulting projects in Q3 2025."
  />
</svelte:head>

<!-- {#snippet CardHeader(title: string)}
  <div class="card-header_root">
    <h3 class="headline-display">
      {title}
    </h3>
    <span class="card-header_graphic"></span>
  </div>
{/snippet} -->

<!-- <Section id="introduction">
  {#snippet main()}
    <p>Introduction</p>
  {/snippet}
</Section>

<Section id="work">
  {#snippet main()}
    <p>work</p>
  {/snippet}
</Section>

<Section id="articles">
  {#snippet main()}
    <p>Articles</p>
  {/snippet}
</Section> -->

<div class="page-container">
  <div class="background-animation">
    <AnimatedTextPath
      texts={["COMING SOON"]}
      showPath={false}
      speed={80}
      pathWildness={0.9}
      verticalBounds={0.1}
      textStyle={{
        font: "bold 48px sans-serif",
        size: 48,
        color: "#888888",
      }}
    />
  </div>

  <div class="content">
    <div class="chat-trigger-container">
      <ChatTrigger
        handleClick={handleChatTriggerClick}
        shouldShowIndicator={chatStore.shouldShowIndicator}
      />
    </div>

    <div class="coming-soon">
      <h1>Peter<br />Abbott</h1>
    </div>
  </div>
</div>

<QAChat />

<style>
  .page-container {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
  }

  .background-animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 0;
    opacity: 0.3;
  }

  .background-animation :global(.animated-text-path-container) {
    height: 100vh;
  }

  .content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    padding: var(--padding-xl);
  }

  .chat-trigger-container {
    display: flex;
    justify-content: flex-start;
    padding: var(--padding-medium) 0;
  }

  .coming-soon {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    flex-grow: 1;
    width: 100%;
  }

  .coming-soon h1 {
    font-size: clamp(4rem, 15vw, 12rem);
    font-weight: var(--font-weight-bold);
    line-height: 0.9;
    color: var(--fg-text-primary);
    text-align: left;
    text-transform: uppercase;
  }

  /* .card-header_root {
    display: flex;
    position: relative;
    width: 100%;

    padding: var(--padding-xl) var(--padding-xl);

    color: var(--fg-primary-default);
  }

  .card-header_graphic {
    display: block;
    position: absolute;
    top: -50px;
    right: 10%;
    width: 100px;
    height: 100px;
    background-color: rgba(137, 43, 226, 0.21);
  } */
</style>

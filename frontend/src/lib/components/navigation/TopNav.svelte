<script lang="ts">
  import LinkList from "./LinkList.svelte";
  import Popover from "../popover/Popover.svelte";
  import ChatTrigger from "./ChatTrigger.svelte";
  import { QAChat } from "../chat";
  import { chatStore } from "$lib/stores/chatStore.svelte.js";

  interface LinkItem {
    label: string;
    href: string;
  }

  interface TopNavProps {
    list?: LinkItem[];
  }

  let defaultListData: LinkItem[] = [
    { label: "Index", href: "/" },
    { label: "Experience", href: "/experience" },
  ];

  let { list = defaultListData }: TopNavProps = $props();

  let popoverTitle = "Hey there!";
  let popoverText =
    "This site is built using Svelte5.js, Vite and is hosted on Vercel with a little help from Claude. ❤️";

  function handleChatTriggerClick() {
    chatStore.openChat();
  }
</script>

<section class="top-nav-root">
  <ChatTrigger 
    handleClick={handleChatTriggerClick}
    shouldShowIndicator={chatStore.shouldShowIndicator}
  />
  <div class="top-nav-surface">
    <header class="content">
      <LinkList {list} />
    </header>
  </div>
  <Popover
    id="bottom-position"
    position="bottom"
    title={popoverTitle}
    text={popoverText}
  />
</section>

<QAChat />

<style>
  .top-nav-root {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--padding-large);
  }

  .top-nav-surface {
    background-color: var(--surface-neutral-mask);
    border: 1px solid var(--border-neutral);
    border-radius: var(--border-radius-sm);
  }

  header {
    display: flex;
    justify-content: start;
    padding: var(--padding-tiny) var(--padding-medium);
    background: transparent;
    border-radius: calc(var(--border-radius-sm) - 1px);
  }
</style>

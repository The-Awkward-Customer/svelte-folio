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
    { label: "Introduction", href: "#introduction" },
    { label: "Work", href: "#work" },
    { label: "Articles", href: "#articles" },
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
  <nav class="top-nav-surface">
    <nav class="top-nav-content">
      <ChatTrigger
        handleClick={handleChatTriggerClick}
        shouldShowIndicator={chatStore.shouldShowIndicator}
      />

      <LinkList {list} />

      <Popover
        id="bottom-position"
        position="bottom"
        title={popoverTitle}
        text={popoverText}
      />
    </nav>
  </nav>
</section>

<QAChat />

<style>
  .top-nav-root {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: var(--gap-sm);
    width: 100%;
    padding-bottom: 2px;
  }

  .top-nav-surface {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    width: 100%;
    padding: var(--padding-sm) var(--padding-sm);

    background-color: var(--surface-neutral-reading);
  }

  .top-nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1;
    max-width: 1024px;
    padding: var(--padding-tiny) var(--padding-medium);
    background: transparent;
    border-radius: calc(var(--border-radius-sm) - 1px);
  }
</style>

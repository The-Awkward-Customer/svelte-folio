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
  <div class="top-nav-surface">
    <header class="content">
      <LinkList {list} />
    </header>

    <Popover
      id="bottom-position"
      position="bottom"
      title={popoverTitle}
      text={popoverText}
    />
  </div>
  <ChatTrigger
    handleClick={handleChatTriggerClick}
    shouldShowIndicator={chatStore.shouldShowIndicator}
  />
</section>

<QAChat />

<style>
  .top-nav-root {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: var(--gap-sm);
    padding: var(--padding-lg) var(--padding-sm);
    min-width: 100%;
  }

  .top-nav-surface {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    flex: 1;
    max-width: 1024px;
    border-radius: var(--border-radius-pill);
    padding: var(--padding-sm) var(--padding-sm);

    background-color: var(--surface-neutral-reading);
  }

  header {
    display: flex;
    justify-content: start;
    padding: var(--padding-tiny) var(--padding-medium);
    background: transparent;
    border-radius: calc(var(--border-radius-sm) - 1px);
  }
</style>

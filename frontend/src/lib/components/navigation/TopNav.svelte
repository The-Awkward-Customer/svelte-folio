<script lang="ts">
  import LinkList from "./LinkList.svelte";

  interface LinkItem {
    label: string;
    href: string;
  }

  interface TopNavProps {
    list?: LinkItem[];
  }

  let defaultListData: LinkItem[] = [
    { label: "Index", href: "/" },
    { label: "Graphics", href: "/graphics" },
    { label: "Experience", href: "/experience" },
  ];

  let { list = defaultListData }: TopNavProps = $props();
</script>

<section class="top-nav-root">
  <div class="animated-border-box">
    <header class="content">
      <LinkList {list} />
    </header>
  </div>
</section>

<style>
  .top-nav-root {
    padding: 24px 0 0 24px;
  }

  .animated-border-box {
    position: relative;
    border-radius: var(--border-radius-card);
    padding: 1px;
  }

  .animated-border-box::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: var(--border-radius-card);
    padding: 1px;
    background: var(--border-neutral);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }

  .animated-border-box:hover::before {
    background: linear-gradient(
      45deg,
      var(--border-neutral),
      var(--border-hover),
      var(--border-neutral),
      var(--border-hover)
    );
    background-size: 300% 300%;
    animation: bgRotate 10s linear infinite;
  }

  .animated-border-box::after {
    content: "";
    position: absolute;
    inset: 1px;
    background: var(--surface-neutral-reading);
    border-radius: calc(var(--border-radius-card) - 1px);
    z-index: -1;
  }

  .content {
    position: relative;
    z-index: 1;
  }

  header {
    display: flex;
    justify-content: start;
    padding: 2px var(--spacing-grouped);
    background: transparent;
    border-radius: calc(var(--border-radius-card) - 1px);
  }

  @keyframes bgRotate {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>

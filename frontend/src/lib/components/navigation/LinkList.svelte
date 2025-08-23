<script lang="ts">
  import { page } from "$app/stores";

  interface LinkItem {
    label: string;
    href: string;
  }

  interface LinkListProps {
    list?: LinkItem[];
  }

  let defaultListData: LinkItem[] = [
    { label: "Index", href: "/" },
    { label: "Graphics", href: "/graphics" },
  ];

  let { list = defaultListData }: LinkListProps = $props();

  function getNavClasses(href: string): string {
    const isActive =
      href === "/"
        ? $page.url.pathname === "/"
        : $page.url.pathname.startsWith(href);

    return `nav-link ${isActive ? "active" : ""}`;
  }
</script>

<nav aria-label="Main navigation">
  <ul role="list">
    {#each list as item}
      <li>
        <a
          class={getNavClasses(item.href)}
          href={item.href}
          aria-label={`Navigate to ${item.label} page`}
          aria-current={item.href === "/"
            ? $page.url.pathname === "/"
              ? "page"
              : undefined
            : $page.url.pathname.startsWith(item.href)
              ? "page"
              : undefined}
        >
          {item.label}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  nav {
    display: block;
  }

  ul {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    list-style: none;
  }

  li {
    display: list-item;
  }

  .nav-link {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--fg-text-primary-60);
    text-decoration: none;
    height: var(--size-touch-safe-inset);
    border-radius: 0.25rem;
    font-size: var(--fs-275);
    font-weight: var(--fw-medium);
    transition: all 0.2s ease-in-out;
  }

  .nav-link:hover {
    color: var(--fg-text-primary);
  }

  .nav-link:focus {
    color: var(--fg-text-primary);
    outline: 2px solid var(--focus-ring-color);
    outline-offset: 2px;
  }

  .nav-link.active {
    color: var(--fg-text-primary);
  }
</style>

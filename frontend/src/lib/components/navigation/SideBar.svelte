<!-- SideBar component -->

<script lang="ts">
import logoSvg from "$lib/assets/logo.svg"

  interface $$Slots {
    default: {};
  }
</script>

<aside class="sidebar">

  <img src={logoSvg} alt="logo" />
  <slot />
</aside>

<style>
  .sidebar {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 124px 32px 24px;
    gap: 8px;
    width: 189px;
    height: 372px;
    flex: none;
    order: 0;
    flex-grow: 0;
  }

  @media (max-width: 767px) {
    .sidebar {
      /* Add mobile-specific styles if needed */
    }
  }
</style>


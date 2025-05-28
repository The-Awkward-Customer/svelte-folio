<script lang="ts">
  import LinkList from '../navigation/LinkList.svelte';

  interface LinkItem {
    label: string;
    href: string;
  }

  interface LinkListArray {
    list?: LinkItem[];
  }

  let listData: LinkItem[] = [ 
    { label: "Index", href: "/" },
    { label: "Graphics", href: "/graphics" }
  ];

  let { list = listData }: LinkListArray = $props();
</script>

<footer>
<p>Footer</p>
</footer>

<style>
  footer {
    display: inline-flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    padding-top: 16px;
    width: 100%;
    max-width: 1024px;
    font-size: clamp(18px, 4vw, 28px);
    font-weight: var(--fw-semibold);
  }

  .svg-logo { 
    width: clamp(100px, 15vw, 150px); 
    height: auto; 
  }
</style>

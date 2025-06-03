<script lang="ts">

import type { Snippet } from 'svelte';


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


interface TopNavProps{
    children? : Snippet
}


let { list = listData, children }: LinkListArray & TopNavProps = $props();


</script>

<nav>
    <div>
        <p>Peter Abbott</p>
        <p>A Developer, Designer & Mentor based in Madrid, Spain.</p>
    </div>
    <LinkList {list} />
</nav>

<style>
nav{
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    max-width: 1024px;
    padding-top: 12px;
    padding-bottom: 12px;
    gap: 1em;
}

div{
    display: flex;
    flex-direction: column;
    color: rgb(var(--fg-text-primary));
    font-size: var(--fs-300);
    font-weight: var(--fw-semibold);
    max-width: 32ch;
}

div p:nth-child(2){
 font-weight: var(--fw-regular);
 color:rgb(var(--fg-text-secondary))
}

@media (min-width: 896px){
    nav{
        flex-direction: row;
    }
}

</style>
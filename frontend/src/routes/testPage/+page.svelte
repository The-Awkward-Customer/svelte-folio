
<script lang="ts">
  //Imports
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  //Components
  import Link from '$lib/components/actions/Link.svelte';

  //Variables
  let apiMessage: string = 'loading...';

  //onMount (When the connection in made) fetch the API data
  onMount(async () => {
    try{
        // check URL is correct
        // relies on Cors
        const response = await fetch('http://localhost:3000/api/hello');
        const data = await response.json();
        apiMessage = data.message;
    }catch(error){
        console.error("error fetching data", error);
        apiMessage = "Error loading data";
    }
  });

  //Get the current path
  $: currentPath = $page.url.pathname;
</script>


<style>   
    .h-1 {
        color: rgb(60, 60, 60);
    }

    .p-text{
        color: rgb(80, 80, 80);
    }
</style>

<main>
<h1 class="h-1">Test Page</h1>
<p class="p-text">API message: {apiMessage}</p>
<a href="/">Go to home page</a>
<Link href="/" active={currentPath === '/'}>
    Home Page
</Link>

</main>
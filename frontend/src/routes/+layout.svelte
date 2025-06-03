<script>
  import '../app.css';
  import OverlayMenu from '$lib/components/navigation/OverlayMenu.svelte'
  import Footer from '$lib/components/Footer/Footer.svelte';
  import TopNav from '$lib/components/topNav/TopNav.svelte'
  import Button from '$lib/components/actions/Button.svelte';

  import { onMount } from 'svelte';
  import { theme } from '$lib/theme.svelte';


  onMount(() => {
    console.log('About to call theme.init()');
    theme.init();
    console.log('After theme.init(), current theme is:', theme.current);
  });



  let { children } = $props()


</script>



    <TopNav>
      <OverlayMenu/>
    </TopNav>

        <main>
        {@render children()}
        </main>

<Footer/>


<style>

main{
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  width: 100%;
  max-width: 1024px;
  background-color: rgb(var(--bg-page));
}


</style>


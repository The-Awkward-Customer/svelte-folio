<script>
  import '../app.css';
  import OverlayMenu from '$lib/components/navigation/OverlayMenu.svelte'
  import Footer from '$lib/components/Footer/Footer.svelte';
  import TopNav from '$lib/components/topNav/TopNav.svelte'
  import Button from '$lib/components/actions/Button.svelte';

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
}


p{
font-size:clamp(16px, 4vw, 32px);
}

</style>


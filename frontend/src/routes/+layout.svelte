<script>
  import '../app.css';
  import  Footer  from '$lib/components/Footer/Footer.svelte'
  import TopNav from '$lib/components/topNav/TopNav.svelte'

  let { children } = $props()
</script>



    <TopNav/>

        <main>
        {@render children()}
        </main>

<Footer/>


<style>

main{
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 255, 255, 0.0);
  flex-grow: 1;
  justify-content: center;
  width: 100%;
  max-width: 1024px;
  background-color: rgba(255, 192, 203, 0.20);
}


p{
font-size:clamp(16px, 4vw, 32px);
}

</style>


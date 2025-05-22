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
}


p{
font-size:clamp(16px, 4vw, 32px);
}

</style>


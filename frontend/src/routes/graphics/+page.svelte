<!-- Graphics +page -->
<script lang="ts">

    import GridLayout from "$lib/components/grids/GridLayout.svelte";
    import TextCard from "$lib/components/cards/TextCard.svelte";
    import ImageCard from "$lib/components/cards/ImageCard.svelte";





let P : string = "GRAPHICS"
console.log(`${P} rendered!`)

import exampleImage1 from '$lib/assets/exampleImage1.jpg'
import exampleImage2 from '$lib/assets/exampleImage2.jpg'


const gridItems = [
    {
      id: '1',
      component: ImageCard,
      size: '2-2', // Takes 2 columns, 1 row (wide)
      props: {
        src: exampleImage1,
        alt: 'Hero image',
        title: 'wide'
      }
    },
    {
      id: '2',
      component: TextCard,
      size: '1-1', // Takes 1 column, 1 row (square)
      props: {
        title: 'Welcome',
        content: 'This is a demo of our grid layout system!',
        bgColor: '#e3f2fd'
      }
    },
    {
      id: '3',
      component: ImageCard,
      size: '1-1', // Takes 1 column, 2 rows (tall)
      props: {
        src: exampleImage2,
        alt: 'Gallery photo 1'
      }
    },
    {
      id: '4',
      component: TextCard,
      size: '2-2',
      props: {
        title: 'Card 2',
        content: 'Another text card',
        bgColor: '#f3e5f5'
      }
    },
    {
      id: '5',
      component: ImageCard,
      size: '2-2', // Takes 2 columns, 2 rows (large square)
      props: {
        src: exampleImage1,
        alt: 'Large featured image',
        title: 'Big Feature'
      }
    },
    {
      id: '6',
      component: TextCard,
      size: '1-1',
      props: {
        title: 'Small Card',
        content: 'Compact content',
        bgColor: '#e8f5e8'
      }
    },{
      id: '1',
      component: ImageCard,
      size: '2-2', // Takes 2 columns, 1 row (wide)
      props: {
        src: exampleImage1,
        alt: 'Hero image',
        title: 'wide'
      }
    },
    {
      id: '2',
      component: TextCard,
      size: '1-1', // Takes 1 column, 1 row (square)
      props: {
        title: 'Welcome',
        content: 'This is a demo of our grid layout system!',
        bgColor: '#e3f2fd'
      }
    },
    {
      id: '3',
      component: ImageCard,
      size: '2-1', // Takes 1 column, 2 rows (tall)
      props: {
        src: exampleImage2,
        alt: 'Gallery photo 1'
      }
    },
    {
      id: '4',
      component: TextCard,
      size: '2-2',
      props: {
        title: 'Card 2',
        content: 'Another text card',
        bgColor: '#f3e5f5'
      }
    },
    {
      id: '5',
      component: ImageCard,
      size: '2-2', // Takes 2 columns, 2 rows (large square)
      props: {
        src: exampleImage1,
        alt: 'Large featured image',
        title: 'Big Feature'
      }
    },{
      id: '1',
      component: ImageCard,
      size: '2-2', // Takes 2 columns, 1 row (wide)
      props: {
        src: exampleImage1,
        alt: 'Hero image',
        title: 'wide'
      }
    },
    {
      id: '2',
      component: TextCard,
      size: '1-1', // Takes 1 column, 1 row (square)
      props: {
        title: 'Welcome',
        content: 'This is a demo of our grid layout system!',
        bgColor: '#e3f2fd'
      }
    },
    {
      id: '3',
      component: ImageCard,
      size: '1-1', // Takes 1 column, 2 rows (tall)
      props: {
        src: exampleImage2,
        alt: 'Gallery photo 1'
      }
    },
    {
      id: '4',
      component: TextCard,
      size: '2-2',
      props: {
        title: 'Card 2',
        content: 'Another text card',
        bgColor: '#f3e5f5'
      }
    },
    {
      id: '5',
      component: ImageCard,
      size: '2-2', // Takes 2 columns, 2 rows (large square)
      props: {
        src: exampleImage1,
        alt: 'Large featured image',
        title: 'Big Feature'
      }
    },{
      id: '1',
      component: ImageCard,
      size: '2-2', // Takes 2 columns, 1 row (wide)
      props: {
        src: exampleImage1,
        alt: 'Hero image',
        title: 'wide'
      }
    },
    {
      id: '2',
      component: TextCard,
      size: '1-1', // Takes 1 column, 1 row (square)
      props: {
        title: 'Welcome',
        content: 'This is a demo of our grid layout system!',
        bgColor: '#e3f2fd'
      }
    },
    {
      id: '3',
      component: ImageCard,
      size: '1-1', // Takes 1 column, 2 rows (tall)
      props: {
        src: exampleImage2,
        alt: 'Gallery photo 1'
      }
    },
    {
      id: '4',
      component: TextCard,
      size: '2-2',
      props: {
        title: 'Card 2',
        content: 'Another text card',
        bgColor: '#f3e5f5'
      }
    },
    {
      id: '5',
      component: ImageCard,
      size: '2-2', // Takes 2 columns, 2 rows (large square)
      props: {
        src: exampleImage1,
        alt: 'Large featured image',
        title: 'Big Feature'
      }
    },
  ] as const;


</script>

<section>
    <div class="header-root">
        <div class="row-wrapper">
        <p>GRAPHICS</p>
        <p>2016-2025</p>
        </div>
        <p>An assorted collection of graphical artefacts from various projects over the years.</p>  
    </div>
    
    <GridLayout items={gridItems} columns={4}/>
</section>


<style>
h1{
    font-size: clamp(48px, 15vw, 124px);
    color: rgb(var(--color-fg-primary));
}

.header-root{
     display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 12px;
    padding-top: 64px;
    padding-bottom: 64px;
}

.row-wrapper{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 12px;
    font-weight:var(--fw-semibold);
}

p{
    color: rgb(var(--color-fg-primary));
    font-size: clamp(18px, 4vw, 24px);
}

p:nth-child(2){
    color:rgb(var(--color-fg-secondary));
}

@media (min-width: 896px){
    .row-wrapper{
    flex-direction: row;
    }
}


</style>
<script lang="ts">
  let helloWorld: string = 'Hello world';
  console.log(helloWorld);

  // components
  import { page } from '$app/stores';
  import { MultiPathAnimatedText } from '$lib/components/graphics';

  // Vibrant color pairs for MultiPathAnimatedText
  const colorPairs = [
    { background: '#0066FF', foreground: '#FFFF00' }, // Electric Blue & Bright Yellow
    { background: '#FF1493', foreground: '#32FF32' }, // Hot Pink & Lime Green
    { background: '#FF4500', foreground: '#9932CC' }, // Orange & Purple
    { background: '#00FFFF', foreground: '#FF00FF' }, // Cyan & Magenta
    { background: '#50C878', foreground: '#FFD700' }, // Emerald & Gold
  ];

  // Configure multiple paths for the component
  const pathConfigs = [
    {
      texts: [
        'HALLO •',
        ' HEJ •',
        'HOLA •',
        'HELLO •',
        'WELCOME •',
        'こんにちは •',
      ],
      speed: 70,
      pathWildness: 0.9,
      showPath: true,
      pathStyle: {
        strokeWidth: 80,
        opacity: 1,
      },
      textStyle: {
        font: 'bold 28px sans-serif',
        size: 24,
      }
    },
    {
      texts: [
        'LETS COOK –',
        ' WHY NOT TRY?',
        'LETS CREATE //',
        'LETS MAKE //',
        'LETS EXPLORE //',
      ],
      speed: 100,
      pathWildness: 0.9,
      showPath: true,
      pathStyle: {
        strokeWidth: 80,
        opacity: 1,
      },
      textStyle: {
        font: 'bold 28px sans-serif',
        size: 24,
      }
    }
  ];
</script>

<svelte:head>
  <title>Peter Abbott - Interactive Designer & Developer</title>
  <meta
    name="description"
    content="Interactive designer and frontend developer based in Madrid. Available for UI/UX design, development, and consulting projects in Q3 2025."
  />
</svelte:head>

<MultiPathAnimatedText 
  paths={pathConfigs}
  {colorPairs}
  verticalStacking="random"
/>

<style>
</style>

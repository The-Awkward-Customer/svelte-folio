<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';

  let cloudContainer: HTMLDivElement;
  let lightning: HTMLDivElement;
  let raindrops: HTMLDivElement[] = [];
  
  onMount(() => {
    // Cloud floating animation
    gsap.to(".cloud", {
      x: "random(-5, 5)",
      y: "random(-3, 3)",
      rotation: "random(-2, 2)",
      duration: "random(3, 5)",
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.2
    });

    // Cloud pulsing for storm effect
    gsap.to(".cloud", {
      scale: "random(0.95, 1.05)",
      duration: "random(2, 4)",
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.1
    });

    // Lightning flash effect
    const lightningTl = gsap.timeline({ repeat: -1, repeatDelay: gsap.utils.random(2, 6) });
    lightningTl
      .to(lightning, { opacity: 1, duration: 0.1 })
      .to(lightning, { opacity: 0, duration: 0.1 })
      .to(lightning, { opacity: 1, duration: 0.05 })
      .to(lightning, { opacity: 0, duration: 0.2 });

    // Rain animation
    raindrops.forEach((drop, i) => {
      gsap.set(drop, {
        x: gsap.utils.random(-20, 20),
        y: -10,
        opacity: 0.6
      });
      
      gsap.to(drop, {
        y: 60,
        opacity: 0,
        duration: gsap.utils.random(0.8, 1.5),
        ease: "power1.in",
        repeat: -1,
        delay: i * 0.1
      });
    });

    // Storm intensity pulse
    gsap.to(".storm-container", {
      filter: `brightness(${gsap.utils.random(0.8, 1.2)}) contrast(${gsap.utils.random(1, 1.3)})`,
      duration: gsap.utils.random(1, 3),
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true
    });
  });
</script>

<div class="storm-container" bind:this={cloudContainer}>
  <!-- Main storm cloud layers -->
  <div class="cloud cloud-back"></div>
  <div class="cloud cloud-main"></div>
  <div class="cloud cloud-front"></div>
  
  <!-- Lightning bolt -->
  <div class="lightning" bind:this={lightning}>
    <svg width="24" height="32" viewBox="0 0 24 32">
      <path d="M8 2L16 14H12L14 30L6 18H10L8 2Z" fill="#FFE135" stroke="#FFA500" stroke-width="0.5"/>
    </svg>
  </div>
  
  <!-- Rain drops -->
  {#each Array(8) as _, i}
    <div class="raindrop" bind:this={raindrops[i]}></div>
  {/each}
</div>

<style>
  .storm-container {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cloud {
    position: absolute;
    border-radius: 50px;
    background: linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%);
    box-shadow: 
      inset -5px -5px 10px rgba(0, 0, 0, 0.3),
      inset 5px 5px 10px rgba(255, 255, 255, 0.1),
      0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .cloud-back {
    width: 45px;
    height: 25px;
    top: 20px;
    left: 5px;
    opacity: 0.6;
    background: linear-gradient(135deg, #b4bccb 0%, #1a202c 100%);
  }

  .cloud-main {
    width: 55px;
    height: 35px;
    top: 15px;
    left: 12px;
    z-index: 2;
  }

  .cloud-front {
    width: 35px;
    height: 20px;
    top: 25px;
    right: 8px;
    opacity: 0.8;
    background: linear-gradient(135deg, #949cab 0%, #2d3748 70%);
  }

  .cloud::before {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: inherit;
  }

  .cloud-back::before {
    width: 25px;
    height: 25px;
    top: -8px;
    left: 8px;
  }

  .cloud-main::before {
    width: 30px;
    height: 30px;
    top: -12px;
    left: 12px;
  }

  .cloud-front::before {
    width: 20px;
    height: 20px;
    top: -6px;
    left: 6px;
  }

  .lightning {
    position: absolute;
    top: 35px;
    left: 28px;
    z-index: 3;
    opacity: 0;
    filter: drop-shadow(0 0 4px #FFE135);
  }

  .raindrop {
    position: absolute;
    width: 2px;
    height: 8px;
    background: linear-gradient(to bottom, rgba(173, 216, 230, 0.8), rgba(135, 206, 235, 0.6));
    border-radius: 0 0 50% 50%;
    top: 45px;
    opacity: 0.6;
  }

  .raindrop:nth-child(odd) {
    background: linear-gradient(to bottom, rgba(173, 216, 230, 0.6), rgba(135, 206, 235, 0.4));
  }

  /* Hover effect for interactivity */
  .storm-container:hover .cloud {
    filter: brightness(1.1) contrast(1.1);
    transition: filter 0.3s ease;
  }

  .storm-container:hover .lightning {
    animation: quickFlash 0.5s ease-in-out;
  }

  @keyframes quickFlash {
    0%, 100% { opacity: 0; }
    20%, 60% { opacity: 1; }
    40% { opacity: 0.3; }
  }
</style>

<script lang="ts">
  import Tag from '../primitives/Tag.svelte';
  import { onMount } from 'svelte';

  //Interface
  interface Props {
    src?: string;
    bgColor?: string;
    tag?: string;
  }

  //Props
  let { src, bgColor = 'none', tag = 'example' }: Props = $props();

  let videoElement: HTMLVideoElement;
  let cardElement: HTMLButtonElement;
  let isPlaying = $state(false); // intial state to be updated by observer
  let observer: IntersectionObserver; // stores for Intersection observer

  onMount(() => {
    // Create a new intersection observer for each card element
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo();
          } else {
            pauseVideo();
          }
        });
      },
      { threshold: 0.5 } // 50% visability
    );

    if (cardElement) {
      observer.observe(cardElement);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  });

  function playVideo() {
    if (videoElement && !isPlaying) {
      videoElement.play();
      isPlaying = true;
    }
  }

  function pauseVideo() {
    if (videoElement && isPlaying) {
      videoElement.pause();
      isPlaying = false;
    }
  }

  function togglePlayPause() {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }
</script>

<button class="video-card" bind:this={cardElement} onclick={togglePlayPause}>
  <video
    class="cover-video"
    bind:this={videoElement}
    {src}
    muted
    loop
    playsinline
    preload="metadata"
    controls={false}
    style="background-color: {bgColor};"
  >
    <track kind="captions" />
  </video>

  {#if tag}
    <div class="tag-container">
      <Tag label={tag} variant="inverse" />
    </div>
  {/if}

  <div class="play-indicator" class:visible={!isPlaying}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  </div>
</button>

<style>
  .video-card {
    display: flex;
    position: relative;
    padding-top: var(--spc-200);
    padding-left: var(--spc-300);
    padding-right: var(--spc-300);
    padding-bottom: var(--spc-300);
    width: 100%;
    height: 100%;
    flex-direction: column-reverse;
    justify-content: flex-end;
    align-items: flex-end;
    overflow: hidden;
    border: none;
    cursor: pointer;
  }

  .tag-container {
    position: relative;
    align-self: flex-start;
    z-index: 1;
  }

  .cover-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    -webkit-appearance: none;
    appearance: none;
    -webkit-media-controls: none;
    -webkit-media-controls-panel: none;
    -webkit-media-controls-play-button: none;
    -webkit-media-controls-start-playback-button: none;
  }

  .cover-video::-webkit-media-controls {
    display: none !important;
  }

  .cover-video::-webkit-media-controls-panel {
    display: none !important;
  }

  .play-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
  }

  .play-indicator.visible {
    opacity: 1;
  }
</style>

<script lang="ts">
  interface VideoTileProps {
    videoId: string;
    subject?: string;
    duration?: string;
    title?: string;
    thumbnailUrl?: string;
  }

  // Props with interface
  export let videoId: VideoTileProps['videoId'];
  export let subject: VideoTileProps['subject'] = '';
  export let duration: VideoTileProps['duration'] = '';
  export let title: VideoTileProps['title'] = '';
  export let thumbnailUrl: VideoTileProps['thumbnailUrl'] = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  // State
  let isPlaying = false;

  // Functions
  function playVideo() {
    isPlaying = true;
  }
</script>

<div class="video-tile-root">
  <div class="tile-header">
    <div class="subject-tag">
      <div class="circle-indicator"></div>
      <span class="subject-text">{subject}</span>
    </div>
    <div class="duration-info">
      <span class="duration-text">{duration}</span>
    </div>
  </div>

  <div class="video-container">
    {#if isPlaying}
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        {title}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    {:else}
      <div
        class="video-thumbnail"
        role="button"
        on:click={playVideo}
        on:keydown={(e) => e.key === 'Enter' && playVideo()}
        tabindex="0"
      >
        <img src={thumbnailUrl} alt={`Thumbnail for ${title}`} />
        <div class="play-button">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="24" fill="white" fill-opacity="0.8" />
            <path d="M32 24L20 31.464V16.536L32 24Z" fill="#26272D" />
          </svg>
        </div>
      </div>
    {/if}
  </div>

  <div class="tile-footer">
    <h3 class="video-title">{title}</h3>
  </div>
</div>

<style>
  .video-tile-root {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    background: #f6f6f7;
    padding: 0px 16px;
    box-sizing: border-box;
  }

  .tile-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    height: 44px;
    padding: 16px 0px;
    box-sizing: border-box;
  }

  .subject-tag {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    height: 12px;
  }

  .circle-indicator {
    width: 12px;
    height: 12px;
    border: 1px solid #989cb8;
    border-radius: 999px;
  }

  .subject-text {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 400;
    color: #989cb8;
  }

  .duration-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 12px;
  }

  .duration-text {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 400;
    color: #989cb8;
  }

  .video-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; /* 16:9 aspect ratio */
    position: relative;
    background: #ffffff;
    overflow: hidden;
  }

  .video-container iframe,
  .video-thumbnail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .video-thumbnail {
    cursor: pointer;
  }

  .video-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: transform 0.2s ease;
  }

  .video-thumbnail:hover .play-button {
    transform: translate(-50%, -50%) scale(1.1);
  }

  .tile-footer {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 49px;
    padding: 16px 0px;
    box-sizing: border-box;
  }

  .video-title {
    font-family: 'Geist', sans-serif;
    font-size: 14px;
    font-weight: 500;
    line-height: 120%;
    color: #26272d;
    margin: 0;
  }

  /* Desktop styles */
  @media (min-width: 898px) {
    .video-tile-root {
      width: 767px;
      max-width: 568px;
      height: 506.44px;
    }

    .video-container {
      height: 413.44px;
      padding-bottom: 0;
    }

    .video-container iframe,
    .video-thumbnail {
      position: relative;
    }
  }
</style>

<script lang="ts">
	import FacelessPic from '$lib/assets/FacelessPic.png';
	import { waveText } from '$lib/animations/gsap/textAnimations.js';

	interface ChatTriggerProps {
		handleClick?: () => void;
		onMouseEnter?: () => void;
	}

	let { handleClick = consoleLogClick, onMouseEnter = handleMouseEnter }: ChatTriggerProps =
		$props();

	let speechBubbleElement: HTMLElement | undefined;

	function consoleLogClick() {
		console.log('Chat trigger clicked');
	}

	function handleMouseEnter() {
		console.log('Mouse entered chat trigger');
		if (speechBubbleElement) {
			const text = speechBubbleElement.textContent || '';
			waveText(speechBubbleElement, text, {
				duration: 0.3,
				stagger: 0.05,
				amplitude: 3,
				direction: 'up'
			});
		}
	}
</script>

<button
	class="chat-trigger"
	onclick={handleClick}
	aria-label="Chat with Peter Abbott"
	onmouseenter={onMouseEnter}
>
	<span class="speech-bubble" bind:this={speechBubbleElement}> About me… </span>
	<span class="profile-image" style="background-image: url({FacelessPic})"></span>
</button>

<style>
	.chat-trigger {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: clamp(60px, 20vw, 180px);
		aspect-ratio: 4 / 5;
		background-color: rgba(var(--bg-page) / 0);
		border: none;
		border-radius: var(--bdr-radius-small);
		cursor: pointer;
		padding: 4px;
		box-shadow: inset 0 0 0 1px rgba(var(--fg-text-primary) / 1);
		container-type: inline-size;
	}

	.profile-image {
		display: flex;
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: top;
		background-repeat: no-repeat;
		border-radius: var(--bdr-radius-tiny);
		transition: all 0.15s ease-in-out;
	}

	.chat-trigger:hover .profile-image {
		transform: scale(0.98);
	}

	.speech-bubble {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--fs-250);
		font-weight: var(--fw-semibold);
		color: rgb(var(--fg-text-inverse));
		background-color: rgb(var(--bg-primary));
		border-radius: var(--bdr-radius-pill) var(--bdr-radius-pill) 0 var(--bdr-radius-pill);
		padding: 4px 8px;
		top: 42%;
		left: 20%;
		visibility: hidden;
		z-index: 100;
		transition: all 0.3s ease-in-out;
		scale: 0;
	}

	.chat-trigger:hover .speech-bubble {
		top: 28%;
		left: -36%;
		scale: 1.05;
	}

	@media (min-width: 552px) {
		.speech-bubble {
			visibility: visible;
		}
	}
</style>

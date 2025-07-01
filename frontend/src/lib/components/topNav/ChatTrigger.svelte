<script lang="ts">
	import FacelessPic from '$lib/assets/FacelessPic.png';

	interface ChatTriggerProps {
		onclick?: () => void;
	}

	let { onclick }: ChatTriggerProps = $props();
	let chatTriggerElement: HTMLButtonElement | undefined;
	let speechBubbleScale = $state(1);

	function handleClick() {
		if (onclick) {
			onclick();
		}
	}
</script>

<button
	bind:this={chatTriggerElement}
	class="chat-trigger"
	onclick={handleClick}
	aria-label="Chat with Peter Abbott"
>
	<span class="speech-bubble" style="scale: {speechBubbleScale}"> About me… </span>
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
		background-position: center;
		background-repeat: no-repeat;
		border-radius: var(--bdr-radius-tiny);
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
		top: 28%;
		left: -34%;
		visibility: hidden;
	}

	@media (min-width: 552px) {
		.speech-bubble {
			visibility: visible;
		}
	}
</style>

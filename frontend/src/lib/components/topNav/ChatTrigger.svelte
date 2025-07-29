<script lang="ts">
	import Anim_me from '$lib/assets/Ani_me.png';

	interface ChatTriggerProps {
		handleClick?: () => void;
		onMouseEnter?: () => void;
	}

	let { handleClick = defaultClickHandler, onMouseEnter = handleMouseEnter }: ChatTriggerProps =
		$props();

	// Default handler if none provided
	function defaultClickHandler() {
		console.log('Chat trigger clicked - no handler provided');
	}

	function handleMouseEnter() {
		console.log('Mouse entered chat trigger');
	}
</script>

<button
	class="chat-trigger"
	onclick={handleClick}
	aria-label="Chat with Peter Abbott"
	onmouseenter={onMouseEnter}
>
	<span class="profile-image" style="background-image: url({Anim_me})"></span>
</button>

<style>
	.chat-trigger {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--width-4xl);
		aspect-ratio: 4 / 5;
		background-color: var(--bg-page);
		border: none;
		border-radius: var(--bdr-radius-small);
		cursor: pointer;
		padding: 4px;
		box-shadow: inset 0 0 0 1px var(--fg-text-primary);
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
</style>

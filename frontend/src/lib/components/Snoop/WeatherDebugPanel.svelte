<script lang="ts">
	import { weatherDebugManager } from '$lib/stores/weatherDebugManager.svelte.js';
	import { LoadingState, WeatherErrorType } from '$lib/types/weatherDebug.js';
	import Button from '$lib/components/actions/Button.svelte';

	// Panel state
	let isDragging = $state(false);
	let dragOffset = $state({ x: 0, y: 0 });
	let panelPosition = $state({ x: 20, y: 20 });
	let isCollapsed = $state(false);

	// Get current debug state
	const debugState = $derived(weatherDebugManager.state);
	const isOverrideMode = $derived(weatherDebugManager.isOverrideMode);

	// Drag functionality
	function handleMouseDown(event: MouseEvent) {
		isDragging = true;
		dragOffset.x = event.clientX - panelPosition.x;
		dragOffset.y = event.clientY - panelPosition.y;

		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	}

	function handleMouseMove(event: MouseEvent) {
		if (!isDragging) return;

		panelPosition.x = event.clientX - dragOffset.x;
		panelPosition.y = event.clientY - dragOffset.y;

		// Keep panel within viewport
		panelPosition.x = Math.max(0, Math.min(panelPosition.x, window.innerWidth - 320));
		panelPosition.y = Math.max(0, Math.min(panelPosition.y, window.innerHeight - 400));
	}

	function handleMouseUp() {
		isDragging = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	}

	// Control functions
	function setLoadingState(state: string) {
		weatherDebugManager.setLoadingState(state as any);
	}

	function setErrorState(error: string) {
		weatherDebugManager.setErrorState(error as any);
	}

	function injectWeatherScenario(scenarioId: string) {
		const scenario = weatherDebugManager.MOCK_WEATHER_SCENARIOS.find((s) => s.id === scenarioId);
		if (scenario) {
			weatherDebugManager.injectMockWeatherData(scenario);
		}
	}

	function injectLocationScenario(scenarioId: string) {
		const scenario = weatherDebugManager.MOCK_LOCATION_SCENARIOS.find((s) => s.id === scenarioId);
		if (scenario) {
			weatherDebugManager.injectMockLocationData(scenario);
		}
	}

	function resetAll() {
		weatherDebugManager.resetComponentState();
	}

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}
</script>

{#if weatherDebugManager.isPanelVisible}
	<div
		class="debug-panel"
		style="left: {panelPosition.x}px; top: {panelPosition.y}px;"
		class:dragging={isDragging}
		class:collapsed={isCollapsed}
	>
		<!-- Panel Header -->
		<div class="debug-header" onmousedown={handleMouseDown} role="button" tabindex="0">
			<h3>🐛 Weather Debug</h3>
			<div class="header-controls">
				<button
					class="collapse-btn"
					onclick={toggleCollapse}
					aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
				>
					{isCollapsed ? '▼' : '▲'}
				</button>
				<button
					class="close-btn"
					onclick={() => weatherDebugManager.hidePanel()}
					aria-label="Close debug panel"
				>
					✕
				</button>
			</div>
		</div>

		{#if !isCollapsed}
			<div class="debug-content">
				<!-- Current State Display -->
				<div class="state-display">
					<h4>Current State</h4>
					<div class="state-info">
						<div class="state-item">
							<span class="label">Override Mode:</span>
							<span class="value" class:active={isOverrideMode}>
								{isOverrideMode ? 'ON' : 'OFF'}
							</span>
						</div>
						{#if debugState.forcedLoadingState}
							<div class="state-item">
								<span class="label">Loading:</span>
								<span class="value loading">{debugState.forcedLoadingState}</span>
							</div>
						{/if}
						{#if debugState.forcedErrorState}
							<div class="state-item">
								<span class="label">Error:</span>
								<span class="value error">{debugState.forcedErrorState}</span>
							</div>
						{/if}
						{#if debugState.mockWeatherData}
							<div class="state-item">
								<span class="label">Mock Weather:</span>
								<span class="value success">{debugState.mockWeatherData.name}</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Loading State Controls -->
				<div class="control-section">
					<h4>Loading States</h4>
					<div class="button-grid">
						<Button
							as="button"
							label="Idle"
							handleClick={() => setLoadingState(LoadingState.IDLE)}
						/>
						<Button
							as="button"
							label="Getting Location"
							handleClick={() => setLoadingState(LoadingState.GETTING_LOCATION)}
						/>
						<Button
							as="button"
							label="Fetching Weather"
							handleClick={() => setLoadingState(LoadingState.FETCHING_WEATHER)}
						/>
					</div>
				</div>

				<!-- Error State Controls -->
				<div class="control-section">
					<h4>Error States</h4>
					<div class="button-grid">
						<Button
							as="button"
							label="Location Denied"
							handleClick={() => setErrorState(WeatherErrorType.LOCATION_DENIED)}
						/>
						<Button
							as="button"
							label="API Error"
							handleClick={() => setErrorState(WeatherErrorType.API_ERROR)}
						/>
						<Button
							as="button"
							label="Network Error"
							handleClick={() => setErrorState(WeatherErrorType.NETWORK_ERROR)}
						/>
						<Button
							as="button"
							label="No Location"
							handleClick={() => setErrorState(WeatherErrorType.NO_LOCATION)}
						/>
					</div>
				</div>

				<!-- Mock Weather Data -->
				<div class="control-section">
					<h4>Mock Weather Data</h4>
					<div class="scenario-grid">
						{#each weatherDebugManager.MOCK_WEATHER_SCENARIOS as scenario}
							<button class="scenario-btn" onclick={() => injectWeatherScenario(scenario.id)}>
								{scenario.name}
							</button>
						{/each}
					</div>
				</div>

				<!-- Mock Location Data -->
				<div class="control-section">
					<h4>Mock Location Data</h4>
					<div class="scenario-grid">
						{#each weatherDebugManager.MOCK_LOCATION_SCENARIOS as scenario}
							<button class="scenario-btn" onclick={() => injectLocationScenario(scenario.id)}>
								{scenario.name}
							</button>
						{/each}
					</div>
				</div>

				<!-- Reset Controls -->
				<div class="control-section">
					<h4>Reset</h4>
					<Button as="button" label="Reset All States" handleClick={resetAll} />
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.debug-panel {
		position: fixed;
		z-index: 9999;
		width: 320px;
		max-height: 80vh;
		background: rgba(0, 0, 0, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 8px;
		font-family: var(--font-family-alt, monospace);
		font-size: 12px;
		color: white;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(10px);
		overflow: hidden;
		user-select: none;
	}

	.debug-panel.dragging {
		cursor: grabbing;
	}

	.debug-panel.collapsed {
		height: auto;
	}

	.debug-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 12px;
		background: rgba(255, 255, 255, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		cursor: grab;
	}

	.debug-header:active {
		cursor: grabbing;
	}

	.debug-header h3 {
		margin: 0;
		font-size: 14px;
		font-weight: 600;
	}

	.header-controls {
		display: flex;
		gap: 8px;
	}

	.collapse-btn,
	.close-btn {
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		font-size: 12px;
		line-height: 1;
	}

	.collapse-btn:hover,
	.close-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.debug-content {
		padding: 12px;
		max-height: calc(80vh - 50px);
		overflow-y: auto;
	}

	.state-display {
		margin-bottom: 16px;
		padding: 8px;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 4px;
	}

	.state-display h4 {
		margin: 0 0 8px 0;
		font-size: 12px;
		color: #ccc;
	}

	.state-info {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.state-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.label {
		color: #aaa;
		font-size: 11px;
	}

	.value {
		font-weight: 600;
		font-size: 11px;
	}

	.value.active {
		color: #4ade80;
	}

	.value.loading {
		color: #3b82f6;
	}

	.value.error {
		color: #ef4444;
	}

	.value.success {
		color: #10b981;
	}

	.control-section {
		margin-bottom: 16px;
	}

	.control-section h4 {
		margin: 0 0 8px 0;
		font-size: 12px;
		color: #ccc;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		padding-bottom: 4px;
	}

	.button-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 6px;
	}

	.scenario-grid {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.scenario-btn {
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		padding: 6px 8px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 11px;
		text-align: left;
		transition: background-color 0.2s;
	}

	.scenario-btn:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.scenario-btn:active {
		background: rgba(255, 255, 255, 0.3);
	}

	/* Scrollbar styling */
	.debug-content::-webkit-scrollbar {
		width: 6px;
	}

	.debug-content::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.1);
	}

	.debug-content::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.3);
		border-radius: 3px;
	}

	.debug-content::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.5);
	}
</style>

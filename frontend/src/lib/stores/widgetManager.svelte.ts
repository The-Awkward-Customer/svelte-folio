interface WidgetPosition {
	id: string;
	x: number;
	y: number;
	scale: number;
	gridX: number;
	gridY: number;
}

interface SafeAreas {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

interface ViewportInfo {
	width: number;
	height: number;
	breakpoint: 'mobile' | 'tablet' | 'desktop';
}

const WIDGET_BASE_SIZE = 512;
const MIN_SCALE = 0.25;
const MAX_SCALE = 0.5;
const SESSION_STORAGE_KEY = 'widget-positions';

function createWidgetManager() {
	let positions = $state<Map<string, WidgetPosition>>(new Map());
	let gridSize = $state(16);
	let minSpacing = $state(4);
	let viewport = $state<ViewportInfo>({
		width: 1200,
		height: 800,
		breakpoint: 'desktop'
	});

	function getViewportInfo(): ViewportInfo {
		const width = window.innerWidth;
		const height = window.innerHeight;
		
		let breakpoint: 'mobile' | 'tablet' | 'desktop';
		if (width < 767) {
			breakpoint = 'mobile';
		} else if (width < 1199) {
			breakpoint = 'tablet';
		} else {
			breakpoint = 'desktop';
		}

		return { width, height, breakpoint };
	}

	function updateViewport() {
		viewport = getViewportInfo();
	}

	function getSafeAreas(): SafeAreas {
		const baseMargin = 24;
		const viewportScale = Math.min(viewport.width, viewport.height) / 1000 * 0.05;
		const margin = baseMargin + (viewport.width * viewportScale);

		return {
			top: 120, // Navigation clearance
			right: margin,
			bottom: margin,
			left: margin
		};
	}

	function getWidgetScale(): number {
		const baseScale = viewport.breakpoint === 'mobile' ? MIN_SCALE : 
						  viewport.breakpoint === 'tablet' ? (MIN_SCALE + MAX_SCALE) / 2 : 
						  MAX_SCALE;
		return Math.max(MIN_SCALE, Math.min(MAX_SCALE, baseScale));
	}

	function snapToGrid(value: number): number {
		return Math.round(value / gridSize) * gridSize;
	}

	function checkCollision(newPos: WidgetPosition, existingPositions: WidgetPosition[]): boolean {
		const scale = getWidgetScale();
		const widgetSize = WIDGET_BASE_SIZE * scale;
		const totalSpacing = minSpacing + widgetSize;

		for (const existing of existingPositions) {
			const dx = Math.abs(newPos.x - existing.x);
			const dy = Math.abs(newPos.y - existing.y);
			
			if (dx < totalSpacing && dy < totalSpacing) {
				return true;
			}
		}
		return false;
	}

	function generatePosition(existingPositions: WidgetPosition[], attemptId: string): WidgetPosition | null {
		const safeAreas = getSafeAreas();
		const scale = getWidgetScale();
		const widgetSize = WIDGET_BASE_SIZE * scale;
		
		const availableWidth = viewport.width - safeAreas.left - safeAreas.right - widgetSize;
		const availableHeight = viewport.height - safeAreas.top - safeAreas.bottom - widgetSize;

		if (availableWidth <= 0 || availableHeight <= 0) {
			return null;
		}

		let attempts = 0;
		const maxAttempts = 50;

		while (attempts < maxAttempts) {
			const rawX = safeAreas.left + Math.random() * availableWidth;
			const rawY = safeAreas.top + Math.random() * availableHeight;
			
			const x = snapToGrid(rawX);
			const y = snapToGrid(rawY);
			const gridX = x / gridSize;
			const gridY = y / gridSize;

			const newPosition: WidgetPosition = {
				id: attemptId,
				x,
				y,
				scale,
				gridX,
				gridY
			};

			if (!checkCollision(newPosition, existingPositions)) {
				return newPosition;
			}

			attempts++;
		}

		return null;
	}

	function generatePositions(count: number): Map<string, WidgetPosition> {
		const newPositions = new Map<string, WidgetPosition>();
		const positionsArray: WidgetPosition[] = [];

		for (let i = 0; i < count; i++) {
			const id = `widget-${i}`;
			const position = generatePosition(positionsArray, id);
			
			if (position) {
				newPositions.set(id, position);
				positionsArray.push(position);
			}
		}

		return newPositions;
	}

	function loadFromSessionStorage(): boolean {
		if (typeof window === 'undefined') return false;
		
		try {
			const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
			if (stored) {
				const positionsArray = JSON.parse(stored);
				const newPositions = new Map<string, WidgetPosition>();
				
				for (const [key, value] of positionsArray) {
					newPositions.set(key, value as WidgetPosition);
				}
				
				positions = newPositions;
				return true;
			}
		} catch (error) {
			console.warn('Failed to load widget positions from sessionStorage:', error);
		}
		
		return false;
	}

	function saveToSessionStorage() {
		if (typeof window === 'undefined') return;
		
		try {
			const positionsArray = Array.from(positions.entries());
			sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(positionsArray));
		} catch (error) {
			console.warn('Failed to save widget positions to sessionStorage:', error);
		}
	}

	function initialize(widgetCount: number = 5) {
		if (typeof window !== 'undefined') {
			updateViewport();
			
			if (!loadFromSessionStorage() || positions.size === 0) {
				positions = generatePositions(widgetCount);
				saveToSessionStorage();
			}
		}
	}

	function shuffle(widgetCount: number = 5) {
		positions = generatePositions(widgetCount);
		saveToSessionStorage();
	}

	function handleResize() {
		const oldViewport = { ...viewport };
		updateViewport();
		
		// Regenerate positions if breakpoint changes
		if (oldViewport.breakpoint !== viewport.breakpoint) {
			const currentCount = positions.size;
			if (currentCount > 0) {
				shuffle(currentCount);
			}
		}
	}

	function setupEffects() {
		// Session storage sync effect
		$effect(() => {
			if (positions.size > 0) {
				saveToSessionStorage();
			}
		});

		// Window resize listener
		$effect(() => {
			if (typeof window !== 'undefined') {
				window.addEventListener('resize', handleResize);
				return () => window.removeEventListener('resize', handleResize);
			}
		});
	}

	return {
		get positions() { return positions; },
		get viewport() { return viewport; },
		get gridSize() { return gridSize; },
		get minSpacing() { return minSpacing; },
		initialize,
		shuffle,
		updateViewport,
		getWidgetScale,
		getSafeAreas,
		setupEffects
	};
}

export const widgetManager = createWidgetManager();
export type { WidgetPosition, SafeAreas, ViewportInfo };
interface WidgetPosition {
	id: string;
	x: number;
	y: number;
	scale: number;
	gridX: number;
	gridY: number;
	// Store relative positions (0-1) for viewport scaling
	relativeX: number;
	relativeY: number;
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

function createWidgetManager() {
	let positions = $state<Map<string, WidgetPosition>>(new Map());
	let gridSize = $state(1);
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
		// Continuous scaling based on viewport width instead of discrete breakpoints
		const minWidth = 320; // Minimum mobile width
		const maxWidth = 1200; // Desktop width where max scale is reached
		
		const widthRatio = Math.max(0, Math.min(1, (viewport.width - minWidth) / (maxWidth - minWidth)));
		const scale = MIN_SCALE + (MAX_SCALE - MIN_SCALE) * widthRatio;
		
		return Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale));
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

			const safeWidth = viewport.width - safeAreas.left - safeAreas.right;
			const safeHeight = viewport.height - safeAreas.top - safeAreas.bottom;
			
			const newPosition: WidgetPosition = {
				id: attemptId,
				x,
				y,
				scale,
				gridX,
				gridY,
				relativeX: (x - safeAreas.left) / safeWidth,
				relativeY: (y - safeAreas.top) / safeHeight
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

	// Remove session storage loading - widgets will get fresh positions on each page load

	// Remove session storage saving - widgets will get fresh positions on each page load

	function initialize(widgetCount: number = 5) {
		if (typeof window !== 'undefined') {
			updateViewport();
			
			// Always generate fresh positions on page load
			positions = generatePositions(widgetCount);
		}
	}

	function shuffle(widgetCount: number = 5) {
		positions = generatePositions(widgetCount);
	}

	function scalePositionsToViewport() {
		const safeAreas = getSafeAreas();
		const currentScale = getWidgetScale();
		const safeWidth = viewport.width - safeAreas.left - safeAreas.right;
		const safeHeight = viewport.height - safeAreas.top - safeAreas.bottom;

		const newPositions = new Map<string, WidgetPosition>();

		for (const [id, position] of positions.entries()) {
			// Calculate new absolute position from relative position
			const newX = snapToGrid(safeAreas.left + (position.relativeX * safeWidth));
			const newY = snapToGrid(safeAreas.top + (position.relativeY * safeHeight));
			
			// Ensure widgets stay within bounds
			const maxX = viewport.width - safeAreas.right - (WIDGET_BASE_SIZE * currentScale);
			const maxY = viewport.height - safeAreas.bottom - (WIDGET_BASE_SIZE * currentScale);
			
			const boundedX = Math.max(safeAreas.left, Math.min(maxX, newX));
			const boundedY = Math.max(safeAreas.top, Math.min(maxY, newY));

			const scaledPosition: WidgetPosition = {
				...position,
				x: boundedX,
				y: boundedY,
				scale: currentScale,
				gridX: boundedX / gridSize,
				gridY: boundedY / gridSize,
				// Keep the same relative positions for future scaling
				relativeX: position.relativeX,
				relativeY: position.relativeY
			};

			newPositions.set(id, scaledPosition);
		}

		positions = newPositions;
	}

	function handleResize() {
		updateViewport();
		
		// Scale existing positions instead of regenerating them
		if (positions.size > 0) {
			scalePositionsToViewport();
		}
	}

	function setupEffects() {
		// Window resize listener only - no session storage sync
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
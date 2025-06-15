/**
 * Extracts RGB values from CSS custom property
 */
function getRGBFromCSSProperty(propertyName: string): [number, number, number] {
	const value = getComputedStyle(document.documentElement)
		.getPropertyValue(propertyName)
		.trim();
	
	// Parse "255 255 255" format used in your CSS
	const rgb = value.split(' ').map(v => parseInt(v.trim(), 10));
	
	if (rgb.length === 3 && rgb.every(v => !isNaN(v))) {
		return [rgb[0], rgb[1], rgb[2]];
	}
	
	// Fallback to white if parsing fails
	console.warn(`Failed to parse CSS property ${propertyName}: "${value}"`);
	return [255, 255, 255];
}

/**
 * Generates a fractal noise pattern using HTML5 Canvas
 * Returns a base64 data URL that can be used in CSS background-image
 */
export function generateNoisePattern(
	width: number = 100, // Default width for the noise pattern
	height: number = 100, // Default height for the noise pattern
	density: number = 0.1, // Default density for the noise pattern
	color?: [number, number, number] // Optional RGB color override
): string {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	
	if (!ctx) {
		console.warn('Canvas context not available, returning empty pattern');
		return '';
	}

	canvas.width = width;
	canvas.height = height;

	const imageData = ctx.createImageData(width, height);
	const data = imageData.data;

	// Get theme-aware color or use provided color
	const [r, g, b] = color || getRGBFromCSSProperty('--fg-text-primary');

	// Generate fractal-like noise pattern
	for (let i = 0; i < data.length; i += 4) {
		const random = Math.random();
		
		// Create sparse noise pattern similar to your Figma design
		const isNoise = random > (1 - density);
		const alpha = isNoise ? 30 : 0;
		
		data[i] = r;     // Red (theme-aware)
		data[i + 1] = g; // Green (theme-aware)
		data[i + 2] = b; // Blue (theme-aware)
		data[i + 3] = alpha; // Alpha (transparency)
	}

	ctx.putImageData(imageData, 0, 0);
	return canvas.toDataURL('image/png');
}

/**
 * Sets a CSS custom property with the generated noise pattern
 */
export function applyNoisePattern(
	element: HTMLElement,
	propertyName: string = '--generated-noise',
	width: number = 100,
	height: number = 100,
	density: number = 0.15
): void {
	const noiseDataUrl = generateNoisePattern(width, height, density);
	if (noiseDataUrl) {
		element.style.setProperty(propertyName, `url("${noiseDataUrl}")`);
	}
}

/**
 * Theme-aware noise pattern generator that integrates with your theme store
 * Use this in Svelte components with $effect to automatically update on theme changes
 */
export function createThemeAwareNoiseEffect(
	element: HTMLElement,
	propertyName: string = '--generated-noise',
	width: number = 100,
	height: number = 100,
	density: number = 0.15
): void {
	// This function should be called inside a $effect in your Svelte component
	// The effect will automatically re-run when theme.current changes
	applyNoisePattern(element, propertyName, width, height, density);
}

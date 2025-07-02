// Type definitions for enhanced AnimatedTextPathSpag component

export interface PathConfig {
	id: string;
	text: string;
	speed: number;
	pathWildness: number;
	verticalBounds: number;
	verticalOffset: number; // Y-axis shift for this path
	textStyle: {
		font: string;
		size: number;
		color: string;
	};
	pathStyle: {
		strokeColor: string;
		strokeWidth: number;
		opacity: number;
	};
}

export interface IntersectionPoint {
	x: number;
	y: number;
	pathA: string; // path ID
	pathB: string; // path ID
	pathAGoesOver: boolean; // braiding relationship
	distanceA: number; // distance along path A
	distanceB: number; // distance along path B
}

export interface PathData {
	id: string;
	points: { x: number; y: number }[];
	length: number;
	textChars: { char: string; width: number }[];
	totalTextWidth: number;
	config: PathConfig;
}

export interface TextChar {
	char: string;
	width: number;
}

export interface PathPoint {
	x: number;
	y: number;
	distance?: number; // Distance along the path from start
}

// Enhanced intersection interface for segment-based rendering
export interface PathIntersection {
	point: { x: number; y: number };
	path1Index: number;
	path2Index: number;
	path1Distance: number;
	path2Distance: number;
	depthOrder: 'path1Over' | 'path2Over';
}

// Path segment for unified rendering
export interface PathSegment {
	pathIndex: number;
	startDistance: number;
	endDistance: number;
	points: PathPoint[];
	renderOrder: number;
	intersectionStart?: PathIntersection;
	intersectionEnd?: PathIntersection;
}
<!-- Docs: ../../../../docs/components/animation/Enhanced-Glitch-Animation-Refactor-Plan.md -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import { gsap } from 'gsap';
  import type {
    PathConfig,
    PathData,
    IntersectionPoint,
    PathPoint,
    PathIntersection,
    PathSegment,
  } from '$lib/types/textPath';

  // Enhanced Props - maintaining backward compatibility
  export let texts: string[] = ['LETS COOK'];
  export let speed: number = 50; // pixels per second
  export let pathWildness: number = 0.7; // 0-1 scale
  export let verticalBounds: number = 0.1; // 0.1 = 10% margin from top/bottom
  export let showPath: boolean = true; // Whether to show the path stroke
  export let fixedCanvasWidth: number = 2560; // Fixed width for stability
  export let pathStyle = {
    strokeColor: '#cccccc',
    strokeWidth: 2,
    opacity: 0.5,
  };
  export let textStyle = {
    font: 'bold 24px sans-serif',
    size: 24,
    color: '#000000',
  };

  // New Multi-Path Props
  export let pathCount: number = 3; // Number of intertwining paths
  export let verticalVariationRange: [number, number] = [0.05, 0.8]; // Min/max vertical bounds (0-1 range)
  export let speedVariationRange: [number, number] = [30, 100]; // Speed range for randomization
  export let colorPalette: string[] = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
  ];

  // State
  let canvas: HTMLCanvasElement;
  let container: HTMLDivElement;
  let ctx: CanvasRenderingContext2D;
  let canvasWidth: number = fixedCanvasWidth;
  let canvasHeight: number = 400;
  let viewportWidth: number = 0;

  // Multi-path data
  let pathsData: PathData[] = [];
  let intersections: IntersectionPoint[] = [];
  let pathIntersections: PathIntersection[] = [];
  let pathSegments: PathSegment[] = [];
  let animationTimeline: gsap.core.Timeline;

  // Backward compatibility - single path data (used when pathCount = 1)
  let selectedText = texts[Math.floor(Math.random() * texts.length)];
  let pathPoints: { x: number; y: number }[] = [];
  let pathLength = 0;
  let textChars: { char: string; width: number }[] = [];
  let totalTextWidth = 0;
  let animationId: gsap.core.Tween; // For backward compatibility

  // Generate multiple intertwining paths
  function generateMultiplePaths(width: number, height: number) {
    pathsData = [];
    intersections = [];

    // Create path configurations
    const configs = createPathConfigs(height);

    // Generate each path
    for (const config of configs) {
      const pathData = generateSinglePath(width, height, config);
      pathsData.push(pathData);
    }

    // Calculate intersections between paths
    calculateIntersections();
  }

  // Create randomized path configurations
  function createPathConfigs(height: number): PathConfig[] {
    const configs: PathConfig[] = [];
    const usedTexts = new Set<string>();

    for (let i = 0; i < pathCount; i++) {
      // Select unique text for each path
      let selectedText: string;
      do {
        selectedText = texts[Math.floor(Math.random() * texts.length)];
      } while (usedTexts.has(selectedText) && usedTexts.size < texts.length);
      usedTexts.add(selectedText);

      // Randomize properties within ranges
      const pathSpeed =
        speedVariationRange[0] +
        Math.random() * (speedVariationRange[1] - speedVariationRange[0]);

      // Convert pixel values to percentage if needed (values > 1 are assumed to be pixels)
      let minBounds = verticalVariationRange[0];
      let maxBounds = verticalVariationRange[1];
      if (minBounds > 1) minBounds = minBounds / height;
      if (maxBounds > 1) maxBounds = maxBounds / height;

      const pathVerticalBounds =
        minBounds + Math.random() * (maxBounds - minBounds);
      const pathWildnessVariation = pathWildness + (Math.random() - 0.5) * 0.3; // ±0.15 variation
      const verticalOffset = (i - (pathCount - 1) / 2) * 30; // Fixed pixel offset between paths

      // Select random color
      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];

      // Vary text size
      const fontSize = textStyle.size + (Math.random() - 0.5) * 8; // ±4px variation

      configs.push({
        id: `path-${i}`,
        text: selectedText,
        speed: pathSpeed,
        pathWildness: Math.max(0, Math.min(1, pathWildnessVariation)),
        verticalBounds: pathVerticalBounds,
        verticalOffset,
        textStyle: {
          font: `bold ${fontSize}px sans-serif`,
          size: fontSize,
          color,
        },
        pathStyle: {
          strokeColor: color,
          strokeWidth: pathStyle.strokeWidth + (Math.random() - 0.5) * 2,
          opacity: pathStyle.opacity + (Math.random() - 0.5) * 0.3,
        },
      });
    }

    return configs;
  }

  // Generate a single path with organic curves - adapted from AnimatedTextPath.svelte
  function generateSinglePath(
    width: number,
    height: number,
    config: PathConfig
  ): PathData {
    const extendedWidth = width * 1.5; // Extend past canvas for smooth entry/exit
    const startX = -width * 0.25;

    // Generate curves with irregular spacing - pathWildness affects curve count
    const baseNumCurves = 4;
    const wildnessRange = Math.floor(config.pathWildness * 4); // 0-4 additional curves based on wildness
    const numCurves =
      baseNumCurves + Math.floor(Math.random() * (wildnessRange + 1));
    const controlPoints: PathPoint[] = [];

    // Create irregular spacing
    const spacings: number[] = [];
    let totalSpacing = 0;

    for (let i = 0; i < numCurves; i++) {
      // Random spacing between 0.5 and 1.5 of average
      const spacing = 0.5 + Math.random();
      spacings.push(spacing);
      totalSpacing += spacing;
    }

    // Normalize spacings to fit the extended width
    const normalizedSpacings = spacings.map(
      (s) => (s / totalSpacing) * extendedWidth
    );

    // Generate control points with organic variation
    let currentX = startX;
    const minY = height * config.verticalBounds + config.verticalOffset;
    const maxY = height * (1 - config.verticalBounds) + config.verticalOffset;
    const yRange = maxY - minY;

    for (let i = 0; i < numCurves; i++) {
      const x = currentX + normalizedSpacings[i] * 0.5; // Place point at middle of spacing

      // Create organic vertical positions with alternating tendency
      // pathWildness affects the variation range - increased for more dramatic curves
      let y: number;
      if (i === 0) {
        // Start somewhere in the middle range with increased variation
        const baseRange = 0.6; // Increased from 0.4
        const wildnessBonus = config.pathWildness * 0.3; // Increased from 0.2
        const totalRange = Math.min(baseRange + wildnessBonus, 0.9); // Increased max from 0.8
        const startOffset = (1 - totalRange) / 2;
        y = minY + yRange * (startOffset + Math.random() * totalRange);
      } else {
        // Alternate between high and low with organic variation - increased range
        const previousY = controlPoints[i - 1].y;
        const isHigh = previousY > (minY + maxY) / 2;

        // pathWildness affects how extreme the variations can be - increased for more drama
        const baseVariation = 0.5; // Increased from 0.35
        const wildnessVariation = config.pathWildness * 0.4; // Keep same multiplier
        const maxVariation = Math.min(baseVariation + wildnessVariation, 0.9); // Increased max from 0.8

        if (isHigh) {
          // Go low, but with variation affected by wildness
          y = minY + yRange * (Math.random() * maxVariation);
        } else {
          // Go high, but with variation affected by wildness
          y = minY + yRange * (1 - maxVariation + Math.random() * maxVariation);
        }
      }

      controlPoints.push({ x, y });
      currentX += normalizedSpacings[i];
    }

    // Add extra point at the end for smooth continuation
    controlPoints.push({
      x: currentX + width * 0.25,
      y: controlPoints[0].y + (Math.random() - 0.5) * yRange * 0.3,
    });

    // Convert control points to very smooth bezier path using Catmull-Rom splines
    const pathPoints: PathPoint[] = [];
    const resolution = 5; // Higher resolution for smoother curves

    // Use Catmull-Rom spline for smoother, more organic curves
    for (let i = 0; i < controlPoints.length - 1; i++) {
      const p0 = controlPoints[Math.max(0, i - 1)];
      const p1 = controlPoints[i];
      const p2 = controlPoints[i + 1];
      const p3 = controlPoints[Math.min(controlPoints.length - 1, i + 2)];

      const steps = Math.ceil(Math.abs(p2.x - p1.x) / resolution);

      for (let t = 0; t < steps; t++) {
        const ratio = t / steps;

        // Catmull-Rom spline interpolation for smoother curves
        const x = catmullRom(p0.x, p1.x, p2.x, p3.x, ratio);
        const y = catmullRom(p0.y, p1.y, p2.y, p3.y, ratio);

        pathPoints.push({ x, y });
      }
    }

    // Apply smoothing pass to reduce sharp angle changes
    const smoothedPoints = smoothPathPoints(pathPoints);
    const pathLength = calculatePathLengthForPoints(smoothedPoints);

    return {
      id: config.id,
      points: smoothedPoints,
      length: pathLength,
      textChars: [],
      totalTextWidth: 0,
      config,
    };
  }

  // Light smoothing that preserves crossing patterns
  function lightSmoothPath(points: PathPoint[]): PathPoint[] {
    if (points.length < 3) return points;

    const smoothed: PathPoint[] = [points[0]]; // Keep first point

    for (let i = 1; i < points.length - 1; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];

      // Very light smoothing to preserve wave patterns
      const smoothedX = curr.x; // Keep X linear
      const smoothedY = prev.y * 0.2 + curr.y * 0.6 + next.y * 0.2;

      smoothed.push({ x: smoothedX, y: smoothedY });
    }

    smoothed.push(points[points.length - 1]); // Keep last point
    return smoothed;
  }

  // Generate smooth path from control points
  function generateSmoothPath(controlPoints: PathPoint[]): PathPoint[] {
    const pathPoints: PathPoint[] = [];
    const resolution = 5;

    for (let i = 0; i < controlPoints.length - 1; i++) {
      const p0 = controlPoints[Math.max(0, i - 1)];
      const p1 = controlPoints[i];
      const p2 = controlPoints[i + 1];
      const p3 = controlPoints[Math.min(controlPoints.length - 1, i + 2)];

      const steps = Math.ceil(Math.abs(p2.x - p1.x) / resolution);

      for (let t = 0; t < steps; t++) {
        const ratio = t / steps;
        const x = catmullRom(p0.x, p1.x, p2.x, p3.x, ratio);
        const y = catmullRom(p0.y, p1.y, p2.y, p3.y, ratio);
        pathPoints.push({ x, y });
      }
    }

    return smoothPathPoints(pathPoints);
  }

  // Smooth path points
  function smoothPathPoints(points: PathPoint[]): PathPoint[] {
    const smoothedPoints: PathPoint[] = [];
    const windowSize = 5;

    for (let i = 0; i < points.length; i++) {
      let sumX = 0;
      let sumY = 0;
      let count = 0;

      for (let j = -windowSize; j <= windowSize; j++) {
        const index = i + j;
        if (index >= 0 && index < points.length) {
          const weight = Math.exp(-(j * j) / (windowSize * 0.5));
          sumX += points[index].x * weight;
          sumY += points[index].y * weight;
          count += weight;
        }
      }

      smoothedPoints.push({
        x: sumX / count,
        y: sumY / count,
      });
    }

    return smoothedPoints;
  }

  // Calculate path length for given points
  function calculatePathLengthForPoints(points: PathPoint[]): number {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
  }

  // Enhanced intersection detection with random depth ordering
  function calculateIntersections() {
    intersections = [];
    pathIntersections = [];

    for (let i = 0; i < pathsData.length; i++) {
      for (let j = i + 1; j < pathsData.length; j++) {
        const pathA = pathsData[i];
        const pathB = pathsData[j];

        // Find intersections between the two paths
        const intersectionPoints = findPathIntersections(pathA, pathB, i, j);
        intersections.push(...intersectionPoints.legacy);
        pathIntersections.push(...intersectionPoints.enhanced);
      }
    }

    // Create path segments based on intersections
    createPathSegments();
  }

  // Find intersections between two paths with enhanced data structure
  function findPathIntersections(
    pathA: PathData,
    pathB: PathData,
    pathAIndex: number,
    pathBIndex: number
  ): { legacy: IntersectionPoint[]; enhanced: PathIntersection[] } {
    const legacyIntersections: IntersectionPoint[] = [];
    const enhancedIntersections: PathIntersection[] = [];
    const sampleRate = 8; // Check every 8th point for better accuracy

    let pathADistance = 0;
    let pathBDistance = 0;

    for (let i = 0; i < pathA.points.length - 1; i += sampleRate) {
      // Calculate distance along path A
      if (i > 0) {
        for (let k = i - sampleRate; k < i; k++) {
          if (k >= 0 && k < pathA.points.length - 1) {
            const dx = pathA.points[k + 1].x - pathA.points[k].x;
            const dy = pathA.points[k + 1].y - pathA.points[k].y;
            pathADistance += Math.sqrt(dx * dx + dy * dy);
          }
        }
      }

      pathBDistance = 0;
      for (let j = 0; j < pathB.points.length - 1; j += sampleRate) {
        // Calculate distance along path B
        if (j > 0) {
          for (let k = j - sampleRate; k < j; k++) {
            if (k >= 0 && k < pathB.points.length - 1) {
              const dx = pathB.points[k + 1].x - pathB.points[k].x;
              const dy = pathB.points[k + 1].y - pathB.points[k].y;
              pathBDistance += Math.sqrt(dx * dx + dy * dy);
            }
          }
        }

        const intersection = lineIntersection(
          pathA.points[i],
          pathA.points[i + 1],
          pathB.points[j],
          pathB.points[j + 1]
        );

        if (intersection) {
          // Random depth ordering for organic spaghetti effect
          const depthOrder: 'path1Over' | 'path2Over' =
            Math.random() > 0.5 ? 'path1Over' : 'path2Over';

          // Legacy format for backward compatibility
          legacyIntersections.push({
            x: intersection.x,
            y: intersection.y,
            pathA: pathA.id,
            pathB: pathB.id,
            pathAGoesOver: depthOrder === 'path1Over',
            distanceA: pathADistance,
            distanceB: pathBDistance,
          });

          // Enhanced format for segment-based rendering
          enhancedIntersections.push({
            point: { x: intersection.x, y: intersection.y },
            path1Index: pathAIndex,
            path2Index: pathBIndex,
            path1Distance: pathADistance,
            path2Distance: pathBDistance,
            depthOrder,
          });
        }
      }
    }

    return { legacy: legacyIntersections, enhanced: enhancedIntersections };
  }

  // Create path segments between intersections for unified rendering
  function createPathSegments() {
    pathSegments = [];

    for (let pathIndex = 0; pathIndex < pathsData.length; pathIndex++) {
      const pathData = pathsData[pathIndex];

      // Find all intersections for this path
      const pathIntersectionsForPath = pathIntersections.filter(
        (intersection) =>
          intersection.path1Index === pathIndex ||
          intersection.path2Index === pathIndex
      );

      // Sort intersections by distance along this path
      const sortedIntersections = pathIntersectionsForPath
        .map((intersection) => ({
          ...intersection,
          distanceOnThisPath:
            intersection.path1Index === pathIndex
              ? intersection.path1Distance
              : intersection.path2Distance,
        }))
        .sort((a, b) => a.distanceOnThisPath - b.distanceOnThisPath);

      // Create segments between intersections
      let segmentStart = 0;
      let renderOrder = 0;

      for (let i = 0; i <= sortedIntersections.length; i++) {
        const segmentEnd =
          i < sortedIntersections.length
            ? sortedIntersections[i].distanceOnThisPath
            : pathData.length;

        // Determine render order based on intersections
        if (i < sortedIntersections.length) {
          const intersection = sortedIntersections[i];
          const isPath1 = intersection.path1Index === pathIndex;
          const shouldBeOnTop =
            (isPath1 && intersection.depthOrder === 'path1Over') ||
            (!isPath1 && intersection.depthOrder === 'path2Over');
          renderOrder = shouldBeOnTop ? 1 : 0;
        }

        // Create segment
        const segmentPoints = getPathPointsBetweenDistances(
          pathData,
          segmentStart,
          segmentEnd
        );

        pathSegments.push({
          pathIndex,
          startDistance: segmentStart,
          endDistance: segmentEnd,
          points: segmentPoints,
          renderOrder: renderOrder + pathIndex * 2, // Offset by path index for base ordering
          intersectionStart: i > 0 ? sortedIntersections[i - 1] : undefined,
          intersectionEnd:
            i < sortedIntersections.length ? sortedIntersections[i] : undefined,
        });

        segmentStart = segmentEnd;
      }
    }
  }

  // Get path points between two distances
  function getPathPointsBetweenDistances(
    pathData: PathData,
    startDist: number,
    endDist: number
  ): PathPoint[] {
    const points: PathPoint[] = [];
    let currentDistance = 0;

    for (let i = 0; i < pathData.points.length - 1; i++) {
      const dx = pathData.points[i + 1].x - pathData.points[i].x;
      const dy = pathData.points[i + 1].y - pathData.points[i].y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);

      if (
        currentDistance + segmentLength >= startDist &&
        currentDistance <= endDist
      ) {
        // Include this point if it's within our range
        if (currentDistance >= startDist) {
          points.push(pathData.points[i]);
        }
        if (currentDistance + segmentLength <= endDist) {
          points.push(pathData.points[i + 1]);
        }
      }

      currentDistance += segmentLength;
      if (currentDistance > endDist) break;
    }

    return points;
  }

  // Line intersection algorithm
  function lineIntersection(
    p1: PathPoint,
    p2: PathPoint,
    p3: PathPoint,
    p4: PathPoint
  ): PathPoint | null {
    const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (Math.abs(denom) < 1e-10) return null;

    const t =
      ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
    const u =
      -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: p1.x + t * (p2.x - p1.x),
        y: p1.y + t * (p2.y - p1.y),
      };
    }

    return null;
  }

  // Backward compatibility - generate single path
  function generatePath(width: number, height: number) {
    const extendedWidth = width * 1.5;
    const startX = -width * 0.25;

    const baseNumCurves = 4;
    const wildnessRange = Math.floor(pathWildness * 4);
    const numCurves =
      baseNumCurves + Math.floor(Math.random() * (wildnessRange + 1));
    const points: { x: number; y: number }[] = [];

    const spacings: number[] = [];
    let totalSpacing = 0;

    for (let i = 0; i < numCurves; i++) {
      const spacing = 0.5 + Math.random();
      spacings.push(spacing);
      totalSpacing += spacing;
    }

    const normalizedSpacings = spacings.map(
      (s) => (s / totalSpacing) * extendedWidth
    );

    let currentX = startX;
    const minY = height * verticalBounds;
    const maxY = height * (1 - verticalBounds);
    const yRange = maxY - minY;

    for (let i = 0; i < numCurves; i++) {
      const x = currentX + normalizedSpacings[i] * 0.5;

      let y: number;
      if (i === 0) {
        // Increased vertical range for backward compatibility mode too
        const baseRange = 0.6; // Increased from 0.4
        const wildnessBonus = pathWildness * 0.3; // Increased from 0.2
        const totalRange = Math.min(baseRange + wildnessBonus, 0.9); // Increased from 0.8
        const startOffset = (1 - totalRange) / 2;
        y = minY + yRange * (startOffset + Math.random() * totalRange);
      } else {
        const previousY = points[i - 1].y;
        const isHigh = previousY > (minY + maxY) / 2;
        const baseVariation = 0.5; // Increased from 0.35
        const wildnessVariation = pathWildness * 0.4;
        const maxVariation = Math.min(baseVariation + wildnessVariation, 0.9); // Increased from 0.8

        if (isHigh) {
          y = minY + yRange * (Math.random() * maxVariation);
        } else {
          y = minY + yRange * (1 - maxVariation + Math.random() * maxVariation);
        }
      }

      points.push({ x, y });
      currentX += normalizedSpacings[i];
    }

    points.push({
      x: currentX + width * 0.25,
      y: points[0].y + (Math.random() - 0.5) * yRange * 0.3,
    });

    pathPoints = [];
    const resolution = 5;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];

      const steps = Math.ceil(Math.abs(p2.x - p1.x) / resolution);

      for (let t = 0; t < steps; t++) {
        const ratio = t / steps;
        const x = catmullRom(p0.x, p1.x, p2.x, p3.x, ratio);
        const y = catmullRom(p0.y, p1.y, p2.y, p3.y, ratio);
        pathPoints.push({ x, y });
      }
    }

    smoothPath();
    calculatePathLength();
  }

  // Catmull-Rom spline interpolation
  function catmullRom(
    p0: number,
    p1: number,
    p2: number,
    p3: number,
    t: number
  ): number {
    const t2 = t * t;
    const t3 = t2 * t;

    return (
      0.5 *
      (2 * p1 +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
    );
  }

  // Smooth the path to reduce sharp changes
  function smoothPath() {
    const smoothedPoints: { x: number; y: number }[] = [];
    const windowSize = 5; // Number of points to average

    for (let i = 0; i < pathPoints.length; i++) {
      let sumX = 0;
      let sumY = 0;
      let count = 0;

      for (let j = -windowSize; j <= windowSize; j++) {
        const index = i + j;
        if (index >= 0 && index < pathPoints.length) {
          // Use gaussian-like weights
          const weight = Math.exp(-(j * j) / (windowSize * 0.5));
          sumX += pathPoints[index].x * weight;
          sumY += pathPoints[index].y * weight;
          count += weight;
        }
      }

      smoothedPoints.push({
        x: sumX / count,
        y: sumY / count,
      });
    }

    pathPoints = smoothedPoints;
  }

  // Calculate path length
  function calculatePathLength() {
    pathLength = 0;
    for (let i = 1; i < pathPoints.length; i++) {
      const dx = pathPoints[i].x - pathPoints[i - 1].x;
      const dy = pathPoints[i].y - pathPoints[i - 1].y;
      pathLength += Math.sqrt(dx * dx + dy * dy);
    }
  }

  // Get point and smoothed angle at specific distance along path
  function getPointAtDistance(distance: number): {
    x: number;
    y: number;
    angle: number;
  } {
    // Ensure distance is positive
    while (distance < 0) distance += pathLength;
    distance = distance % pathLength;

    let currentDistance = 0;

    for (let i = 1; i < pathPoints.length; i++) {
      const dx = pathPoints[i].x - pathPoints[i - 1].x;
      const dy = pathPoints[i].y - pathPoints[i - 1].y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);

      if (currentDistance + segmentLength >= distance) {
        const ratio = (distance - currentDistance) / segmentLength;
        const x = pathPoints[i - 1].x + dx * ratio;
        const y = pathPoints[i - 1].y + dy * ratio;

        // Get smoothed angle by averaging nearby points
        const smoothAngle = getSmoothedAngle(i - 1, ratio);

        return { x, y, angle: smoothAngle };
      }

      currentDistance += segmentLength;
    }

    // Return last point if distance exceeds path length
    const lastPoint = pathPoints[pathPoints.length - 1];
    const smoothAngle = getSmoothedAngle(pathPoints.length - 2, 1);
    return { ...lastPoint, angle: smoothAngle };
  }

  // Get smoothed angle by averaging nearby segments
  function getSmoothedAngle(segmentIndex: number, ratio: number): number {
    const lookAhead = 15; // Number of points to look ahead/behind for smoothing
    let totalDx = 0;
    let totalDy = 0;
    let count = 0;

    // Look at points before and after current position
    for (let offset = -lookAhead; offset <= lookAhead; offset++) {
      const index = segmentIndex + offset;

      if (index >= 0 && index < pathPoints.length - 1) {
        const weight = Math.exp(-(offset * offset) / (lookAhead * 0.5)); // Gaussian weight
        const dx = pathPoints[index + 1].x - pathPoints[index].x;
        const dy = pathPoints[index + 1].y - pathPoints[index].y;

        totalDx += dx * weight;
        totalDy += dy * weight;
        count += weight;
      }
    }

    return Math.atan2(totalDy / count, totalDx / count);
  }

  // Create text data for multiple paths
  function createMultiplePathTexts() {
    for (const pathData of pathsData) {
      ctx.font = pathData.config.textStyle.font;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const separator = '  ';
      const pattern = pathData.config.text + separator;
      const patternWidth = ctx.measureText(pattern).width;

      pathData.textChars = [];
      pathData.totalTextWidth = patternWidth;

      for (const char of pattern) {
        const width = ctx.measureText(char).width;
        pathData.textChars.push({ char, width });
      }
    }
  }

  // Create single repeating text string (backward compatibility)
  function createRepeatedText() {
    ctx.font = textStyle.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const separator = '  ';
    const pattern = selectedText + separator;
    const patternWidth = ctx.measureText(pattern).width;

    textChars = [];
    totalTextWidth = patternWidth;

    for (const char of pattern) {
      const width = ctx.measureText(char).width;
      textChars.push({ char, width });
    }
  }

  // Segment-based render function with unified path+text rendering
  function renderMultiplePaths(progress: number) {
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate center offset for viewport
    const centerOffset = (canvasWidth - viewportWidth) / 2;

    // If no segments exist, fall back to simple rendering
    if (pathSegments.length === 0) {
      // Fallback to simple path rendering
      for (const pathData of pathsData) {
        // Render path stroke
        if (showPath) {
          ctx.save();
          ctx.strokeStyle = pathData.config.pathStyle.strokeColor;
          ctx.lineWidth = pathData.config.pathStyle.strokeWidth;
          ctx.globalAlpha = pathData.config.pathStyle.opacity;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          let started = false;

          for (let i = 0; i < pathData.points.length; i++) {
            const point = pathData.points[i];
            if (!started) {
              ctx.moveTo(point.x, point.y);
              started = true;
            } else {
              ctx.lineTo(point.x, point.y);
            }
          }

          ctx.stroke();
          ctx.restore();
        }

        // Render text
        renderPathText(pathData, progress, centerOffset);
      }
      return;
    }

    // Sort segments by render order for proper depth layering
    const sortedSegments = [...pathSegments].sort(
      (a, b) => a.renderOrder - b.renderOrder
    );

    // Render each segment as a unified path+text unit
    for (const segment of sortedSegments) {
      const pathData = pathsData[segment.pathIndex];

      // Render path stroke for this segment
      if (showPath && segment.points.length > 1) {
        ctx.save();
        ctx.strokeStyle = pathData.config.pathStyle.strokeColor;
        ctx.lineWidth = pathData.config.pathStyle.strokeWidth;
        ctx.globalAlpha = pathData.config.pathStyle.opacity;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(segment.points[0].x, segment.points[0].y);

        for (let i = 1; i < segment.points.length; i++) {
          ctx.lineTo(segment.points[i].x, segment.points[i].y);
        }

        ctx.stroke();
        ctx.restore();
      }

      // Render text for this segment
      renderSegmentText(segment, pathData, progress, centerOffset);
    }
  }

  // Render text for a specific path segment
  function renderSegmentText(
    segment: PathSegment,
    pathData: PathData,
    progress: number,
    centerOffset: number
  ) {
    // Set text style for this path
    ctx.font = pathData.config.textStyle.font;
    ctx.fillStyle = pathData.config.textStyle.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate offset based on path's individual speed
    const pathProgress = (progress * pathData.config.speed) / speed; // Normalize to path speed
    const offset = -(pathProgress * pathData.length) % pathData.totalTextWidth;

    // Start drawing from before the visible area
    let currentDistance = segment.startDistance - offset;

    // Keep drawing pattern instances until we've covered the segment
    while (currentDistance < segment.endDistance + pathData.totalTextWidth) {
      let charPosition = 0;

      for (const { char, width } of pathData.textChars) {
        const distance = currentDistance + charPosition;

        // Only process characters that are within this segment
        if (
          distance >= segment.startDistance &&
          distance <= segment.endDistance
        ) {
          const point = getPointAtDistanceForPath(pathData, distance);

          // Only render if in viewport (with margin for smooth entry/exit)
          if (
            point.x > centerOffset - 200 &&
            point.x < centerOffset + viewportWidth + 200
          ) {
            ctx.save();
            ctx.translate(point.x, point.y);
            ctx.rotate(point.angle);
            ctx.fillText(char, 0, 0);
            ctx.restore();
          }
        }

        charPosition += width;
      }

      // Move to next pattern instance
      currentDistance += pathData.totalTextWidth;
    }
  }

  // Render text for a single path
  function renderPathText(
    pathData: PathData,
    progress: number,
    centerOffset: number
  ) {
    // Set text style for this path
    ctx.font = pathData.config.textStyle.font;
    ctx.fillStyle = pathData.config.textStyle.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate offset based on path's individual speed
    const pathProgress = (progress * pathData.config.speed) / speed; // Normalize to path speed
    const offset = -(pathProgress * pathData.length) % pathData.totalTextWidth;

    // Start drawing from before the visible area
    let currentDistance = -offset;

    // Keep drawing pattern instances until we've covered the entire path
    while (currentDistance < pathData.length + pathData.totalTextWidth) {
      let charPosition = 0;

      for (const { char, width } of pathData.textChars) {
        const distance = currentDistance + charPosition;

        // Only process characters that are on the path
        if (distance >= 0 && distance <= pathData.length) {
          const point = getPointAtDistanceForPath(pathData, distance);

          // Only render if in viewport (with margin for smooth entry/exit)
          if (
            point.x > centerOffset - 200 &&
            point.x < centerOffset + viewportWidth + 200
          ) {
            ctx.save();
            ctx.translate(point.x, point.y);
            ctx.rotate(point.angle);
            ctx.fillText(char, 0, 0);
            ctx.restore();
          }
        }

        charPosition += width;
      }

      // Move to next pattern instance
      currentDistance += pathData.totalTextWidth;
    }
  }

  // Get point at distance for a specific path
  function getPointAtDistanceForPath(
    pathData: PathData,
    distance: number
  ): { x: number; y: number; angle: number } {
    // Ensure distance is positive
    while (distance < 0) distance += pathData.length;
    distance = distance % pathData.length;

    let currentDistance = 0;

    for (let i = 1; i < pathData.points.length; i++) {
      const dx = pathData.points[i].x - pathData.points[i - 1].x;
      const dy = pathData.points[i].y - pathData.points[i - 1].y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);

      if (currentDistance + segmentLength >= distance) {
        const ratio = (distance - currentDistance) / segmentLength;
        const x = pathData.points[i - 1].x + dx * ratio;
        const y = pathData.points[i - 1].y + dy * ratio;

        // Get smoothed angle by averaging nearby points
        const smoothAngle = getSmoothedAngleForPath(pathData, i - 1, ratio);

        return { x, y, angle: smoothAngle };
      }

      currentDistance += segmentLength;
    }

    // Return last point if distance exceeds path length
    const lastPoint = pathData.points[pathData.points.length - 1];
    const smoothAngle = getSmoothedAngleForPath(
      pathData,
      pathData.points.length - 2,
      1
    );
    return { ...lastPoint, angle: smoothAngle };
  }

  // Get smoothed angle for a specific path
  function getSmoothedAngleForPath(
    pathData: PathData,
    segmentIndex: number,
    ratio: number
  ): number {
    const lookAhead = 15;
    let totalDx = 0;
    let totalDy = 0;
    let count = 0;

    for (let offset = -lookAhead; offset <= lookAhead; offset++) {
      const index = segmentIndex + offset;

      if (index >= 0 && index < pathData.points.length - 1) {
        const weight = Math.exp(-(offset * offset) / (lookAhead * 0.5));
        const dx = pathData.points[index + 1].x - pathData.points[index].x;
        const dy = pathData.points[index + 1].y - pathData.points[index].y;

        totalDx += dx * weight;
        totalDy += dy * weight;
        count += weight;
      }
    }

    return Math.atan2(totalDy / count, totalDx / count);
  }

  // Backward compatibility - single path render
  function render(progress: number) {
    if (!ctx || !canvas) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate center offset for viewport
    const centerOffset = (canvasWidth - viewportWidth) / 2;

    // Draw the path stroke first (behind text)
    if (showPath) {
      ctx.save();
      ctx.strokeStyle = pathStyle.strokeColor;
      ctx.lineWidth = pathStyle.strokeWidth;
      ctx.globalAlpha = pathStyle.opacity;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      let started = false;

      for (let i = 0; i < pathPoints.length; i++) {
        const point = pathPoints[i];
        if (!started) {
          ctx.moveTo(point.x, point.y);
          started = true;
        } else {
          ctx.lineTo(point.x, point.y);
        }
      }

      ctx.stroke();
      ctx.restore();
    }

    // Set text style
    ctx.font = textStyle.font;
    ctx.fillStyle = textStyle.color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate how much to offset based on progress (left to right movement)
    // Negate the progress to reverse direction
    const offset = -(progress * pathLength) % totalTextWidth;

    // Start drawing from before the visible area to ensure smooth entry
    let currentDistance = -offset;

    // Keep drawing pattern instances until we've covered the entire path
    while (currentDistance < pathLength + totalTextWidth) {
      // Draw one instance of the pattern
      let charPosition = 0;

      for (const { char, width } of textChars) {
        const distance = currentDistance + charPosition;

        // Only process characters that are on the path
        if (distance >= 0 && distance <= pathLength) {
          const point = getPointAtDistance(distance);

          // Only render if in viewport (with margin for smooth entry/exit)
          if (
            point.x > centerOffset - 200 &&
            point.x < centerOffset + viewportWidth + 200
          ) {
            ctx.save();
            ctx.translate(point.x, point.y);
            ctx.rotate(point.angle);
            ctx.fillText(char, 0, 0);
            ctx.restore();
          }
        }

        charPosition += width;
      }

      // Move to next pattern instance
      currentDistance += totalTextWidth;
    }
  }

  // Setup canvas and animation
  function setup() {
    if (!browser || !canvas || !container) return;

    ctx = canvas.getContext('2d')!;

    // Get container dimensions
    const rect = container.getBoundingClientRect();
    canvasHeight = rect.height;
    viewportWidth = rect.width;

    // Set fixed canvas size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    // Scale for DPR
    ctx.scale(dpr, dpr);

    // Choose between single-path and multi-path mode
    if (pathCount === 1) {
      // Backward compatibility mode
      generatePath(canvasWidth, canvasHeight);
      createRepeatedText();

      // Setup single-path animation
      const duration = pathLength / speed;
      if (animationId) animationId.kill();

      animationId = gsap.to(
        { progress: 0 },
        {
          progress: 1,
          duration,
          ease: 'none',
          repeat: -1,
          onUpdate: function () {
            render(this.targets()[0].progress);
          },
        }
      );
    } else {
      // Multi-path mode
      generateMultiplePaths(canvasWidth, canvasHeight);
      createMultiplePathTexts();

      // Setup multi-path animation timeline
      if (animationTimeline) animationTimeline.kill();

      animationTimeline = gsap.timeline({ repeat: -1 });

      // Create a unified animation that drives all paths
      const avgDuration =
        pathsData.reduce(
          (sum, path) => sum + path.length / path.config.speed,
          0
        ) / pathsData.length;

      animationTimeline.to(
        { progress: 0 },
        {
          progress: 1,
          duration: avgDuration,
          ease: 'none',
          onUpdate: function () {
            renderMultiplePaths(this.targets()[0].progress);
          },
        }
      );
    }
  }

  // Handle resize - only updates viewport tracking
  function handleResize() {
    if (!browser || !container) return;
    const rect = container.getBoundingClientRect();
    viewportWidth = rect.width;
    // Re-render at current progress
    if (animationId) {
      render(animationId.progress());
    }
  }

  onMount(() => {
    if (browser) {
      setup();
      window.addEventListener('resize', handleResize);
    }
  });

  onDestroy(() => {
    if (browser) {
      if (animationId) animationId.kill();
      window.removeEventListener('resize', handleResize);
    }
  });
</script>

<div class="animated-text-path-container" bind:this={container}>
  <div class="canvas-wrapper">
    <canvas bind:this={canvas} class="animated-text-path" aria-hidden="true"
    ></canvas>
  </div>
  <div class="sr-only">{selectedText}</div>
</div>

<style>
  .animated-text-path-container {
    position: relative;
    width: 100%;
    height: 300px; /* Adjust as needed */
    overflow: visible;
  }

  .canvas-wrapper {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 2560px; /* Match fixedCanvasWidth prop */
    height: 100%;
  }

  .animated-text-path {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .animated-text-path {
      display: none;
    }
  }
</style>
